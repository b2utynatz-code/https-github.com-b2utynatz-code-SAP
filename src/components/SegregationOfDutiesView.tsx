import React from 'react';
import { SOD_ITEMS } from '../data/defaultUnits';
import { AuditRecord, CheckOption, UnitInfo } from '../types/audit';
import { ShieldCheck, Download, Check, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface SegregationOfDutiesViewProps {
  record: AuditRecord;
  units: UnitInfo[];
  onUpdateResponse: (unitId: number, itemId: number, value: CheckOption) => void;
  onBulkUpdateUnit: (unitId: number, value: CheckOption) => void;
  onSelectUnit: (unit: UnitInfo) => void;
}

export const SegregationOfDutiesView: React.FC<SegregationOfDutiesViewProps> = ({
  record,
  units,
  onUpdateResponse,
  onBulkUpdateUnit,
  onSelectUnit
}) => {
  const handleExportSheet = () => {
    const wb = XLSX.utils.book_new();
    const rows: any[][] = [];
    rows.push(['สำรวจการแบ่งแยกหน้าที่']);
    rows.push(['สำนักงานตรวจสอบภายใน มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย']);

    const h1 = ['ลำดับ', 'ส่วนงาน'];
    SOD_ITEMS.forEach(item => {
      h1.push(`${item.id}.${item.title}`, '');
    });
    h1.push('รวม', '', 'ร้อยละที่มี');
    rows.push(h1);

    const h2 = ['', ''];
    SOD_ITEMS.forEach(() => {
      h2.push('มี', 'ไม่มี');
    });
    h2.push('มี', 'ไม่มี', '');
    rows.push(h2);

    units.forEach(u => {
      const row: any[] = [u.id, u.name];
      const sod = record.sodData[u.id]?.responses || {};
      let yesCount = 0;
      let noCount = 0;

      SOD_ITEMS.forEach(item => {
        const val = sod[item.id];
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

      const total = yesCount + noCount;
      const pct = total > 0 ? Math.round((yesCount / total) * 100) : 0;
      row.push(yesCount || '-', noCount || '-', total > 0 ? `${pct}%` : '-');
      rows.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'สำรวจการแบ่งแยกหน้าที่');
    XLSX.writeFile(wb, 'MCU_SoD_Survey_10Items.xlsx');
  };

  const itemSummary = SOD_ITEMS.map(item => {
    let yes = 0;
    let no = 0;
    units.forEach(u => {
      const val = record.sodData[u.id]?.responses[item.id];
      if (val === 'มี') yes++;
      else if (val === 'ไม่มี') no++;
    });
    const total = yes + no;
    const pct = total > 0 ? Math.round((yes / total) * 100) : 0;
    return { item, yes, no, pct };
  });

  return (
    <div className="space-y-6">
      {/* Title & Banner - Modern Green */}
      <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  แบบสำรวจการแบ่งแยกหน้าที่ (Segregation of Duties - SoD)
                </h2>
                <p className="text-xs text-slate-500">
                  สำนักงานตรวจสอบภายใน มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย • ทั้งหมด 10 ข้อตรวจประเมิน
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSheet}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดตารางนี้ (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* 10 Items Guide Banner */}
        <div className="mt-4 pt-4 border-t border-emerald-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {itemSummary.map(({ item, yes, pct }) => (
            <div
              key={item.id}
              className="p-2.5 rounded-lg bg-emerald-50/40 border border-emerald-100/80 text-xs flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-1 mb-1">
                <span className="font-semibold text-slate-800 line-clamp-2">
                  {item.id}. {item.shortLabel}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    pct >= 80 ? 'bg-emerald-200 text-emerald-900' :
                    pct >= 60 ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                  }`}
                >
                  {pct}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>มี {yes}/{units.length} แห่ง</span>
                <span className="text-emerald-700 font-medium">
                  {item.riskIfMissing === 'สูงมาก' ? '🔴 เสี่ยงสูงมาก' : '🟡 เสี่ยงปานกลาง'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spreadsheet Matrix */}
      <div className="bg-white rounded-xl border border-emerald-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/30">
          <div className="text-xs text-slate-600">
            แสดงข้อมูลทั้งหมด <strong className="text-emerald-950 font-bold">{units.length}</strong> ส่วนงาน (คลิกเลือกช่อง &quot;มี&quot; หรือ &quot;ไม่มี&quot; ในตารางได้ทันที)
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> มีการแบ่งแยก
            </span>
            <span className="inline-flex items-center gap-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> ไม่มีการแบ่งแยก
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
                <th rowSpan={2} className="p-2.5 border-b border-r border-slate-200 min-w-48 bg-slate-100 sticky left-0 z-30 shadow-xs">
                  ส่วนงาน (57 แห่ง)
                </th>
                {SOD_ITEMS.map((item) => (
                  <th
                    key={item.id}
                    colSpan={2}
                    className="p-2 text-center border-b border-r border-slate-200 min-w-28 text-[11px] font-semibold"
                    title={item.title}
                  >
                    <div className="truncate max-w-36 mx-auto">{item.id}. {item.shortLabel}</div>
                  </th>
                ))}
                <th colSpan={2} className="p-2 text-center border-b border-r border-slate-200 w-24 bg-emerald-50 font-semibold text-emerald-900">
                  รวม
                </th>
                <th rowSpan={2} className="p-2.5 text-center border-b border-slate-200 w-20 bg-emerald-100/70 font-bold text-emerald-950">
                  ร้อยละที่มี
                </th>
              </tr>
              <tr className="bg-slate-50 text-[11px]">
                {SOD_ITEMS.map((item) => (
                  <React.Fragment key={item.id}>
                    <th className="p-1 text-center border-b border-r border-slate-200 w-12 text-emerald-800 bg-emerald-50/50 font-semibold">
                      มี
                    </th>
                    <th className="p-1 text-center border-b border-r border-slate-200 w-12 text-rose-800 bg-rose-50/50 font-semibold">
                      ไม่มี
                    </th>
                  </React.Fragment>
                ))}
                <th className="p-1 text-center border-b border-r border-slate-200 text-emerald-800 bg-emerald-50">มี</th>
                <th className="p-1 text-center border-b border-r border-slate-200 text-rose-800 bg-emerald-50">ไม่มี</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {units.map((unit) => {
                const sod = record.sodData[unit.id]?.responses || {};
                let yesCount = 0;
                let noCount = 0;
                SOD_ITEMS.forEach(it => {
                  if (sod[it.id] === 'มี') yesCount++;
                  else if (sod[it.id] === 'ไม่มี') noCount++;
                });
                const totalAns = yesCount + noCount;
                const pct = totalAns > 0 ? Math.round((yesCount / totalAns) * 100) : 0;

                return (
                  <tr key={unit.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="p-2 text-center text-slate-500 border-r border-slate-200">
                      {unit.id}
                    </td>
                    <td className="p-2 border-r border-slate-200 sticky left-0 bg-white z-10 shadow-xs font-medium text-slate-900">
                      <div className="flex items-center justify-between gap-1">
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
                        <button
                          type="button"
                          onClick={() => onBulkUpdateUnit(unit.id, 'มี')}
                          title="เลือก 'มี' ทุกข้อ"
                          className="text-[9px] px-1 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded font-medium shrink-0"
                        >
                          มีหมด
                        </button>
                      </div>
                    </td>

                    {SOD_ITEMS.map((item) => {
                      const val = sod[item.id] || '';
                      return (
                        <React.Fragment key={item.id}>
                          <td
                            onClick={() => onUpdateResponse(unit.id, item.id, val === 'มี' ? '' : 'มี')}
                            className={`p-1.5 text-center border-r border-slate-200 cursor-pointer select-none transition-colors ${
                              val === 'มี' ? 'bg-emerald-100/80 font-bold text-emerald-950' : 'hover:bg-slate-100/70'
                            }`}
                          >
                            {val === 'มี' ? '✓' : ''}
                          </td>
                          <td
                            onClick={() => onUpdateResponse(unit.id, item.id, val === 'ไม่มี' ? '' : 'ไม่มี')}
                            className={`p-1.5 text-center border-r border-slate-200 cursor-pointer select-none transition-colors ${
                              val === 'ไม่มี' ? 'bg-rose-100/80 font-bold text-rose-950' : 'hover:bg-slate-100/70'
                            }`}
                          >
                            {val === 'ไม่มี' ? '✗' : ''}
                          </td>
                        </React.Fragment>
                      );
                    })}

                    <td className="p-2 text-center font-bold text-emerald-800 bg-emerald-50/40 border-r border-slate-200">
                      {yesCount || '-'}
                    </td>
                    <td className="p-2 text-center font-bold text-rose-800 bg-emerald-50/40 border-r border-slate-200">
                      {noCount || '-'}
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
                            pct >= 60 ? 'text-amber-900 bg-amber-100' : 'text-rose-900 bg-rose-100'
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
    </div>
  );
};
