import React, { useState } from 'react';
import { UnitInfo, AuditRecord, CheckOption, FunctionWorkloadData } from '../types/audit';
import { calculateUnitSummary } from '../utils/auditCalculations';
import { SOD_ITEMS, WORKLOAD_FUNCTIONS, SKILLS_ITEMS } from '../data/defaultUnits';
import { 
  X, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  AlertTriangle, 
  FileText 
} from 'lucide-react';
import { McuLogo } from './McuLogo';

interface UnitDetailModalProps {
  unit: UnitInfo | null;
  record: AuditRecord;
  onClose: () => void;
  onUpdateSod: (unitId: number, itemId: number, val: CheckOption) => void;
  onUpdateWorkload: (unitId: number, funcId: number, field: keyof FunctionWorkloadData, val: any) => void;
  onUpdateSkills: (unitId: number, itemId: number, val: CheckOption) => void;
  onOpenWorkingPaperForUnit: (unit: UnitInfo) => void;
}

export const UnitDetailModal: React.FC<UnitDetailModalProps> = ({
  unit,
  record,
  onClose,
  onUpdateSod,
  onUpdateWorkload,
  onUpdateSkills,
  onOpenWorkingPaperForUnit
}) => {
  if (!unit) return null;

  const [activeTab, setActiveTab] = useState<'sod' | 'workload' | 'skills'>('sod');
  const summary = calculateUnitSummary(unit, record);

  const sodData = record.sodData[unit.id]?.responses || {};
  const wlData = record.workloadData[unit.id]?.functions || {};
  const skData = record.skillsData[unit.id]?.responses || {};

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 border border-emerald-100 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div className="w-12 h-14 rounded-xl bg-emerald-50 border border-emerald-200 p-1 flex items-center justify-center shrink-0">
              <McuLogo className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                  ลำดับที่ {unit.id}
                </span>
                <span className="text-xs text-slate-500">{unit.category}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-950 font-heading mt-0.5">
                {unit.name}
              </h3>
              <p className="text-xs text-slate-500">
                สังกัดมหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย {unit.province ? `• จ.${unit.province}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mr-8">
            <div className="text-right">
              <div className="text-[10px] text-slate-400">สถานะการส่งข้อมูล</div>
              <div className="text-sm font-bold text-slate-800">
                {summary.hasSubmittedData ? (
                  <span className="text-emerald-700">✓ ส่งข้อมูลแล้ว</span>
                ) : (
                  <span className="text-amber-700">⏳ ยังไม่ได้ส่งข้อมูล</span>
                )}
              </div>
              {summary.auditorInCharge && (
                <div className="text-[10px] text-slate-500">ผู้รับผิดชอบ: {summary.auditorInCharge}</div>
              )}
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400">คะแนนควบคุมภายใน</div>
              <div className="text-2xl font-black text-emerald-800">
                {summary.hasSubmittedData ? `${summary.overallScore}/100` : '-'}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400">ระดับความเสี่ยง</div>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                summary.overallRiskLevel === 'ยังไม่ได้ส่งข้อมูล' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                summary.overallRiskLevel === 'วิกฤต/สูงมาก' ? 'bg-rose-100 text-rose-900' :
                summary.overallRiskLevel === 'สูง' ? 'bg-amber-100 text-amber-900' :
                summary.overallRiskLevel === 'ปานกลาง' ? 'bg-yellow-100 text-yellow-900' : 'bg-emerald-100 text-emerald-900'
              }`}>
                {summary.overallRiskLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Status / Deficiencies alert */}
        {!summary.hasSubmittedData ? (
          <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>ส่วนงานนี้ยังไม่ได้ส่งข้อมูลแบบสำรวจ:</strong>
              <p className="text-[11px] text-amber-900 mt-0.5">
                ท่านสามารถกรอกข้อมูลโดยตรงในแท็บด้านล่างนี้ได้ทันที หรืออัปโหลดไฟล์ Excel/CSV เพื่ออัปเดตระบบ
              </p>
            </div>
          </div>
        ) : summary.criticalDeficiencies.length > 0 ? (
          <div className="mt-3 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong>ข้อตรวจพบความเสี่ยงสำคัญ:</strong>
              <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-[11px] text-emerald-900">
                {summary.criticalDeficiencies.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mt-4 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('sod')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sod'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1. การแบ่งแยกหน้าที่ ({summary.sodPercent}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('workload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'workload'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. ภาระงาน ({summary.workloadPercent}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'skills'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>3. การพัฒนาทักษะ ({summary.skillsPercent}%)</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
          {activeTab === 'sod' && (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 mb-2">
                คลิกเลือก &quot;มี&quot; หรือ &quot;ไม่มี&quot; เพื่อปรับปรุงข้อมูลการแบ่งแยกหน้าที่ทั้ง 10 ข้อ:
              </p>
              {SOD_ITEMS.map((item) => {
                const val = sodData[item.id] || '';
                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <span className="font-semibold text-slate-900">{item.id}. {item.title}</span>
                      <div className="text-[10px] text-slate-500">หมวด: {item.category} • ความเสี่ยงหากขาด: {item.riskIfMissing}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateSod(unit.id, item.id, val === 'มี' ? '' : 'มี')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                          val === 'มี'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50'
                        }`}
                      >
                        ✓ มี
                      </button>
                      <button
                        onClick={() => onUpdateSod(unit.id, item.id, val === 'ไม่มี' ? '' : 'ไม่มี')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                          val === 'ไม่มี'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-rose-50'
                        }`}
                      >
                        ✗ ไม่มี
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'workload' && (
            <div className="space-y-3">
              {WORKLOAD_FUNCTIONS.map((f) => {
                const fnData = wlData[f.id] || { staffCount: '', workloadVolume: '', adequacy: '', issues: '' };
                return (
                  <div key={f.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{f.id}. {f.name}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateWorkload(unit.id, f.id, 'adequacy', fnData.adequacy === 'เพียงพอ' ? '' : 'เพียงพอ')}
                          className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                            fnData.adequacy === 'เพียงพอ' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-700'
                          }`}
                        >
                          เพียงพอ
                        </button>
                        <button
                          onClick={() => onUpdateWorkload(unit.id, f.id, 'adequacy', fnData.adequacy === 'ไม่เพียงพอ' ? '' : 'ไม่เพียงพอ')}
                          className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                            fnData.adequacy === 'ไม่เพียงพอ' ? 'bg-rose-600 text-white' : 'bg-white border text-slate-700'
                          }`}
                        >
                          ไม่เพียงพอ
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-0.5">จำนวนผู้ปฏิบัติงาน (คน)</label>
                        <input
                          type="number"
                          value={fnData.staffCount ?? ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                            onUpdateWorkload(unit.id, f.id, 'staffCount', isNaN(val as number) ? '' : val);
                          }}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-0.5">ปริมาณงานโดยประมาณ</label>
                        <input
                          type="text"
                          value={fnData.workloadVolume || ''}
                          onChange={(e) => onUpdateWorkload(unit.id, f.id, 'workloadVolume', e.target.value)}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                          placeholder="เช่น 100 ฎีกา/เดือน"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">ปัญหา / ข้อจำกัด</label>
                      <input
                        type="text"
                        value={fnData.issues || ''}
                        onChange={(e) => onUpdateWorkload(unit.id, f.id, 'issues', e.target.value)}
                        className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                        placeholder="ระบุปัญหาหรือข้อจำกัด..."
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 mb-2">
                ข้อมูลการอบรมและพัฒนาทักษะ (6 ข้อ):
              </p>
              {SKILLS_ITEMS.map((item) => {
                const val = skData[item.id] || '';
                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{item.id}. {item.title}</span>
                      <div className="text-[10px] text-slate-500">ประเภท: {item.category}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateSkills(unit.id, item.id, val === 'มี' ? '' : 'มี')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                          val === 'มี'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50'
                        }`}
                      >
                        ✓ มี
                      </button>
                      <button
                        onClick={() => onUpdateSkills(unit.id, item.id, val === 'ไม่มี' ? '' : 'ไม่มี')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                          val === 'ไม่มี'
                            ? 'bg-slate-700 text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        ✗ ไม่มี
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onOpenWorkingPaperForUnit(unit);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ออกกระดาษทำการของ {unit.name}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
