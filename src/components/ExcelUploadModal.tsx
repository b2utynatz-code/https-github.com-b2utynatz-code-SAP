import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { AuditRecord } from '../types/audit';
import { parseUploadedAuditFile, exportAuditRecordToExcel } from '../utils/excelUtils';
import { createInitialEmptyAuditRecord } from '../data/defaultUnits';
import { McuLogo } from './McuLogo';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRecord: AuditRecord;
  onApplyNewRecord: (record: AuditRecord, msg: string) => void;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  currentRecord,
  onApplyNewRecord
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success?: boolean;
    message?: string;
    sections?: string[];
    count?: number;
    warnings?: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setUploadStatus(null);
    try {
      const { newRecord, result } = await parseUploadedAuditFile(file, currentRecord);
      if (result.success) {
        onApplyNewRecord(newRecord, result.message);
        setUploadStatus({
          success: true,
          message: result.message,
          count: result.unitsUpdatedCount,
          warnings: result.warnings
        });
      } else {
        setUploadStatus({
          success: false,
          message: result.message,
          warnings: result.warnings
        });
      }
    } catch (err: any) {
      setUploadStatus({
        success: false,
        message: 'เกิดข้อผิดพลาดในการอ่านไฟล์: ' + (err?.message || 'ไฟล์อาจไม่ถูกต้องหรือเสียหาย')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const emptyRecord = createInitialEmptyAuditRecord();
    exportAuditRecordToExcel(emptyRecord, 'MCU_Audit_Survey_Template_57Units.xlsx');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-emerald-100 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-12 rounded-xl bg-emerald-50 border border-emerald-200 p-1 flex items-center justify-center shrink-0">
            <McuLogo className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              นำเข้าไฟล์แบบสำรวจ Excel / CSV
            </h3>
            <p className="text-xs text-slate-500">
              สำนักงานตรวจสอบภายใน มจร • รองรับไฟล์ทั้ง 3 แบบสำรวจ
            </p>
          </div>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-600 bg-emerald-50/60'
              : 'border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
              <p className="text-xs font-semibold text-emerald-900">กำลังประมวลผลและจับคู่ 57 ส่วนงาน...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100/60 flex items-center justify-center text-emerald-700 mb-3">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                ลากไฟล์มาวางที่นี่ หรือ <span className="text-emerald-700 underline font-bold">คลิกเพื่อเลือกไฟล์</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ตรวจจับและเชื่อมโยงข้อมูลทั้ง 57 ส่วนงาน มจร โดยอัตโนมัติ
              </p>
            </div>
          )}
        </div>

        {/* Status Feedback */}
        {uploadStatus && (
          <div
            className={`mt-4 p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
              uploadStatus.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium'
                : 'bg-rose-50 border border-rose-200 text-rose-950 font-medium'
            }`}
          >
            {uploadStatus.success ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{uploadStatus.message}</p>
              {uploadStatus.warnings && uploadStatus.warnings.length > 0 && (
                <ul className="mt-1 list-disc list-inside text-[11px] text-amber-800">
                  {uploadStatus.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Template Download Section */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 text-center sm:text-left">
            ต้องการแม่แบบมาตรฐานที่มีรายชื่อ 57 ส่วนงาน มจร ครบถ้วน?
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-emerald-850 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดแม่แบบ Excel (57 ส่วนงาน)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
