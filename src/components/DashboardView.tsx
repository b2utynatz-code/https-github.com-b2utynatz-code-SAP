import React from 'react';
import { AuditRecord, UnitInfo } from '../types/audit';
import { computeUniversityStats } from '../utils/auditCalculations';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Building,
  FileText
} from 'lucide-react';

interface DashboardViewProps {
  record: AuditRecord;
  onSelectUnit: (unit: UnitInfo) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenUpload?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  record,
  onSelectUnit,
  onNavigateToTab,
  onOpenUpload
}) => {
  const [submissionListFilter, setSubmissionListFilter] = React.useState<'all' | 'submitted' | 'pending'>('all');
  const [listSearch, setListSearch] = React.useState('');
  const { unitSummaries, stats } = computeUniversityStats(record);

  // Filter high-risk units that need immediate audit intervention
  const highRiskUnits = unitSummaries
    .filter(s => s.overallRiskLevel === 'วิกฤต/สูงมาก' || s.overallRiskLevel === 'สูง')
    .sort((a, b) => a.overallScore - b.overallScore);

  // Top compliant units
  const topUnits = [...unitSummaries]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 5);

  const isDataEmpty = stats.totalEvaluatedUnits === 0;

  return (
    <div className="space-y-6">
      {/* Empty State Banner when cleared */}
      {isDataEmpty && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-dashed border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                ข้อมูลถูกเคลียร์เป็นค่าว่างเรียบร้อยแล้ว (พร้อมรับข้อมูลใหม่ 57 ส่วนงาน)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                ท่านสามารถอัปโหลดไฟล์ Excel (.xlsx) หรือ CSV เพื่อประมวลผลแดชบอร์ดและออกกระดาษทำการตรวจสอบภายในได้ทันที
              </p>
            </div>
          </div>
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-sm flex items-center gap-2 transition-all shrink-0"
            >
              <span>อัปโหลดไฟล์ Excel ตอนนี้</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Executive Welcome & Key Metrics */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                แดชบอร์ดสรุปผลการวิเคราะห์ข้อมูลแบบเรียลไทม์
              </span>
              <h2 className="text-xl md:text-2xl font-bold font-heading mt-2">
                รายงานการประเมินการควบคุมภายในและศักยภาพบุคลากร 57 ส่วนงาน
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-1">
                มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย (มจร) • สำนักงานตรวจสอบภายใน
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-amber-300/80">คะแนนควบคุมภายในภาพรวม มจร</div>
                <div className="text-3xl font-extrabold text-amber-400 font-heading">
                  {stats.overallHealthScore}<span className="text-lg font-normal text-white/60">/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillars Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {/* Submission Progress */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-300 font-medium">ความคืบหน้าการส่งข้อมูล</span>
                <span className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-white">
                  {stats.totalSubmittedUnits} <span className="text-sm font-normal text-slate-300">/ 57 ส่วนงาน</span>
                </div>
                <div className="text-[11px] text-amber-200 mt-0.5">
                  ส่งข้อมูลแล้ว {stats.submissionRate}% • ยังไม่ส่ง {stats.totalPendingUnits} แห่ง
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span>ประเมินแล้ว {stats.totalSubmittedUnits} แห่ง</span>
                <span className="text-amber-300">รอส่ง {stats.totalPendingUnits} แห่ง</span>
              </div>
            </div>

            {/* 1. SoD */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-300 font-medium">1. การแบ่งแยกหน้าที่ (SoD)</span>
                <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-white">{stats.avgSodCompliance}%</div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  เกณฑ์ร้อยละที่มีการแบ่งแยกหน้าที่ 10 ข้อ
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span>(เฉพาะ {stats.totalSubmittedUnits} แห่งที่ส่งแล้ว)</span>
                <button
                  onClick={() => onNavigateToTab('sod')}
                  className="text-amber-300 hover:text-white flex items-center gap-0.5 font-medium"
                >
                  ดูตาราง <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 2. Workload */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-300 font-medium">2. ความเพียงพอบุคลากร</span>
                <span className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-white">{stats.avgWorkloadAdequacy}%</div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  สัดส่วนส่วนงานที่ประเมินว่าเพียงพอ (5 ด้าน)
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span>บุคลากรผู้ปฏิบัติงาน: {stats.totalPersonnel} คน</span>
                <button
                  onClick={() => onNavigateToTab('workload')}
                  className="text-amber-300 hover:text-white flex items-center gap-0.5 font-medium"
                >
                  ดูตาราง <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 3. Skills */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-300 font-medium">3. การพัฒนาความรู้/ทักษะ</span>
                <span className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                  <GraduationCap className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-white">{stats.avgSkillsTraining}%</div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  อัตราการได้รับการอบรมและ KM (6 ข้อ)
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span>อบรม MIS: {stats.skillsItemStats[3]?.percent || 0}%</span>
                <button
                  onClick={() => onNavigateToTab('skills')}
                  className="text-amber-300 hover:text-white flex items-center gap-0.5 font-medium"
                >
                  ดูตาราง <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Analysis Warning: Critical Fraud & Control Bottlenecks */}
      {!isDataEmpty && highRiskUnits.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-700 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-red-900 font-heading">
                  ข้อตรวจพบสำคัญที่มีความเสี่ยงสูง (Critical Control & Fraud Deficiencies)
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-200 text-red-800">
                  {highRiskUnits.length} ส่วนงานต้องได้รับการเข้าตรวจเป็นลำดับแรก
                </span>
              </div>
              <p className="text-xs text-red-700 mt-1">
                ตรวจพบส่วนงานที่ไม่มีการแบ่งแยกหน้าที่ในจุดเปราะบาง (เช่น ผู้รับเงินกับผู้ลงบัญชีเป็นบุคคลเดียวกัน หรือผู้จัดซื้อเป็นผู้ตรวจรับพัสดุ) ร่วมกับมีอัตรากำลังไม่เพียงพอ
              </p>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {highRiskUnits.slice(0, 6).map((u) => {
                  const unitObj = record.units.find(x => x.id === u.unitId)!;
                  return (
                    <div
                      key={u.unitId}
                      onClick={() => onSelectUnit(unitObj)}
                      className="bg-white p-3 rounded-lg border border-red-200 hover:border-red-400 hover:shadow-xs cursor-pointer transition-all text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-900">
                        <span className="truncate">{u.unitName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-100 text-red-800 font-bold">
                          {u.overallRiskLevel}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        SoD: <strong className="text-red-700">{u.sodPercent}%</strong> | กำลังคน: {u.totalStaff} คน
                      </div>
                      <div className="text-[11px] text-red-600 line-clamp-1 mt-1">
                        ⚠ {u.criticalDeficiencies[0] || 'ขาดการควบคุมภายในที่เพียงพอ'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Breakdown: 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: SoD 10 Items Compliance Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                สถิติการแบ่งแยกหน้าที่รายข้อ (10 ข้อ)
              </h3>
              <span className="text-[11px] text-slate-400">57 ส่วนงาน</span>
            </div>

            <div className="mt-4 space-y-3">
              {stats.sodItemStats.map((item) => (
                <div key={item.id} className="text-xs">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-700 font-medium truncate max-w-[210px]" title={item.title}>
                      {item.id}. {item.title}
                    </span>
                    <span className="font-bold text-slate-900">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.percent >= 80 ? 'bg-emerald-500' :
                        item.percent >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>เกณฑ์มาตรฐาน มจร: 100%</span>
            <button
              onClick={() => onNavigateToTab('sod')}
              className="text-amber-700 hover:text-amber-900 font-medium"
            >
              แก้ไขตาราง SoD →
            </button>
          </div>
        </div>

        {/* Column 2: Workload & Staff Adequacy per Function */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                ความเพียงพอของบุคลากรรายสายงาน (5 ด้าน)
              </h3>
              <span className="text-[11px] text-slate-400">รวม {stats.totalPersonnel} คน</span>
            </div>

            <div className="mt-4 space-y-4">
              {stats.workloadFunctionStats.map((f) => (
                <div key={f.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-800">{f.id}. {f.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      f.percent >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      เพียงพอ {f.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${f.percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>จำนวนบุคลากรทั้งหมด: <strong className="text-slate-800">{f.totalStaff}</strong> คน</span>
                    <span>เพียงพอ {f.adequateCount} / ไม่พอ {f.inadequateCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>ภาระงานวิกฤต: งานบัญชีและการเงิน</span>
            <button
              onClick={() => onNavigateToTab('workload')}
              className="text-blue-700 hover:text-blue-900 font-medium"
            >
              แก้ไขตารางภาระงาน →
            </button>
          </div>
        </div>

        {/* Column 3: Category Breakdown & Top Units */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-600" />
                เปรียบเทียบตามประเภทส่วนงาน
              </h3>
              <span className="text-[11px] text-slate-400">7 ประเภท</span>
            </div>

            <div className="mt-4 space-y-3">
              {stats.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-800">{cat.category} ({cat.count} แห่ง)</span>
                    <span className="font-bold text-slate-900">
                      SoD เฉลี่ย {cat.avgSod}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-200/60">
                    <span>การแบ่งแยก: <strong className="text-emerald-700">{cat.avgSod}%</strong></span>
                    <span>เพียงพอ: <strong className="text-blue-700">{cat.avgWl}%</strong></span>
                    <span>อบรม: <strong className="text-purple-700">{cat.avgSk}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>ความพร้อมหน่วยวิทยบริการต้องการความช่วยเหลือเร่งด่วน</span>
            <button
              onClick={() => onNavigateToTab('working-papers')}
              className="text-amber-800 hover:text-amber-950 font-medium"
            >
              ดูกระดาษทำการตรวจสอบ →
            </button>
          </div>
        </div>
      </div>

      {/* Unit Submission Status Tracking Table (57 Units) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <Building className="w-4 h-4 text-amber-700" />
              </span>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                สถานะการส่งข้อมูลแบบสำรวจ ครบทั้ง 57 ส่วนงาน (Survey Submission Tracking)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ติดตามส่วนงานที่ส่งข้อมูลแล้ว ({stats.totalSubmittedUnits} แห่ง) และส่วนงานที่ยังไม่ได้ส่งข้อมูล ({stats.totalPendingUnits} แห่ง) พร้อมข้อมูลผลประเมินรายส่วนงาน
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter buttons */}
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setSubmissionListFilter('all')}
                className={`px-3 py-1 rounded-md transition-all ${
                  submissionListFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ทั้งหมด (57)
              </button>
              <button
                type="button"
                onClick={() => setSubmissionListFilter('submitted')}
                className={`px-3 py-1 rounded-md transition-all ${
                  submissionListFilter === 'submitted'
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ✓ ส่งแล้ว ({stats.totalSubmittedUnits})
              </button>
              <button
                type="button"
                onClick={() => setSubmissionListFilter('pending')}
                className={`px-3 py-1 rounded-md transition-all ${
                  submissionListFilter === 'pending'
                    ? 'bg-white text-amber-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⏳ ยังไม่ส่ง ({stats.totalPendingUnits})
              </button>
            </div>

            {/* Quick search input */}
            <input
              type="text"
              placeholder="ค้นหารายชื่อส่วนงาน..."
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              className="py-1 px-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 w-44 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold text-[11px] sticky top-0 z-10 shadow-xs">
              <tr>
                <th className="p-2.5 text-center w-12 border-b border-r border-slate-200">ลำดับ</th>
                <th className="p-2.5 border-b border-r border-slate-200 min-w-48">ส่วนงาน (57 แห่ง)</th>
                <th className="p-2.5 border-b border-r border-slate-200 text-center w-28">ประเภท</th>
                <th className="p-2.5 border-b border-r border-slate-200 text-center w-24">ผู้รับผิดชอบ</th>
                <th className="p-2.5 border-b border-r border-slate-200 text-center w-32">สถานะการส่ง</th>
                <th className="p-2.5 border-b border-r border-slate-200 text-center w-24 bg-emerald-50/50">SoD (% มี)</th>
                <th className="p-2.5 border-b border-r border-slate-200 text-center w-24 bg-blue-50/50">ภาระงาน (% พอ)</th>
                <th className="p-2.5 border-b border-r border-slate-200 text-center w-24 bg-purple-50/50">ทักษะ (% อบรม)</th>
                <th className="p-2.5 border-b border-r border-slate-200 text-center w-24 bg-amber-50/50">คะแนนประเมิน</th>
                <th className="p-2.5 border-b border-slate-200 text-center w-24">ระดับความเสี่ยง</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {unitSummaries
                .filter((s) => {
                  const matchStatus =
                    submissionListFilter === 'all' ||
                    (submissionListFilter === 'submitted' && s.hasSubmittedData) ||
                    (submissionListFilter === 'pending' && !s.hasSubmittedData);
                  const matchSearch =
                    !listSearch.trim() ||
                    s.unitName.toLowerCase().includes(listSearch.toLowerCase()) ||
                    String(s.unitId) === listSearch.trim() ||
                    (s.auditorInCharge && s.auditorInCharge.toLowerCase().includes(listSearch.toLowerCase()));
                  return matchStatus && matchSearch;
                })
                .map((s) => {
                  const unitObj = record.units.find((x) => x.id === s.unitId)!;
                  return (
                    <tr
                      key={s.unitId}
                      onClick={() => onSelectUnit(unitObj)}
                      className="hover:bg-amber-50/20 cursor-pointer transition-colors"
                    >
                      <td className="p-2 text-center text-slate-500 border-r border-slate-200 font-mono">
                        {s.unitId}
                      </td>
                      <td className="p-2 border-r border-slate-200 font-medium text-slate-900">
                        <div className="flex items-center justify-between gap-1">
                          <span className="hover:text-amber-700 hover:underline">{s.unitName}</span>
                          {!s.hasSubmittedData && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0 font-normal">
                              ยังไม่ได้ส่งข้อมูล
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center text-slate-600 text-[11px]">
                        {s.category}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center text-[11px]">
                        {s.auditorInCharge ? (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                            {s.auditorInCharge}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center">
                        {s.hasSubmittedData ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            ส่งข้อมูลแล้ว
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-900 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                            ⏳ ยังไม่ได้ส่งข้อมูล
                          </span>
                        )}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-emerald-800 bg-emerald-50/20">
                        {s.hasSubmittedData ? `${s.sodPercent}%` : <span className="text-slate-400 font-normal text-[10px]">-</span>}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-blue-800 bg-blue-50/20">
                        {s.hasSubmittedData ? `${s.workloadPercent}%` : <span className="text-slate-400 font-normal text-[10px]">-</span>}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-purple-800 bg-purple-50/20">
                        {s.hasSubmittedData ? `${s.skillsPercent}%` : <span className="text-slate-400 font-normal text-[10px]">-</span>}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-black text-amber-900 bg-amber-50/40">
                        {s.hasSubmittedData ? `${s.overallScore}/100` : <span className="text-slate-400 font-normal text-[10px]">-</span>}
                      </td>
                      <td className="p-2 text-center">
                        {s.hasSubmittedData ? (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              s.overallRiskLevel === 'วิกฤต/สูงมาก'
                                ? 'bg-red-100 text-red-900 border border-red-300'
                                : s.overallRiskLevel === 'สูง'
                                ? 'bg-amber-100 text-amber-900'
                                : s.overallRiskLevel === 'ปานกลาง'
                                ? 'bg-yellow-50 text-yellow-800'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {s.overallRiskLevel}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            ยังไม่ได้ส่งข้อมูล
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 5 Best Practice Units vs Low Ranking Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 5 Units */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ส่วนงานที่มีคะแนนการควบคุมภายในสูงสุด (Best Practices)
            </h3>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {topUnits.map((u, i) => {
              const unitObj = record.units.find(x => x.id === u.unitId)!;
              return (
                <div
                  key={u.unitId}
                  onClick={() => onSelectUnit(unitObj)}
                  className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-800">{u.unitName}</span>
                      <div className="text-[11px] text-slate-500">
                        {u.category} • บุคลากร {u.totalStaff} คน
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-sm">{u.overallScore}</span>
                    <span className="text-[10px] text-slate-400">/100</span>
                    <div className="text-[10px] text-slate-500">SoD {u.sodPercent}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Recommendations & Next Steps */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                ข้อเสนอแนะเชิงนโยบายของผู้ตรวจสอบภายใน มจร
              </h3>
            </div>
            <ul className="mt-3 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span><strong>ออกคำสั่งมอบหมายหน้าที่ชัดเจน:</strong> สำหรับหน่วยงานที่มีบุคลากรจำกัด ต้องกำหนดอำนาจดำเนินการและระบบการสอบทานคู่ขนาน (Compensating Controls) เพื่อทดแทนการแบ่งแยกหน้าที่ที่ไม่สมบูรณ์</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span><strong>แก้ไขจุดวิกฤตผู้รับเงิน-ผู้ลงบัญชี:</strong> ห้ามผู้ปฏิบัติงานคนเดียวกันรับเงินสดและบันทึกบัญชีโดยเด็ดขาด ให้ส่วนกลางจัดระบบ e-Payment หรือใบเสร็จอิเล็กทรอนิกส์</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span><strong>จัดอบรมพระราชบัญญัติจัดซื้อจัดจ้างฯ และระบบ MIS:</strong> จัดหลักสูตรเร่งรัดให้กับวิทยาเขตและวิทยาลัยสงฆ์ที่ยังขาดการอบรม</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">อ้างอิงมาตรฐานการตรวจสอบภายในภาครัฐ</span>
            <button
              onClick={() => onNavigateToTab('working-papers')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-800 hover:bg-amber-900 text-white shadow-xs"
            >
              ออกกระดาษทำการฉบับสมบูรณ์
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
