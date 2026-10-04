export type FieldType = 
  | 'text' 
  | 'number' 
  | 'currency' 
  | 'date' 
  | 'dropdown' 
  | 'formula' 
  | 'status' 
  | 'relation' 
  | 'user';

export type ApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface FieldDefinition {
  id: string;
  name: string;
  nameKu: string;
  nameAr: string;
  type: FieldType;
  options?: string[]; // For dropdown
  formula?: string; // For formula fields
  required?: boolean;
  width?: number;
}

export interface SubItem {
  id: string;
  item: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DatabaseRecord {
  id: string;
  recordNumber: string;
  createdAt: string;
  updatedAt: string;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvalDate?: string;
  subItems?: SubItem[];
  // Dynamic fields
  [key: string]: any;
}

export interface DatabaseTable {
  id: string;
  name: string;
  nameKu: string;
  nameAr: string;
  icon: string;
  category: 'erp' | 'crm' | 'manufacturing' | 'projects';
  descriptionKu: string;
  descriptionEn: string;
  descriptionAr: string;
  fields: FieldDefinition[];
  records: DatabaseRecord[];
  subTableTitle?: string;
  subTableTitleKu?: string;
}

export interface SecurityEvent {
  id: string;
  ip: string;
  country: string;
  timestamp: string;
  threatType: 'SQL_INJECTION' | 'BRUTE_FORCE' | 'XSS_ATTEMPT' | 'RATE_LIMIT_EXCEEDED' | 'ANOMALOUS_CRAWLER';
  status: 'BLOCKED' | 'FLAGGED' | 'ALLOWED';
  path: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
}

export interface ApiActivityLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  clientIp: string;
  country: string;
  statusCode: number;
  status: 'SUCCESS' | 'BLOCKED' | 'FAILED';
  responseTimeMs: number;
  threatType?: string;
  userAgent?: string;
}

export interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  assignee: string;
  status: 'planning' | 'in_progress' | 'completed' | 'delayed';
  category: string;
}

export type AuditActionType = 
  | 'RECORD_CREATED' 
  | 'RECORD_UPDATED' 
  | 'RECORD_DELETED' 
  | 'APPROVAL_STATUS_CHANGED' 
  | 'COLUMN_ADDED' 
  | 'DATA_EXPORTED' 
  | 'TABLE_SWITCHED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: AuditActionType;
  tableId: string;
  tableName: string;
  recordNumber?: string;
  fieldName?: string;
  previousValue?: any;
  newValue?: any;
  details: string;
  detailsKu: string;
  detailsAr: string;
  ipAddress?: string;
}
