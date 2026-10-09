import React, { useState, useEffect, useMemo } from 'react';
import { AuditRecord, CheckOption, FunctionWorkloadData, UnitInfo } from './types/audit';
import { createRealisticSampleAuditRecord, createInitialEmptyAuditRecord, MCU_UNITS } from './data/defaultUnits';
import { createAuditRecordFromUploadedData } from './data/actualUploadedData';
import { exportAuditRecordToExcel } from './utils/excelUtils';
import { Header, TabType } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SegregationOfDutiesView } from './components/SegregationOfDutiesView';
import { WorkloadAdequacyView } from './components/WorkloadAdequacyView';
import { SkillsDevelopmentView } from './components/SkillsDevelopmentView';
import { WorkingPaperView } from './components/WorkingPaperView';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { UnitDetailModal } from './components/UnitDetailModal';
import { CheckCircle, Info } from 'lucide-react';

const STORAGE_KEY = 'mcu_internal_audit_record_v6';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [record, setRecord] = useState<AuditRecord>(() => {
    try {
      localStorage.removeItem('mcu_internal_audit_record_v1');
      localStorage.removeItem('mcu_internal_audit_record_v2');
      localStorage.removeItem('mcu_internal_audit_record_v3');
      localStorage.removeItem('mcu_internal_audit_record_v4');
      localStorage.removeItem('mcu_internal_audit_record_v5');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.units && parsed.sodData && parsed.workloadData && parsed.skillsData) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load local audit record', e);
    }
    // Load actual uploaded data (34 submitted units + 23 pending units)
    return createAuditRecordFromUploadedData();
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'submitted' | 'pending'>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedUnitForModal, setSelectedUnitForModal] = useState<UnitInfo | null>(null);
  const [unitForWorkingPaper, setUnitForWorkingPaper] = useState<UnitInfo | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (e) {
      console.warn('Storage quota exceeded or disabled', e);
    }
  }, [record]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Helper to check if a unit has submitted data
  const checkUnitHasData = (unitId: number) => {
    const sodResp = record.sodData[unitId]?.responses || {};
    const hasSod = Object.values(sodResp).some(v => v !== '');
    const wlFuncs = record.workloadData[unitId]?.functions || {};
    const hasWl = Object.values(wlFuncs).some(f => (typeof f.staffCount === 'number') || f.adequacy !== '' || (f.workloadVolume && f.workloadVolume !== '-'));
    const skResp = record.skillsData[unitId]?.responses || {};
    const hasSk = Object.values(skResp).some(v => v !== '');
    return hasSod || hasWl || hasSk;
  };

  // Counts
  const { submittedCount, pendingCount } = useMemo(() => {
    let sub = 0;
    record.units.forEach(u => {
      if (checkUnitHasData(u.id)) sub++;
    });
    return { submittedCount: sub, pendingCount: record.units.length - sub };
  }, [record]);

  // Filtered units based on search term, category, and submission status
  const filteredUnits = useMemo(() => {
    return record.units.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.province && u.province.toLowerCase().includes(searchTerm.toLowerCase())) ||
        String(u.id) === searchTerm.trim();

      const matchCat =
        selectedCategory === 'ทั้งหมด' || u.category === selectedCategory;

      const hasData = checkUnitHasData(u.id);
      const matchSubmission =
        submissionFilter === 'all' ||
        (submissionFilter === 'submitted' && hasData) ||
        (submissionFilter === 'pending' && !hasData);

      return matchSearch && matchCat && matchSubmission;
    });
  }, [record, searchTerm, selectedCategory, submissionFilter]);

  // Handlers for SoD
  const handleUpdateSodResponse = (unitId: number, itemId: number, value: CheckOption) => {
    setRecord((prev) => {
      const next = { ...prev };
      const unitSod = next.sodData[unitId] || { unitId, responses: {} };
      unitSod.responses = { ...unitSod.responses, [itemId]: value };
      next.sodData = { ...next.sodData, [unitId]: unitSod };
      next.metadata.lastUpdated = new Date().toISOString();
      return next;
    });
  };

  const handleBulkUpdateSodUnit = (unitId: number, value: CheckOption) => {
    setRecord((prev) => {
      const next = { ...prev };
      const unitSod = next.sodData[unitId] || { unitId, responses: {} };
      const newResp = { ...unitSod.responses };
      for (let i = 1; i <= 10; i++) {
        newResp[i] = value;
      }
      unitSod.responses = newResp;
      next.sodData = { ...next.sodData, [unitId]: unitSod };
      return next;
    });
    showToast(`อัปเดตการแบ่งแยกหน้าที่ส่วนงาน #${unitId} เป็น "${value}" ทั้งหมดแล้ว`);
  };

  // Handlers for Workload
  const handleUpdateWorkloadFunction = (
    unitId: number,
    funcId: number,
    field: keyof FunctionWorkloadData,
    value: any
  ) => {
    setRecord((prev) => {
      const next = { ...prev };
      const unitWl = next.workloadData[unitId] || { unitId, functions: {} };
      const currentFn = unitWl.functions[funcId] || {
        staffCount: '',
        workloadVolume: '',
        adequacy: '',
        issues: ''
      };
      unitWl.functions = {
        ...unitWl.functions,
        [funcId]: { ...currentFn, [field]: value }
      };
      next.workloadData = { ...next.workloadData, [unitId]: unitWl };
      next.metadata.lastUpdated = new Date().toISOString();
      return next;
    });
  };

  // Handlers for Skills
  const handleUpdateSkillsResponse = (unitId: number, itemId: number, value: CheckOption) => {
    setRecord((prev) => {
      const next = { ...prev };
      const unitSkills = next.skillsData[unitId] || { unitId, responses: {} };
      unitSkills.responses = { ...unitSkills.responses, [itemId]: value };
      next.skillsData = { ...next.skillsData, [unitId]: unitSkills };
      next.metadata.lastUpdated = new Date().toISOString();
      return next;
    });
  };

  const handleBulkUpdateSkillsUnit = (unitId: number, value: CheckOption) => {
    setRecord((prev) => {
      const next = { ...prev };
      const unitSkills = next.skillsData[unitId] || { unitId, responses: {} };
      const newResp = { ...unitSkills.responses };
      for (let i = 1; i <= 6; i++) {
        newResp[i] = value;
      }
      unitSkills.responses = newResp;
      next.skillsData = { ...next.skillsData, [unitId]: unitSkills };
      return next;
    });
    showToast(`อัปเดตการพัฒนาทักษะส่วนงาน #${unitId} เป็น "${value}" ทั้งหมดแล้ว`);
  };

  // Metadata update
  const handleUpdateMetadata = (updatedMeta: Partial<AuditRecord['metadata']>) => {
    setRecord((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, ...updatedMeta }
    }));
    showToast('บันทึกข้อมูลกำกับกระดาษทำการเรียบร้อยแล้ว');
  };

  // Export all to Excel
  const handleExportAllExcel = () => {
    exportAuditRecordToExcel(
      record,
      `MCU_Internal_Audit_Surveys_${record.metadata.fiscalYear}.xlsx`
    );
    showToast('ดาวน์โหลดไฟล์ Excel ทุกแบบสำรวจและกระดาษทำการสรุปเรียบร้อยแล้ว');
  };

  // Reload Actual Uploaded Survey Data (34 submitted + 23 pending)
  const handleLoadUploadedData = () => {
    const uploaded = createAuditRecordFromUploadedData();
    setRecord(uploaded);
    showToast('โหลดข้อมูลสำรวจจริง 34 ส่วนงาน (และคง 23 ส่วนงานที่ยังไม่ส่ง) เรียบร้อยแล้ว');
  };

  // Reload Realistic Sample Data
  const handleLoadSample = () => {
    const sample = createRealisticSampleAuditRecord();
    setRecord(sample);
    showToast('โหลดชุดข้อมูลตัวอย่าง 57 ส่วนงานเรียบร้อยแล้ว');
  };

  // Reset to empty survey
  const handleResetData = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลคำตอบทั้งหมดให้เป็นตารางเปล่าใช่หรือไม่?')) {
      const empty = createInitialEmptyAuditRecord();
      setRecord(empty);
      showToast('ล้างข้อมูลเรียบร้อยแล้ว พร้อมสำหรับการกรอกหรือนำเข้าไฟล์ใหม่');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header & Tabs */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onExportExcel={handleExportAllExcel}
        onLoadUploadedData={handleLoadUploadedData}
        onLoadSample={handleLoadSample}
        onResetData={handleResetData}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        submissionFilter={submissionFilter}
        onSubmissionFilterChange={setSubmissionFilter}
        submittedCount={submittedCount}
        pendingCount={pendingCount}
        fiscalYear={record.metadata.fiscalYear}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            record={record}
            onSelectUnit={(unit) => setSelectedUnitForModal(unit)}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {currentTab === 'sod' && (
          <SegregationOfDutiesView
            record={record}
            units={filteredUnits}
            onUpdateResponse={handleUpdateSodResponse}
            onBulkUpdateUnit={handleBulkUpdateSodUnit}
            onSelectUnit={(unit) => setSelectedUnitForModal(unit)}
          />
        )}

        {currentTab === 'workload' && (
          <WorkloadAdequacyView
            record={record}
            units={filteredUnits}
            onUpdateFunctionData={handleUpdateWorkloadFunction}
            onSelectUnit={(unit) => setSelectedUnitForModal(unit)}
          />
        )}

        {currentTab === 'skills' && (
          <SkillsDevelopmentView
            record={record}
            units={filteredUnits}
            onUpdateResponse={handleUpdateSkillsResponse}
            onBulkUpdateUnit={handleBulkUpdateSkillsUnit}
            onSelectUnit={(unit) => setSelectedUnitForModal(unit)}
          />
        )}

        {currentTab === 'working-papers' && (
          <WorkingPaperView
            record={record}
            units={filteredUnits}
            onUpdateMetadata={handleUpdateMetadata}
            selectedUnitFromParent={unitForWorkingPaper}
          />
        )}
      </main>

      {/* Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        currentRecord={record}
        onApplyNewRecord={(newRec, msg) => {
          setRecord(newRec);
          showToast(msg);
          setIsUploadOpen(false);
        }}
      />

      {/* Unit Drill-Down Modal */}
      {selectedUnitForModal && (
        <UnitDetailModal
          unit={selectedUnitForModal}
          record={record}
          onClose={() => setSelectedUnitForModal(null)}
          onUpdateSod={handleUpdateSodResponse}
          onUpdateWorkload={handleUpdateWorkloadFunction}
          onUpdateSkills={handleUpdateSkillsResponse}
          onOpenWorkingPaperForUnit={(u) => {
            setUnitForWorkingPaper(u);
            setCurrentTab('working-papers');
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer (Hidden on print) */}
      <footer className="no-print bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            สำนักงานตรวจสอบภายใน มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย • ระบบประมวลผลแบบสำรวจและกระดาษทำการ
          </p>
          <p className="text-[11px] text-slate-400">
            ครอบคลุม 57 ส่วนงาน (12 วิทยาเขต, 27 วิทยาลัยสงฆ์, คณะ, สถาบัน, ส่วนกลาง)
          </p>
        </div>
      </footer>
    </div>
  );
}
