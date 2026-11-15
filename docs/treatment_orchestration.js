/*
 * R1167 — Browser-side treatment phase orchestration
 *
 * Ports the active Python App.run_treatment_planner() orchestration boundary.
 * The mechanical phase executor is injected so this module can be parity-
 * tested independently from the still-migrating CASE-to-mechanics bridge.
 *
 * Responsibilities:
 *   - full sequential and phase-scoped execution
 *   - active-phase Day-N replan handoff
 *   - predecessor final-state handoff
 *   - intentional calendar-overlap handoff (predecessor day before start)
 *   - recoveredFinalState persistence
 *   - merged prescription/clinical arrays with duplicate Day-0 removal
 *   - restoration of the originally selected phase
 *
 * It does not call Flask, Python, the DOM, reconstruction, or the UI.
 */
(function(root){
  'use strict';

  function clone(value){
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function fail(message){ throw new Error(message); }

  function parseDateOnly(value, label){
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      fail('Invalid ' + label + ' date: expected YYYY-MM-DD.');
    }
    const [y,m,d] = value.split('-').map(Number);
    const date = new Date(Date.UTC(y,m-1,d));
    if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m-1 || date.getUTCDate() !== d) {
      fail('Invalid ' + label + ' date.');
    }
    return date;
  }

  function daysBetween(start, end){
    return Math.round((end.getTime()-start.getTime())/86400000);
  }

  function validateStrutRow(row, label){
    if (!Array.isArray(row) || row.length !== 6 || row.some(v => !Number.isFinite(Number(v)))) {
      fail(label + ' must contain six finite strut lengths.');
    }
    return row.map(Number);
  }

  function validatePose(pose, label){
    if (!Array.isArray(pose) || pose.length !== 4 || pose.some(r =>
      !Array.isArray(r) || r.length !== 4 || r.some(v => !Number.isFinite(Number(v))))) {
      fail(label + ' must be a finite 4x4 transform.');
    }
    return pose.map(r => r.map(Number));
  }

  function storedPhaseResult(stage){
    const prescription = stage && stage.prescription;
    const recovered = stage && stage.recoveredFinalState;
    if (!prescription || !recovered || recovered.pose == null || !Array.isArray(prescription.strut_array) || !prescription.strut_array.length) {
      return null;
    }
    return {
      daily_poses: [validatePose(recovered.pose, 'Stored recovered pose')],
      strut_array: prescription.strut_array.map((row,i) => validateStrutRow(row, 'Stored prescription row ' + i)),
      recovered_final_pose: validatePose(recovered.pose, 'Stored recovered pose')
    };
  }

  function resolveStartingState(previousResult, currentStage, previousStage, recoverPoseFromStruts){
    if (!previousResult) return null;

    const previousStruts = previousResult.strut_array;
    if (!Array.isArray(previousStruts) || previousStruts.length === 0) {
      fail('The previous phase has no stored strut prescription. Cannot determine the starting strut lengths for the requested phase.');
    }

    const previousPoses = previousResult.daily_poses;
    if (!Array.isArray(previousPoses) || previousPoses.length === 0) {
      fail('The previous phase has no recovered daily poses. Cannot determine the starting pose for the requested phase.');
    }

    let overlap = false;
    let rowIndex = null;
    const currentStart = currentStage && currentStage.startDate;
    const previousStart = previousStage && previousStage.startDate;
    const previousEnd = previousStage && previousStage.endDate;

    if (currentStart && previousStart && previousEnd) {
      const currentDate = parseDateOnly(currentStart, 'current phase start');
      const previousStartDate = parseDateOnly(previousStart, 'previous phase start');
      const previousEndDate = parseDateOnly(previousEnd, 'previous phase end');
      if (previousStartDate <= currentDate && currentDate <= previousEndDate) {
        overlap = true;
        // Prescription row 0 is the state one day before the predecessor starts.
        // Thus currentStart - previousStart is the row for currentStart - 1 day.
        rowIndex = daysBetween(previousStartDate, currentDate);
      }
    }

    if (overlap) {
      if (!Number.isInteger(rowIndex) || rowIndex < 0 || rowIndex >= previousStruts.length) {
        fail('The requested overlapping phase start does not correspond to a valid state in the previous phase prescription.');
      }
      if (typeof recoverPoseFromStruts !== 'function') {
        fail('A recoverPoseFromStruts callback is required for an overlapping phase handoff.');
      }
      const initialStruts = validateStrutRow(previousStruts[rowIndex], 'Overlapping predecessor strut row ' + rowIndex);
      const recovered = recoverPoseFromStruts(initialStruts.slice());
      const poseValue = recovered && (recovered.T_bone || recovered.pose || recovered);
      const pose = validatePose(poseValue, 'Recovered overlapping predecessor pose');
      return {
        pose,
        strutLengths: initialStruts,
        source: 'previous-phase-overlap',
        overlap: true,
        overlapRowIndex: rowIndex,
        predecessorPhaseId: previousStage.id,
        predecessorStateDate: currentStart
      };
    }

    const finalPoseValue = previousResult.recovered_final_pose || previousPoses[previousPoses.length-1];
    const finalPose = validatePose(finalPoseValue, 'Previous phase final pose');
    const finalStruts = validateStrutRow(previousStruts[previousStruts.length-1], 'Previous phase final struts');
    return {
      pose: finalPose,
      strutLengths: finalStruts,
      source: 'previous-phase-final',
      overlap: false,
      overlapRowIndex: null,
      predecessorPhaseId: previousStage && previousStage.id || null
    };
  }

  function storeRecoveredFinalState(stage, phaseResult){
    let finalPose = phaseResult.recovered_final_pose;
    if (finalPose == null && Array.isArray(phaseResult.daily_poses) && phaseResult.daily_poses.length) {
      finalPose = phaseResult.daily_poses[phaseResult.daily_poses.length-1];
    }
    if (finalPose == null) fail('Planner did not produce a recovered final pose for ' + (stage.name || 'the phase'));
    if (!Array.isArray(phaseResult.strut_array) || phaseResult.strut_array.length === 0) {
      fail('Planner did not produce final strut lengths for ' + (stage.name || 'the phase'));
    }
    const pose = validatePose(finalPose, 'Planner recovered final pose');
    const struts = validateStrutRow(phaseResult.strut_array[phaseResult.strut_array.length-1], 'Planner final struts');
    stage.recoveredFinalState = { pose: clone(pose), strutLengths: clone(struts) };
  }

  function assembleTreatmentResult(phaseResults){
    const mergedStruts = [];
    const mergedMetrics = [];
    const mergedDirections = [];
    let totalDays = 0;
    phaseResults.forEach((phase,index) => {
      if (!Array.isArray(phase.strut_array)) fail('Phase result is missing strut_array.');
      const skip = index === 0 ? 0 : 1;
      mergedStruts.push(...phase.strut_array.slice(skip));
      const metrics = Array.isArray(phase.clinical_metrics) ? phase.clinical_metrics : [];
      const directions = Array.isArray(phase.clinical_directions) ? phase.clinical_directions : [];
      mergedMetrics.push(...metrics.slice(skip));
      mergedDirections.push(...directions.slice(skip));
      const days = Number(phase.days_needed);
      if (!Number.isFinite(days)) fail('Phase result has an invalid days_needed value.');
      totalDays += days;
    });
    return {
      strut_array: mergedStruts,
      clinical_metrics: mergedMetrics,
      clinical_directions: mergedDirections,
      days_needed: totalDays
    };
  }

  async function runTreatmentPlanner(options){
    options = options || {};
    const caseData = options.caseData;
    const runPhase = options.runPhase;
    const recoverPoseFromStruts = options.recoverPoseFromStruts;
    const phaseId = options.phaseId == null ? null : options.phaseId;
    if (!caseData || !caseData.treatment) fail('A CASE with treatment data is required.');
    if (typeof runPhase !== 'function') fail('A runPhase callback is required.');

    const treatment = caseData.treatment;
    const stages = treatment.stages;
    if (!Array.isArray(stages) || stages.length === 0) fail('No treatment phases are defined.');
    const originalSelectedStageId = treatment.selected_stage_id;
    let targetIndex = null;
    if (phaseId !== null) {
      targetIndex = stages.findIndex(stage => stage && stage.id === phaseId);
      if (targetIndex < 0) fail('Requested phase ID was not found in the current treatment.');
    }

    const phaseResults = [];
    const executionIndices = phaseId === null ? stages.map((_,i)=>i) : [targetIndex];
    try {
      for (const index of executionIndices) {
        const stage = stages[index];
        treatment.selected_stage_id = stage.id;

        let previousResult = null;
        let previousStage = null;
        let activeReplan = false;

        if (phaseId === null) {
          if (index > 0) {
            previousStage = stages[index-1];
            previousResult = phaseResults[index-1];
          }
        } else {
          activeReplan = stage._activeReplan === true;
          if (activeReplan) {
            const recovered = stage.recoveredFinalState;
            if (!recovered || recovered.pose == null || recovered.strutLengths == null) {
              fail('Active phase replan has no complete recovered Day-N mechanical state.');
            }
            previousResult = {
              daily_poses: [validatePose(recovered.pose, 'Active replan pose')],
              recovered_final_pose: validatePose(recovered.pose, 'Active replan pose'),
              strut_array: [validateStrutRow(recovered.strutLengths, 'Active replan struts')]
            };
          } else if (index > 0) {
            previousStage = stages[index-1];
            previousResult = storedPhaseResult(previousStage);
            if (!previousResult) {
              fail('Cannot plan ' + (stage.name || 'the requested phase') + ' because the previous phase does not have a stored recovered final state.');
            }
          }
        }

        const startState = resolveStartingState(previousResult, stage, previousStage, recoverPoseFromStruts);
        const phaseResult = await runPhase({
          caseData,
          stage,
          phaseIndex: index,
          executionScope: phaseId === null ? 'full-treatment' : 'phase-only',
          activeReplan,
          previousStage,
          previousPhaseResult: previousResult,
          startState,
          phaseStartDate: stage.startDate || null,
          previousPhaseStartDate: previousStage && previousStage.startDate || null,
          previousPhaseEndDate: previousStage && previousStage.endDate || null
        });

        if (!phaseResult || typeof phaseResult !== 'object') fail('Planner returned no phase result for ' + (stage.name || 'the phase'));
        phaseResult.phase_id = stage.id;
        phaseResult.phase_name = stage.name;
        storeRecoveredFinalState(stage, phaseResult);
        phaseResults.push(phaseResult);
      }
    } finally {
      treatment.selected_stage_id = originalSelectedStageId;
    }

    return {
      execution_scope: phaseId === null ? 'full-treatment' : 'phase-only',
      phase_results: phaseResults,
      assembled_result: assembleTreatmentResult(phaseResults),
      executed_phase_ids: phaseResults.map(p => p.phase_id),
      restored_selected_stage_id: originalSelectedStageId
    };
  }

  const api = {
    parseDateOnly,
    storedPhaseResult,
    resolveStartingState,
    storeRecoveredFinalState,
    assembleTreatmentResult,
    runTreatmentPlanner
  };
  root.HexapodTreatmentOrchestration = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
