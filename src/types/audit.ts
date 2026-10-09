export type CheckOption = 'มี' | 'ไม่มี' | '';
export type AdequacyOption = 'เพียงพอ' | 'ไม่เพียงพอ' | '';

export interface UnitInfo {
  id: number;
  name: string;
  category: 'วิทยาเขต' | 'วิทยาลัยสงฆ์' | 'วิทยาลัยเฉพาะทาง' | 'หน่วยวิทยบริการ' | 'หน่วยงานบริการ/กองทุน' | 'คณะ/บัณฑิตวิทยาลัย' | 'ส่วนกลาง';
  province?: string;
}

// 1. การแบ่งแยกหน้าที่ (10 items)
export interface SegregationOfDutiesItem {
  id: number;
  title: string;
  shortLabel: string;
  category: 'คำสั่ง/การมอบหมาย' | 'การเงินและบัญชี' | 'พัสดุและจัดซื้อ' | 'การควบคุมระบบ';
  riskIfMissing: 'สูงมาก' | 'สูง' | 'ปานกลาง';
}

export interface UnitSegregationData {
  unitId: number;
  responses: Record<number, CheckOption>; // item id (1-10) -> 'มี' | 'ไม่มี' | ''
  notes?: string;
}

// 2. ภาระงานและความเพียงพอ (5 functions)
export interface WorkloadFunctionItem {
  id: number;
  name: string;
  description: string;
}

export interface FunctionWorkloadData {
  staffCount: number | '';
  workloadVolume: string;
  adequacy: AdequacyOption;
  issues: string;
}

export interface UnitWorkloadData {
  unitId: number;
  functions: Record<number, FunctionWorkloadData>; // function id (1-5)
  overallNotes?: string;
}

// 3. การพัฒนาความรู้และทักษะ (6 items)
export interface SkillsDevelopmentItem {
  id: number;
  title: string;
  shortLabel: string;
  category: 'หลักสูตรวิชาชีพ' | 'ระบบงาน' | 'การจัดการความรู้';
}

export interface UnitSkillsData {
  unitId: number;
  responses: Record<number, CheckOption>; // item id (1-6) -> 'มี' | 'ไม่มี' | ''
  notes?: string;
}

export interface AuditRecord {
  units: UnitInfo[];
  sodData: Record<number, UnitSegregationData>;
  workloadData: Record<number, UnitWorkloadData>;
  skillsData: Record<number, UnitSkillsData>;
  metadata: {
    fiscalYear: string;
    auditPeriod: string;
    leadAuditor: string;
    auditorPosition: string;
    auditSupervisor: string;
    supervisorPosition: string;
    lastUpdated: string;
  };
}

export interface UnitCalculatedSummary {
  unitId: number;
  unitName: string;
  category: string;
  hasSubmittedData: boolean;
  submissionStatus: 'ส่งข้อมูลแล้ว' | 'ยังไม่ได้ส่งข้อมูล';
  auditorInCharge?: string;
  // SoD
  sodYesCount: number;
  sodNoCount: number;
  sodAnsweredCount: number;
  sodPercent: number;
  // Workload
  totalStaff: number;
  workloadAdequateCount: number;
  workloadInadequateCount: number;
  workloadPercent: number;
  // Skills
  skillsYesCount: number;
  skillsNoCount: number;
  skillsPercent: number;
  // Combined Risk
  overallRiskLevel: 'วิกฤต/สูงมาก' | 'สูง' | 'ปานกลาง' | 'ต่ำ' | 'ยังไม่ได้ส่งข้อมูล';
  overallScore: number; // 0-100
  criticalDeficiencies: string[];
}
