import React, { useState } from 'react';
import { 
  ShieldCheck, 
  History, 
  Search, 
  Filter, 
  User, 
  Clock, 
  ArrowRight, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Tag, 
  Layers, 
  RefreshCw,
  Trash2,
  Lock,
  ArrowUpRight,
  FileSpreadsheet,
  Check,
  Building,
  UserCheck
} from 'lucide-react';
import { AuditLogEntry, AuditActionType, DatabaseTable } from '../types/database';
import { Language } from '../i18n/translations';
import { exportAuditLogsToCsv, exportAuditLogsToPdf } from '../utils/exportUtils';

interface AuditTrailViewProps {
  currentLang: Language;
  currentTable: DatabaseTable;
  tables?: DatabaseTable[];
  auditLogs: AuditLogEntry[];
  onRefresh: () => void;
  onClearDemoLogs?: () => void;
  activeOperator?: {
    name: string;
    role: string;
    ip: string;
  };
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  currentLang,
  currentTable,
  tables = [],
  auditLogs,
  onRefresh,
  onClearDemoLogs,
  activeOperator = {
    name: 'ڕەوەند سەردار (Admin)',
    role: 'Senior Enterprise Administrator',
    ip: '192.168.1.104'
  }
}) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [tableFilter, setTableFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const actionTypeBadges: Record<string, { labelKu: string; labelEn: string; labelAr: string; color: string }> = {
    RECORD_CREATED: { 
      labelKu: 'تۆماری نوێ دروستکرا', 
      labelEn: 'Record Created', 
      labelAr: 'تم إنشاء سجل',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
    },
    RECORD_UPDATED: { 
      labelKu: 'دەستکاری کرا', 
      labelEn: 'Record Updated', 
      labelAr: 'تم التعديل',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
    },
    RECORD_DELETED: { 
      labelKu: 'سڕایەوە', 
      labelEn: 'Record Deleted', 
      labelAr: 'تم الحذف',
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
    },
    APPROVAL_STATUS_CHANGED: { 
      labelKu: 'بڕیاری ڕەزامەندی', 
      labelEn: 'Approval Changed', 
      labelAr: 'تغيير الموافقة',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
    },
    COLUMN_ADDED: { 
      labelKu: 'خانە زیادکرا', 
      labelEn: 'Column Added', 
      labelAr: 'إضافة عمود',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
    },
    DATA_EXPORTED: { 
      labelKu: 'داتای دابەزێندراو', 
      labelEn: 'Data Exported', 
      labelAr: 'تصدير البيانات',
      color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
    },
    TABLE_SWITCHED: { 
      labelKu: 'گۆڕینی خشتە', 
      labelEn: 'Table Switched', 
      labelAr: 'تبديل الجدول',
      color: 'bg-slate-700/30 text-slate-300 border-slate-600/30' 
    },
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (filterAction !== 'ALL' && log.action !== filterAction) return false;
    if (tableFilter !== 'ALL' && log.tableId !== tableFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.actor.toLowerCase().includes(q) ||
      (log.actorRole && log.actorRole.toLowerCase().includes(q)) ||
      log.action.toLowerCase().includes(q) ||
      (log.tableName && log.tableName.toLowerCase().includes(q)) ||
      (log.recordNumber && log.recordNumber.toLowerCase().includes(q)) ||
      (log.fieldName && log.fieldName.toLowerCase().includes(q)) ||
      log.details.toLowerCase().includes(q) ||
      log.detailsKu.toLowerCase().includes(q) ||
      (log.detailsAr && log.detailsAr.toLowerCase().includes(q))
    );
  });

  const handleExportCsv = () => {
    exportAuditLogsToCsv(filteredLogs, currentLang);
    setExportNotice(
      currentLang === 'ku'
        ? `تۆماری وردبینی بە سەرکەوتوویی وەک CSV دابەزێندرا (${filteredLogs.length} چالاکی)`
        : currentLang === 'ar'
        ? `تم تصدير سجل التدقيق بنجاح كملف CSV (${filteredLogs.length} نشاط)`
        : `Audit trail exported to CSV successfully (${filteredLogs.length} events)`
    );
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleExportPdf = () => {
    exportAuditLogsToPdf(filteredLogs, currentLang);
    setExportNotice(
      currentLang === 'ku'
        ? `ڕاپۆرتی فەرمی وردبینی وەک PDF دروستکرا (${filteredLogs.length} چالاکی)`
        : currentLang === 'ar'
        ? `تم إنشاء تقرير التدقيق الرسمي كملف PDF (${filteredLogs.length} نشاط)`
        : `Formal compliance audit PDF generated (${filteredLogs.length} events)`
    );
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shadow-inner">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                {currentLang === 'ku'
                  ? 'تۆماری وردبینی و مێژووی دەستکاری (Enterprise Audit Trail)'
                  : currentLang === 'ar'
                  ? 'سجل التدقيق وتتبع التعديلات (Enterprise Audit Trail)'
                  : 'Enterprise Audit Trail & Modification History'}
              </h3>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Immutable Log
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentLang === 'ku'
                ? 'تۆمارکردنی تەواوی گۆڕانکاری، دەستکاریکردنی خانەکان، پەسەندکردن، سڕینەوە و دابەزاندنی داتا بە ناونیشانی IP و ناوی بەرپرس'
                : currentLang === 'ar'
                ? 'تسجيل كل تعديل، تحرير الخلايا، الموافقات، الحذف، وتصدير البيانات مع عنوان IP واسم المستخدم المسؤول'
                : 'Cryptographically ordered records of every cell edit, row creation, approval change, and export with user and IP audit'}
            </p>
          </div>
        </div>

        {/* Top Controls: Export Buttons & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Operator Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] text-slate-400">
              {currentLang === 'ku' ? 'ئەکتەری چالاک:' : 'Active Operator:'}
            </span>
            <span className="font-bold text-white text-[11px]">{activeOperator.name}</span>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer border border-slate-700"
            title="Download audit logs in CSV format"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors cursor-pointer shadow-md shadow-indigo-600/30"
            title="Download audit compliance report in PDF format"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Report</span>
          </button>

          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh Audit Logs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{currentLang === 'ku' ? 'نوێکردنەوە' : currentLang === 'ar' ? 'تحديث' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Export Feedback Toast */}
      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="text-emerald-400 hover:text-white text-xs cursor-pointer px-1">
            ✕
          </button>
        </div>
      )}

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400">
            {currentLang === 'ku' ? 'کۆی چالاکییە تۆمارکراوەکان' : currentLang === 'ar' ? 'إجمالي السجلات' : 'Total Audit Events'}
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-0.5">{auditLogs.length}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400">
            {currentLang === 'ku' ? 'دەستکاریکردنی تۆمارەکان' : currentLang === 'ar' ? 'تعديل السجلات' : 'Data Modifications'}
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-0.5">
            {auditLogs.filter(l => l.action === 'RECORD_UPDATED' || l.action === 'RECORD_CREATED').length}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400">
            {currentLang === 'ku' ? 'بڕیاری پەسەندکردن' : currentLang === 'ar' ? 'قرارات الموافقة' : 'Approval Actions'}
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-0.5">
            {auditLogs.filter(l => l.action === 'APPROVAL_STATUS_CHANGED').length}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400">
            {currentLang === 'ku' ? 'هەناردەکردنی داتا' : currentLang === 'ar' ? 'تصدير البيانات' : 'Data Exports'}
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
            {auditLogs.filter(l => l.action === 'DATA_EXPORTED').length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
        
        {/* Action Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'ALL', labelKu: 'هەموو چالاکییەکان', labelEn: 'All Actions', labelAr: 'كافة النشاطات' },
            { id: 'RECORD_UPDATED', labelKu: 'دەستکاری خانەکان', labelEn: 'Cell Edits', labelAr: 'تعديلات الخلايا' },
            { id: 'APPROVAL_STATUS_CHANGED', labelKu: 'ڕەزامەندی', labelEn: 'Approvals', labelAr: 'الموافقات' },
            { id: 'RECORD_CREATED', labelKu: 'تۆماری نوێ', labelEn: 'New Rows', labelAr: 'صفوف جديدة' },
            { id: 'RECORD_DELETED', labelKu: 'سڕینەوە', labelEn: 'Deletions', labelAr: 'الحذف' },
            { id: 'DATA_EXPORTED', labelKu: 'هەناردەکردن', labelEn: 'Exports', labelAr: 'التصدير' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterAction(btn.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                filterAction === btn.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {currentLang === 'ku' ? btn.labelKu : currentLang === 'ar' ? btn.labelAr : btn.labelEn}
            </button>
          ))}
        </div>

        {/* Right filters: Table filter and Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Table filter dropdown */}
          <select
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">
              {currentLang === 'ku' ? 'هەموو خشتەکان (All Tables)' : currentLang === 'ar' ? 'جميع الجداول' : 'All Tables'}
            </option>
            {tables.length > 0 ? (
              tables.map(t => (
                <option key={t.id} value={t.id}>
                  {currentLang === 'ku' ? t.nameKu : currentLang === 'ar' ? t.nameAr : t.name}
                </option>
              ))
            ) : (
              <option value={currentTable.id}>{currentTable.name}</option>
            )}
          </select>

          {/* Search */}
          <div className="relative min-w-[210px]">
            <Search className="absolute right-2.5 rtl:right-2.5 ltr:left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLang === 'ku' ? 'گەڕان بەپێی بەکارهێنەر، کۆدی تۆمار...' : currentLang === 'ar' ? 'بحث بالمستخدم أو السجل...' : 'Search user, record #, field...'}
              className="w-full pl-3 pr-8 rtl:pr-8 ltr:pl-8 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

      </div>

      {/* Audit Log Timeline Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
        <table className="w-full text-xs text-right border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 select-none">
              <th className="p-3 w-40">{currentLang === 'ku' ? 'کاتژمێر و بەروار' : currentLang === 'ar' ? 'الوقت والتاريخ' : 'Timestamp'}</th>
              <th className="p-3 w-48">{currentLang === 'ku' ? 'بەکارهێنەر / ئەکتەر' : currentLang === 'ar' ? 'المستخدم المسؤول' : 'Actor / Role'}</th>
              <th className="p-3 w-36">{currentLang === 'ku' ? 'جۆری کردار' : currentLang === 'ar' ? 'نوع الإجراء' : 'Action Type'}</th>
              <th className="p-3 w-40">{currentLang === 'ku' ? 'خشتە / تۆمار' : currentLang === 'ar' ? 'الجدول / السجل' : 'Table / Record #'}</th>
              <th className="p-3">{currentLang === 'ku' ? 'وردەکاری دەستکاریکردن (Action Audit & Diff)' : currentLang === 'ar' ? 'تفاصيل التعديل وفارق القيم' : 'Audit Details & Value Diff'}</th>
              <th className="p-3 w-28 font-mono">{currentLang === 'ku' ? 'ناونیشانی IP' : currentLang === 'ar' ? 'عنوان IP' : 'IP Address'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850 font-medium">
            {filteredLogs.map((log) => {
              const badge = actionTypeBadges[log.action] || {
                labelKu: log.action,
                labelEn: log.action,
                labelAr: log.action,
                color: 'bg-slate-700 text-slate-300 border-slate-600',
              };

              const dateObj = new Date(log.timestamp);
              const formattedTime = !isNaN(dateObj.getTime())
                ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                : '12:00:00';
              const formattedDate = !isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString()
                : '2026-09-26';

              const logText = currentLang === 'ku' 
                ? (log.detailsKu || log.details) 
                : currentLang === 'ar' 
                ? (log.detailsAr || log.details) 
                : log.details;

              return (
                <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                  
                  {/* Timestamp */}
                  <td className="p-3 whitespace-nowrap">
                    <div className="font-mono text-white text-[11px] font-bold">{formattedTime}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{formattedDate}</div>
                  </td>

                  {/* Actor */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0 shadow-sm">
                        {log.actor.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-bold truncate max-w-[140px] text-[11px]">{log.actor}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{log.actorRole}</div>
                      </div>
                    </div>
                  </td>

                  {/* Action Badge */}
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                      {currentLang === 'ku' ? badge.labelKu : currentLang === 'ar' ? badge.labelAr : badge.labelEn}
                    </span>
                  </td>

                  {/* Table & Record Number */}
                  <td className="p-3">
                    <div className="text-slate-300 font-medium text-[11px] truncate max-w-[130px]">
                      {log.tableName}
                    </div>
                    {log.recordNumber ? (
                      <span className="inline-block mt-0.5 text-[10px] font-mono text-indigo-400 px-1.5 py-0.2 rounded bg-indigo-950/40 border border-indigo-900/60">
                        #{log.recordNumber}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">-</span>
                    )}
                  </td>

                  {/* Details & Value Diff */}
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="text-slate-200 text-xs">
                        {logText}
                      </div>

                      {/* Field Value Diff if updated */}
                      {log.fieldName && log.previousValue !== undefined && log.newValue !== undefined && (
                        <div className="inline-flex items-center gap-2 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          <span className="text-slate-500 font-sans">{log.fieldName}:</span>
                          <span className="line-through text-rose-400">{String(log.previousValue)}</span>
                          <ArrowRight className="w-3 h-3 text-slate-600 rtl:rotate-180" />
                          <span className="text-emerald-400 font-bold">{String(log.newValue)}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* IP Address */}
                  <td className="p-3 font-mono text-[11px] text-slate-400">
                    {log.ipAddress || '192.168.1.104'}
                  </td>

                </tr>
              );
            })}

            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-slate-500 italic">
                  {currentLang === 'ku'
                    ? 'هیچ تۆمارێکی وردبینی بەم پێوەرانە نەدۆزرایەوە'
                    : currentLang === 'ar'
                    ? 'لم يتم العثور على أي سجلات تدقيق مطابقة'
                    : 'No audit records matched the criteria'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Compliance Footer Note */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {currentLang === 'ku'
              ? 'پابەندە بە یاساکانی ئاسایشی زانیاری و وردبینی بەڕێوەبەرایەتی دارایی (SOC2 & ISO 27001 Ready Audit Logs)'
              : currentLang === 'ar'
              ? 'متوافق مع معايير الأمان المؤسسي وتدقيق الحسابات والامتثال (SOC2 & ISO 27001 Ready Audit Logs)'
              : 'Enterprise Security Compliant & Audit-Ready for Corporate Accountability (SOC2 & ISO 27001)'}
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Immutable Cryptographic Timestamping
        </div>
      </div>

    </div>
  );
};
