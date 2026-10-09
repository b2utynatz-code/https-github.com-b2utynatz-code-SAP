import fs from 'fs';

const parsed = JSON.parse(fs.readFileSync('scripts/parsed_result.json', 'utf8'));

// Generate TypeScript source code for actual uploaded data
const content = `// Auto-generated data from uploaded user surveys (ปีงบประมาณ 2569)
import { AuditRecord, UnitSegregationData, UnitWorkloadData, UnitSkillsData } from '../types/audit';
import { MCU_UNITS, SOD_ITEMS, WORKLOAD_FUNCTIONS, SKILLS_ITEMS } from './defaultUnits';

export const AUDITOR_ASSIGNMENTS: Record<number, string> = {
  // 13 - 22: พี่ตูน
  13: 'พี่ตูน', 14: 'พี่ตูน', 15: 'พี่ตูน', 16: 'พี่ตูน', 17: 'พี่ตูน',
  18: 'พี่ตูน', 19: 'พี่ตูน', 20: 'พี่ตูน', 21: 'พี่ตูน', 22: 'พี่ตูน',
  // 23 - 30: แน็ต
  23: 'แน็ต', 24: 'แน็ต', 25: 'แน็ต', 26: 'แน็ต', 27: 'แน็ต',
  28: 'แน็ต', 29: 'แน็ต', 30: 'แน็ต',
  // 31 - 38: พี่ออ
  31: 'พี่ออ', 32: 'พี่ออ', 33: 'พี่ออ', 34: 'พี่ออ', 35: 'พี่ออ',
  36: 'พี่ออ', 37: 'พี่ออ', 38: 'พี่ออ',
  // 39 - 46: น้ำ
  39: 'น้ำ', 40: 'น้ำ', 41: 'น้ำ', 42: 'น้ำ', 43: 'น้ำ',
  44: 'น้ำ', 45: 'น้ำ', 46: 'น้ำ'
};

export const RAW_PARSED_SOD: Record<string | number, any> = ${JSON.stringify(parsed.sodData, null, 2)};
export const RAW_PARSED_WL: Record<string | number, any> = ${JSON.stringify(parsed.wlData, null, 2)};
export const RAW_PARSED_SK: Record<string | number, any> = ${JSON.stringify(parsed.skData, null, 2)};

export function createAuditRecordFromUploadedData(): AuditRecord {
  const sodData: Record<number, UnitSegregationData> = {};
  const workloadData: Record<number, UnitWorkloadData> = {};
  const skillsData: Record<number, UnitSkillsData> = {};

  MCU_UNITS.forEach(u => {
    // SoD
    if (RAW_PARSED_SOD[u.id]) {
      sodData[u.id] = {
        unitId: u.id,
        responses: RAW_PARSED_SOD[u.id]
      };
    } else {
      // Empty response for units that haven't submitted (ยังไม่ได้ส่งข้อมูล)
      const emptyResp: Record<number, ''> = {};
      SOD_ITEMS.forEach(it => { emptyResp[it.id] = ''; });
      sodData[u.id] = { unitId: u.id, responses: emptyResp };
    }

    // Workload
    if (RAW_PARSED_WL[u.id]) {
      workloadData[u.id] = {
        unitId: u.id,
        functions: RAW_PARSED_WL[u.id]
      };
    } else {
      const emptyFuncs: Record<number, any> = {};
      WORKLOAD_FUNCTIONS.forEach(f => {
        emptyFuncs[f.id] = { staffCount: '', workloadVolume: '', adequacy: '', issues: '' };
      });
      workloadData[u.id] = { unitId: u.id, functions: emptyFuncs };
    }

    // Skills
    if (RAW_PARSED_SK[u.id]) {
      skillsData[u.id] = {
        unitId: u.id,
        responses: RAW_PARSED_SK[u.id]
      };
    } else {
      const emptyResp: Record<number, ''> = {};
      SKILLS_ITEMS.forEach(it => { emptyResp[it.id] = ''; });
      skillsData[u.id] = { unitId: u.id, responses: emptyResp };
    }
  });

  return {
    units: MCU_UNITS,
    sodData,
    workloadData,
    skillsData,
    metadata: {
      fiscalYear: '2569',
      auditPeriod: 'รอบการประเมินประจำปีงบประมาณ พ.ศ. 2569',
      leadAuditor: 'นักวิชาการตรวจสอบภายใน',
      auditorPosition: 'นักวิชาการตรวจสอบภายในปฏิบัติการ',
      auditSupervisor: 'หัวหน้าสำนักงานตรวจสอบภายใน',
      supervisorPosition: 'ผู้อำนวยการสำนักงานตรวจสอบภายใน มจร',
      lastUpdated: new Date().toISOString()
    }
  };
}
`;

fs.writeFileSync('src/data/actualUploadedData.ts', content);
console.log("Successfully generated src/data/actualUploadedData.ts");
