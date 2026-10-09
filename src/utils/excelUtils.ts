import * as XLSX from 'xlsx';
import { AuditRecord, CheckOption, AdequacyOption } from '../types/audit';
import { SOD_ITEMS, WORKLOAD_FUNCTIONS, SKILLS_ITEMS, MCU_UNITS } from '../data/defaultUnits';
import { calculateUnitSummary } from './auditCalculations';

export interface ParseResult {
  success: boolean;
  message: string;
  updatedSections: ('sod' | 'workload' | 'skills')[];
  unitsUpdatedCount: number;
  warnings: string[];
}

/**
 * Clean & match unit name to one of MCU 57 units
 */
export function findMatchingUnit(rawName: string) {
  if (!rawName) return null;
  const clean = rawName.trim().replace(/\s+/g, ' ');
  // Exact match
  const exact = MCU_UNITS.find(u => u.name === clean);
  if (exact) return exact;

  // Normalized matching (e.g. handling slight typos like "หน่วนวิทยบริการ" vs "หน่วยวิทยบริการ")
  const norm = clean.replace(/หน่วน/g, 'หน่วย').replace(/ปัจจุบน/g, 'ปัจจุบัน');
  const matched = MCU_UNITS.find(u => {
    const uNorm = u.name.replace(/หน่วน/g, 'หน่วย');
    return uNorm === norm || clean.includes(u.name) || u.name.includes(clean);
  });
  return matched || null;
}

/**
 * Generate official Excel Workbook with all 3 survey sheets + Executive Summary Sheet
 */
export function exportAuditRecordToExcel(record: AuditRecord, filename = 'MCU_Internal_Audit_Surveys.xlsx') {
  const wb = XLSX.utils.book_new();

  // --- SHEET 1: การสำรวจการแบ่งแยกหน้าที่ ---
  const sodRows: any[][] = [];
  sodRows.push(['สำรวจการแบ่งแยกหน้าที่']);
  sodRows.push(['สำนักงานตรวจสอบภายใน มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย']);
  
  // Header row 1
  const h1 = ['ลำดับ', 'ส่วนงาน'];
  SOD_ITEMS.forEach(item => {
    h1.push(`${item.id}.${item.title}`, '');
  });
  h1.push('รวม', '', 'ร้อยละที่มี');
  sodRows.push(h1);

  // Header row 2
  const h2 = ['', ''];
  SOD_ITEMS.forEach(() => {
    h2.push('มี', 'ไม่มี');
  });
  h2.push('มี', 'ไม่มี', '');
  sodRows.push(h2);

  // Data rows
  record.units.forEach(u => {
    const row: any[] = [u.id, u.name];
    const sodResp = record.sodData[u.id]?.responses || {};
    let yesCount = 0;
    let noCount = 0;

    SOD_ITEMS.forEach(item => {
      const val = sodResp[item.id];
      if (val === 'มี') {
        row.push('/', '');
        yesCount++;
      } else if (val === 'ไม่มี') {
        row.push('', '/');
        noCount++;
      } else {
        row.push('', '');
      }
    });

    const totalAns = yesCount + noCount;
    const pct = totalAns > 0 ? Math.round((yesCount / totalAns) * 100) : 0;
    row.push(yesCount || '-', noCount || '-', totalAns > 0 ? `${pct}%` : 'ยังไม่ได้ส่งข้อมูล');
    sodRows.push(row);
  });

  const ws1 = XLSX.utils.aoa_to_sheet(sodRows);
  XLSX.utils.book_append_sheet(wb, ws1, '1.การแบ่งแยกหน้าที่');

  // --- SHEET 2: การสำรวจภาระงานและความเพียงพอ ---
  const wlRows: any[][] = [];
  wlRows.push(['สำรวจภาระงานและความเพียงพอของบุคลากร']);
  wlRows.push(['สำนักงานตรวจสอบภายใน มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย']);

  const wlh1 = ['ลำดับ', 'ส่วนงาน'];
  WORKLOAD_FUNCTIONS.forEach(f => {
    wlh1.push(`${f.id}.${f.name}`, '', '', '', '');
  });
  wlh1.push('รวม', '', 'ร้อยละที่เพียงพอ');
  wlRows.push(wlh1);

  const wlh2 = ['', ''];
  WORKLOAD_FUNCTIONS.forEach(() => {
    wlh2.push('จำนวนผู้ปฏิบัติงาน', 'ปริมาณงานโดยประมาณ', 'เพียงพอ', 'ไม่เพียงพอ', 'ปัญหา/ข้อจำกัด');
  });
  wlh2.push('เพียงพอ', 'ไม่เพียงพอ', '');
  wlRows.push(wlh2);

  record.units.forEach(u => {
    const row: any[] = [u.id, u.name];
    const wlData = record.workloadData[u.id]?.functions || {};
    let adCount = 0;
    let inadCount = 0;

    WORKLOAD_FUNCTIONS.forEach(f => {
      const item = wlData[f.id] || { staffCount: '', workloadVolume: '', adequacy: '', issues: '' };
      row.push(item.staffCount ?? '');
      row.push(item.workloadVolume ?? '');
      row.push(item.adequacy === 'เพียงพอ' ? '/' : '');
      row.push(item.adequacy === 'ไม่เพียงพอ' ? '/' : '');
      row.push(item.issues ?? '');

      if (item.adequacy === 'เพียงพอ') adCount++;
      else if (item.adequacy === 'ไม่เพียงพอ') inadCount++;
    });

    const totalAns = adCount + inadCount;
    const pct = totalAns > 0 ? Math.round((adCount / totalAns) * 100) : 0;
    row.push(adCount || '-', inadCount || '-', totalAns > 0 ? `${pct}%` : 'ยังไม่ได้ส่งข้อมูล');
    wlRows.push(row);
  });

  const ws2 = XLSX.utils.aoa_to_sheet(wlRows);
  XLSX.utils.book_append_sheet(wb, ws2, '2.ภาระงานและความเพียงพอ');

  // --- SHEET 3: การสำรวจการพัฒนาความรู้และทักษะ ---
  const skRows: any[][] = [];
  skRows.push(['สำรวจการพัฒนาความรู้และทักษะ']);
  skRows.push(['สำนักงานตรวจสอบภายใน มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย']);

  const skh1 = ['ลำดับ', 'ส่วนงาน'];
  SKILLS_ITEMS.forEach(item => {
    skh1.push(`${item.id}. ${item.title}`, '');
  });
  skh1.push('รวม', '', 'ร้อยละที่มี');
  skRows.push(skh1);

  const skh2 = ['', ''];
  SKILLS_ITEMS.forEach(() => {
    skh2.push('มี', 'ไม่มี');
  });
  skh2.push('มี', 'ไม่มี', '');
  skRows.push(skh2);

  record.units.forEach(u => {
    const row: any[] = [u.id, u.name];
    const skResp = record.skillsData[u.id]?.responses || {};
    let yesCount = 0;
    let noCount = 0;

    SKILLS_ITEMS.forEach(item => {
      const val = skResp[item.id];
      if (val === 'มี') {
        row.push('/', '');
        yesCount++;
      } else if (val === 'ไม่มี') {
        row.push('', '/');
        noCount++;
      } else {
        row.push('', '');
      }
    });

    const totalAns = yesCount + noCount;
    const pct = totalAns > 0 ? Math.round((yesCount / totalAns) * 100) : 0;
    row.push(yesCount || '-', noCount || '-', totalAns > 0 ? `${pct}%` : 'ยังไม่ได้ส่งข้อมูล');
    skRows.push(row);
  });

  const ws3 = XLSX.utils.aoa_to_sheet(skRows);
  XLSX.utils.book_append_sheet(wb, ws3, '3.การพัฒนาทักษะ');

  // --- SHEET 4: กระดาษทำการสรุปผลภาพรวม (Executive Summary Matrix) ---
  const sumRows: any[][] = [];
  sumRows.push(['กระดาษทำการสรุปผลการประเมินการควบคุมภายในและภาระงาน 57 ส่วนงาน']);
  sumRows.push(['สำนักงานตรวจสอบภายใน มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย ประจำปีงบประมาณ ' + record.metadata.fiscalYear]);
  sumRows.push([
    'ลำดับ',
    'ส่วนงาน',
    'ประเภทหน่วยงาน',
    'การแบ่งแยกหน้าที่ (% มี)',
    'อัตรากำลังรวม (คน)',
    'ภาระงาน (% เพียงพอ)',
    'การพัฒนาทักษะ (% อบรม)',
    'คะแนนรวม (100)',
    'ระดับความเสี่ยง',
    'ข้อตรวจพบและจุดอ่อนที่สำคัญ'
  ]);

  record.units.forEach(u => {
    const summary = calculateUnitSummary(u, record);
    sumRows.push([
      u.id,
      u.name,
      u.category,
      summary.hasSubmittedData ? `${summary.sodPercent}%` : 'ยังไม่ได้ส่งข้อมูล',
      summary.hasSubmittedData ? summary.totalStaff : '-',
      summary.hasSubmittedData ? `${summary.workloadPercent}%` : 'ยังไม่ได้ส่งข้อมูล',
      summary.hasSubmittedData ? `${summary.skillsPercent}%` : 'ยังไม่ได้ส่งข้อมูล',
      summary.hasSubmittedData ? summary.overallScore : '-',
      summary.hasSubmittedData ? summary.overallRiskLevel : 'ยังไม่ได้ส่งข้อมูล',
      summary.hasSubmittedData ? (summary.criticalDeficiencies.join('; ') || 'ไม่พบข้อตรวจพบที่มีนัยสำคัญ') : 'ยังไม่ได้ส่งข้อมูลแบบสำรวจ'
    ]);
  });

  const ws4 = XLSX.utils.aoa_to_sheet(sumRows);
  XLSX.utils.book_append_sheet(wb, ws4, 'กระดาษทำการสรุปผลภาพรวม');

  XLSX.writeFile(wb, filename);
}

/**
 * Parse an uploaded workbook or CSV file and merge into audit state
 */
export async function parseUploadedAuditFile(file: File, currentRecord: AuditRecord): Promise<{
  newRecord: AuditRecord;
  result: ParseResult;
}> {
  const warnings: string[] = [];
  const updatedSections: ('sod' | 'workload' | 'skills')[] = [];
  let updatedUnitsCount = 0;

  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });

  // Deep clone current record
  const newRecord: AuditRecord = JSON.parse(JSON.stringify(currentRecord));
  newRecord.metadata.lastUpdated = new Date().toISOString();

  // Helper to process a 2D array sheet
  const processSheet = (sheetName: string, rows: any[][]) => {
    if (!rows || rows.length < 3) return;

    // Detect section based on sheet name or text content in top rows
    const firstFewRowsText = rows.slice(0, 5).map(r => r.join(' ')).join(' ');
    
    const isSod = sheetName.includes('แบ่งแยก') || firstFewRowsText.includes('แบ่งแยกหน้าที่') || firstFewRowsText.includes('ผู้จัดทำ');
    const isWl = sheetName.includes('ภาระงาน') || firstFewRowsText.includes('ภาระงาน') || firstFewRowsText.includes('ความเพียงพอ');
    const isSk = sheetName.includes('ทักษะ') || sheetName.includes('อบรม') || firstFewRowsText.includes('พัฒนาความรู้') || firstFewRowsText.includes('ได้รับการอบรม');

    // Find the data start row (where column 0 is a number or column 1 contains a known unit name)
    let dataStartRow = -1;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 2) continue;
      const col0 = String(row[0]).trim();
      const col1 = String(row[1]).trim();
      if (!isNaN(Number(col0)) && Number(col0) >= 1 && Number(col0) <= 60 && col1) {
        dataStartRow = i;
        break;
      }
      if (findMatchingUnit(col1) || findMatchingUnit(col0)) {
        dataStartRow = i;
        break;
      }
    }

    if (dataStartRow === -1) {
      warnings.push(`ไม่พบแถวข้อมูลส่วนงานในชีต: ${sheetName}`);
      return;
    }

    let sheetUnitsUpdated = 0;

    for (let r = dataStartRow; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length < 2) continue;
      const unitNameCandidate = String(row[1] || row[0] || '').trim();
      const unit = findMatchingUnit(unitNameCandidate);
      if (!unit) continue;

      sheetUnitsUpdated++;

      // Process Segregation of Duties
      if (isSod) {
        if (!updatedSections.includes('sod')) updatedSections.push('sod');
        const sod = newRecord.sodData[unit.id] || { unitId: unit.id, responses: {} };
        
        // In the template, each question has 2 columns: [มี, ไม่มี]
        // Starting at column index 2:
        // Item 1: col 2 (มี), col 3 (ไม่มี)
        // Item 2: col 4 (มี), col 5 (ไม่มี) ...
        SOD_ITEMS.forEach((item, idx) => {
          const colYesIdx = 2 + (idx * 2);
          const colNoIdx = 3 + (idx * 2);
          const yesVal = String(row[colYesIdx] || '').trim().toLowerCase();
          const noVal = String(row[colNoIdx] || '').trim().toLowerCase();

          if (yesVal === '/' || yesVal === '1' || yesVal === 'x' || yesVal === 'มี' || yesVal === 'true') {
            sod.responses[item.id] = 'มี';
          } else if (noVal === '/' || noVal === '1' || noVal === 'x' || noVal === 'ไม่มี' || noVal === 'true') {
            sod.responses[item.id] = 'ไม่มี';
          }
        });
        newRecord.sodData[unit.id] = sod;
      }

      // Process Workload & Staff Adequacy
      if (isWl) {
        if (!updatedSections.includes('workload')) updatedSections.push('workload');
        const wl = newRecord.workloadData[unit.id] || { unitId: unit.id, functions: {} };

        // Each function has 5 columns:
        // [จำนวนผู้ปฏิบัติงาน, ปริมาณงานโดยประมาณ, เพียงพอ, ไม่เพียงพอ, ปัญหา/ข้อจำกัด]
        // Starting at col 2:
        WORKLOAD_FUNCTIONS.forEach((fn, idx) => {
          const baseCol = 2 + (idx * 5);
          const staffRaw = row[baseCol];
          const volRaw = row[baseCol + 1];
          const adRaw = String(row[baseCol + 2] || '').trim().toLowerCase();
          const inadRaw = String(row[baseCol + 3] || '').trim().toLowerCase();
          const issueRaw = row[baseCol + 4];

          let adequacy: AdequacyOption = '';
          if (adRaw === '/' || adRaw === '1' || adRaw === 'x' || adRaw === 'เพียงพอ' || adRaw === 'true') {
            adequacy = 'เพียงพอ';
          } else if (inadRaw === '/' || inadRaw === '1' || inadRaw === 'x' || inadRaw === 'ไม่เพียงพอ' || inadRaw === 'true') {
            adequacy = 'ไม่เพียงพอ';
          }

          let staffCount: number | '' = '';
          if (staffRaw !== undefined && staffRaw !== null && staffRaw !== '') {
            const num = Number(staffRaw);
            if (!isNaN(num)) staffCount = num;
          }

          wl.functions[fn.id] = {
            staffCount,
            workloadVolume: volRaw ? String(volRaw).trim() : '',
            adequacy,
            issues: issueRaw ? String(issueRaw).trim() : ''
          };
        });
        newRecord.workloadData[unit.id] = wl;
      }

      // Process Skills Development
      if (isSk) {
        if (!updatedSections.includes('skills')) updatedSections.push('skills');
        const sk = newRecord.skillsData[unit.id] || { unitId: unit.id, responses: {} };

        // 6 items, 2 cols each [มี, ไม่มี]
        // Starting at col 2:
        SKILLS_ITEMS.forEach((item, idx) => {
          const colYesIdx = 2 + (idx * 2);
          const colNoIdx = 3 + (idx * 2);
          const yesVal = String(row[colYesIdx] || '').trim().toLowerCase();
          const noVal = String(row[colNoIdx] || '').trim().toLowerCase();

          if (yesVal === '/' || yesVal === '1' || yesVal === 'x' || yesVal === 'มี' || yesVal === 'true') {
            sk.responses[item.id] = 'มี';
          } else if (noVal === '/' || noVal === '1' || noVal === 'x' || noVal === 'ไม่มี' || noVal === 'true') {
            sk.responses[item.id] = 'ไม่มี';
          }
        });
        newRecord.skillsData[unit.id] = sk;
      }
    }

    if (sheetUnitsUpdated > updatedUnitsCount) {
      updatedUnitsCount = sheetUnitsUpdated;
    }
  };

  // Iterate all sheets
  workbook.SheetNames.forEach(sheetName => {
    const ws = workbook.Sheets[sheetName];
    const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    processSheet(sheetName, rows);
  });

  const success = updatedSections.length > 0 && updatedUnitsCount > 0;
  const sectionLabels = {
    sod: 'การแบ่งแยกหน้าที่ (10 ข้อ)',
    workload: 'ภาระงานและความเพียงพอ (5 ด้าน)',
    skills: 'การพัฒนาความรู้และทักษะ (6 ข้อ)'
  };
  const updatedSectionNames = updatedSections.map(s => sectionLabels[s]).join(', ');

  const message = success
    ? `นำเข้าข้อมูลสำเร็จ ${updatedUnitsCount} ส่วนงาน สำหรับหมวด: ${updatedSectionNames}`
    : 'ไม่สามารถระบุรูปแบบตารางที่ตรงกับแบบสำรวจ มจร ได้ กรุณาตรวจสอบหัวตารางและชื่อส่วนงาน';

  return {
    newRecord,
    result: {
      success,
      message,
      updatedSections,
      unitsUpdatedCount: updatedUnitsCount,
      warnings
    }
  };
}
