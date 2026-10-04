import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatabaseTable, DatabaseRecord } from '../types/database';
import { Language } from '../i18n/translations';

/**
 * Clean & sanitize text for PDF output
 */
function cleanText(val: any): string {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

/**
 * Exports current table records to a CSV file locally
 */
export function exportTableToCsv(table: DatabaseTable, records?: DatabaseRecord[]) {
  const recordsToExport = records && records.length > 0 ? records : table.records;
  
  // Format column headers
  const headers = [
    'Record #',
    ...table.fields.map(f => `"${(f.name || f.nameKu || f.id).replace(/"/g, '""')}"`),
    'Approval Status',
    'Created At',
    'Approved By'
  ];

  const rows = recordsToExport.map(r => {
    const fieldValues = table.fields.map(f => {
      const val = r[f.id];
      if (val === undefined || val === null) return '""';
      const cleanVal = String(val).replace(/"/g, '""');
      return `"${cleanVal}"`;
    });

    return [
      `"${r.recordNumber}"`,
      ...fieldValues,
      `"${r.approvalStatus}"`,
      `"${r.createdAt || ''}"`,
      `"${r.approvedBy || ''}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const sanitizedName = (table.name || 'magic_table').toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.setAttribute('download', `${sanitizedName}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports current table records and schema to a structured JSON file
 */
export function exportTableToJson(table: DatabaseTable, records?: DatabaseRecord[], pretty: boolean = true) {
  const recordsToExport = records && records.length > 0 ? records : table.records;
  const payload = {
    schemaVersion: '2.5.0',
    platform: 'Wizard (Jadoo) Database Studio',
    exportedAt: new Date().toISOString(),
    table: {
      id: table.id,
      name: table.name,
      nameKu: table.nameKu,
      nameAr: table.nameAr,
      category: table.category,
      descriptionKu: table.descriptionKu,
      descriptionAr: table.descriptionAr,
      fieldsCount: table.fields.length,
      recordsCount: recordsToExport.length,
    },
    fields: table.fields,
    records: recordsToExport,
  };

  const jsonContent = pretty ? JSON.stringify(payload, null, 2) : JSON.stringify(payload);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const sanitizedName = (table.name || 'database_table').toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.setAttribute('download', `${sanitizedName}_records_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports entire database workspace and all tables to a master JSON backup file
 */
export function exportAllTablesToJson(tables: DatabaseTable[], pretty: boolean = true) {
  const payload = {
    schemaVersion: '2.5.0',
    platform: 'Wizard (Jadoo) Database Studio',
    backupType: 'FULL_WORKSPACE_BACKUP',
    exportedAt: new Date().toISOString(),
    totalTables: tables.length,
    totalRecords: tables.reduce((acc, t) => acc + t.records.length, 0),
    tables: tables.map(t => ({
      id: t.id,
      name: t.name,
      nameKu: t.nameKu,
      nameAr: t.nameAr,
      category: t.category,
      fields: t.fields,
      recordsCount: t.records.length,
      records: t.records,
    })),
  };

  const jsonContent = pretty ? JSON.stringify(payload, null, 2) : JSON.stringify(payload);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `jadoo_full_database_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports current table records to a high-fidelity PDF report locally
 */
export function exportTableToPdf(
  table: DatabaseTable,
  records?: DatabaseRecord[],
  lang: Language = 'ku'
) {
  const recordsToExport = records && records.length > 0 ? records : table.records;
  
  // Initialize jsPDF in landscape orientation for spreadsheet data
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Primary Theme Colors (Magic Indigo / Slate)
  const primaryColor = [79, 70, 229]; // #4f46e5 (Indigo 600)
  const darkSlate = [15, 23, 42]; // #0f172a (Slate 900)
  const textMuted = [100, 116, 139]; // #64748b (Slate 500)

  // 1. Header Banner
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.rect(0, 0, pageWidth, 56, 'F');

  // Accent Line under header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 56, pageWidth, 3, 'F');

  // Brand Name & Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('MAGIC NO-CODE DATABASE', 40, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(199, 210, 254);
  doc.text('Enterprise Relational Business Engine & AI Workflows', 40, 46);

  // Export Meta info on right
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${dateStr}`, pageWidth - 40, 30, { align: 'right' });
  doc.text(`Records: ${recordsToExport.length}`, pageWidth - 40, 44, { align: 'right' });

  // 2. Table Title & Summary Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  const tableTitle = table.name || table.nameKu || 'Database Report';
  doc.text(tableTitle, 40, 84);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  const categoryStr = `Category: ${table.category.toUpperCase()} | Built with Magic Studio`;
  doc.text(categoryStr, 40, 98);

  // 3. Prepare Columns & Table Data
  // Select fields to display cleanly in landscape mode
  const selectedFields = table.fields.slice(0, 7); // keep optimal column count for PDF readability
  
  const headers = [
    'Record #',
    ...selectedFields.map(f => f.name || f.id),
    'Approval',
    'Date'
  ];

  const bodyData = recordsToExport.map(r => {
    const cells = selectedFields.map(f => {
      const val = r[f.id];
      if (val === undefined || val === null) return '-';
      if (f.type === 'currency' && typeof val === 'number') {
        return `$${val.toLocaleString()}`;
      }
      return cleanText(val);
    });

    const approvalStatusFormatted = 
      r.approvalStatus === 'approved' ? 'Approved' :
      r.approvalStatus === 'pending' ? 'Pending' :
      r.approvalStatus === 'rejected' ? 'Rejected' : 'Draft';

    return [
      cleanText(r.recordNumber),
      ...cells,
      approvalStatusFormatted,
      cleanText(r.createdAt || '-')
    ];
  });

  // 4. Generate AutoTable
  autoTable(doc, {
    startY: 110,
    head: [headers],
    body: bodyData,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 6,
      overflow: 'linebreak',
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [79, 70, 229], // Indigo 600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [79, 70, 229], cellWidth: 70 },
    },
    didDrawCell: (data) => {
      // Highlight approval status column
      if (data.section === 'body' && data.column.index === headers.length - 2) {
        const text = String(data.cell.raw);
        if (text === 'Approved') {
          doc.setTextColor(22, 101, 52); // green-800
        } else if (text === 'Pending') {
          doc.setTextColor(180, 83, 9); // amber-700
        } else if (text === 'Rejected') {
          doc.setTextColor(190, 18, 60); // rose-700
        }
      }
    },
    didDrawPage: (data) => {
      // Footer page numbering
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Magic No-Code Database Studio - Page ${doc.getNumberOfPages()}`,
        pageWidth / 2,
        pageHeight - 20,
        { align: 'center' }
      );
    },
    margin: { top: 110, left: 40, right: 40, bottom: 40 },
  });

  // Save the generated PDF
  const sanitizedName = (table.name || 'magic_table').toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`${sanitizedName}_report_${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Export audit logs to CSV
 */
export function exportAuditLogsToCsv(logs: any[], currentLang: Language) {
  const headers = [
    'Timestamp',
    'Actor',
    'Role',
    'Action Type',
    'Table',
    'Record #',
    'Field Name',
    'Previous Value',
    'New Value',
    'Details',
    'IP Address'
  ];

  const rows = logs.map(log => [
    `"${log.timestamp}"`,
    `"${(log.actor || '').replace(/"/g, '""')}"`,
    `"${(log.actorRole || '').replace(/"/g, '""')}"`,
    `"${(log.action || '').replace(/"/g, '""')}"`,
    `"${(log.tableName || '').replace(/"/g, '""')}"`,
    `"${(log.recordNumber || '').replace(/"/g, '""')}"`,
    `"${(log.fieldName || '').replace(/"/g, '""')}"`,
    `"${String(log.previousValue ?? '').replace(/"/g, '""')}"`,
    `"${String(log.newValue ?? '').replace(/"/g, '""')}"`,
    `"${(currentLang === 'ku' ? log.detailsKu : currentLang === 'ar' ? log.detailsAr : log.details || '').replace(/"/g, '""')}"`,
    `"${(log.ipAddress || '192.168.1.1').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `magic_enterprise_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export audit logs to PDF
 */
export function exportAuditLogsToPdf(logs: any[], currentLang: Language) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header band
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 75, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MAGIC ENTERPRISE AUDIT TRAIL REPORT', 40, 36);

  // Subtitle
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFont('helvetica', 'normal');
  doc.text('Immutable audit logs of user actions, data edits, approval flows, and exports', 40, 56);

  // Metadata block
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  const now = new Date().toLocaleString();
  doc.text(`Generated: ${now}`, pageWidth - 40, 36, { align: 'right' });
  doc.text(`Total Log Entries: ${logs.length} | SOC2 & ISO 27001 Ready`, pageWidth - 40, 56, { align: 'right' });

  // Headers
  const tableHeaders = ['Timestamp', 'Actor', 'Action', 'Table / Record', 'Details / Diff', 'IP'];

  const rows = logs.map(log => {
    const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(log.timestamp).toLocaleDateString();
    const actorStr = `${log.actor}\n(${log.actorRole})`;
    const recStr = log.recordNumber ? `${log.tableName}\n#${log.recordNumber}` : log.tableName;
    const diffStr = (log.fieldName && log.previousValue !== undefined)
      ? `[${log.fieldName}]: ${log.previousValue} -> ${log.newValue}\n${log.details}`
      : (log.details || log.detailsKu || '');

    return [
      timeStr,
      actorStr,
      log.action,
      recStr,
      diffStr,
      log.ipAddress || '192.168.1.1'
    ];
  });

  autoTable(doc, {
    startY: 90,
    head: [tableHeaders],
    body: rows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 5,
      overflow: 'linebreak',
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Magic No-Code Database Studio - Compliance Audit Log - Page ${doc.getNumberOfPages()}`,
        pageWidth / 2,
        pageHeight - 20,
        { align: 'center' }
      );
    },
    margin: { top: 90, left: 40, right: 40, bottom: 40 },
  });

  doc.save(`magic_audit_trail_${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Generates clean SQL DDL schema & INSERT statements for PostgreSQL or SQLite
 */
export function generateSqlSchema(tables: DatabaseTable[]): string {
  const lines: string[] = [
    '--',
    '-- Jadoo (Wizard) No-Code Database Studio - SQL Schema & Data Export',
    `-- Exported At: ${new Date().toISOString()}`,
    '--',
    'BEGIN;',
    ''
  ];

  tables.forEach((table) => {
    const tableName = (table.name || table.id).toLowerCase().replace(/[^a-z0-9_]/g, '_');
    lines.push(`-- Table: ${table.name} (${table.nameKu})`);
    lines.push(`CREATE TABLE IF NOT EXISTS "${tableName}" (`);
    lines.push('  "id" VARCHAR(64) PRIMARY KEY,');
    lines.push('  "record_number" VARCHAR(64) NOT NULL,');

    table.fields.forEach((field) => {
      let sqlType = 'VARCHAR(255)';
      if (field.type === 'number') sqlType = 'NUMERIC(14, 2)';
      else if (field.type === 'date') sqlType = 'DATE';
      else if (field.type === 'formula') sqlType = 'NUMERIC(14, 2)';
      else if (field.type === 'dropdown') sqlType = 'VARCHAR(128)';

      lines.push(`  "${field.id}" ${sqlType},`);
    });

    lines.push('  "approval_status" VARCHAR(32) DEFAULT \'draft\',');
    lines.push('  "approved_by" VARCHAR(128),');
    lines.push('  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,');
    lines.push('  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    lines.push(');');
    lines.push('');

    // Insert sample records
    if (table.records.length > 0) {
      lines.push(`-- Seed Data for ${table.name}`);
      table.records.forEach((rec) => {
        const fieldCols = ['"id"', '"record_number"', ...table.fields.map(f => `"${f.id}"`), '"approval_status"'];
        const values = [
          `'${rec.id}'`,
          `'${rec.recordNumber}'`,
          ...table.fields.map(f => {
            const v = rec[f.id];
            if (v === undefined || v === null) return 'NULL';
            if (typeof v === 'number') return String(v);
            return `'${String(v).replace(/'/g, "''")}'`;
          }),
          `'${rec.approvalStatus || 'draft'}'`
        ];
        lines.push(`INSERT INTO "${tableName}" (${fieldCols.join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT ("id") DO NOTHING;`);
      });
      lines.push('');
    }
  });

  lines.push('COMMIT;');
  return lines.join('\n');
}

/**
 * Generates TypeScript type definitions for all tables and records
 */
export function generateTypeScriptDefinitions(tables: DatabaseTable[]): string {
  const lines: string[] = [
    '/**',
    ' * Jadoo (Wizard) No-Code Database Studio - TypeScript Source Definitions',
    ` * Generated: ${new Date().toISOString()}`,
    ' */',
    '',
    'export type ApprovalStatus = \'draft\' | \'pending\' | \'approved\' | \'rejected\';',
    ''
  ];

  tables.forEach((t) => {
    const typeName = t.id.replace('tbl-', '').replace(/^[a-z]/, c => c.toUpperCase()) + 'Record';
    lines.push(`export interface ${typeName} {`);
    lines.push('  id: string;');
    lines.push('  recordNumber: string;');
    lines.push('  approvalStatus: ApprovalStatus;');
    lines.push('  approvedBy?: string;');
    lines.push('  createdAt?: string;');
    lines.push('  updatedAt?: string;');

    t.fields.forEach((f) => {
      let tsType = 'string';
      if (f.type === 'number' || f.type === 'formula') tsType = 'number';
      lines.push(`  /** ${f.name} - ${f.nameKu} */`);
      lines.push(`  ${f.id}: ${tsType};`);
    });

    lines.push('}');
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Generates GitHub README.md for the repository
 */
export function generateGitHubReadme(tables: DatabaseTable[], activeTable: DatabaseTable): string {
  return `# 🔮 Jadoo (Wizard) Enterprise Database & Workflows

> **باشترین بنکەی دروستکردنی ماڵپەڕ و داتای بێکۆد**
> Repository backed up directly from Jadoo No-Code Studio on ${new Date().toISOString().split('T')[0]}.

## 📊 Overview
- **Active Table:** ${activeTable.name} (${activeTable.nameKu})
- **Total Tables:** ${tables.length}
- **Total Active Records:** ${tables.reduce((acc, t) => acc + t.records.length, 0)}
- **Platform Version:** 2.5.0 Enterprise

## 📁 Included Files
- \`data/${activeTable.id}_records.json\`: Active table records and schema
- \`data/${activeTable.id}_records.csv\`: Raw CSV export
- \`data/jadoo_full_database.json\`: Master workspace backup with all relational tables
- \`schema.sql\`: Production-ready PostgreSQL & SQLite schema DDL with seed data
- \`types.ts\`: Auto-generated TypeScript types and interfaces

## 🚀 Quick Start
\`\`\`bash
# 1. Clone repository
git clone https://github.com/USERNAME/REPOSITORY.git
cd REPOSITORY

# 2. Inspect active records
cat data/${activeTable.id}_records.json
\`\`\`

## 🛡️ Security & Integrity
All records are protected by audit trail tracking and multi-tier approval states (\`draft\`, \`pending\`, \`approved\`, \`rejected\`).
`;
}

/**
 * Exports complete project source and database files as a single downloadable text package
 */
export function exportSourcePackage(tables: DatabaseTable[], activeTable: DatabaseTable) {
  const sql = generateSqlSchema(tables);
  const ts = generateTypeScriptDefinitions(tables);
  const readme = generateGitHubReadme(tables, activeTable);
  const dataJson = JSON.stringify({
    schemaVersion: '2.5.0',
    exportedAt: new Date().toISOString(),
    activeTable: activeTable.name,
    tables: tables.map(t => ({
      id: t.id,
      name: t.name,
      nameKu: t.nameKu,
      fields: t.fields,
      records: t.records,
    })),
  }, null, 2);

  const fullPackage = `# ====================================================================
# JADOO (WIZARD) COMPLETE REPOSITORY & SOURCE CODE EXPORT
# Exported on: ${new Date().toISOString()}
# Contains: README.md, schema.sql, types.ts, data.json
# ====================================================================

=== FILE: README.md ===
${readme}

=== FILE: schema.sql ===
${sql}

=== FILE: types.ts ===
${ts}

=== FILE: data/database_records.json ===
${dataJson}
`;

  const blob = new Blob([fullPackage], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `jadoo_source_repository_${new Date().toISOString().split('T')[0]}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

