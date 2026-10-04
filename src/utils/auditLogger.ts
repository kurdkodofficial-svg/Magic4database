import { AuditLogEntry, AuditActionType, DatabaseTable, DatabaseRecord } from '../types/database';
import { initialAuditLogs } from '../data/initialAuditLogs';

const STORAGE_KEY = 'magic_enterprise_audit_trail_v1';

export interface EnterpriseOperator {
  name: string;
  role: string;
  ip: string;
}

export const defaultOperator: EnterpriseOperator = {
  name: 'ڕەوەند سەردار (Admin)',
  role: 'Senior Enterprise Administrator',
  ip: '192.168.1.104'
};

export const availableOperators: EnterpriseOperator[] = [
  {
    name: 'ڕەوەند سەردار (Admin)',
    role: 'Senior Enterprise Administrator',
    ip: '192.168.1.104'
  },
  {
    name: 'سارا جەمال (Auditor)',
    role: 'Financial Compliance Officer',
    ip: '192.168.1.112'
  },
  {
    name: 'لانە کامەران (CRM Lead)',
    role: 'Commercial Operations Manager',
    ip: '10.0.4.52'
  },
  {
    name: 'کاروان عەزیز (Production Lead)',
    role: 'Plant & BOM Supervisor',
    ip: '172.16.8.19'
  }
];

/**
 * Load audit logs from localStorage or fallback to initialAuditLogs
 */
export function loadAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load audit logs from localStorage', e);
  }
  return initialAuditLogs;
}

/**
 * Save audit logs to localStorage
 */
export function saveAuditLogs(logs: AuditLogEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, 300))); // Keep last 300 entries
  } catch (e) {
    console.error('Failed to persist audit logs', e);
  }
}

/**
 * Helper to build an audit log entry
 */
export function createAuditEntry(params: {
  action: AuditActionType;
  table: DatabaseTable;
  operator?: EnterpriseOperator;
  recordNumber?: string;
  fieldName?: string;
  previousValue?: any;
  newValue?: any;
  details: string;
  detailsKu: string;
  detailsAr: string;
}): AuditLogEntry {
  const operator = params.operator || defaultOperator;
  return {
    id: `aud-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    actor: operator.name,
    actorRole: operator.role,
    action: params.action,
    tableId: params.table.id,
    tableName: params.table.name,
    recordNumber: params.recordNumber,
    fieldName: params.fieldName,
    previousValue: params.previousValue,
    newValue: params.newValue,
    details: params.details,
    detailsKu: params.detailsKu,
    detailsAr: params.detailsAr,
    ipAddress: operator.ip,
  };
}
