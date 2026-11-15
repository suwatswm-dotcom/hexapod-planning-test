/*
 * R1156 — Physical hardware specification.
 * Source: HARDWARE_SPECS_GUIDANCE_FOR_NEXT_CHAT_2026-09-29.
 * Physical hardware dimensions live here; patient/case parameters do not.
 */
(function(root){
  'use strict';

  const spec = {
    version: 'R1156-measured-hardware-spec-1',
    ring: {
      anchorRadiusMm: 113.5,
      innerRadiusMm: 90.0,
      thicknessMm: 8.0,
      outerRadiusMm: 110.0
    },
    holes: {
      innerCount: 48,
      innerDiameterMm: 10.0,
      innerSpacingDeg: 7.5,
      innerCenterRadiusMm: 99.0,
      tabCenterRadiusMm: 113.5,
      tabSpacingDeg: 7.5
    },
    tabs: {
      standardHoleCount: 3,
      standardSpacingDeg: 7.5,
      masterHoleCount: 7,
      masterSpacingDeg: 7.5,
      masterStrutHoles: [3, 5]
    },
    offsets: {
      mountingMm: -17.0,
      pinMm: 0.0
    },
    topology: {
      holeStepDeg: 7.5,
      proximalTabTopDeg: 90,
      proximalTabLeftDeg: 210,
      proximalTabRightDeg: 330,
      distalTabTopRightDeg: 30,
      distalTabTopLeftDeg: 150,
      distalTabBottomDeg: 270
    }
  };

  function resolveAnchorRadiusMm(frame){
    if(!frame || typeof frame !== 'object'){
      throw new TypeError('CASE.frame is required for anchor-radius resolution');
    }
    const hardware=String(frame.hardware||'').trim();
    if(hardware==='Hexapod'){
      return spec.ring.anchorRadiusMm;
    }
    // Backward compatibility for existing saved CASE files. This is the
    // former temporary rule and is intentionally isolated to the legacy ID.
    if(hardware==='MAXFRAME'){
      const diameter=Number(frame.proximal_ring_diameter);
      if(!Number.isFinite(diameter)||diameter<=0){
        throw new Error('CASE.frame.proximal_ring_diameter is invalid for legacy MAXFRAME compatibility');
      }
      return diameter/2+23.5;
    }
    throw new Error('Unsupported CASE frame hardware for anchor-radius derivation: '+(hardware||'(missing)'));
  }

  root.HardwareSpec = root.HardwareSpec || spec;
  if(typeof root.HardwareSpec.resolveAnchorRadiusMm !== 'function'){
    root.HardwareSpec.resolveAnchorRadiusMm=resolveAnchorRadiusMm;
  }
  root.HardwareSpecR1156 = root.HardwareSpec;
})(typeof window!=='undefined'?window:globalThis);
