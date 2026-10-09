import {
  UnitInfo,
  SegregationOfDutiesItem,
  WorkloadFunctionItem,
  SkillsDevelopmentItem,
  UnitSegregationData,
  UnitWorkloadData,
  UnitSkillsData,
  AuditRecord
} from '../types/audit';

export const MCU_UNITS: UnitInfo[] = [
  { id: 1, name: 'วิทยาเขตหนองคาย', category: 'วิทยาเขต', province: 'หนองคาย' },
  { id: 2, name: 'วิทยาเขตนครศรีธรรมราช', category: 'วิทยาเขต', province: 'นครศรีธรรมราช' },
  { id: 3, name: 'วิทยาเขตเชียงใหม่', category: 'วิทยาเขต', province: 'เชียงใหม่' },
  { id: 4, name: 'วิทยาเขตขอนแก่น', category: 'วิทยาเขต', province: 'ขอนแก่น' },
  { id: 5, name: 'วิทยาเขตนครราชสีมา', category: 'วิทยาเขต', province: 'นครราชสีมา' },
  { id: 6, name: 'วิทยาเขตอุบลราชธานี', category: 'วิทยาเขต', province: 'อุบลราชธานี' },
  { id: 7, name: 'วิทยาเขตแพร่', category: 'วิทยาเขต', province: 'แพร่' },
  { id: 8, name: 'วิทยาเขตสุรินทร์', category: 'วิทยาเขต', province: 'สุรินทร์' },
  { id: 9, name: 'วิทยาเขตพะเยา', category: 'วิทยาเขต', province: 'พะเยา' },
  { id: 10, name: 'วิทยาเขตบาฬีศึกษาพุทธโฆส นครปฐม', category: 'วิทยาเขต', province: 'นครปฐม' },
  { id: 11, name: 'วิทยาเขตนครสวรรค์', category: 'วิทยาเขต', province: 'นครสวรรค์' },
  { id: 12, name: 'วิทยาเขตนครน่าน เฉลิมพระเกียรติฯ', category: 'วิทยาเขต', province: 'น่าน' },
  { id: 13, name: 'วิทยาลัยสงฆ์เลย', category: 'วิทยาลัยสงฆ์', province: 'เลย' },
  { id: 14, name: 'วิทยาลัยสงฆ์นครพนม', category: 'วิทยาลัยสงฆ์', province: 'นครพนม' },
  { id: 15, name: 'วิทยาลัยสงฆ์ลำพูน', category: 'วิทยาลัยสงฆ์', province: 'ลำพูน' },
  { id: 16, name: 'วิทยาลัยสงฆ์พุทธชินราช', category: 'วิทยาลัยสงฆ์', province: 'พิษณุโลก' },
  { id: 17, name: 'วิทยาลัยสงฆ์บุรีรัมย์', category: 'วิทยาลัยสงฆ์', province: 'บุรีรัมย์' },
  { id: 18, name: 'วิทยาลัยสงฆ์ปัตตานี', category: 'วิทยาลัยสงฆ์', province: 'ปัตตานี' },
  { id: 19, name: 'วิทยาลัยสงฆ์พุทธโสธร', category: 'วิทยาลัยสงฆ์', province: 'ฉะเชิงเทรา' },
  { id: 20, name: 'วิทยาลัยสงฆ์นครลำปาง', category: 'วิทยาลัยสงฆ์', province: 'ลำปาง' },
  { id: 21, name: 'วิทยาลัยสงฆ์เชียงราย', category: 'วิทยาลัยสงฆ์', province: 'เชียงราย' },
  { id: 22, name: 'วิทยาลัยสงฆ์ศรีสะเกษ', category: 'วิทยาลัยสงฆ์', province: 'ศรีสะเกษ' },
  { id: 23, name: 'วิทยาลัยสงฆ์ราชบุรี', category: 'วิทยาลัยสงฆ์', province: 'ราชบุรี' },
  { id: 24, name: 'วิทยาลัยสงฆ์พุทธปัญญาศรีทวารวดี', category: 'วิทยาลัยสงฆ์', province: 'นครปฐม' },
  { id: 25, name: 'วิทยาลัยสงฆ์พ่อขุนผาเมือง เพชรบูรณ์', category: 'วิทยาลัยสงฆ์', province: 'เพชรบูรณ์' },
  { id: 26, name: 'วิทยาลัยสงฆ์ร้อยเอ็ด', category: 'วิทยาลัยสงฆ์', province: 'ร้อยเอ็ด' },
  { id: 27, name: 'วิทยาลัยสงฆ์ชัยภูมิ', category: 'วิทยาลัยสงฆ์', province: 'ชัยภูมิ' },
  { id: 28, name: 'วิทยาลัยสงฆ์พิจิตร', category: 'วิทยาลัยสงฆ์', province: 'พิจิตร' },
  { id: 29, name: 'วิทยาลัยสงฆ์สุพรรณบุรีศรีสุวรรณภูมิ', category: 'วิทยาลัยสงฆ์', province: 'สุพรรณบุรี' },
  { id: 30, name: 'วิทยาลัยสงฆ์ระยอง', category: 'วิทยาลัยสงฆ์', province: 'ระยอง' },
  { id: 31, name: 'วิทยาลัยสงฆ์มหาสารคาม', category: 'วิทยาลัยสงฆ์', province: 'มหาสารคาม' },
  { id: 32, name: 'วิทยาลัยสงฆ์สุราษฎร์ธานี', category: 'วิทยาลัยสงฆ์', province: 'สุราษฎร์ธานี' },
  { id: 33, name: 'วิทยาลัยสงฆ์อุทัยธานี', category: 'วิทยาลัยสงฆ์', province: 'อุทัยธานี' },
  { id: 34, name: 'วิทยาลัยสงฆ์เพชรบุรี', category: 'วิทยาลัยสงฆ์', province: 'เพชรบุรี' },
  { id: 35, name: 'วิทยาลัยสงฆ์ชลบุรี', category: 'วิทยาลัยสงฆ์', province: 'ชลบุรี' },
  { id: 36, name: 'วิทยาลัยสงฆ์กาญจนบุรี ศรีไพบูลย์', category: 'วิทยาลัยสงฆ์', province: 'กาญจนบุรี' },
  { id: 37, name: 'วิทยาลัยสงฆ์จันทบุรี', category: 'วิทยาลัยสงฆ์', province: 'จันทบุรี' },
  { id: 38, name: 'วิทยาลัยสงฆ์กำแพงเพชร', category: 'วิทยาลัยสงฆ์', province: 'กำแพงเพชร' },
  { id: 39, name: 'วิทยาลัยสงฆ์ตาก', category: 'วิทยาลัยสงฆ์', province: 'ตาก' },
  { id: 40, name: 'มหาวชิราลงกรณบาลีเถรวาทราชวิทยาลัย', category: 'วิทยาลัยเฉพาะทาง', province: 'นครปฐม' },
  { id: 41, name: 'หน่วยวิทยบริการวัดหงษ์ประดิษฐาราม จ.สงขลา', category: 'หน่วยวิทยบริการ', province: 'สงขลา' },
  { id: 42, name: 'หน่วยวิทยบริการวัดหมอนไม้ จ.อุตรดิตถ์', category: 'หน่วยวิทยบริการ', province: 'อุตรดิตถ์' },
  { id: 43, name: 'หน่วยวิทยบริการวัดกลาง จ.กาฬสินธุ์', category: 'หน่วยวิทยบริการ', province: 'กาฬสินธุ์' },
  { id: 44, name: 'หน่วนวิทยบริการวัดดอนทราราม จ.สมุทรสงคราม', category: 'หน่วยวิทยบริการ', province: 'สมุทรสงคราม' },
  { id: 45, name: 'โรงพิมพ์มหาจุฬาลงกรณราชวิทยาลัย', category: 'หน่วยงานบริการ/กองทุน', province: 'พระนครศรีอยุธยา' },
  { id: 46, name: 'สำนักพิมพ์มหาจุฬาลงกรณราชวิทยาลัย', category: 'หน่วยงานบริการ/กองทุน', province: 'พระนครศรีอยุธยา' },
  { id: 47, name: 'มหาจุฬาบรรณาคาร', category: 'หน่วยงานบริการ/กองทุน', province: 'พระนครศรีอยุธยา' },
  { id: 48, name: 'อาคาร 92 ปี ปัญญานันทะ', category: 'หน่วยงานบริการ/กองทุน', province: 'นนทบุรี' },
  { id: 49, name: 'กองทุนสวัสดิการภายใน มจร', category: 'หน่วยงานบริการ/กองทุน', province: 'พระนครศรีอยุธยา' },
  { id: 50, name: 'คณะพุทธศาสตร์', category: 'คณะ/บัณฑิตวิทยาลัย', province: 'พระนครศรีอยุธยา' },
  { id: 51, name: 'คณะครุศาสตร์', category: 'คณะ/บัณฑิตวิทยาลัย', province: 'พระนครศรีอยุธยา' },
  { id: 52, name: 'คณะมนุษยศาสตร์', category: 'คณะ/บัณฑิตวิทยาลัย', province: 'พระนครศรีอยุธยา' },
  { id: 53, name: 'คณะสังคมศาสตร์', category: 'คณะ/บัณฑิตวิทยาลัย', province: 'พระนครศรีอยุธยา' },
  { id: 54, name: 'บัณฑิตวิทยาลัย', category: 'คณะ/บัณฑิตวิทยาลัย', province: 'พระนครศรีอยุธยา' },
  { id: 55, name: 'วิทยาลัยพุทธศาสตร์นานาชาติ (IBSC)', category: 'วิทยาลัยเฉพาะทาง', province: 'พระนครศรีอยุธยา' },
  { id: 56, name: 'วิทยาลัยพระธรรมฑูต', category: 'วิทยาลัยเฉพาะทาง', province: 'พระนครศรีอยุธยา' },
  { id: 57, name: 'ส่วนกลาง', category: 'ส่วนกลาง', province: 'พระนครศรีอยุธยา' }
];

export const SOD_ITEMS: SegregationOfDutiesItem[] = [
  {
    id: 1,
    title: 'มีคำสั่ง/มอบหมายหน้าที่เป็นลายลักษณ์อักษร',
    shortLabel: 'คำสั่งลายลักษณ์อักษร',
    category: 'คำสั่ง/การมอบหมาย',
    riskIfMissing: 'สูง'
  },
  {
    id: 2,
    title: 'ผู้จัดทำเอกสารแยกจากผู้ตรวจสอบ',
    shortLabel: 'ผู้ทำเอกสาร ≠ ผู้ตรวจสอบ',
    category: 'การเงินและบัญชี',
    riskIfMissing: 'สูงมาก'
  },
  {
    id: 3,
    title: 'ผู้ตรวจสอบแยกจากผู้อนุมัติ',
    shortLabel: 'ผู้ตรวจสอบ ≠ ผู้อนุมัติ',
    category: 'การเงินและบัญชี',
    riskIfMissing: 'สูงมาก'
  },
  {
    id: 4,
    title: 'ผู้รับเงินแยกจากผู้บันทึกบัญชี',
    shortLabel: 'ผู้รับเงิน ≠ ผู้ลงบัญชี',
    category: 'การเงินและบัญชี',
    riskIfMissing: 'สูงมาก'
  },
  {
    id: 5,
    title: 'ผู้จ่ายเงินแยกจากผู้บันทึกบัญชี',
    shortLabel: 'ผู้จ่ายเงิน ≠ ผู้ลงบัญชี',
    category: 'การเงินและบัญชี',
    riskIfMissing: 'สูงมาก'
  },
  {
    id: 6,
    title: 'ผู้จัดทำจัดซื้อแยกจากผู้ตรวจรับพัสดุ',
    shortLabel: 'ผู้จัดซื้อ ≠ ผู้ตรวจรับพัสดุ',
    category: 'พัสดุและจัดซื้อ',
    riskIfMissing: 'สูงมาก'
  },
  {
    id: 7,
    title: 'ผู้ตรวจรับพัสดุแยกจากผู้เบิกจ่าย',
    shortLabel: 'ผู้ตรวจรับ ≠ ผู้เบิกจ่าย',
    category: 'พัสดุและจัดซื้อ',
    riskIfMissing: 'สูง'
  },
  {
    id: 8,
    title: 'มีผู้ปฏิบัติงานสำรองกรณีมีผู้รับผิดชอบไม่อยู่',
    shortLabel: 'มีผู้ปฏิบัติงานสำรอง',
    category: 'คำสั่ง/การมอบหมาย',
    riskIfMissing: 'ปานกลาง'
  },
  {
    id: 9,
    title: 'มีการทบทวน/ปรับปรุงคำสั่งมอบหมายหน้าที่เป็นปัจจุบัน',
    shortLabel: 'ทบทวนคำสั่งเป็นปัจจุบัน',
    category: 'คำสั่ง/การมอบหมาย',
    riskIfMissing: 'ปานกลาง'
  },
  {
    id: 10,
    title: 'มีการควบคุมสิทธิ์การเข้าใช้งานระบบที่เหมาะสม',
    shortLabel: 'ควบคุมสิทธิ์ระบบสารสนเทศ',
    category: 'การควบคุมระบบ',
    riskIfMissing: 'สูง'
  }
];

export const WORKLOAD_FUNCTIONS: WorkloadFunctionItem[] = [
  { id: 1, name: 'งานการเงิน', description: 'การรับเงิน ออกใบเสร็จ เบิกจ่ายเงิน และรายงานเงินสดคงเหลือ' },
  { id: 2, name: 'งานบัญชี', description: 'การบันทึกบัญชี ปิดงบการเงิน งบกระทบยอดเงินฝากธนาคาร' },
  { id: 3, name: 'งานพัสดุ', description: 'การควบคุม ทะเบียนคุมครุภัณฑ์ การตรวจนับ และจำหน่ายพัสดุ' },
  { id: 4, name: 'งานจัดซื้อจัดจ้าง', description: 'การจัดทำแผนจัดซื้อจัดจ้าง ขออนุมัติซื้อ/จ้าง บริหารสัญญา' },
  { id: 5, name: 'งานอื่นที่เกี่ยวข้อง', description: 'งานบริหารทั่วไป งานสารบรรณ งานนโยบายและแผน' }
];

export const SKILLS_ITEMS: SkillsDevelopmentItem[] = [
  {
    id: 1,
    title: 'ได้รับการอบรมด้านการเงิน',
    shortLabel: 'อบรมด้านการเงิน',
    category: 'หลักสูตรวิชาชีพ'
  },
  {
    id: 2,
    title: 'ได้รับการอบรมด้านบัญชี',
    shortLabel: 'อบรมด้านบัญชี',
    category: 'หลักสูตรวิชาชีพ'
  },
  {
    id: 3,
    title: 'ได้รับการอบรมด้านพัสดุ',
    shortLabel: 'อบรมด้านพัสดุ',
    category: 'หลักสูตรวิชาชีพ'
  },
  {
    id: 4,
    title: 'ได้รับการอบรมระบบ MIS/ระบบที่เกี่ยวข้อง',
    shortLabel: 'อบรมระบบ MIS/ไอที',
    category: 'ระบบงาน'
  },
  {
    id: 5,
    title: 'มีแผนพัฒนาความรู้รายบุคคล',
    shortLabel: 'มีแผนพัฒนาความรู้ (IDP)',
    category: 'การจัดการความรู้'
  },
  {
    id: 6,
    title: 'มีการถ่ายทอดความรู้ภายในส่วนงาน',
    shortLabel: 'มีการถ่ายทอดความรู้ (KM)',
    category: 'การจัดการความรู้'
  }
];

export function createInitialEmptyAuditRecord(): AuditRecord {
  const sodData: Record<number, UnitSegregationData> = {};
  const workloadData: Record<number, UnitWorkloadData> = {};
  const skillsData: Record<number, UnitSkillsData> = {};

  MCU_UNITS.forEach(u => {
    // SoD
    const sodResponses: Record<number, ''> = {};
    SOD_ITEMS.forEach(item => {
      sodResponses[item.id] = '';
    });
    sodData[u.id] = { unitId: u.id, responses: sodResponses };

    // Workload
    const functionsData: Record<number, any> = {};
    WORKLOAD_FUNCTIONS.forEach(f => {
      functionsData[f.id] = {
        staffCount: '',
        workloadVolume: '',
        adequacy: '',
        issues: ''
      };
    });
    workloadData[u.id] = { unitId: u.id, functions: functionsData };

    // Skills
    const skillsResponses: Record<number, ''> = {};
    SKILLS_ITEMS.forEach(item => {
      skillsResponses[item.id] = '';
    });
    skillsData[u.id] = { unitId: u.id, responses: skillsResponses };
  });

  return {
    units: MCU_UNITS,
    sodData,
    workloadData,
    skillsData,
    metadata: {
      fiscalYear: '2567',
      auditPeriod: 'รอบการประเมินประจำปีงบประมาณ พ.ศ. 2567',
      leadAuditor: 'นักวิชาการตรวจสอบภายใน',
      auditorPosition: 'นักวิชาการตรวจสอบภายในปฏิบัติการ',
      auditSupervisor: 'หัวหน้าสำนักงานตรวจสอบภายใน',
      supervisorPosition: 'ผู้อำนวยการสำนักงานตรวจสอบภายใน มจร',
      lastUpdated: new Date().toISOString()
    }
  };
}

export function createRealisticSampleAuditRecord(): AuditRecord {
  const base = createInitialEmptyAuditRecord();

  // Seed sample data for all 57 units
  MCU_UNITS.forEach(u => {
    const isCentralOrLarge = u.category === 'ส่วนกลาง' || u.category === 'วิทยาเขต';
    const isServiceUnit = u.category === 'หน่วยวิทยบริการ' || u.category === 'หน่วยงานบริการ/กองทุน';
    
    // Seed SoD
    const sod = base.sodData[u.id];
    SOD_ITEMS.forEach(item => {
      // Small units often have issues separating cash receiver vs bookkeeping, buyer vs receiver
      if (isServiceUnit && (item.id === 4 || item.id === 5 || item.id === 6)) {
        sod.responses[item.id] = (u.id % 2 === 0) ? 'ไม่มี' : 'มี';
      } else if (u.id % 7 === 0 && (item.id === 8 || item.id === 9)) {
        sod.responses[item.id] = 'ไม่มี';
      } else if (u.id % 5 === 0 && item.id === 10) {
        sod.responses[item.id] = 'ไม่มี';
      } else {
        sod.responses[item.id] = (u.id % 11 === 0 && (item.id === 4 || item.id === 6)) ? 'ไม่มี' : 'มี';
      }
    });

    // Seed Workload
    const wl = base.workloadData[u.id];
    WORKLOAD_FUNCTIONS.forEach(f => {
      let staff = isCentralOrLarge ? (f.id === 1 || f.id === 2 ? 3 : 2) : (f.id === 1 || f.id === 2 ? 1 : 1);
      if (isServiceUnit && f.id >= 3) staff = 1;
      
      const isAdequate = (staff >= 2 || (isCentralOrLarge && staff >= 2) || (u.id % 4 !== 0));
      
      let sampleVolume = 'ปานกลาง (เอกสาร ~40-60 รายการ/เดือน)';
      if (f.id === 1) sampleVolume = isCentralOrLarge ? 'สูง (~350-500 ฎีกา/เดือน)' : 'ปานกลาง (~60-120 ฎีกา/เดือน)';
      if (f.id === 2) sampleVolume = isCentralOrLarge ? 'สูง (ปิดงบประจำเดือน+ระบบ MIS)' : 'ปานกลาง (~40 รายการ/เดือน)';
      if (f.id === 3) sampleVolume = 'ตรวจนับครุภัณฑ์ประจำปี';
      if (f.id === 4) sampleVolume = isCentralOrLarge ? 'สูง (~30 สัญญา/ปี)' : 'ปานกลาง (~10-15 สัญญา/ปี)';
      if (f.id === 5) sampleVolume = 'งานธุรการและสารบรรณสนับสนุน';

      let sampleIssue = '';
      if (!isAdequate) {
        if (f.id === 2) sampleIssue = 'มีเจ้าหน้าที่เพียง 1 คน ต้องทำทั้งการเงินและลงบัญชี';
        else if (f.id === 4) sampleIssue = 'ภาระงานจัดซื้อเร่งด่วน ขาดผู้มีความรู้พระราชบัญญัติจัดซื้อจัดจ้างฯ';
        else sampleIssue = 'อัตรากำลังไม่เพียงพอ ปฏิบัติงานหลายหน้าที่ควบคู่กัน';
      }

      wl.functions[f.id] = {
        staffCount: staff,
        workloadVolume: sampleVolume,
        adequacy: isAdequate ? 'เพียงพอ' : 'ไม่เพียงพอ',
        issues: sampleIssue
      };
    });

    // Seed Skills
    const sk = base.skillsData[u.id];
    SKILLS_ITEMS.forEach(item => {
      if (item.id === 4) {
        // MIS
        sk.responses[item.id] = (u.id % 3 === 0) ? 'ไม่มี' : 'มี';
      } else if (item.id === 5) {
        // IDP
        sk.responses[item.id] = (u.id % 4 === 0) ? 'ไม่มี' : 'มี';
      } else if (item.id === 6) {
        // KM
        sk.responses[item.id] = (u.id % 5 === 0) ? 'ไม่มี' : 'มี';
      } else {
        sk.responses[item.id] = (u.id % 6 === 0) ? 'ไม่มี' : 'มี';
      }
    });
  });

  return base;
}
