import React, { useState } from 'react';
import { AuditRecord, UnitInfo, UnitCalculatedSummary } from '../types/audit';
import { computeUniversityStats, calculateUnitSummary } from '../utils/auditCalculations';
import { SOD_ITEMS, WORKLOAD_FUNCTIONS, SKILLS_ITEMS } from '../data/defaultUnits';
import { exportAuditRecordToExcel } from '../utils/excelUtils';
import { McuLogo } from './McuLogo';
import { 
  Printer, 
  Download, 
  FileCheck, 
  Building2, 
  Calendar, 
  UserCheck, 
  FileSpreadsheet,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Filter
} from 'lucide-react';

interface WorkingPaperViewProps {
  record: AuditRecord;
  units: UnitInfo[];
  onUpdateMetadata: (metadata: Partial<AuditRecord['metadata']>) => void;
  selectedUnitFromParent?: UnitInfo | null;
}

export const WorkingPaperView: React.FC<WorkingPaperViewProps> = ({
  record,
  units,
  onUpdateMetadata,
  selectedUnitFromParent
}) => {
  const [reportType, setReportType] = useState<'matrix-57' | 'single-unit' | 'sod-detail' | 'workload-detail'>('matrix-57');
  const [focusedUnitId, setFocusedUnitId] = useState<number>(selectedUnitFromParent?.id || 1);
  const [isEditingSignatures, setIsEditingSignatures] = useState(false);

  const { unitSummaries, stats } = computeUniversityStats(record);
  const currentFocusedUnit = units.find(u => u.id === focusedUnitId) || units[0];
  const focusedSummary = calculateUnitSummary(currentFocusedUnit, record);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar (Hidden when printing) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-amber-700" />
            รูปแบบกระดาษทำการ:
          </span>
          <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-100 text-xs">
            <button
              onClick={() => setReportType('matrix-57')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                reportType === 'matrix-57'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ตารางสรุป 57 ส่วนงาน (WP-MCU-ALL)
            </button>
            <button
              onClick={() => setReportType('single-unit')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                reportType === 'single-unit'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              กระดาษทำการเจาะลึกรายส่วนงาน (WP-UNIT)
            </button>
            <button
              onClick={() => setReportType('sod-detail')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                reportType === 'sod-detail'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              กระดาษทำการแบ่งแยกหน้าที่ (WP-SOD)
            </button>
          </div>

          {reportType === 'single-unit' && (
            <select
              value={focusedUnitId}
              onChange={(e) => setFocusedUnitId(Number(e.target.value))}
              className="py-1 px-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id}. {u.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingSignatures(!isEditingSignatures)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {isEditingSignatures ? 'ปิดแก้ไขข้อมูลกำกับ' : 'แก้ไขชื่อผู้ตรวจ/ปีงบ'}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-700 hover:bg-amber-800 text-white shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์กระดาษทำการ (Print/PDF)</span>
          </button>

          <button
            onClick={() => exportAuditRecordToExcel(record, `MCU_Working_Paper_${reportType}_${record.metadata.fiscalYear}.xlsx`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก Excel</span>
          </button>
        </div>
      </div>

      {/* Metadata / Auditor Signatures Editor Modal or Accordion */}
      {isEditingSignatures && (
        <div className="no-print bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs space-y-3">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-amber-700" />
            ข้อมูลกำกับกระดาษทำการตรวจสอบภายใน
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">ปีงบประมาณ</label>
              <input
                type="text"
                value={record.metadata.fiscalYear}
                onChange={(e) => onUpdateMetadata({ fiscalYear: e.target.value })}
                className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">ผู้จัดทำ (ผู้ตรวจสอบภายใน)</label>
              <input
                type="text"
                value={record.metadata.leadAuditor}
                onChange={(e) => onUpdateMetadata({ leadAuditor: e.target.value })}
                className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">ตำแหน่งผู้จัดทำ</label>
              <input
                type="text"
                value={record.metadata.auditorPosition}
                onChange={(e) => onUpdateMetadata({ auditorPosition: e.target.value })}
                className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">ผู้สอบทาน (หัวหน้า สนง.ตรวจสอบภายใน)</label>
              <input
                type="text"
                value={record.metadata.auditSupervisor}
                onChange={(e) => onUpdateMetadata({ auditSupervisor: e.target.value })}
                className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OFFICIAL WORKING PAPER SHEET (PRINTABLE CONTAINER)                         */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 lg:p-8 rounded-xl border border-slate-200 shadow-sm print-container text-slate-900">
        {/* Official Header Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <McuLogo className="w-16 h-16" />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold font-heading uppercase tracking-wide text-slate-950">
                  สำนักงานตรวจสอบภายใน มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย
                </h1>
                <h2 className="text-sm font-semibold text-slate-800">
                  กระดาษทำการตรวจสอบภายใน (INTERNAL AUDIT WORKING PAPER)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  โครงการประเมินระบบการควบคุมภายใน การแบ่งแยกหน้าที่ ภาระงาน และการพัฒนาทักษะบุคลากร
                </p>
              </div>
            </div>

            {/* Working Paper Metadata Badge */}
            <div className="text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 min-w-56 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">กระดาษทำการเลขที่:</span>
                <span className="font-bold text-slate-900">
                  {reportType === 'matrix-57' ? 'WP-MCU-SUMMARY-2567' :
                   reportType === 'single-unit' ? `WP-MCU-U${currentFocusedUnit.id}` : 'WP-MCU-SOD-2567'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ปีงบประมาณ:</span>
                <span className="font-semibold text-slate-900">พ.ศ. {record.metadata.fiscalYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">วันที่ประเมิน:</span>
                <span className="font-semibold text-slate-900">
                  {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Audit Standard Criteria & Objectives Bar */}
          <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div>
              <strong className="text-slate-800">วัตถุประสงค์ (Objective):</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                เพื่อสอบทานความเหมาะสมของการแบ่งแยกหน้าที่ ความเพียงพอของบุคลากรสายสนับสนุน และความพร้อมในการปฏิบัติงานด้านการเงิน บัญชี พัสดุ
              </p>
            </div>
            <div>
              <strong className="text-slate-800">เกณฑ์การตรวจ (Criteria):</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                หลักเกณฑ์ คตง. / กระทรวงการคลังว่าด้วยการควบคุมภายใน และ พ.ร.บ. จัดซื้อจัดจ้างฯ พ.ศ. 2560
              </p>
            </div>
            <div>
              <strong className="text-slate-800">ขอบเขต (Scope):</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                ส่วนงาน มจร รวม 57 แห่ง (12 วิทยาเขต, 27 วิทยาลัยสงฆ์, คณะ, สถาบัน และส่วนกลาง)
              </p>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------- */}
        {/* VIEW 1: MATRIX 57 UNITS (SUMMARY WORKING PAPER)                     */}
        {/* -------------------------------------------------------------------- */}
        {reportType === 'matrix-57' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                ตารางสรุปผลการประเมิน 3 มิติ ครบทั้ง 57 ส่วนงาน มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย
              </span>
              <span className="text-slate-500 text-[11px]">
                คะแนนรวมคิดจาก SoD (45%) + ภาระงาน (30%) + ทักษะ (25%)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-300 border-collapse">
                <thead className="bg-slate-100 text-slate-800 font-semibold text-[11px]">
                  <tr>
                    <th className="p-2 border border-slate-300 text-center w-10">ลำดับ</th>
                    <th className="p-2 border border-slate-300 text-left min-w-44">ส่วนงาน</th>
                    <th className="p-2 border border-slate-300 text-center w-24">ประเภท</th>
                    <th className="p-2 border border-slate-300 text-center w-24 bg-emerald-50">SoD (% มี)</th>
                    <th className="p-2 border border-slate-300 text-center w-20">คนรวม</th>
                    <th className="p-2 border border-slate-300 text-center w-24 bg-blue-50">ภาระงาน (% พอ)</th>
                    <th className="p-2 border border-slate-300 text-center w-24 bg-purple-50">ทักษะ (% อบรม)</th>
                    <th className="p-2 border border-slate-300 text-center w-20 bg-amber-50 font-bold">คะแนนรวม</th>
                    <th className="p-2 border border-slate-300 text-center w-24">ระดับความเสี่ยง</th>
                    <th className="p-2 border border-slate-300 text-left min-w-64">ข้อตรวจพบ / จุดอ่อนที่สำคัญ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {unitSummaries.map((s) => (
                    <tr key={s.unitId} className="hover:bg-slate-50 text-[11px]">
                      <td className="p-1.5 border border-slate-300 text-center">{s.unitId}</td>
                      <td className="p-1.5 border border-slate-300 font-medium text-slate-900">
                        <div className="flex items-center justify-between gap-1">
                          <span>{s.unitName}</span>
                          {s.auditorInCharge && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                              {s.auditorInCharge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-1.5 border border-slate-300 text-center text-slate-600">{s.category}</td>
                      <td className="p-1.5 border border-slate-300 text-center font-semibold text-emerald-800 bg-emerald-50/30">
                        {s.hasSubmittedData ? `${s.sodPercent}%` : <span className="text-slate-400 font-normal text-[10px]">ยังไม่ได้ส่งข้อมูล</span>}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-center text-slate-800">
                        {s.hasSubmittedData ? s.totalStaff : '-'}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-center font-semibold text-blue-800 bg-blue-50/30">
                        {s.hasSubmittedData ? `${s.workloadPercent}%` : <span className="text-slate-400 font-normal text-[10px]">ยังไม่ได้ส่งข้อมูล</span>}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-center font-semibold text-purple-800 bg-purple-50/30">
                        {s.hasSubmittedData ? `${s.skillsPercent}%` : <span className="text-slate-400 font-normal text-[10px]">ยังไม่ได้ส่งข้อมูล</span>}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-center font-bold text-amber-900 bg-amber-50">
                        {s.hasSubmittedData ? s.overallScore : '-'}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-center">
                        {s.hasSubmittedData ? (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            s.overallRiskLevel === 'วิกฤต/สูงมาก' ? 'bg-red-100 text-red-900 border border-red-300' :
                            s.overallRiskLevel === 'สูง' ? 'bg-amber-100 text-amber-900' :
                            s.overallRiskLevel === 'ปานกลาง' ? 'bg-yellow-50 text-yellow-800' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {s.overallRiskLevel}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            ⏳ ยังไม่ได้ส่งข้อมูล
                          </span>
                        )}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-slate-700">
                        {s.hasSubmittedData ? (
                          s.criticalDeficiencies.length > 0 ? (
                            <span className="text-red-700">{s.criticalDeficiencies.join('; ')}</span>
                          ) : (
                            <span className="text-emerald-700">เป็นไปตามเกณฑ์ควบคุมภายใน</span>
                          )
                        ) : (
                          <span className="text-slate-400 italic">รอการส่งข้อมูลแบบสำรวจจากส่วนงาน</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------- */}
        {/* VIEW 2: SINGLE UNIT DRILL-DOWN WORKING PAPER                         */}
        {/* -------------------------------------------------------------------- */}
        {reportType === 'single-unit' && (
          <div className="space-y-6">
            {/* Unit Header Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    หน่วยรับตรวจ (Auditee Unit)
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-heading mt-1">
                    {currentFocusedUnit.id}. {currentFocusedUnit.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    ประเภท: {currentFocusedUnit.category} • จังหวัด: {currentFocusedUnit.province}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center px-3 py-1.5 bg-white rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">คะแนนประเมิน</div>
                    <div className="text-xl font-bold text-amber-700">
                      {focusedSummary.hasSubmittedData ? `${focusedSummary.overallScore}/100` : '-'}
                    </div>
                  </div>
                  <div className="text-center px-3 py-1.5 bg-white rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">ระดับความเสี่ยง</div>
                    <div className={`text-xs font-bold mt-1 ${
                      focusedSummary.hasSubmittedData ? 'text-red-700' : 'text-amber-800'
                    }`}>
                      {focusedSummary.hasSubmittedData ? focusedSummary.overallRiskLevel : '⏳ ยังไม่ได้ส่งข้อมูล'}
                    </div>
                  </div>
                </div>
              </div>

              {!focusedSummary.hasSubmittedData && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-2">
                  <span className="text-base">⏳</span>
                  <span>
                    <strong>ส่วนงานนี้ยังไม่ได้ส่งข้อมูลแบบสำรวจ:</strong> อยู่ระหว่างรอการนำเข้าข้อมูลหรือบันทึกคำตอบจากส่วนงาน
                  </span>
                </div>
              )}
            </div>

            {/* 3 Pillars Table for this unit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pillar 1: SoD */}
              <div className="border border-slate-200 rounded-lg p-3 bg-white text-xs">
                <div className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex justify-between">
                  <span>1. การแบ่งแยกหน้าที่ (10 ข้อ)</span>
                  <span className="text-emerald-700 font-bold">{focusedSummary.sodPercent}%</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {SOD_ITEMS.map((item) => {
                    const ans = record.sodData[currentFocusedUnit.id]?.responses[item.id];
                    return (
                      <div key={item.id} className="flex items-center justify-between text-[11px]">
                        <span className="truncate max-w-[190px]" title={item.title}>
                          {item.id}. {item.shortLabel}
                        </span>
                        <span className={`px-1 rounded font-bold ${
                          ans === 'มี' ? 'text-emerald-700 bg-emerald-50' :
                          ans === 'ไม่มี' ? 'text-red-700 bg-red-50' : 'text-slate-400'
                        }`}>
                          {ans || '-'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pillar 2: Workload */}
              <div className="border border-slate-200 rounded-lg p-3 bg-white text-xs">
                <div className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex justify-between">
                  <span>2. ภาระงาน/ความเพียงพอ (5 ด้าน)</span>
                  <span className="text-blue-700 font-bold">{focusedSummary.workloadPercent}%</span>
                </div>
                <div className="mt-2 space-y-2">
                  {WORKLOAD_FUNCTIONS.map((f) => {
                    const fnData = record.workloadData[currentFocusedUnit.id]?.functions[f.id];
                    return (
                      <div key={f.id} className="text-[11px] border-b border-slate-50 pb-1">
                        <div className="flex items-center justify-between font-medium">
                          <span>{f.id}. {f.name} (จน. {fnData?.staffCount || 0} คน)</span>
                          <span className={`px-1 rounded font-bold ${
                            fnData?.adequacy === 'เพียงพอ' ? 'text-emerald-700 bg-emerald-50' :
                            fnData?.adequacy === 'ไม่เพียงพอ' ? 'text-red-700 bg-red-50' : 'text-slate-400'
                          }`}>
                            {fnData?.adequacy || '-'}
                          </span>
                        </div>
                        {fnData?.issues && (
                          <div className="text-[10px] text-red-600 italic mt-0.5 truncate">
                            ปัญหา: {fnData.issues}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pillar 3: Skills */}
              <div className="border border-slate-200 rounded-lg p-3 bg-white text-xs">
                <div className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex justify-between">
                  <span>3. การพัฒนาทักษะ (6 ข้อ)</span>
                  <span className="text-purple-700 font-bold">{focusedSummary.skillsPercent}%</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {SKILLS_ITEMS.map((item) => {
                    const ans = record.skillsData[currentFocusedUnit.id]?.responses[item.id];
                    return (
                      <div key={item.id} className="flex items-center justify-between text-[11px]">
                        <span className="truncate max-w-[190px]" title={item.title}>
                          {item.id}. {item.shortLabel}
                        </span>
                        <span className={`px-1 rounded font-bold ${
                          ans === 'มี' ? 'text-purple-700 bg-purple-50' :
                          ans === 'ไม่มี' ? 'text-slate-500 bg-slate-100' : 'text-slate-400'
                        }`}>
                          {ans || '-'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Findings & Auditor Recommendation for this unit */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 font-heading">
                ผลการตรวจสอบและข้อเสนอแนะรายส่วนงาน (Audit Finding & Recommendations)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong className="text-slate-800">1. สภาพที่ตรวจพบ (Condition):</strong>
                  <p className="text-slate-700 text-[11px] mt-1">
                    {focusedSummary.criticalDeficiencies.length > 0 ? (
                      focusedSummary.criticalDeficiencies.map((d, i) => (
                        <span key={i} className="block text-red-700">• {d}</span>
                      ))
                    ) : (
                      '• การแบ่งแยกหน้าที่และอัตรากำลังมีความสอดคล้องกับการควบคุมภายใน'
                    )}
                  </p>
                </div>
                <div>
                  <strong className="text-slate-800">2. ข้อเสนอแนะของผู้ตรวจสอบภายใน (Auditor Recommendation):</strong>
                  <p className="text-slate-700 text-[11px] mt-1">
                    {focusedSummary.overallRiskLevel === 'วิกฤต/สูงมาก' || focusedSummary.overallRiskLevel === 'สูง'
                      ? '• ขอให้ผู้บริหารส่วนงานออกคำสั่งมอบหมายหน้าที่ฉบับปัจจุบันอย่างเป็นลายลักษณ์อักษร และแยกผู้รับเงินสดออกจากผู้ลงบัญชีโดยเร่งด่วน พร้อมส่งรายงานชี้แจงสำนักงานตรวจสอบภายในภายใน 30 วัน'
                      : '• ขอให้คงมาตรฐานการควบคุมภายในอย่างสม่ำเสมอ และส่งเสริมให้เจ้าหน้าที่เข้าอบรมระบบ MIS และระเบียบจัดซื้อจัดจ้างอย่างต่อเนื่อง'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------- */}
        {/* VIEW 3: SoD DETAILED WORKING PAPER                                  */}
        {/* -------------------------------------------------------------------- */}
        {reportType === 'sod-detail' && (
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-800">
              กระดาษทำการการแบ่งแยกหน้าที่ 10 ข้อ (Segregation of Duties Matrix - 57 Units)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-300 border-collapse">
                <thead className="bg-slate-100 text-slate-800 text-[10px]">
                  <tr>
                    <th className="p-2 border border-slate-300 text-center w-10">ลำดับ</th>
                    <th className="p-2 border border-slate-300 text-left min-w-44">ส่วนงาน</th>
                    {SOD_ITEMS.map((item) => (
                      <th key={item.id} className="p-1 border border-slate-300 text-center min-w-20">
                        {item.id}. {item.shortLabel}
                      </th>
                    ))}
                    <th className="p-1 border border-slate-300 text-center w-14 bg-emerald-50">มี</th>
                    <th className="p-1 border border-slate-300 text-center w-14 bg-red-50">ไม่มี</th>
                    <th className="p-1 border border-slate-300 text-center w-16 bg-amber-50">% มี</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {units.map((u) => {
                    const sod = record.sodData[u.id]?.responses || {};
                    let yes = 0;
                    let no = 0;
                    SOD_ITEMS.forEach(it => {
                      if (sod[it.id] === 'มี') yes++;
                      else if (sod[it.id] === 'ไม่มี') no++;
                    });
                    const pct = (yes + no) > 0 ? Math.round((yes / (yes + no)) * 100) : 0;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-1.5 border border-slate-300 text-center">{u.id}</td>
                        <td className="p-1.5 border border-slate-300 font-medium">
                          <div className="flex items-center justify-between gap-1">
                            <span>{u.name}</span>
                            {yes + no === 0 && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-normal shrink-0">
                                ยังไม่ได้ส่งข้อมูล
                              </span>
                            )}
                          </div>
                        </td>
                        {SOD_ITEMS.map((item) => {
                          const val = sod[item.id];
                          return (
                            <td key={item.id} className={`p-1 border border-slate-300 text-center font-bold ${
                              val === 'มี' ? 'text-emerald-700 bg-emerald-50/20' :
                              val === 'ไม่มี' ? 'text-red-700 bg-red-50/30' : 'text-slate-300'
                            }`}>
                              {val === 'มี' ? '✓' : val === 'ไม่มี' ? '✗' : '-'}
                            </td>
                          );
                        })}
                        <td className="p-1 border border-slate-300 text-center font-bold text-emerald-800 bg-emerald-50/20">
                          {yes + no > 0 ? yes : '-'}
                        </td>
                        <td className="p-1 border border-slate-300 text-center font-bold text-red-800 bg-red-50/20">
                          {yes + no > 0 ? no : '-'}
                        </td>
                        <td className="p-1 border border-slate-300 text-center font-bold bg-amber-50/50">
                          {yes + no > 0 ? (
                            `${pct}%`
                          ) : (
                            <span className="text-[10px] font-normal text-amber-800">
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
        )}

        {/* -------------------------------------------------------------------- */}
        {/* OFFICIAL AUDIT SIGN-OFF BOX (MANDATORY IN WORKING PAPERS)            */}
        {/* -------------------------------------------------------------------- */}
        <div className="mt-8 pt-6 border-t-2 border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            {/* Prepared By */}
            <div className="p-4 border border-slate-300 rounded-lg bg-slate-50/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  ผู้จัดทำกระดาษทำการ (PREPARED BY)
                </span>
                <div className="h-14 flex items-end">
                  <div className="w-full border-b border-dashed border-slate-400"></div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="font-semibold text-slate-900">
                  ( {record.metadata.leadAuditor} )
                </p>
                <p className="text-[11px] text-slate-600">{record.metadata.auditorPosition}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  วันที่: .......... / .......... / {record.metadata.fiscalYear}
                </p>
              </div>
            </div>

            {/* Reviewed By */}
            <div className="p-4 border border-slate-300 rounded-lg bg-slate-50/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  ผู้สอบทานกระดาษทำการ (REVIEWED BY)
                </span>
                <div className="h-14 flex items-end">
                  <div className="w-full border-b border-dashed border-slate-400"></div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="font-semibold text-slate-900">
                  ( {record.metadata.auditSupervisor} )
                </p>
                <p className="text-[11px] text-slate-600">{record.metadata.supervisorPosition}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  วันที่: .......... / .......... / {record.metadata.fiscalYear}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-[10px] text-slate-400">
            เอกสารนี้เป็นกระดาษทำการตรวจสอบภายในชั้นความลับตามมาตรฐานการตรวจสอบภายใน สำนักงานตรวจสอบภายใน มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย
          </div>
        </div>
      </div>
    </div>
  );
};
