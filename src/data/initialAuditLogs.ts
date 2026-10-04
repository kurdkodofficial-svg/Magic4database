import { AuditLogEntry } from '../types/database';

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(), // 14 mins ago
    actor: 'ڕەوەند سەردار (Admin)',
    actorRole: 'Senior Enterprise Administrator',
    action: 'APPROVAL_STATUS_CHANGED',
    tableId: 'tbl-erp',
    tableName: 'Sales & Invoices (ERP)',
    recordNumber: 'INV-2026-081',
    fieldName: 'approvalStatus',
    previousValue: 'pending',
    newValue: 'approved',
    details: 'Approved invoice INV-2026-081 for Enterprise Cloud Node ($13,125)',
    detailsKu: 'فاکتۆڕی INV-2026-081 بۆ سێرڤەری کلاود بە بڕی $13,125 پەسەندکرا',
    detailsAr: 'تمت الموافقة على الفاتورة INV-2026-081 لخادم السحابة بمبلغ $13,125',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'aud-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(), // 42 mins ago
    actor: 'سارا جەمال (Financial Auditor)',
    actorRole: 'Compliance Officer',
    action: 'RECORD_UPDATED',
    tableId: 'tbl-erp',
    tableName: 'Sales & Invoices (ERP)',
    recordNumber: 'INV-2026-082',
    fieldName: 'paymentStatus',
    previousValue: 'چاوەڕوانکراو (Pending)',
    newValue: 'دراوە (Paid)',
    details: 'Updated paymentStatus from "Pending" to "Paid" for invoice INV-2026-082',
    detailsKu: 'دۆخی پارەدانی فاکتۆڕی INV-2026-082 لە "چاوەڕوانکراو"ەوە گۆڕدرا بۆ "دراوە"',
    detailsAr: 'تم تحديث حالة السداد من "معلق" إلى "مدفوع" للفاتورة INV-2026-082',
    ipAddress: '192.168.1.112'
  },
  {
    id: 'aud-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(), // 1.5 hours ago
    actor: 'لانە کامەران (Sales Lead)',
    actorRole: 'CRM Manager',
    action: 'RECORD_CREATED',
    tableId: 'tbl-crm',
    tableName: 'CRM & Client Pipeline',
    recordNumber: 'CRM-2026-101',
    details: 'Created new enterprise opportunity record CRM-2026-101 (Enterprise Cloud ERP)',
    detailsKu: 'تۆماری نوێی دەرفەتی فرۆشتن دروستکرا: سیستەمی کلاودی سەرەکی (CRM-2026-101)',
    detailsAr: 'تم إنشاء فرصة مبيعات جديدة للنظام السحابي الرئيسي (CRM-2026-101)',
    ipAddress: '10.0.4.52'
  },
  {
    id: 'aud-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    actor: 'کاروان عەزیز (Production Lead)',
    actorRole: 'Plant Engineer',
    action: 'RECORD_UPDATED',
    tableId: 'tbl-bom',
    tableName: 'Manufacturing & BOM',
    recordNumber: 'BOM-2026-501',
    fieldName: 'unitCost',
    previousValue: 24,
    newValue: 22,
    details: 'Recalculated unitCost from $24 to $22 based on batch optimization',
    detailsKu: 'تێچووی یەکە (unitCost) کەمکرایەوە لە $24 بۆ $22 بەهۆی باشترکردنی بەرھەمھێنان',
    detailsAr: 'تم تخفيض تكلفة الوحدة من $24 إلى $22 بناءً على تحسين خط الإنتاج',
    ipAddress: '172.16.8.19'
  },
  {
    id: 'aud-005',
    timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(), // ~5 hours ago
    actor: 'سارا جەمال (Financial Auditor)',
    actorRole: 'Compliance Officer',
    action: 'DATA_EXPORTED',
    tableId: 'tbl-erp',
    tableName: 'Sales & Invoices (ERP)',
    details: 'Exported official financial report as encrypted PDF document (5 records)',
    detailsKu: 'ڕاپۆرتی فەرمی دارایی لە خشتەی فاکتۆڕەکان هەناردەکرا وەک فایلی پارێزراوی PDF',
    detailsAr: 'تم تصدير التقرير المالي الرسمي كملف PDF مشفر للتدقيق المؤسسي (5 سجلات)',
    ipAddress: '192.168.1.112'
  },
  {
    id: 'aud-006',
    timestamp: new Date(Date.now() - 1000 * 60 * 500).toISOString(), // ~8 hours ago
    actor: 'ڕەوەند سەردار (Admin)',
    actorRole: 'Senior Enterprise Administrator',
    action: 'COLUMN_ADDED',
    tableId: 'tbl-erp',
    tableName: 'Sales & Invoices (ERP)',
    fieldName: 'paymentMethod',
    details: 'Added custom enterprise dropdown field "Payment Method" with banking transfer support',
    detailsKu: 'خانەی نوێ زیادکرا: "شێوازی پارەدان" بە هەڵبژاردنی حەواڵە و نەقدی',
    detailsAr: 'تمت إضافة حقل جديد "طريقة الدفع" مع دعم التحويلات البنكية والبطاقات',
    ipAddress: '192.168.1.104'
  }
];
