import React, { useState } from 'react';
import { WORKLOAD_FUNCTIONS } from '../data/defaultUnits';
import { AuditRecord, AdequacyOption, UnitInfo, FunctionWorkloadData } from '../types/audit';
import { Users, Download, MessageSquare } from 'lucide-react';
import * as XLSX from 'xlsx';

interface WorkloadAdequacyViewProps {
  record: AuditRecord;
  units: UnitInfo[];
  onUpdateFunctionData: (unitId: number, funcId: number, field: keyof FunctionWorkloadData, value: any) => void;
  onSelectUnit: (unit: UnitInfo) => void;
}

export const WorkloadAdequacyView: React.FC<WorkloadAdequacyViewProps> = ({
  record,
  units,
  onUpdateFunctionData,
  onSelectUnit
}) => {
  const [activeIssueModal, setActiveIssueModal] = useState<{
    unitId: number;
    unitName: string;
    funcId: number;
    funcName: string;
    issueText: string;
  } | null>(null);

  const handleExportSheet = () => {
    const wb = XLSX.utils.book_new();
    const rows: any[][] = [];
    rows.push(['สำรวจภาระงานและความเพียงพอของบุคลากร']);
    rows.push(['สำนักงานตรวจสอบภายใน มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย']);

    const wlh1 = ['ลำดับ', 'ส่วนงาน'];
    WORKLOAD_FUNCTIONS.forEach(f => {
      wlh1.push(`${f.id}.${f.name}`, '', '', '', '');
    });
    wlh1.push('รวม', '', 'ร้อยละที่เพียงพอ');
    rows.push(wlh1);

    const wlh2 = ['', ''];
    WORKLOAD_FUNCTIONS.forEach(() => {
      wlh2.push('จำนวนผู้ปฏิบัติงาน', 'ปริมาณงานโดยประมาณ', 'เพียงพอ', 'ไม่เพียงพอ', 'ปัญหา/ข้อจำกัด');
    });
    wlh2.push('เพียงพอ', 'ไม่เพียงพอ', '');
    rows.push(wlh2);

    units.forEach(u => {
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
      row.push(adCount || '-', inadCount || '-', totalAns > 0 ? `${pct}%` : '-');
      rows.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'ภาระงานและความเพียงพอ');
    XLSX.writeFile(wb, 'MCU_Workload_Adequacy_5Functions.xlsx');
  };

  const functionSummaries = WORKLOAD_FUNCTIONS.map(f => {
    let ad = 0;
    let inad = 0;
    let staff = 0;
    units.forEach(u => {
      const item = record.workloadData[u.id]?.functions[f.id];
      if (item) {
        if (typeof item.staffCount === 'number') staff += item.staffCount;
        if (item.adequacy === 'เพียงพอ') ad++;
        else if (item.adequacy === 'ไม่เพียงพอ') inad++;
      }
    });
    const total = ad + inad;
    const pct = total > 0 ? Math.round((ad / total) * 100) : 0;
    return { f, ad, inad, staff, pct };
  });

  return (
    <div className="space-y-6">
      {/* Title & Banner - Modern Green */}
      <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-teal-100 text-teal-800">
                <Users className="w-5 h-5 text-teal-700" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  แบบสำรวจภาระงานและความเพียงพอของบุคลากร (5 ด้านภารกิจ)
                </h2>
                <p className="text-xs text-slate-500">
                  สำนักงานตรวจสอบภายใน มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย • การเงิน, บัญชี, พัสดุ, จัดซื้อจัดจ้าง, งานอื่นที่เกี่ยวข้อง
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportSheet}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดตารางนี้ (.xlsx)</span>
          </button>
        </div>

        {/* 5 Functions KPI Summary */}
        <div className="mt-4 pt-4 border-t border-emerald-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {functionSummaries.map(({ f, ad, inad, staff, pct }) => (
            <div
              key={f.id}
              className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-100/80 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-1 mb-1">
                <span className="font-semibold text-slate-900 text-xs">{f.id}. {f.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    pct >= 80 ? 'bg-emerald-200 text-emerald-900' :
                    pct >= 50 ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                  }`}
                >
                  เพียงพอ {pct}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">{f.description}</p>
              <div className="pt-2 border-t border-emerald-200/50 flex items-center justify-between text-[11px]">
                <span className="text-slate-600">กำลังคน: <strong className="text-emerald-900">{staff}</strong> คน</span>
                <span className="text-rose-700 font-medium">{inad > 0 ? `ขาด ${inad} แห่ง` : 'ครบถ้วน'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="bg-white rounded-xl border border-emerald-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/30">
          <div className="text-xs text-slate-600">
            แสดงข้อมูลทั้งหมด <strong className="text-emerald-950 font-bold">{units.length}</strong> ส่วนงาน (แก้ไขจำนวนคน ปริมาณงาน และคลิกเพียงพอ/ไม่เพียงพอ ได้ทันที)
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> เพียงพอ
            </span>
            <span className="inline-flex items-center gap-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> ไม่เพียงพอ
            </span>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[70vh] relative">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 z-20 shadow-xs">
              <tr>
                <th rowSpan={2} className="p-2.5 text-center border-b border-r border-slate-200 w-12 bg-slate-100">
                  ลำดับ
                </th>
                <th rowSpan={2} className="p-2.5 border-b border-r border-slate-200 min-w-44 bg-slate-100 sticky left-0 z-30 shadow-xs">
                  ส่วนงาน (57 แห่ง)
                </th>
                {WORKLOAD_FUNCTIONS.map((f) => (
                  <th
                    key={f.id}
                    colSpan={5}
                    className="p-2 text-center border-b border-r border-slate-200 min-w-64 text-xs font-semibold bg-slate-100"
                  >
                    {f.id}. {f.name}
                  </th>
                ))}
                <th colSpan={2} className="p-2 text-center border-b border-r border-slate-200 w-24 bg-emerald-50 font-semibold text-emerald-900">
                  รวม
                </th>
                <th rowSpan={2} className="p-2 text-center border-b border-slate-200 w-20 bg-emerald-100/70 font-bold text-emerald-950">
                  ร้อยละที่เพียงพอ
                </th>
              </tr>
              <tr className="bg-slate-50 text-[10px]">
                {WORKLOAD_FUNCTIONS.map((f) => (
                  <React.Fragment key={f.id}>
                    <th className="p-1 text-center border-b border-r border-slate-200 w-14 font-medium text-slate-600">
                      จน.คน
                    </th>
                    <th className="p-1 text-center border-b border-r border-slate-200 min-w-28 font-medium text-slate-600">
                      ปริมาณงาน
                    </th>
                    <th className="p-1 text-center border-b border-r border-slate-200 w-12 text-emerald-800 bg-emerald-50/60 font-semibold">
                      เพียงพอ
                    </th>
                    <th className="p-1 text-center border-b border-r border-slate-200 w-14 text-rose-800 bg-rose-50/60 font-semibold">
                      ไม่เพียงพอ
                    </th>
                    <th className="p-1 text-center border-b border-r border-slate-200 min-w-24 font-medium text-slate-600">
                      ปัญหา/ข้อจำกัด
                    </th>
                  </React.Fragment>
                ))}
                <th className="p-1 text-center border-b border-r border-slate-200 text-emerald-800 bg-emerald-50">เพียงพอ</th>
                <th className="p-1 text-center border-b border-r border-slate-200 text-rose-800 bg-emerald-50">ไม่เพียงพอ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {units.map((unit) => {
                const wlData = record.workloadData[unit.id]?.functions || {};
                let adCount = 0;
                let inadCount = 0;

                WORKLOAD_FUNCTIONS.forEach(f => {
                  const it = wlData[f.id];
                  if (it?.adequacy === 'เพียงพอ') adCount++;
                  else if (it?.adequacy === 'ไม่เพียงพอ') inadCount++;
                });

                const totalAns = adCount + inadCount;
                const pct = totalAns > 0 ? Math.round((adCount / totalAns) * 100) : 0;

                return (
                  <tr key={unit.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="p-2 text-center text-slate-500 border-r border-slate-200">
                      {unit.id}
                    </td>
                    <td className="p-2 border-r border-slate-200 sticky left-0 bg-white z-10 shadow-xs font-medium text-slate-900">
                      <button
                        type="button"
                        onClick={() => onSelectUnit(unit)}
                        className="hover:text-emerald-800 text-left truncate hover:underline flex items-center gap-1.5"
                      >
                        <span>{unit.name}</span>
                        {totalAns === 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-normal shrink-0">
                            ยังไม่ได้ส่งข้อมูล
                          </span>
                        )}
                      </button>
                    </td>

                    {WORKLOAD_FUNCTIONS.map((f) => {
                      const item = wlData[f.id] || { staffCount: '', workloadVolume: '', adequacy: '', issues: '' };
                      return (
                        <React.Fragment key={f.id}>
                          <td className="p-1 text-center border-r border-slate-200">
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={item.staffCount ?? ''}
                              onChange={(e) => {
                                const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                                onUpdateFunctionData(unit.id, f.id, 'staffCount', isNaN(val as number) ? '' : val);
                              }}
                              className="w-10 text-center py-0.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                            />
                          </td>

                          <td className="p-1 border-r border-slate-200">
                            <input
                              type="text"
                              placeholder="ปริมาณงาน..."
                              value={item.workloadVolume || ''}
                              onChange={(e) => onUpdateFunctionData(unit.id, f.id, 'workloadVolume', e.target.value)}
                              className="w-full px-1.5 py-0.5 border border-slate-200 rounded text-[11px] focus:ring-1 focus:ring-emerald-500 focus:outline-hidden truncate"
                            />
                          </td>

                          <td
                            onClick={() => onUpdateFunctionData(unit.id, f.id, 'adequacy', item.adequacy === 'เพียงพอ' ? '' : 'เพียงพอ')}
                            className={`p-1 text-center border-r border-slate-200 cursor-pointer select-none transition-colors ${
                              item.adequacy === 'เพียงพอ' ? 'bg-emerald-100/90 font-bold text-emerald-950' : 'hover:bg-slate-100'
                            }`}
                          >
                            {item.adequacy === 'เพียงพอ' ? '✓' : ''}
                          </td>

                          <td
                            onClick={() => onUpdateFunctionData(unit.id, f.id, 'adequacy', item.adequacy === 'ไม่เพียงพอ' ? '' : 'ไม่เพียงพอ')}
                            className={`p-1 text-center border-r border-slate-200 cursor-pointer select-none transition-colors ${
                              item.adequacy === 'ไม่เพียงพอ' ? 'bg-rose-100/90 font-bold text-rose-950' : 'hover:bg-slate-100'
                            }`}
                          >
                            {item.adequacy === 'ไม่เพียงพอ' ? '✗' : ''}
                          </td>

                          <td className="p-1 border-r border-slate-200 text-[11px]">
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                placeholder="ระบุปัญหา..."
                                value={item.issues || ''}
                                onChange={(e) => onUpdateFunctionData(unit.id, f.id, 'issues', e.target.value)}
                                className={`w-full px-1.5 py-0.5 border rounded text-[11px] truncate focus:ring-1 focus:ring-emerald-500 focus:outline-hidden ${
                                  item.issues ? 'bg-rose-50/50 border-rose-200 text-rose-900' : 'border-slate-200'
                                }`}
                              />
                              <button
                                type="button"
                                title="ขยายกล่องข้อความปัญหา/ข้อจำกัด"
                                onClick={() => setActiveIssueModal({
                                  unitId: unit.id,
                                  unitName: unit.name,
                                  funcId: f.id,
                                  funcName: f.name,
                                  issueText: item.issues || ''
                                })}
                                className="text-slate-400 hover:text-emerald-700 p-0.5 rounded"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </React.Fragment>
                      );
                    })}

                    <td className="p-2 text-center font-bold text-emerald-800 bg-emerald-50/40 border-r border-slate-200">
                      {adCount || '-'}
                    </td>
                    <td className="p-2 text-center font-bold text-rose-800 bg-emerald-50/40 border-r border-slate-200">
                      {inadCount || '-'}
                    </td>
                    <td className="p-2 text-center font-bold bg-emerald-50/60">
                      {totalAns === 0 ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-normal bg-amber-50 text-amber-800 border border-amber-200">
                          ยังไม่ได้ส่งข้อมูล
                        </span>
                      ) : (
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                            pct >= 80 ? 'text-emerald-900 bg-emerald-200' :
                            pct >= 50 ? 'text-amber-900 bg-amber-100' : 'text-rose-900 bg-rose-100'
                          }`}
                        >
                          {pct}%
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

      {/* Modal for detailed issue input */}
      {activeIssueModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              บันทึกปัญหา / ข้อจำกัดภาระงาน
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              ส่วนงาน: <strong>{activeIssueModal.unitName}</strong> • {activeIssueModal.funcName}
            </p>
            <textarea
              rows={4}
              value={activeIssueModal.issueText}
              onChange={(e) => setActiveIssueModal({ ...activeIssueModal, issueText: e.target.value })}
              placeholder="ระบุรายละเอียดปัญหา เช่น เจ้าหน้าที่ลาออก อัตรากำลังขาดแคลน ปริมาณเอกสารเพิ่มสูงขึ้น..."
              className="mt-3 w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-hidden"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveIssueModal(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateFunctionData(activeIssueModal.unitId, activeIssueModal.funcId, 'issues', activeIssueModal.issueText);
                  setActiveIssueModal(null);
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
