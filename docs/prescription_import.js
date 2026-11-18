/* R1172.9.24 — Prescription Verification spreadsheet import.
 * Stores validated daily six-strut rows and import metadata in CASE.
 * Day 0 is always the first data row; no Day-number column is accepted.
 */
(function(root){
    'use strict';

    const CASE_KEY = 'verification_prescription';
    const SHEETJS_URL = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
    let sheetJsPromise = null;

    function fail(message){ throw new Error(message); }
    function normalizeHeader(value){ return String(value == null ? '' : value).trim().toLowerCase().replace(/[^a-z0-9]/g, ''); }
    function isBlankRow(row){ return !Array.isArray(row) || row.every(value => value == null || String(value).trim() === ''); }

    function parseNumericRow(row, rowNumber){
        const cells = Array.isArray(row) ? row.slice() : [];
        while(cells.length && (cells[cells.length - 1] == null || String(cells[cells.length - 1]).trim() === '')) cells.pop();
        if(cells.length !== 6) fail('Worksheet row ' + rowNumber + ' must contain exactly six cells (Strut 1 through Strut 6). Found ' + cells.length + '.');
        return cells.map((value, index) => {
            if(value == null || String(value).trim() === '') fail('Worksheet row ' + rowNumber + ', Strut ' + (index + 1) + ' is blank.');
            const number = typeof value === 'number' ? value : Number(String(value).trim());
            if(!Number.isFinite(number) || number <= 0) fail('Worksheet row ' + rowNumber + ', Strut ' + (index + 1) + ' must be a positive finite number.');
            return number;
        });
    }

    function normalizeWorksheetRows(inputRows){
        if(!Array.isArray(inputRows)) fail('The selected worksheet could not be read as rows.');
        const rows = inputRows.filter(row => !isBlankRow(row));
        if(!rows.length) fail('The selected worksheet is empty.');
        const first = Array.isArray(rows[0]) ? rows[0].slice() : [];
        while(first.length && (first[first.length - 1] == null || String(first[first.length - 1]).trim() === '')) first.pop();
        const expected = ['strut1','strut2','strut3','strut4','strut5','strut6'];
        const aliases = ['s1','s2','s3','s4','s5','s6'];
        const normalized = first.map(normalizeHeader);
        const hasHeader = first.length === 6 && normalized.every((value, index) => value === expected[index] || value === aliases[index]);
        if(!hasHeader && first.length !== 6) fail('The first worksheet must have six columns only: Strut 1, Strut 2, Strut 3, Strut 4, Strut 5, Strut 6. Do not add a Day column.');
        if(!hasHeader && first.some(value => value == null || String(value).trim() === '' || !Number.isFinite(Number(value)))){
            fail('Column headers must be Strut 1 through Strut 6, in order. The first data row must be Day 0.');
        }
        const dataRows = hasHeader ? rows.slice(1) : rows;
        if(!dataRows.length) fail('No daily prescription rows were found below the column headers.');
        if(dataRows.length > 500) fail('The prescription contains ' + dataRows.length + ' rows. The current limit is 500 rows.');
        const strutRows = dataRows.map((row, index) => parseNumericRow(row, hasHeader ? index + 2 : index + 1));
        return { strutRows, headerPresent: hasHeader, rowCount: strutRows.length, daysNeeded: strutRows.length - 1 };
    }

    function detectDelimiter(text){
        const firstLine = String(text).replace(/^\uFEFF/, '').split(/\r?\n/, 1)[0] || '';
        const counts = { ',': 0, ';': 0, '\t': 0 };
        let quoted = false;
        for(let i = 0; i < firstLine.length; i++){
            const ch = firstLine[i];
            if(ch === '"'){
                if(quoted && firstLine[i + 1] === '"'){ i++; continue; }
                quoted = !quoted;
            }else if(!quoted && Object.prototype.hasOwnProperty.call(counts, ch)) counts[ch]++;
        }
        return Object.keys(counts).sort((a,b) => counts[b] - counts[a])[0];
    }

    function parseDelimitedText(text){
        const delimiter = detectDelimiter(text);
        const source = String(text).replace(/^\uFEFF/, '');
        const rows = [];
        let row = [], cell = '', quoted = false;
        for(let i = 0; i < source.length; i++){
            const ch = source[i];
            if(ch === '"'){
                if(quoted && source[i + 1] === '"'){ cell += '"'; i++; }
                else quoted = !quoted;
            }else if(ch === delimiter && !quoted){ row.push(cell); cell = ''; }
            else if((ch === '\n' || ch === '\r') && !quoted){
                if(ch === '\r' && source[i + 1] === '\n') i++;
                row.push(cell); cell = '';
                if(!isBlankRow(row)) rows.push(row);
                row = [];
            }else cell += ch;
        }
        row.push(cell);
        if(!isBlankRow(row)) rows.push(row);
        if(quoted) fail('The CSV file contains an unclosed quoted cell.');
        return rows;
    }

    function loadSheetJs(){
        if(root.XLSX && typeof root.XLSX.read === 'function') return Promise.resolve(root.XLSX);
        if(sheetJsPromise) return sheetJsPromise;
        sheetJsPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = SHEETJS_URL;
            script.async = true;
            script.onload = () => root.XLSX && typeof root.XLSX.read === 'function'
                ? resolve(root.XLSX)
                : reject(new Error('SheetJS loaded but its XLSX API was not found.'));
            script.onerror = () => reject(new Error('The Excel reader could not load. Check internet access to the official SheetJS CDN, or save the workbook as CSV and import that instead.'));
            document.head.appendChild(script);
        }).catch(error => { sheetJsPromise = null; throw error; });
        return sheetJsPromise;
    }

    async function readFileRows(file){
        const extension = String(file.name || '').split('.').pop().toLowerCase();
        if(extension === 'csv') return parseDelimitedText(await file.text());
        if(extension !== 'xlsx' && extension !== 'xls') fail('Please select an .xlsx, .xls, or .csv file.');
        const XLSX = await loadSheetJs();
        const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: false });
        if(!workbook || !Array.isArray(workbook.SheetNames) || !workbook.SheetNames.length) fail('The Excel workbook contains no worksheets.');
        const sheet = workbook.Sheets && workbook.Sheets[workbook.SheetNames[0]];
        if(!sheet) fail('The first worksheet could not be opened.');
        return XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: null, blankrows: false });
    }

    async function importFile(file){
        if(!file) fail('Choose a prescription file first.');
        if(file.size > 10 * 1024 * 1024) fail('The selected file is larger than 10 MB.');
        const parsed = normalizeWorksheetRows(await readFileRows(file));
        if(typeof root.ensureCurrentCase !== 'function' || typeof root.syncCurrentCase !== 'function') fail('The active CASE commit functions are unavailable.');
        const caseData = await root.ensureCurrentCase();
        if(!caseData.treatment || typeof caseData.treatment !== 'object') caseData.treatment = {};
        caseData.treatment[CASE_KEY] = {
            schema_version: 1,
            source_file: String(file.name || 'Imported prescription'),
            imported_at: new Date().toISOString(),
            row_count: parsed.rowCount,
            days_needed: parsed.daysNeeded,
            day_zero_row_index: 0,
            strut_rows: parsed.strutRows
        };
        await root.syncCurrentCase();
        if(typeof root.noteCaseCommitted === 'function') root.noteCaseCommitted('verification prescription imported');
        if(typeof root.emitCommittedCaseChange === 'function') root.emitCommittedCaseChange('treatment', 'verification-prescription-imported');
        else if(typeof root.CaseChangeCoordinator?.emit === 'function') root.CaseChangeCoordinator.emit({ domain: 'case', operation: 'update', source: 'treatment', reason: 'verification-prescription-imported' });
        return parsed;
    }

    async function clearImportedPrescription(){
        if(typeof root.ensureCurrentCase !== 'function' || typeof root.syncCurrentCase !== 'function') fail('The active CASE commit functions are unavailable.');
        const caseData = await root.ensureCurrentCase();
        if(caseData.treatment && Object.prototype.hasOwnProperty.call(caseData.treatment, CASE_KEY)){
            delete caseData.treatment[CASE_KEY];
            await root.syncCurrentCase();
            if(typeof root.noteCaseCommitted === 'function') root.noteCaseCommitted('verification prescription cleared');
            if(typeof root.emitCommittedCaseChange === 'function') root.emitCommittedCaseChange('treatment', 'verification-prescription-cleared');
        }
    }

    async function renderStatus(){
        const status = document.getElementById('verificationPrescriptionImportStatus');
        const preview = document.getElementById('verificationPrescriptionPreview');
        const clearButton = document.getElementById('clearVerificationPrescriptionButton');
        if(!status || !preview) return;
        const caseData = typeof root.ensureCurrentCase === 'function' ? await root.ensureCurrentCase() : null;
        const imported = caseData && caseData.treatment ? caseData.treatment[CASE_KEY] : null;
        preview.textContent = '';
        if(!imported || !Array.isArray(imported.strut_rows) || !imported.strut_rows.length){
            const fallbackRows = root.HexapodPrescriptionVerification?.fixedStrutRows?.() || [];
            status.textContent = 'Using built-in verification prescription: ' + fallbackRows.length + ' rows (Day 0 + ' + Math.max(0, fallbackRows.length - 1) + ' correction days).';
            if(clearButton) clearButton.disabled = true;
            return;
        }
        const rows = imported.strut_rows;
        status.textContent = 'Imported: ' + (imported.source_file || 'prescription file') + ' · ' + rows.length + ' rows · Day 0 + ' + (rows.length - 1) + ' correction days · ' + (imported.imported_at || '');
        if(clearButton) clearButton.disabled = false;
        const table = document.createElement('table');
        table.style.cssText = 'border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums;';
        const head = document.createElement('tr');
        ['Day','Strut 1','Strut 2','Strut 3','Strut 4','Strut 5','Strut 6'].forEach(label => {
            const th = document.createElement('th'); th.textContent = label;
            th.style.cssText = 'border-bottom:1px solid #aaa;padding:3px 5px;text-align:right;white-space:nowrap;'; head.appendChild(th);
        });
        table.appendChild(head);
        rows.slice(0, 6).forEach((row, index) => {
            const tr = document.createElement('tr');
            [String(index), ...row.map(value => Number(value).toFixed(2))].forEach(value => {
                const td = document.createElement('td'); td.textContent = value;
                td.style.cssText = 'padding:3px 5px;text-align:right;border-bottom:1px solid #e5e5e5;'; tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        preview.appendChild(table);
        if(rows.length > 6){
            const note = document.createElement('div'); note.textContent = 'Showing Day 0 through Day 5 (' + rows.length + ' total rows).'; note.style.marginTop = '4px'; preview.appendChild(note);
        }
    }

    root.PrescriptionVerificationImport = {
        version: 'R1172.9.24', importFile, clearImportedPrescription, renderStatus,
        parseDelimitedText, normalizeWorksheetRows
    };
})(window);
