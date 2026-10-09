import React from 'react';
import { 
  Building2, 
  BarChart3, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  FileSpreadsheet, 
  Upload, 
  Download, 
  RefreshCw, 
  Search,
  Sparkles
} from 'lucide-react';
import { McuLogo } from './McuLogo';

export type TabType = 'dashboard' | 'sod' | 'workload' | 'skills' | 'working-papers';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenUpload: () => void;
  onExportExcel: () => void;
  onLoadUploadedData?: () => void;
  onLoadSample: () => void;
  onResetData: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  submissionFilter: 'all' | 'submitted' | 'pending';
  onSubmissionFilterChange: (val: 'all' | 'submitted' | 'pending') => void;
  submittedCount?: number;
  pendingCount?: number;
  fiscalYear?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenUpload,
  onExportExcel,
  onLoadUploadedData,
  onLoadSample,
  onResetData,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  submissionFilter,
  onSubmissionFilterChange,
  submittedCount = 34,
  pendingCount = 23
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      {/* Top Banner with University Identity */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-slate-900 text-white px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0">
              <McuLogo className="w-12 h-12" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-500/25 text-amber-200 text-xs px-2.5 py-0.5 rounded-full font-medium border border-amber-400/30">
                  ระบบสารสนเทศกระดาษทำการตรวจสอบภายใน
                </span>
                <span className="bg-emerald-500/25 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-400/30">
                  ส่งข้อมูลแล้ว {submittedCount} / 57 ส่วนงาน
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white font-heading mt-0.5">
                สำนักงานตรวจสอบภายใน มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย (มจร)
              </h1>
              <p className="text-xs text-amber-100/75">
                การประเมินการแบ่งแยกหน้าที่ • ภาระงานและความเพียงพอ • การพัฒนาทักษะ (57 ส่วนงาน)
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>นำเข้าไฟล์ Excel/CSV</span>
            </button>

            {onLoadUploadedData && (
              <button
                onClick={onLoadUploadedData}
                title="โหลดชุดข้อมูลแบบสำรวจจริง 34 ส่วนงานที่ประมวลผลไว้"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/40 shadow-sm transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>ข้อมูลที่นำเข้า (34 ส่วนงาน)</span>
              </button>
            )}

            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-500/30 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ส่งออก Excel</span>
            </button>

            <button
              onClick={onLoadSample}
              title="เติมข้อมูลตัวอย่าง 57 ส่วนงานเพื่อทดสอบแดชบอร์ด"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">ข้อมูลตัวอย่าง</span>
            </button>

            <button
              onClick={onResetData}
              title="ล้างข้อมูลเป็นค่าว่างเริ่มต้น"
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-red-500/30 text-white/80 transition-all"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Filter Bar */}
      <div className="px-4 lg:px-8 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 py-2">
          {/* Main Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                currentTab === 'dashboard'
                  ? 'bg-amber-900 text-amber-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <span>แดชบอร์ดสรุปผลภาพรวม</span>
            </button>

            <button
              onClick={() => onTabChange('sod')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                currentTab === 'sod'
                  ? 'bg-amber-900 text-amber-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>1. การแบ่งแยกหน้าที่ (10 ข้อ)</span>
            </button>

            <button
              onClick={() => onTabChange('workload')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                currentTab === 'workload'
                  ? 'bg-amber-900 text-amber-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Users className="w-4 h-4 text-blue-500" />
              <span>2. ภาระงานและความเพียงพอ (5 ด้าน)</span>
            </button>

            <button
              onClick={() => onTabChange('skills')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                currentTab === 'skills'
                  ? 'bg-amber-900 text-amber-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-500" />
              <span>3. การพัฒนาทักษะ (6 ข้อ)</span>
            </button>

            <button
              onClick={() => onTabChange('working-papers')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                currentTab === 'working-papers'
                  ? 'bg-amber-900 text-amber-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>กระดาษทำการตรวจสอบภายใน</span>
            </button>
          </nav>

          {/* Search, Status, and Category Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาส่วนงาน/วิทยาเขต..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs w-40 md:w-48 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
              />
            </div>

            {/* Submission Status Filter */}
            <select
              value={submissionFilter}
              onChange={(e) => onSubmissionFilterChange(e.target.value as any)}
              className="py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="all">สถานะทั้งหมด (57)</option>
              <option value="submitted">✓ ส่งข้อมูลแล้ว ({submittedCount})</option>
              <option value="pending">⏳ ยังไม่ได้ส่งข้อมูล ({pendingCount})</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="ทั้งหมด">ประเภทส่วนงาน (ทั้งหมด)</option>
              <option value="วิทยาเขต">วิทยาเขต (12)</option>
              <option value="วิทยาลัยสงฆ์">วิทยาลัยสงฆ์ (27)</option>
              <option value="หน่วยวิทยบริการ">หน่วยวิทยบริการ (4)</option>
              <option value="คณะ/บัณฑิตวิทยาลัย">คณะ/บัณฑิตวิทยาลัย (5)</option>
              <option value="วิทยาลัยเฉพาะทาง">วิทยาลัยเฉพาะทาง (3)</option>
              <option value="หน่วยงานบริการ/กองทุน">หน่วยบริการ/กองทุน (5)</option>
              <option value="ส่วนกลาง">ส่วนกลาง (1)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
