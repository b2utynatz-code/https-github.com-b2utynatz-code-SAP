import {
  AuditRecord,
  UnitCalculatedSummary,
  UnitInfo
} from '../types/audit';
import { SOD_ITEMS, WORKLOAD_FUNCTIONS, SKILLS_ITEMS } from '../data/defaultUnits';
import { AUDITOR_ASSIGNMENTS } from '../data/actualUploadedData';

export function calculateUnitSummary(unit: UnitInfo, record: AuditRecord): UnitCalculatedSummary {
  const sod = record.sodData[unit.id]?.responses || {};
  const wl = record.workloadData[unit.id]?.functions || {};
  const sk = record.skillsData[unit.id]?.responses || {};

  // SoD
  let sodYes = 0;
  let sodNo = 0;
  SOD_ITEMS.forEach(item => {
    const val = sod[item.id];
    if (val === 'มี') sodYes++;
    else if (val === 'ไม่มี') sodNo++;
  });
  const sodAnswered = sodYes + sodNo;
  const sodPercent = sodAnswered > 0 ? Math.round((sodYes / sodAnswered) * 100) : 0;

  // Workload
  let totalStaff = 0;
  let wlAdequate = 0;
  let wlInadequate = 0;
  let wlHasAnyInput = false;
  WORKLOAD_FUNCTIONS.forEach(f => {
    const fnData = wl[f.id];
    if (fnData) {
      if (typeof fnData.staffCount === 'number') {
        totalStaff += fnData.staffCount;
        wlHasAnyInput = true;
      }
      if (fnData.adequacy === 'เพียงพอ') {
        wlAdequate++;
        wlHasAnyInput = true;
      } else if (fnData.adequacy === 'ไม่เพียงพอ') {
        wlInadequate++;
        wlHasAnyInput = true;
      }
      if (fnData.workloadVolume && fnData.workloadVolume !== '-') {
        wlHasAnyInput = true;
      }
    }
  });
  const wlAnswered = wlAdequate + wlInadequate;
  const wlPercent = wlAnswered > 0 ? Math.round((wlAdequate / wlAnswered) * 100) : 0;

  // Skills
  let skYes = 0;
  let skNo = 0;
  SKILLS_ITEMS.forEach(item => {
    const val = sk[item.id];
    if (val === 'มี') skYes++;
    else if (val === 'ไม่มี') skNo++;
  });
  const skAnswered = skYes + skNo;
  const skPercent = skAnswered > 0 ? Math.round((skYes / skAnswered) * 100) : 0;

  const hasSubmittedData = (sodAnswered > 0 || wlHasAnyInput || skAnswered > 0);
  const submissionStatus: 'ส่งข้อมูลแล้ว' | 'ยังไม่ได้ส่งข้อมูล' = hasSubmittedData ? 'ส่งข้อมูลแล้ว' : 'ยังไม่ได้ส่งข้อมูล';
  const auditorInCharge = AUDITOR_ASSIGNMENTS[unit.id] || undefined;

  // If unit has not submitted data yet
  if (!hasSubmittedData) {
    return {
      unitId: unit.id,
      unitName: unit.name,
      category: unit.category,
      hasSubmittedData: false,
      submissionStatus: 'ยังไม่ได้ส่งข้อมูล',
      auditorInCharge,
      sodYesCount: 0,
      sodNoCount: 0,
      sodAnsweredCount: 0,
      sodPercent: 0,
      totalStaff: 0,
      workloadAdequateCount: 0,
      workloadInadequateCount: 0,
      workloadPercent: 0,
      skillsYesCount: 0,
      skillsNoCount: 0,
      skillsPercent: 0,
      overallRiskLevel: 'ยังไม่ได้ส่งข้อมูล',
      overallScore: 0,
      criticalDeficiencies: ['ยังไม่ได้ส่งข้อมูล']
    };
  }

  // Deficiencies detection
  const criticalDeficiencies: string[] = [];

  // Critical SoD checks
  if (sod[4] === 'ไม่มี') {
    criticalDeficiencies.push('ผู้รับเงินไม่ได้แยกจากผู้บันทึกบัญชี (เสี่ยงต่อการยักยอก/ทุจริตเงินสด)');
  }
  if (sod[5] === 'ไม่มี') {
    criticalDeficiencies.push('ผู้จ่ายเงินไม่ได้แยกจากผู้บันทึกบัญชี (เสี่ยงต่อการเบิกจ่ายซ้ำซ้อนหรือบันทึกบัญชีเท็จ)');
  }
  if (sod[6] === 'ไม่มี') {
    criticalDeficiencies.push('ผู้จัดทำจัดซื้อไม่ได้แยกจากผู้ตรวจรับพัสดุ (ขัดต่อ พ.ร.บ. จัดซื้อจัดจ้างฯ)');
  }
  if (sod[10] === 'ไม่มี') {
    criticalDeficiencies.push('ไม่มีการควบคุมสิทธิ์การเข้าใช้งานระบบ MIS/ไอที ที่เหมาะสม');
  }

  // Workload bottlenecks
  if (wl[1]?.adequacy === 'ไม่เพียงพอ' || wl[2]?.adequacy === 'ไม่เพียงพอ') {
    criticalDeficiencies.push('บุคลากรด้านการเงินหรือบัญชีไม่เพียงพอต่อภาระงานจริง');
  }
  if (wl[4]?.adequacy === 'ไม่เพียงพอ') {
    criticalDeficiencies.push('บุคลากรด้านจัดซื้อจัดจ้างไม่เพียงพอ ส่งผลต่อความล่าช้าในการบริหารสัญญา');
  }

  // Skills gaps
  if (sk[1] === 'ไม่มี' || sk[2] === 'ไม่มี') {
    criticalDeficiencies.push('เจ้าหน้าที่ยังไม่ได้รับการอบรมด้านการเงินหรือบัญชีตามมาตรฐาน');
  }
  if (sk[4] === 'ไม่มี') {
    criticalDeficiencies.push('ยังไม่ได้รับการอบรมระบบ MIS มหาวิทยาลัย');
  }

  // Weighted score (SoD 45%, Workload 30%, Skills 25%)
  const overallScore = Math.round(
    (sodPercent * 0.45) + (wlPercent * 0.30) + (skPercent * 0.25)
  );

  // Overall Risk Level calculation
  let overallRiskLevel: 'วิกฤต/สูงมาก' | 'สูง' | 'ปานกลาง' | 'ต่ำ';
  const hasCriticalSodFailure = (sod[4] === 'ไม่มี' || sod[5] === 'ไม่มี' || sod[6] === 'ไม่มี');
  const hasInadequateFinanceStaff = (wl[1]?.adequacy === 'ไม่เพียงพอ' || wl[2]?.adequacy === 'ไม่เพียงพอ');

  if ((hasCriticalSodFailure && hasInadequateFinanceStaff) || sodPercent < 50 || overallScore < 50) {
    overallRiskLevel = 'วิกฤต/สูงมาก';
  } else if (hasCriticalSodFailure || sodPercent < 75 || wlPercent < 60 || overallScore < 70) {
    overallRiskLevel = 'สูง';
  } else if (overallScore < 85 || sodPercent < 90) {
    overallRiskLevel = 'ปานกลาง';
  } else {
    overallRiskLevel = 'ต่ำ';
  }

  return {
    unitId: unit.id,
    unitName: unit.name,
    category: unit.category,
    hasSubmittedData: true,
    submissionStatus: 'ส่งข้อมูลแล้ว',
    auditorInCharge,
    sodYesCount: sodYes,
    sodNoCount: sodNo,
    sodAnsweredCount: sodAnswered,
    sodPercent,
    totalStaff,
    workloadAdequateCount: wlAdequate,
    workloadInadequateCount: wlInadequate,
    workloadPercent: wlPercent,
    skillsYesCount: skYes,
    skillsNoCount: skNo,
    skillsPercent: skPercent,
    overallRiskLevel,
    overallScore,
    criticalDeficiencies
  };
}

export interface UniversityAuditStats {
  totalUnits: number;
  totalEvaluatedUnits: number;
  totalSubmittedUnits: number;
  totalPendingUnits: number;
  submissionRate: number;
  avgSodCompliance: number;
  avgWorkloadAdequacy: number;
  avgSkillsTraining: number;
  overallHealthScore: number;
  riskCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    pending: number;
  };
  totalPersonnel: number;
  sodItemStats: { id: number; title: string; yesCount: number; noCount: number; percent: number }[];
  workloadFunctionStats: { id: number; name: string; adequateCount: number; inadequateCount: number; totalStaff: number; percent: number }[];
  skillsItemStats: { id: number; title: string; yesCount: number; noCount: number; percent: number }[];
  categoryBreakdown: { category: string; count: number; submittedCount: number; avgSod: number; avgWl: number; avgSk: number }[];
}

export function computeUniversityStats(record: AuditRecord): {
  unitSummaries: UnitCalculatedSummary[];
  stats: UniversityAuditStats;
} {
  const unitSummaries = record.units.map(u => calculateUnitSummary(u, record));
  const totalUnits = record.units.length;

  const submittedSummaries = unitSummaries.filter(s => s.hasSubmittedData);
  const totalSubmittedUnits = submittedSummaries.length;
  const totalPendingUnits = totalUnits - totalSubmittedUnits;
  const submissionRate = totalUnits > 0 ? Math.round((totalSubmittedUnits / totalUnits) * 100) : 0;

  let totalSodSum = 0;
  let totalWlSum = 0;
  let totalSkSum = 0;
  let totalScoreSum = 0;
  let totalStaff = 0;

  const riskCounts = { critical: 0, high: 0, medium: 0, low: 0, pending: totalPendingUnits };

  submittedSummaries.forEach(s => {
    totalSodSum += s.sodPercent;
    totalWlSum += s.workloadPercent;
    totalSkSum += s.skillsPercent;
    totalScoreSum += s.overallScore;
    totalStaff += s.totalStaff;

    if (s.overallRiskLevel === 'วิกฤต/สูงมาก') riskCounts.critical++;
    else if (s.overallRiskLevel === 'สูง') riskCounts.high++;
    else if (s.overallRiskLevel === 'ปานกลาง') riskCounts.medium++;
    else if (s.overallRiskLevel === 'ต่ำ') riskCounts.low++;
  });

  // SoD per item stats (calculated based on submitted units)
  const sodItemStats = SOD_ITEMS.map(item => {
    let yes = 0;
    let no = 0;
    record.units.forEach(u => {
      const resp = record.sodData[u.id]?.responses[item.id];
      if (resp === 'มี') yes++;
      else if (resp === 'ไม่มี') no++;
    });
    const ans = yes + no;
    return {
      id: item.id,
      title: item.title,
      yesCount: yes,
      noCount: no,
      percent: ans > 0 ? Math.round((yes / ans) * 100) : 0
    };
  });

  // Workload per function stats (calculated based on submitted units)
  const workloadFunctionStats = WORKLOAD_FUNCTIONS.map(f => {
    let ad = 0;
    let inad = 0;
    let staff = 0;
    record.units.forEach(u => {
      const fn = record.workloadData[u.id]?.functions[f.id];
      if (fn) {
        if (typeof fn.staffCount === 'number') staff += fn.staffCount;
        if (fn.adequacy === 'เพียงพอ') ad++;
        else if (fn.adequacy === 'ไม่เพียงพอ') inad++;
      }
    });
    const ans = ad + inad;
    return {
      id: f.id,
      name: f.name,
      adequateCount: ad,
      inadequateCount: inad,
      totalStaff: staff,
      percent: ans > 0 ? Math.round((ad / ans) * 100) : 0
    };
  });

  // Skills per item stats (calculated based on submitted units)
  const skillsItemStats = SKILLS_ITEMS.map(item => {
    let yes = 0;
    let no = 0;
    record.units.forEach(u => {
      const resp = record.skillsData[u.id]?.responses[item.id];
      if (resp === 'มี') yes++;
      else if (resp === 'ไม่มี') no++;
    });
    const ans = yes + no;
    return {
      id: item.id,
      title: item.title,
      yesCount: yes,
      noCount: no,
      percent: ans > 0 ? Math.round((yes / ans) * 100) : 0
    };
  });

  // Category breakdown
  const categoryMap = new Map<string, { count: number; submittedCount: number; sodSum: number; wlSum: number; skSum: number }>();
  unitSummaries.forEach(s => {
    const entry = categoryMap.get(s.category) || { count: 0, submittedCount: 0, sodSum: 0, wlSum: 0, skSum: 0 };
    entry.count += 1;
    if (s.hasSubmittedData) {
      entry.submittedCount += 1;
      entry.sodSum += s.sodPercent;
      entry.wlSum += s.workloadPercent;
      entry.skSum += s.skillsPercent;
    }
    categoryMap.set(s.category, entry);
  });

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, val]) => ({
    category,
    count: val.count,
    submittedCount: val.submittedCount,
    avgSod: val.submittedCount > 0 ? Math.round(val.sodSum / val.submittedCount) : 0,
    avgWl: val.submittedCount > 0 ? Math.round(val.wlSum / val.submittedCount) : 0,
    avgSk: val.submittedCount > 0 ? Math.round(val.skSum / val.submittedCount) : 0
  }));

  const stats: UniversityAuditStats = {
    totalUnits,
    totalEvaluatedUnits: totalSubmittedUnits,
    totalSubmittedUnits,
    totalPendingUnits,
    submissionRate,
    avgSodCompliance: totalSubmittedUnits > 0 ? Math.round(totalSodSum / totalSubmittedUnits) : 0,
    avgWorkloadAdequacy: totalSubmittedUnits > 0 ? Math.round(totalWlSum / totalSubmittedUnits) : 0,
    avgSkillsTraining: totalSubmittedUnits > 0 ? Math.round(totalSkSum / totalSubmittedUnits) : 0,
    overallHealthScore: totalSubmittedUnits > 0 ? Math.round(totalScoreSum / totalSubmittedUnits) : 0,
    riskCounts,
    totalPersonnel: totalStaff,
    sodItemStats,
    workloadFunctionStats,
    skillsItemStats,
    categoryBreakdown
  };

  return { unitSummaries, stats };
}
