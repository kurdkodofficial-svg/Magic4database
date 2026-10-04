import React, { useState } from 'react';
import { 
  Table2, 
  Plus, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  BarChart3, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Edit3, 
  Trash2, 
  Eye, 
  SlidersHorizontal,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  FileCode,
  FolderGit2,
  Check,
  History,
  UserCheck
} from 'lucide-react';
import { DatabaseTable, DatabaseRecord, FieldDefinition, ApprovalStatus, AuditLogEntry } from '../types/database';
import { Language, translations } from '../i18n/translations';
import { GanttChartView } from './GanttChartView';
import { PivotTableView } from './PivotTableView';
import { ApprovalWorkflowView } from './ApprovalWorkflowView';
import { ApprovalWorkflowModal } from './ApprovalWorkflowModal';
import { AddColumnModal } from './AddColumnModal';
import { AuditTrailView } from './AuditTrailView';
import { GitHubBackupModal } from './GitHubBackupModal';
import { exportTableToCsv, exportTableToPdf, exportTableToJson, exportAllTablesToJson } from '../utils/exportUtils';
import { 
  loadAuditLogs, 
  saveAuditLogs, 
  createAuditEntry, 
  availableOperators, 
  EnterpriseOperator 
} from '../utils/auditLogger';

interface DatabaseStudioProps {
  currentLang: Language;
  tables: DatabaseTable[];
  activeTableId: string;
  onSelectTable: (tableId: string) => void;
  onUpdateTableRecords: (tableId: string, records: DatabaseRecord[]) => void;
  onAddTableColumn: (tableId: string, field: FieldDefinition) => void;
  onOpenAiAgent: () => void;
  onOpenIpShield: () => void;
  initialView?: 'sheet' | 'gantt' | 'pivot' | 'approvals' | 'audit';
}

export const DatabaseStudio: React.FC<DatabaseStudioProps> = ({
  currentLang,
  tables,
  activeTableId,
  onSelectTable,
  onUpdateTableRecords,
  onAddTableColumn,
  onOpenAiAgent,
  onOpenIpShield,
  initialView = 'sheet',
}) => {
  const t = translations[currentLang];
  const [activeView, setActiveView] = useState<'sheet' | 'gantt' | 'pivot' | 'approvals' | 'audit'>(initialView);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<DatabaseRecord | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Enterprise Audit Logging & Active Operator State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadAuditLogs());
  const [activeOperator, setActiveOperator] = useState<EnterpriseOperator>(availableOperators[0]);

  // Active table
  const currentTable = tables.find(tbl => tbl.id === activeTableId) || tables[0];

  // Filter records
  const filteredRecords = currentTable.records.filter((rec) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(rec).some(val => 
      String(val).toLowerCase().includes(query)
    );
  });

  // Audit log helper
  const recordAuditEvent = (entryData: Parameters<typeof createAuditEntry>[0]) => {
    const entry = createAuditEntry(entryData);
    setAuditLogs((prev) => {
      const updated = [entry, ...prev];
      saveAuditLogs(updated);
      return updated;
    });
  };

  // Cell edit
  const handleCellChange = (recordId: string, fieldId: string, value: any) => {
    const targetRec = currentTable.records.find(r => r.id === recordId);
    const prevVal = targetRec ? targetRec[fieldId] : undefined;

    // Record audit event if genuinely changed
    if (targetRec && prevVal !== value) {
      const fieldDef = currentTable.fields.find(f => f.id === fieldId);
      const fieldName = fieldDef 
        ? (currentLang === 'ku' ? fieldDef.nameKu : currentLang === 'ar' ? fieldDef.nameAr : fieldDef.name) 
        : fieldId;
      
      recordAuditEvent({
        action: 'RECORD_UPDATED',
        table: currentTable,
        operator: activeOperator,
        recordNumber: targetRec.recordNumber,
        fieldName,
        previousValue: prevVal ?? 'Empty',
        newValue: value,
        details: `Modified "${fieldName}" from "${prevVal ?? ''}" to "${value}" in record #${targetRec.recordNumber}`,
        detailsKu: `خانەی "${fieldName}" لە "${prevVal ?? 'بەتاڵ'}"ەوە گۆڕدرا بۆ "${value}" لە تۆماری #${targetRec.recordNumber}`,
        detailsAr: `تم تعديل حقل "${fieldName}" من "${prevVal ?? 'فارغ'}" إلى "${value}" في السجل #${targetRec.recordNumber}`,
      });
    }

    const updated = currentTable.records.map((r) => {
      if (r.id !== recordId) return r;
      const newRec = { ...r, [fieldId]: value, updatedAt: new Date().toISOString().split('T')[0] };

      // Re-evaluate automatic formulas if any
      if (currentTable.id === 'tbl-erp') {
        const sub = Number(newRec.subtotal) || 0;
        const tax = Number(newRec.taxRate) || 0;
        newRec.totalAmount = Math.round(sub * (1 + tax / 100));
      } else if (currentTable.id === 'tbl-crm') {
        const deal = Number(newRec.dealValue) || 0;
        const prob = Number(newRec.probability) || 0;
        newRec.expectedRevenue = Math.round(deal * (prob / 100));
      } else if (currentTable.id === 'tbl-bom') {
        const units = Number(newRec.plannedUnits) || 0;
        const cost = Number(newRec.unitCost) || 0;
        newRec.totalBatchCost = Math.round(units * cost);
      }

      return newRec;
    });

    onUpdateTableRecords(currentTable.id, updated);
  };

  // Add new row
  const handleAddNewRow = () => {
    const newRecordId = `rec_${Date.now()}`;
    const newRecordNum = `${currentTable.id.slice(4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    const newRecord: DatabaseRecord = {
      id: newRecordId,
      recordNumber: newRecordNum,
      createdAt: today,
      updatedAt: today,
      approvalStatus: 'draft',
      subtotal: 1000,
      taxRate: 5,
      totalAmount: 1050,
      paymentMethod: 'کاش (Cash)',
      paymentStatus: 'چاوەڕوانکراو (Pending)',
      dealValue: 15000,
      probability: 50,
      expectedRevenue: 7500,
      plannedUnits: 100,
      unitCost: 20,
      totalBatchCost: 2000,
      progress: 10,
      status: 'لە جێبەجێکردندایە (In Progress)',
    };

    recordAuditEvent({
      action: 'RECORD_CREATED',
      table: currentTable,
      operator: activeOperator,
      recordNumber: newRecordNum,
      details: `Created new draft record #${newRecordNum} in ${currentTable.name}`,
      detailsKu: `تۆماری نوێی #${newRecordNum} وەک ڕەشنووس لە خشتەی ${currentTable.nameKu} دروستکرا`,
      detailsAr: `تم إنشاء سجل جديد مسودة #${newRecordNum} في جدول ${currentTable.nameAr}`,
    });

    onUpdateTableRecords(currentTable.id, [newRecord, ...currentTable.records]);
  };

  // Delete row
  const handleDeleteRow = (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const recToDelete = currentTable.records.find(r => r.id === recordId);
    const recNum = recToDelete?.recordNumber || recordId;

    recordAuditEvent({
      action: 'RECORD_DELETED',
      table: currentTable,
      operator: activeOperator,
      recordNumber: recNum,
      details: `Deleted record #${recNum} permanently from ${currentTable.name}`,
      detailsKu: `تۆماری #${recNum} بە تەواوی لە خشتەی ${currentTable.nameKu} سڕایەوە`,
      detailsAr: `تم حذف السجل #${recNum} نهائياً من جدول ${currentTable.nameAr}`,
    });

    const updated = currentTable.records.filter(r => r.id !== recordId);
    onUpdateTableRecords(currentTable.id, updated);
  };

  // Approval update
  const handleUpdateApproval = (recordId: string, status: ApprovalStatus, approverName?: string) => {
    const rec = currentTable.records.find(r => r.id === recordId);
    const recNum = rec?.recordNumber || recordId;
    const oldStatus = rec?.approvalStatus || 'draft';
    const finalApprover = approverName || activeOperator.name;

    recordAuditEvent({
      action: 'APPROVAL_STATUS_CHANGED',
      table: currentTable,
      operator: activeOperator,
      recordNumber: recNum,
      fieldName: 'approvalStatus',
      previousValue: oldStatus,
      newValue: status,
      details: `Approval decision for #${recNum}: transitioned from "${oldStatus}" to "${status}" by ${finalApprover}`,
      detailsKu: `بڕیاری پەسەندکردنی #${recNum}: لە "${oldStatus}" گۆڕدرا بۆ "${status}" لەلایەن ${finalApprover}`,
      detailsAr: `قرار الموافقة للسجل #${recNum}: تحول من "${oldStatus}" إلى "${status}" بواسطة ${finalApprover}`,
    });

    const updated = currentTable.records.map((r) => {
      if (r.id !== recordId) return r;
      return {
        ...r,
        approvalStatus: status,
        approvedBy: finalApprover,
        approvalDate: status === 'approved' ? new Date().toISOString().split('T')[0] : r.approvalDate,
        updatedAt: new Date().toISOString().split('T')[0],
      };
    });
    onUpdateTableRecords(currentTable.id, updated);
  };

  // Export Handlers with Audit Trail
  const handleExportCsv = (onlyFiltered: boolean = false) => {
    const recordsToExport = onlyFiltered ? filteredRecords : currentTable.records;
    exportTableToCsv(currentTable, recordsToExport);
    setIsExportMenuOpen(false);

    recordAuditEvent({
      action: 'DATA_EXPORTED',
      table: currentTable,
      operator: activeOperator,
      details: `Exported ${recordsToExport.length} records as CSV ${onlyFiltered ? '(filtered subset)' : '(complete dataset)'}`,
      detailsKu: `${recordsToExport.length} تۆمار وەک CSV هەناردەکرا ${onlyFiltered ? '(داتای فلتەرکراو)' : '(تەواوی خشتە)'}`,
      detailsAr: `تم تصدير ${recordsToExport.length} سجل كملف CSV ${onlyFiltered ? '(بيانات مفلترة)' : '(الجدول كاملاً)'}`,
    });

    setExportSuccessMessage(
      currentLang === 'ku'
        ? `فایلی CSV بە سەرکەوتوویی دابەزێندرا (${recordsToExport.length} تۆمار)`
        : currentLang === 'ar'
        ? `تم تصدير ملف CSV بنجاح (${recordsToExport.length} سجل)`
        : `CSV file exported successfully (${recordsToExport.length} records)`
    );
    setTimeout(() => setExportSuccessMessage(null), 3500);
  };

  const handleExportPdf = (onlyFiltered: boolean = false) => {
    const recordsToExport = onlyFiltered ? filteredRecords : currentTable.records;
    exportTableToPdf(currentTable, recordsToExport, currentLang);
    setIsExportMenuOpen(false);

    recordAuditEvent({
      action: 'DATA_EXPORTED',
      table: currentTable,
      operator: activeOperator,
      details: `Generated and exported formal PDF report (${recordsToExport.length} records)`,
      detailsKu: `ڕاپۆرتی فەرمی PDF بۆ ${recordsToExport.length} تۆمار بە سەرکەوتوویی دروستکرا و دابەزێندرا`,
      detailsAr: `تم إنشاء وتصدير تقرير PDF رسمي لـ ${recordsToExport.length} سجل بنجاح`,
    });

    setExportSuccessMessage(
      currentLang === 'ku'
        ? `بەڵگەنامەی PDF بە سەرکەوتوویی دروستکرا و دابەزێندرا (${recordsToExport.length} تۆمار)`
        : currentLang === 'ar'
        ? `تم إنشاء وتحميل تقرير PDF بنجاح (${recordsToExport.length} سجل)`
        : `PDF report generated and downloaded successfully (${recordsToExport.length} records)`
    );
    setTimeout(() => setExportSuccessMessage(null), 3500);
  };

  const handleExportJson = (onlyFiltered: boolean = false) => {
    const recordsToExport = onlyFiltered ? filteredRecords : currentTable.records;
    exportTableToJson(currentTable, recordsToExport);
    setIsExportMenuOpen(false);

    recordAuditEvent({
      action: 'DATA_EXPORTED',
      table: currentTable,
      operator: activeOperator,
      details: `Exported ${recordsToExport.length} records as JSON schema and data payload ${onlyFiltered ? '(filtered subset)' : '(complete dataset)'}`,
      detailsKu: `${recordsToExport.length} تۆمار وەک فایلی JSON هەناردەکرا ${onlyFiltered ? '(داتای فلتەرکراو)' : '(تەواوی خشتە)'}`,
      detailsAr: `تم تصدير ${recordsToExport.length} سجل كملف JSON ${onlyFiltered ? '(بيانات مفلترة)' : '(الجدول كاملاً)'}`,
    });

    setExportSuccessMessage(
      currentLang === 'ku'
        ? `فایلی JSON بە سەرکەوتوویی دابەزێندرا (${recordsToExport.length} تۆمار)`
        : currentLang === 'ar'
        ? `تم تصدير ملف JSON بنجاح (${recordsToExport.length} سجل)`
        : `JSON file exported successfully (${recordsToExport.length} records)`
    );
    setTimeout(() => setExportSuccessMessage(null), 3500);
  };

  const handleExportFullBackup = () => {
    exportAllTablesToJson(tables);
    setIsExportMenuOpen(false);

    const totalRecords = tables.reduce((acc, t) => acc + t.records.length, 0);
    recordAuditEvent({
      action: 'DATA_EXPORTED',
      table: currentTable,
      operator: activeOperator,
      details: `Generated full workspace database backup (${tables.length} tables, ${totalRecords} records)`,
      detailsKu: `پاڵپشتی گشتی هەموو داتابەیسەکە بە سەرکەوتوویی دابەزێندرا (${tables.length} خشتە و ${totalRecords} تۆمار)`,
      detailsAr: `تم تصدير نسخة احتياطية كاملة لكافة الجداول (${tables.length} جداول و ${totalRecords} سجل)`,
    });

    setExportSuccessMessage(
      currentLang === 'ku'
        ? `پاڵپشتی گشتی هەموو داتابەیسەکە بە سەرکەوتوویی دابەزێندرا (${tables.length} خشتە)`
        : currentLang === 'ar'
        ? `تم تحميل النسخة الاحتياطية الكاملة لقواعد البيانات بنجاح (${tables.length} جداول)`
        : `Full workspace backup exported successfully (${tables.length} tables)`
    );
    setTimeout(() => setExportSuccessMessage(null), 3500);
  };

  // Add column with audit log
  const handleAddColumnWithAudit = (field: FieldDefinition) => {
    onAddTableColumn(currentTable.id, field);
    recordAuditEvent({
      action: 'COLUMN_ADDED',
      table: currentTable,
      operator: activeOperator,
      fieldName: field.name,
      details: `Added new column "${field.name}" (${field.type}) to ${currentTable.name}`,
      detailsKu: `خانەی نوێی "${field.nameKu || field.name}" (${field.type}) بۆ خشتەی ${currentTable.nameKu} زیادکرا`,
      detailsAr: `تمت إضافة عمود جديد "${field.nameAr || field.name}" (${field.type}) إلى جدول ${currentTable.nameAr}`,
    });
  };

  // Table selector with audit log
  const handleSelectTableWithAudit = (tableId: string) => {
    onSelectTable(tableId);
    const targetTbl = tables.find(t => t.id === tableId);
    if (targetTbl && targetTbl.id !== currentTable.id) {
      recordAuditEvent({
        action: 'TABLE_SWITCHED',
        table: targetTbl,
        operator: activeOperator,
        details: `Switched active table to ${targetTbl.name}`,
        detailsKu: `گۆڕینی خشتەی چالاک بۆ ${targetTbl.nameKu}`,
        detailsAr: `تم الانتقال إلى جدول ${targetTbl.nameAr}`,
      });
    }
  };

  return (
    <div id="studio-section" className="py-12 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Studio Top Navbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {t.studioTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {t.studioSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Enterprise Operator Switcher */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <div className="flex flex-col text-right rtl:text-right ltr:text-left">
                <span className="text-[10px] text-slate-500 font-medium">
                  {currentLang === 'ku' ? 'ئەکتەری چالاک:' : currentLang === 'ar' ? 'المستخدم الفعال:' : 'Audit Actor:'}
                </span>
                <select
                  value={activeOperator.name}
                  onChange={(e) => {
                    const found = availableOperators.find(op => op.name === e.target.value);
                    if (found) setActiveOperator(found);
                  }}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
                >
                  {availableOperators.map((op) => (
                    <option key={op.name} value={op.name} className="bg-slate-900 text-white">
                      {op.name} ({op.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={onOpenAiAgent}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-purple-300 bg-purple-950/40 border border-purple-500/40 hover:bg-purple-900/40 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{t.aiAssistantBtn}</span>
            </button>

            <button
              onClick={onOpenIpShield}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-400 bg-slate-950 border border-emerald-500/30 hover:bg-emerald-950/30 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>IP Shield</span>
            </button>
          </div>
        </div>

        {/* Database Table Tabs Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-850">
          {tables.map((tbl) => {
            const isActive = tbl.id === currentTable.id;
            const title = currentLang === 'ku' ? tbl.nameKu : currentLang === 'ar' ? tbl.nameAr : tbl.name;

            return (
              <button
                key={tbl.id}
                onClick={() => handleSelectTableWithAudit(tbl.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Table2 className="w-4 h-4" />
                <span>{title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-indigo-800 text-indigo-200' : 'bg-slate-800 text-slate-400'}`}>
                  {tbl.records.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls Toolbar: Views, Search, Add Row, Add Field, Export */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
          
          {/* View Mode Switcher */}
          <div className="flex flex-wrap rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold gap-0.5">
            <button
              onClick={() => setActiveView('sheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeView === 'sheet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>{t.viewSheet}</span>
            </button>

            <button
              onClick={() => setActiveView('gantt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeView === 'gantt' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.viewGantt}</span>
            </button>

            <button
              onClick={() => setActiveView('pivot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeView === 'pivot' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.viewPivot}</span>
            </button>

            <button
              onClick={() => setActiveView('approvals')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeView === 'approvals' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.viewApprovals}</span>
            </button>

            <button
              onClick={() => setActiveView('audit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeView === 'audit' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title={t.viewAuditLog}
            >
              <History className="w-3.5 h-3.5" />
              <span>{t.viewAuditLog}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeView === 'audit' ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {auditLogs.length}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute right-3 rtl:right-3 ltr:left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-3 pr-8 rtl:pr-8 ltr:pl-8 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAddNewRow}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addRow}</span>
            </button>

            <button
              onClick={() => setIsAddColumnOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t.addField}</span>
            </button>

            {/* Direct 1-Click CSV Download Button */}
            <button
              onClick={() => handleExportCsv(filteredRecords.length !== currentTable.records.length && searchQuery.trim() !== '')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 hover:border-emerald-400 shadow-sm transition-all cursor-pointer group"
              title={currentLang === 'ku' ? `دابەزاندنی خێرای ${filteredRecords.length} تۆماری چالاک بە فایلی CSV` : `Direct CSV Download (${filteredRecords.length} active records)`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>CSV</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-mono">
                {filteredRecords.length}
              </span>
            </button>

            {/* Direct 1-Click JSON Download Button */}
            <button
              onClick={() => handleExportJson(filteredRecords.length !== currentTable.records.length && searchQuery.trim() !== '')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 hover:border-amber-400 shadow-sm transition-all cursor-pointer group"
              title={currentLang === 'ku' ? `دابەزاندنی خێرای ${filteredRecords.length} تۆماری چالاک بە فایلی JSON` : `Direct JSON Download (${filteredRecords.length} active records)`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>JSON</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 font-mono">
                {filteredRecords.length}
              </span>
            </button>

            {/* Save to GitHub (سۆرس لە گیتهەب بپارێزن) */}
            <button
              onClick={() => setIsGitHubModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-200 bg-indigo-950/70 hover:bg-indigo-900/90 border border-indigo-500/40 hover:border-indigo-400 shadow-sm transition-all cursor-pointer group"
              title={t.githubBackupDesc}
            >
              <FolderGit2 className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>{t.saveToGithub}</span>
            </button>

            {/* More Exports Dropdown (PDF, Workspace Backup, Search subset) */}
            <div className="relative">
              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer shadow-sm"
                title="More export options (PDF, Master Backup)"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">{t.exportData}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExportMenuOpen && (
                <div 
                  className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-2.5 py-1.5 border-b border-slate-800 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                    <span>{t.exportData}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {filteredRecords.length !== currentTable.records.length ? `${filteredRecords.length} Filtered` : `${currentTable.records.length} Total`}
                    </span>
                  </div>

                  <div className="py-1 space-y-1">
                    {/* CSV Full */}
                    <button
                      onClick={() => handleExportCsv(false)}
                      className="w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold flex items-center justify-between">
                          <span>{t.exportCsv}</span>
                          <span className="text-[10px] font-mono text-emerald-400">.CSV</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {currentLang === 'ku' ? `دابەزاندنی هەموو ${currentTable.records.length} تۆمارەکە` : `Download all ${currentTable.records.length} rows`}
                        </div>
                      </div>
                    </button>

                    {/* JSON Full */}
                    <button
                      onClick={() => handleExportJson(false)}
                      className="w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20">
                        <FileCode className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold flex items-center justify-between">
                          <span>{t.exportJson}</span>
                          <span className="text-[10px] font-mono text-amber-400">.JSON</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {currentLang === 'ku' ? 'هەناردەی تەواوی تۆمارەکان و مۆدێلی خشتە' : 'Full records & schema JSON payload'}
                        </div>
                      </div>
                    </button>

                    {/* PDF Full */}
                    <button
                      onClick={() => handleExportPdf(false)}
                      className="w-full text-right rtl:text-right ltr:text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 group-hover:bg-rose-500/20">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold flex items-center justify-between">
                          <span>{t.exportPdf}</span>
                          <span className="text-[10px] font-mono text-rose-400">.PDF</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {currentLang === 'ku' ? 'ڕاپۆرتی بەڵگەنامەی فەرمی داتابەیس' : 'Clean formatted printable report'}
                        </div>
                      </div>
                    </button>

                    {/* Workspace & GitHub Actions Divider */}
                    <div className="pt-1.5 pb-0.5 border-t border-slate-800/80">
                      <div className="px-2.5 py-1 text-[10px] font-semibold text-indigo-400">
                        {currentLang === 'ku' ? 'پاڵپشتی و هاوئاهەنگی سۆرس:' : 'Workspace & GitHub Sync:'}
                      </div>

                      {/* Full Workspace Backup */}
                      <button
                        onClick={handleExportFullBackup}
                        className="w-full text-right rtl:text-right ltr:text-left px-3 py-1.5 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20">
                          <FileCode className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-xs text-slate-200">
                            {t.exportFullBackup}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {currentLang === 'ku' ? `هەر ٤ خشتەکە لە یەک فایلی JSON` : `All tables in 1 master JSON file`}
                          </div>
                        </div>
                      </button>

                      {/* Save to GitHub */}
                      <button
                        onClick={() => {
                          setIsExportMenuOpen(false);
                          setIsGitHubModalOpen(true);
                        }}
                        className="w-full text-right rtl:text-right ltr:text-left px-3 py-1.5 rounded-xl text-xs text-slate-200 hover:bg-indigo-950/60 hover:text-indigo-200 border border-indigo-500/20 flex items-center gap-2.5 transition-colors cursor-pointer group mt-1"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-600/30">
                          <FolderGit2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-xs text-indigo-300 flex items-center justify-between">
                            <span>{t.saveToGithub}</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300">Git</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {t.githubBackupDesc}
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Filtered Records Export option if filtered */}
                    {searchQuery.trim() && filteredRecords.length !== currentTable.records.length && (
                      <div className="pt-1.5 border-t border-slate-800/80">
                        <div className="px-2.5 py-1 text-[10px] font-semibold text-indigo-400">
                          {currentLang === 'ku' ? 'تەنها تۆمارە فلتەرکراوەکان:' : 'Filtered search results only:'}
                        </div>
                        <div className="grid grid-cols-3 gap-1 pt-0.5">
                          <button
                            onClick={() => handleExportCsv(true)}
                            className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 font-medium text-center transition-colors cursor-pointer"
                          >
                            CSV ({filteredRecords.length})
                          </button>
                          <button
                            onClick={() => handleExportJson(true)}
                            className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-amber-300 font-medium text-center transition-colors cursor-pointer"
                          >
                            JSON ({filteredRecords.length})
                          </button>
                          <button
                            onClick={() => handleExportPdf(true)}
                            className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-rose-300 font-medium text-center transition-colors cursor-pointer"
                          >
                            PDF ({filteredRecords.length})
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Export Success Feedback Notification */}
        {exportSuccessMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{exportSuccessMessage}</span>
            </div>
            <button
              onClick={() => setExportSuccessMessage(null)}
              className="text-emerald-400 hover:text-white text-xs cursor-pointer px-1.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* View Content Display */}
        {activeView === 'sheet' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
            {/* Table Quick Header with Direct Export Actions */}
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  <Table2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {currentLang === 'ku' ? currentTable.nameKu : currentLang === 'ar' ? currentTable.nameAr : currentTable.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {filteredRecords.length} {t.recordsCount}
                    </span>
                    {searchQuery.trim() && (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {currentLang === 'ku' ? 'فلتەرکراو بەپێی گەڕان' : 'Filtered'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    {currentLang === 'ku'
                      ? 'تۆمارە چالاکەکان دەستبەجێ بە CSV یان JSON دابەزێنە یاخود پاشەکەوتیان بکە لە GitHub'
                      : 'Download active records instantly as CSV or JSON, or commit source to GitHub'}
                  </p>
                </div>
              </div>

              {/* Direct 1-Click Export Actions for Active Records */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExportCsv(filteredRecords.length !== currentTable.records.length && searchQuery.trim() !== '')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  title={currentLang === 'ku' ? `دابەزاندنی ${filteredRecords.length} تۆماری چالاک بە CSV` : `Download ${filteredRecords.length} active records as CSV`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.exportCsv}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExportJson(filteredRecords.length !== currentTable.records.length && searchQuery.trim() !== '')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  title={currentLang === 'ku' ? `دابەزاندنی ${filteredRecords.length} تۆماری چالاک بە JSON` : `Download ${filteredRecords.length} active records as JSON`}
                >
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.exportJson}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsGitHubModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all cursor-pointer"
                  title={t.githubBackupDesc}
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">{t.saveToGithub}</span>
                </button>
              </div>
            </div>

            {/* Sample Template & No Fake Customer Notice */}
            <div className="px-4 py-2.5 bg-indigo-950/50 border-b border-indigo-900/40 flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0"></span>
                <span className="font-semibold text-white">
                  {currentLang === 'ku' 
                    ? 'ئەم پڕۆژانە تەنها وەک نموونەی پێکهاتە دانراون — هیچ ناوێکی کڕیار نەنوسراوە تا بەکارهێنەر خۆی ناوی ڕاستەقینە بنووسێت.' 
                    : currentLang === 'ar'
                    ? 'هذه المشاريع نماذج هيكلية فقط — تم ترك أسماء العملاء فارغة حتى تقوم بكتابة عملائك الفعليين.'
                    : 'These projects are structural templates — customer names are kept blank until you input your real clients.'}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/40">
                {currentLang === 'ku' ? 'خانەی کڕیار بەتاڵە بۆ تۆ' : 'Ready for your clients'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                
                {/* Table Header */}
                <thead>
                  <tr className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800 select-none">
                    <th className="p-3 w-12 text-center text-slate-500">#</th>
                    <th className="p-3 w-28 font-mono">کۆدی تۆمار</th>
                    {currentTable.fields.map((f) => (
                      <th key={f.id} className="p-3 min-w-[130px] border-r border-slate-800/60">
                        <div className="flex items-center justify-between">
                          <span>{currentLang === 'ku' ? f.nameKu : f.name}</span>
                          {f.type === 'formula' && (
                            <span className="text-[10px] text-indigo-400 font-mono" title={f.formula}>
                              fx
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="p-3 w-32 text-center">دۆخی ڕەزامەندی</th>
                    <th className="p-3 w-20 text-center">کردار</th>
                  </tr>
                </thead>

                {/* Table Body with inline editing */}
                <tbody className="divide-y divide-slate-800/80 font-medium text-slate-200">
                  {filteredRecords.map((rec, rowIdx) => (
                    <tr
                      key={rec.id}
                      onClick={() => {
                        setSelectedRecord(rec);
                        setIsApprovalModalOpen(true);
                      }}
                      className="hover:bg-indigo-950/20 transition-colors group cursor-pointer"
                    >
                      <td className="p-3 text-center text-slate-500 font-mono">
                        {rowIdx + 1}
                      </td>

                      <td className="p-3 font-mono font-bold text-indigo-400">
                        #{rec.recordNumber}
                      </td>

                      {currentTable.fields.map((f) => {
                        const cellVal = rec[f.id];

                        return (
                          <td 
                            key={f.id} 
                            onClick={(e) => e.stopPropagation()} 
                            className="p-2 border-r border-slate-800/40"
                          >
                            {f.type === 'formula' ? (
                              <div className="px-2 py-1 font-mono font-bold text-emerald-400">
                                ${cellVal !== undefined ? Number(cellVal).toLocaleString() : 0}
                              </div>
                            ) : f.type === 'currency' ? (
                              <input
                                type="number"
                                value={cellVal !== undefined ? cellVal : ''}
                                onChange={(e) => handleCellChange(rec.id, f.id, Number(e.target.value))}
                                className="w-full px-2 py-1 rounded bg-transparent hover:bg-slate-950 focus:bg-slate-950 border border-transparent focus:border-indigo-500 font-mono text-emerald-300 text-xs"
                              />
                            ) : f.type === 'dropdown' ? (
                              <select
                                value={cellVal || ''}
                                onChange={(e) => handleCellChange(rec.id, f.id, e.target.value)}
                                className="w-full px-2 py-1 rounded bg-transparent hover:bg-slate-950 focus:bg-slate-950 border border-transparent focus:border-indigo-500 text-xs cursor-pointer"
                              >
                                {f.options?.map((opt) => (
                                  <option key={opt} value={opt} className="bg-slate-900 text-white">
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                                value={cellVal !== undefined ? cellVal : ''}
                                placeholder={
                                  f.id === 'customer' || f.id === 'leadName' 
                                    ? (currentLang === 'ku' ? '+ ناوی کڕیار بنووسە...' : currentLang === 'ar' ? '+ أدخل اسم العميل...' : '+ Enter client...')
                                    : (f.id === 'salesRep' || f.id === 'owner' || f.id === 'assignee' || f.id === 'factoryLead'
                                      ? (currentLang === 'ku' ? 'بەرپرس دیاریبکە...' : 'Assign...')
                                      : '')
                                }
                                onChange={(e) => handleCellChange(rec.id, f.id, e.target.value)}
                                className="w-full px-2 py-1 rounded bg-transparent hover:bg-slate-950 focus:bg-slate-950 border border-transparent focus:border-indigo-500 text-xs text-white placeholder-slate-500/80 placeholder:italic font-normal"
                              />
                            )}
                          </td>
                        );
                      })}

                      {/* Approval Status Badge */}
                      <td className="p-3 text-center">
                        {rec.approvalStatus === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            پەسەندکراو
                          </span>
                        )}
                        {rec.approvalStatus === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            چاوەڕوانی
                          </span>
                        )}
                        {rec.approvalStatus === 'draft' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-700/30 text-slate-300">
                            ڕەشنووس
                          </span>
                        )}
                        {rec.approvalStatus === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400">
                            ڕەتکراوە
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedRecord(rec);
                              setIsApprovalModalOpen(true);
                            }}
                            title="بینینی تەواوی فۆرم"
                            className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery(rec.recordNumber);
                              setActiveView('audit');
                            }}
                            title={currentLang === 'ku' ? 'مێژووی دەستکاری تۆمار (Audit Trail)' : currentLang === 'ar' ? 'سجل تدقيق السجل' : 'Inspect Record Audit History'}
                            className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteRow(rec.id, e)}
                            title="سڕینەوە"
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom table info bar with quick export links */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <div>
                  {currentLang === 'ku' ? (
                    <>نیشاندانی <strong className="text-white">{filteredRecords.length}</strong> لە کۆی <strong className="text-white">{currentTable.records.length}</strong> تۆمار</>
                  ) : currentLang === 'ar' ? (
                    <>عرض <strong className="text-white">{filteredRecords.length}</strong> من إجمالي <strong className="text-white">{currentTable.records.length}</strong> سجل</>
                  ) : (
                    <>Showing <strong className="text-white">{filteredRecords.length}</strong> of <strong className="text-white">{currentTable.records.length}</strong> records</>
                  )}
                </div>

                <div className="flex items-center gap-2 border-r rtl:border-r ltr:border-l border-slate-800 px-3">
                  <span className="text-[11px] text-slate-500 font-semibold">{t.exportData}:</span>
                  <button
                    onClick={() => handleExportCsv(searchQuery.trim().length > 0)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                  <span className="text-slate-700">•</span>
                  <button
                    onClick={() => handleExportPdf(searchQuery.trim().length > 0)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                {currentLang === 'ku' ? 'دەستکاریکردنی ڕاستەوخۆ (Live Auto-Save) چالاکە' : 'Live Auto-Save Active'}
              </div>
            </div>
          </div>
        )}

        {activeView === 'gantt' && (
          <GanttChartView currentLang={currentLang} table={currentTable} />
        )}

        {activeView === 'pivot' && (
          <PivotTableView currentLang={currentLang} table={currentTable} />
        )}

        {activeView === 'approvals' && (
          <ApprovalWorkflowView
            currentLang={currentLang}
            table={currentTable}
            onSelectRecord={(rec) => {
              setSelectedRecord(rec);
              setIsApprovalModalOpen(true);
            }}
            onUpdateApproval={handleUpdateApproval}
          />
        )}

        {activeView === 'audit' && (
          <AuditTrailView
            currentLang={currentLang}
            currentTable={currentTable}
            tables={tables}
            auditLogs={auditLogs}
            onRefresh={() => setAuditLogs(loadAuditLogs())}
            activeOperator={activeOperator}
          />
        )}

        {/* Approval Modal */}
        <ApprovalWorkflowModal
          currentLang={currentLang}
          table={currentTable}
          record={selectedRecord}
          isOpen={isApprovalModalOpen}
          onClose={() => setIsApprovalModalOpen(false)}
          onUpdateApproval={handleUpdateApproval}
        />

        {/* Add Column Modal */}
        <AddColumnModal
          currentLang={currentLang}
          isOpen={isAddColumnOpen}
          onClose={() => setIsAddColumnOpen(false)}
          onAddField={handleAddColumnWithAudit}
        />

      </div>
    </div>
  );
};
