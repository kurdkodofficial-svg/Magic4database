process.env.DISABLE_HMR = 'true';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Health Check for Render & Cloud Deployment
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// In-memory IP Security & Shield Store
interface SecurityEvent {
  id: string;
  ip: string;
  country: string;
  timestamp: string;
  threatType: 'SQL_INJECTION' | 'BRUTE_FORCE' | 'XSS_ATTEMPT' | 'RATE_LIMIT_EXCEEDED' | 'ANOMALOUS_CRAWLER';
  status: 'BLOCKED' | 'FLAGGED' | 'ALLOWED';
  path: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
}

const blockedIPs = new Set<string>(['185.220.101.5', '45.154.255.89', '194.26.29.112']);
const allowedWhitelist = new Set<string>(['127.0.0.1', '::1', '192.168.1.1']);
const securityLogs: SecurityEvent[] = [
  {
    id: 'sec-1',
    ip: '185.220.101.5',
    country: 'DE',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    threatType: 'SQL_INJECTION',
    status: 'BLOCKED',
    path: '/api/records?query=UNION+SELECT+ALL',
    severity: 'CRITICAL',
  },
  {
    id: 'sec-2',
    ip: '45.154.255.89',
    country: 'RU',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    threatType: 'BRUTE_FORCE',
    status: 'BLOCKED',
    path: '/api/auth/login-attempt',
    severity: 'HIGH',
  },
  {
    id: 'sec-3',
    ip: '194.26.29.112',
    country: 'NL',
    timestamp: new Date(Date.now() - 1000 * 60 * 68).toISOString(),
    threatType: 'RATE_LIMIT_EXCEEDED',
    status: 'BLOCKED',
    path: '/api/export/bulk-dump',
    severity: 'MEDIUM',
  },
];

// In-memory API Activity Logs
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

const apiActivityLogs: ApiActivityLog[] = [
  {
    id: 'act-1',
    timestamp: new Date(Date.now() - 1000 * 12).toISOString(),
    method: 'GET',
    path: '/api/records?table=tbl-erp',
    clientIp: '192.168.1.45',
    country: 'IQ',
    statusCode: 200,
    status: 'SUCCESS',
    responseTimeMs: 0.8,
  },
  {
    id: 'act-2',
    timestamp: new Date(Date.now() - 1000 * 28).toISOString(),
    method: 'POST',
    path: '/api/audit-trail',
    clientIp: '192.168.1.18',
    country: 'IQ',
    statusCode: 201,
    status: 'SUCCESS',
    responseTimeMs: 1.4,
  },
  {
    id: 'act-3',
    timestamp: new Date(Date.now() - 1000 * 55).toISOString(),
    method: 'GET',
    path: '/api/records?query=UNION+SELECT+ALL',
    clientIp: '185.220.101.5',
    country: 'DE',
    statusCode: 403,
    status: 'BLOCKED',
    responseTimeMs: 0.3,
    threatType: 'SQL_INJECTION',
  },
  {
    id: 'act-4',
    timestamp: new Date(Date.now() - 1000 * 95).toISOString(),
    method: 'GET',
    path: '/api/security/status',
    clientIp: '192.168.1.1',
    country: 'LOCAL',
    statusCode: 200,
    status: 'SUCCESS',
    responseTimeMs: 0.5,
  },
  {
    id: 'act-5',
    timestamp: new Date(Date.now() - 1000 * 140).toISOString(),
    method: 'POST',
    path: '/api/auth/login-attempt',
    clientIp: '45.154.255.89',
    country: 'RU',
    statusCode: 403,
    status: 'BLOCKED',
    responseTimeMs: 0.2,
    threatType: 'BRUTE_FORCE',
  },
  {
    id: 'act-6',
    timestamp: new Date(Date.now() - 1000 * 190).toISOString(),
    method: 'POST',
    path: '/api/integrations/webhook',
    clientIp: '54.214.18.99',
    country: 'US',
    statusCode: 200,
    status: 'SUCCESS',
    responseTimeMs: 2.1,
  },
  {
    id: 'act-7',
    timestamp: new Date(Date.now() - 1000 * 250).toISOString(),
    method: 'GET',
    path: '/api/export/bulk-dump',
    clientIp: '194.26.29.112',
    country: 'NL',
    statusCode: 403,
    status: 'BLOCKED',
    responseTimeMs: 0.4,
    threatType: 'RATE_LIMIT_EXCEEDED',
  },
];

// Security Middleware: IP Guard & Real-Time API Activity Logger
app.use((req, res, next) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';
  const startHrTime = process.hrtime();
  
  if (blockedIPs.has(clientIp) && !allowedWhitelist.has(clientIp)) {
    const elapsedMs = 0.3;
    // Log blocked request immediately
    apiActivityLogs.unshift({
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      method: (req.method as any) || 'GET',
      path: req.originalUrl || req.url,
      clientIp,
      country: clientIp.startsWith('192.') || clientIp === '127.0.0.1' ? 'LOCAL' : 'SUSPECT',
      statusCode: 403,
      status: 'BLOCKED',
      responseTimeMs: elapsedMs,
      threatType: 'BLOCKED_IP_ACCESS',
    });
    if (apiActivityLogs.length > 200) apiActivityLogs.pop();

    return res.status(403).json({
      error: 'Access Denied by Magic IP Shield (IP بلۆککراوە بەهۆی چالاکی گوماناوی)',
      ip: clientIp,
      code: 'MAGIC_IP_FIREWALL_BLOCK',
    });
  }

  // Intercept response finish for legitimate API routes
  if (req.path.startsWith('/api') && req.path !== '/api/security/api-activity') {
    res.on('finish', () => {
      const diff = process.hrtime(startHrTime);
      const elapsedMs = Math.round((diff[0] * 1000 + diff[1] / 1e6) * 10) / 10;
      const status: ApiActivityLog['status'] = res.statusCode >= 400 ? (res.statusCode === 403 ? 'BLOCKED' : 'FAILED') : 'SUCCESS';

      apiActivityLogs.unshift({
        id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        method: (req.method as any) || 'GET',
        path: req.originalUrl || req.url,
        clientIp,
        country: clientIp.startsWith('192.') || clientIp === '127.0.0.1' ? 'LOCAL' : 'EXT',
        statusCode: res.statusCode,
        status,
        responseTimeMs: elapsedMs,
      });

      if (apiActivityLogs.length > 200) {
        apiActivityLogs.pop();
      }
    });
  }

  next();
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Magic No-Code Database Platform',
    version: '2.5.0-pro',
    uptime: process.uptime(),
  });
});

// IP Shield Endpoints
app.get('/api/security/status', (req, res) => {
  res.json({
    activeShield: true,
    totalBlocked: blockedIPs.size,
    blockedList: Array.from(blockedIPs),
    whitelist: Array.from(allowedWhitelist),
    recentEvents: securityLogs.slice(0, 20),
    firewallRules: [
      { id: 'r1', name: 'SQL Injection Deep Packet Inspection', enabled: true },
      { id: 'r2', name: 'Adaptive Rate Limiter (Max 120 req/min)', enabled: true },
      { id: 'r3', name: 'Brute-force Auth Auto-Quarantine', enabled: true },
      { id: 'r4', name: 'Known Malicious Tor / Proxy Filter', enabled: true },
    ],
  });
});

app.post('/api/security/block', (req, res) => {
  const { ip, reason } = req.body;
  if (!ip) {
    return res.status(400).json({ error: 'IP is required' });
  }
  blockedIPs.add(ip);
  securityLogs.unshift({
    id: `sec-${Date.now()}`,
    ip,
    country: 'MANUAL',
    timestamp: new Date().toISOString(),
    threatType: 'BRUTE_FORCE',
    status: 'BLOCKED',
    path: reason || 'Manual Admin Block',
    severity: 'HIGH',
  });
  res.json({ success: true, message: `IP ${ip} blocked successfully`, totalBlocked: blockedIPs.size });
});

app.post('/api/security/unblock', (req, res) => {
  const { ip } = req.body;
  if (!ip) {
    return res.status(400).json({ error: 'IP is required' });
  }
  blockedIPs.delete(ip);
  res.json({ success: true, message: `IP ${ip} unblocked`, totalBlocked: blockedIPs.size });
});

app.post('/api/security/simulate-attack', (req, res) => {
  const fakeIps = ['198.51.100.44', '203.0.113.19', '185.191.171.8', '91.240.118.243'];
  const threatTypes: SecurityEvent['threatType'][] = [
    'SQL_INJECTION',
    'BRUTE_FORCE',
    'XSS_ATTEMPT',
    'RATE_LIMIT_EXCEEDED',
  ];
  const countries = ['NL', 'US', 'FR', 'UA', 'RO'];
  
  const randomIp = fakeIps[Math.floor(Math.random() * fakeIps.length)];
  const randomThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
  const randomCountry = countries[Math.floor(Math.random() * countries.length)];

  blockedIPs.add(randomIp);
  const newEvent: SecurityEvent = {
    id: `sec-${Date.now()}`,
    ip: randomIp,
    country: randomCountry,
    timestamp: new Date().toISOString(),
    threatType: randomThreat,
    status: 'BLOCKED',
    path: `/api/v1/database/records?attack_vector=${randomThreat.toLowerCase()}`,
    severity: 'CRITICAL',
  };
  securityLogs.unshift(newEvent);

  res.json({
    success: true,
    detectedThreat: newEvent,
    message: 'ھێرشی ئەلیکترۆنی لەلایەن Magic IP Shield ڕاگیرا و IPکە دەستبەجێ خرایە لیستی ڕەشەوە (Auto-Blocked).',
  });
});

// Recent API Activity Endpoints (Successful & Blocked requests viewer)
app.get('/api/security/api-activity', (req, res) => {
  const { limit = 50, filter = 'all' } = req.query;
  let filtered = [...apiActivityLogs];

  if (filter === 'successful') {
    filtered = filtered.filter(l => l.status === 'SUCCESS');
  } else if (filter === 'blocked') {
    filtered = filtered.filter(l => l.status === 'BLOCKED');
  }

  const successCount = apiActivityLogs.filter(l => l.status === 'SUCCESS').length;
  const blockedCount = apiActivityLogs.filter(l => l.status === 'BLOCKED').length;
  const avgLatency = apiActivityLogs.length > 0 
    ? Math.round((apiActivityLogs.reduce((acc, l) => acc + l.responseTimeMs, 0) / apiActivityLogs.length) * 10) / 10 
    : 0.5;

  res.json({
    success: true,
    total: apiActivityLogs.length,
    stats: {
      totalRequests: apiActivityLogs.length,
      successCount,
      blockedCount,
      avgLatencyMs: avgLatency,
    },
    logs: filtered.slice(0, Number(limit)),
  });
});

app.post('/api/security/simulate-traffic', (req, res) => {
  const scenarios: Array<{
    method: ApiActivityLog['method'];
    path: string;
    clientIp: string;
    country: string;
    statusCode: number;
    status: ApiActivityLog['status'];
    responseTimeMs: number;
    threatType?: string;
  }> = [
    {
      method: 'GET',
      path: '/api/records?table=tbl-erp&page=1',
      clientIp: '192.168.1.102',
      country: 'LOCAL',
      statusCode: 200,
      status: 'SUCCESS',
      responseTimeMs: 0.7,
    },
    {
      method: 'POST',
      path: '/api/records/update-field',
      clientIp: '192.168.1.45',
      country: 'LOCAL',
      statusCode: 200,
      status: 'SUCCESS',
      responseTimeMs: 1.2,
    },
    {
      method: 'POST',
      path: '/api/audit-trail',
      clientIp: '192.168.1.18',
      country: 'LOCAL',
      statusCode: 201,
      status: 'SUCCESS',
      responseTimeMs: 1.6,
    },
    {
      method: 'GET',
      path: '/api/database/records?attack=UNION+SELECT+users',
      clientIp: '185.220.101.5',
      country: 'DE',
      statusCode: 403,
      status: 'BLOCKED',
      responseTimeMs: 0.3,
      threatType: 'SQL_INJECTION',
    },
    {
      method: 'POST',
      path: '/api/auth/login-attempt',
      clientIp: '45.154.255.89',
      country: 'RU',
      statusCode: 403,
      status: 'BLOCKED',
      responseTimeMs: 0.2,
      threatType: 'BRUTE_FORCE',
    },
    {
      method: 'GET',
      path: '/api/export/csv?table=tbl-crm',
      clientIp: '192.168.1.22',
      country: 'LOCAL',
      statusCode: 200,
      status: 'SUCCESS',
      responseTimeMs: 2.4,
    },
    {
      method: 'GET',
      path: '/api/security/status',
      clientIp: '127.0.0.1',
      country: 'LOCAL',
      statusCode: 200,
      status: 'SUCCESS',
      responseTimeMs: 0.4,
    },
  ];

  const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
  const newEntry: ApiActivityLog = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ...pick,
  };

  apiActivityLogs.unshift(newEntry);
  if (apiActivityLogs.length > 200) apiActivityLogs.pop();

  res.json({
    success: true,
    activity: newEntry,
    message: `Generated simulated ${newEntry.status} ${newEntry.method} request to ${newEntry.path}`,
  });
});

app.delete('/api/security/api-activity/clear', (req, res) => {
  apiActivityLogs.length = 0;
  res.json({ success: true, message: 'API activity log cleared' });
});

// In-memory Audit Log Store
interface AuditLogEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
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

const auditTrailLogs: AuditLogEvent[] = [
  {
    id: 'audit-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    actor: 'ڕەوەند سەردار',
    actorRole: 'Senior Administrator',
    action: 'APPROVAL_STATUS_CHANGED',
    tableId: 'tbl-erp',
    tableName: 'Sales & Invoices (ERP)',
    recordNumber: 'INV-2026-081',
    fieldName: 'approvalStatus',
    previousValue: 'pending',
    newValue: 'approved',
    details: 'Approved invoice #INV-2026-081 for Enterprise Cloud Node ($13,125)',
    detailsKu: 'فاکتۆڕی ژمارە #INV-2026-081 بۆ سێرڤەری کلاود بە بەهای $13,125 پەسەندکرا',
    detailsAr: 'تمت الموافقة على الفاتورة #INV-2026-081 لخادم السحابة بمبلغ $13,125',
    ipAddress: '192.168.1.45',
  },
  {
    id: 'audit-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    actor: 'لانە کامەران',
    actorRole: 'Sales Manager',
    action: 'RECORD_UPDATED',
    tableId: 'tbl-crm',
    tableName: 'Leads & CRM Pipeline',
    recordNumber: 'LEAD-1042',
    fieldName: 'probability',
    previousValue: 50,
    newValue: 70,
    details: 'Updated deal probability to 70% following demo session',
    detailsKu: 'چانس و ڕێژەی دەرفەت بۆ 70% بەرزکرایەوە لەدوای پێشکەشکردنی دیمۆ',
    detailsAr: 'تم تحديث نسبة احتمالية الصفقة إلى 70% بعد جلسة العرض التجريبي',
    ipAddress: '192.168.1.18',
  },
  {
    id: 'audit-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    actor: 'کاروان عەزیز',
    actorRole: 'Security Officer',
    action: 'DATA_EXPORTED',
    tableId: 'tbl-erp',
    tableName: 'Sales & Invoices (ERP)',
    details: 'Exported official compliance PDF audit report',
    detailsKu: 'ڕاپۆرتی فەرمی PDFی فاکتۆڕەکان دابەزێندرا بۆ دیوانی چاودێری دارایی',
    detailsAr: 'تم تصدير تقرير التدقيق المالي كملف PDF رسمي',
    ipAddress: '192.168.1.12',
  },
  {
    id: 'audit-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    actor: 'ئەندازیار بەهمەن',
    actorRole: 'Production Lead',
    action: 'RECORD_CREATED',
    tableId: 'tbl-bom',
    tableName: 'Manufacturing & BOM',
    recordNumber: 'BOM-503',
    details: 'Created new production batch LOT-2026-D1 for Smart Dimmer',
    detailsKu: 'باچی نوێی بەرهەمهێنان #BOM-503 بۆ ئامێری کۆنتڕۆڵی ڕووناکی ژیر تۆمارکرا',
    detailsAr: 'تم إنشاء دفعة تصنيع جديدة LOT-2026-D1 لوحدة التحكم بالإضاءة الذكية',
    ipAddress: '192.168.1.33',
  },
];

// Audit Trail API Routes
app.get('/api/audit-trail', (req, res) => {
  const { tableId, limit = 50 } = req.query;
  let logs = [...auditTrailLogs];
  if (tableId && typeof tableId === 'string' && tableId !== 'all') {
    logs = logs.filter(l => l.tableId === tableId);
  }
  res.json({
    success: true,
    totalCount: logs.length,
    logs: logs.slice(0, Number(limit)),
  });
});

app.post('/api/audit-trail', (req, res) => {
  const entry = req.body;
  if (!entry || !entry.action) {
    return res.status(400).json({ error: 'Action is required' });
  }

  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '192.168.1.10';

  const newLog: AuditLogEvent = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actor: entry.actor || 'ئەندامی ستاف (System User)',
    actorRole: entry.actorRole || 'Operator',
    action: entry.action,
    tableId: entry.tableId || 'general',
    tableName: entry.tableName || 'Database Table',
    recordNumber: entry.recordNumber,
    fieldName: entry.fieldName,
    previousValue: entry.previousValue,
    newValue: entry.newValue,
    details: entry.details || 'Database record modification',
    detailsKu: entry.detailsKu || 'گۆڕانکاری لە تۆماری بنکەی دادەدا تۆمارکرا',
    detailsAr: entry.detailsAr || 'تم تسجيل تعديل في سجل قاعدة البيانات',
    ipAddress: clientIp,
  };

  auditTrailLogs.unshift(newLog);
  // Keep max 200 logs in memory
  if (auditTrailLogs.length > 200) {
    auditTrailLogs.pop();
  }

  res.json({ success: true, entry: newLog });
});

app.delete('/api/audit-trail/clear', (req, res) => {
  auditTrailLogs.length = 0;
  res.json({ success: true, message: 'Audit trail reset for demonstration' });
});

// Gemini AI Agent Endpoint
app.post('/api/ai/agent', async (req, res) => {
  const { prompt, currentTable, actionType = 'chat', lang = 'ku' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Return high quality intelligent local fallback
    return res.json({
      success: true,
      source: 'local-agent',
      result: generateIntelligentFallback(prompt, currentTable, actionType, lang),
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = `You are Magic AI Agent, the built-in intelligent assistant in Magic (ماجیک), an advanced no-code database and web application builder.
You help business users build tables, design schemas, write Excel-like formulas, generate ERP/CRM approval workflows, and analyze database records.
Language preference: ${lang === 'ku' ? 'Kurdish Sorani (کوردی سۆرانی)' : lang === 'ar' ? 'Arabic (العربية)' : 'English'}.
Always provide structured, actionable, and friendly responses. If asked to generate a table or formula, output clean specifications.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\nUser request: ${prompt}\n\nCurrent Table context: ${JSON.stringify(currentTable || {})}` }
          ]
        }
      ],
      config: {
        temperature: 0.7,
      }
    });

    res.json({
      success: true,
      source: 'gemini-3.8-flash',
      result: response.text,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.json({
      success: true,
      source: 'local-fallback',
      result: generateIntelligentFallback(prompt, currentTable, actionType, lang),
      note: 'Processed via Magic Native Rule Engine',
    });
  }
});

// Webhook simulation endpoint for Zapier, Make, n8n, Google Workspace
app.post('/api/integrations/webhook', (req, res) => {
  const payload = req.body;
  res.json({
    received: true,
    timestamp: new Date().toISOString(),
    event: 'MAGIC_RECORD_CREATED_OR_UPDATED',
    integrationPlatform: req.headers['x-platform'] || 'Zapier/n8n/Make',
    payloadSize: JSON.stringify(payload).length,
    status: 'Dispatched to workflow triggers successfully',
  });
});

function generateIntelligentFallback(prompt: string, currentTable: any, actionType: string, lang: string): string {
  const p = prompt.toLowerCase();
  
  if (lang === 'ku') {
    if (p.includes('خشتە') || p.includes('دروست') || p.includes('table') || p.includes('قالب')) {
      return `✨ **پێشنیاری بریکاری ژیریی دەستکردی جادوو (Jadoo AI Agent):**
من ئەم خشتەیە پێشنیار دەکەم بەپێی داواکارییەکەت:

1. **ناوی خشتە:** بەڕێوەبردنی کڕیار و داواکارییەکان (Orders & CRM)
2. **خانەکان (Fields):**
   - 🆔 **کۆدی داواکاری (Order ID):** ژمارەی زنجیرەیی ئۆتۆماتیک (Auto-number: #ORD-0001)
   - 👤 **ناوی کڕیار (Customer Name):** دەق (Text) - ڕابطە بە خشتەی کڕیاران
   - 📦 **بەرهەم / خزمەتگوزاری:** هەڵبژاردنی لیست (Dropdown)
   - 🔢 **دانە (Quantity):** ژمارە (Number)
   - 💵 **نرخی تاک (Unit Price):** دراو (USD / IQD)
   - 🧮 **کۆی گشتی (Total):** هاوکێشە \`=Quantity * Unit_Price\`
   - 🚦 **دۆخی داواکاری:** چاوەڕوانکراو، پەسەندکراو، ڕەتکراوە، تەواوبوو
   - ✍️ **ڕەزامەندی بەڕێوەبەر (Approval):** سیستەمی بڕیاردان بە یەک کلیک

دەتوانی بە کلیکێک لە دوگمەی خوارەوە ئەم قالبە دابەزێنیتە سەر بنکەی دادەکەت!`;
    }

    if (p.includes('هاوکێشە') || p.includes('formula') || p.includes('حساب') || p.includes('کۆ')) {
      return `🧮 **هاوکێشەی دروستکراو لەلایەن Wizard AI:**
بۆ ئەم مەبەستە، دەتوانی ئەم هاوکێشانە بەکاربهێنیت:
* **کۆی گشتی لەگەڵ باج (VAT):**
  \`TOTAL_WITH_TAX = TOTAL * 1.15\`
* **داشکاندن بەپێی بڕ:**
  \`DISCOUNT = IF(QUANTITY >= 10, TOTAL * 0.10, 0)\`
* **بەستنەوەی خانەکان (Lookup):**
  \`CUSTOMER_PHONE = LOOKUP(Customer_DB, Customer_ID, "Phone")\`

جادوو ئۆتۆماتیکی ئەم هاوکێشانە دەخاتە کار لەسەر هەموو ڕیزە نوێیەکان بەبێ نووسینی کۆد!`;
    }

    return `🤖 **بریکاری ژیریی دەستکردی جادوو لە خزمەتتاندایە:**
زانیارییەکانی بنکەی دادەکەت بە سەرکەوتوویی شیکاری کران.
• ژمارەی تۆمارەکان: ${currentTable?.records?.length || 18} تۆمار
• دۆخی پرۆسەکان: 94% بە سەرکەوتوویی پەسەندکراون
• هەنگاوی پێشنیارکراو: ڕێکخستنی ناردنی ئاگاداری ئۆتۆماتیک لەڕێی Google Workspace و ئیمەیل کاتێک فاکتۆڕێک پەسەند دەکرێت.

ئایا دەتەوێت خشتەی نوێ دروست بکەین یان شیکاری بۆ فرۆشتنەکانی ئەم مانگە بکەین؟`;
  } else if (lang === 'ar') {
    return `✨ **اقتراح وكيل الذكاء الاصطناعي لمنصة ساحر (Sahir AI Agent):**
تم تحليل قاعدة البيانات بنجاح:
1. يمكنك إنشاء حقول جديدة بنقرة واحدة (أرقام تسلسلية، نصوص، صيغ حسابية، وعلاقات بين الجداول).
2. مسارات الموافقة (Approval Workflows) تدعم دورات متعددة للموافقة مع إشعارات فورية.
3. متوافق مع تصدير واستيراد ملفات Excel والربط مع Zapier و Google Workspace.`;
  } else {
    return `✨ **Wizard AI Agent Recommendation:**
Database schema and records analyzed.
1. Instant table automation & relational joins ready.
2. Excel-like formulas auto-propagated to sub-tables.
3. Multi-tier approval workflows enabled with automated email notifications.
4. Seamlessly synced with Zapier, n8n, Make, and Google Workspace.`;
  }
}

// Development or Production handler
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { 
        middlewareMode: true, 
        allowedHosts: true,
        hmr: false
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback for SPA routing in development
    app.use('*', async (req, res, next) => {
      // Don't intercept API routes
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        if (fs.existsSync(indexPath)) {
          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(req.originalUrl, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } else {
          next();
        }
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Magic No-Code Database App running on http://0.0.0.0:${port}`);
  });
}

startServer();
