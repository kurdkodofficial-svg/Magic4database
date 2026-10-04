import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  X, 
  AlertTriangle, 
  Ban, 
  Lock, 
  RefreshCw, 
  Globe, 
  Activity, 
  CheckCircle2, 
  Trash2, 
  Plus,
  Radio,
  Search,
  Filter,
  Play,
  Pause,
  Server,
  ArrowUpRight,
  Zap,
  Clock,
  Terminal,
  ChevronDown
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { SecurityEvent, ApiActivityLog } from '../types/database';

interface IPShieldConsoleProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const IPShieldConsole: React.FC<IPShieldConsoleProps> = ({
  currentLang,
  isOpen,
  onClose,
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'activity' | 'threats' | 'rules'>('activity');
  const [totalBlocked, setTotalBlocked] = useState(3);
  const [blockedList, setBlockedList] = useState<string[]>(['185.220.101.5', '45.154.255.89', '194.26.29.112']);
  
  // Threat events
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([
    {
      id: 'sec-1',
      ip: '185.220.101.5',
      country: 'DE',
      timestamp: '12 خولەک لەمەوبەر',
      threatType: 'SQL_INJECTION',
      status: 'BLOCKED',
      path: '/api/records?query=UNION+SELECT+ALL',
      severity: 'CRITICAL',
    },
    {
      id: 'sec-2',
      ip: '45.154.255.89',
      country: 'RU',
      timestamp: '35 خولەک لەمەوبەر',
      threatType: 'BRUTE_FORCE',
      status: 'BLOCKED',
      path: '/api/auth/login-attempt',
      severity: 'HIGH',
    },
    {
      id: 'sec-3',
      ip: '194.26.29.112',
      country: 'NL',
      timestamp: '1 کاتژمێر لەمەوبەر',
      threatType: 'RATE_LIMIT_EXCEEDED',
      status: 'BLOCKED',
      path: '/api/export/bulk-dump',
      severity: 'MEDIUM',
    },
  ]);

  // Recent API Activity Logs (Successful & Blocked)
  const [apiLogs, setApiLogs] = useState<ApiActivityLog[]>([
    {
      id: 'act-1',
      timestamp: new Date(Date.now() - 1000 * 8).toISOString(),
      method: 'GET',
      path: '/api/records?table=tbl-erp',
      clientIp: '192.168.1.45',
      country: 'LOCAL',
      statusCode: 200,
      status: 'SUCCESS',
      responseTimeMs: 0.8,
    },
    {
      id: 'act-2',
      timestamp: new Date(Date.now() - 1000 * 22).toISOString(),
      method: 'POST',
      path: '/api/audit-trail',
      clientIp: '192.168.1.18',
      country: 'LOCAL',
      statusCode: 201,
      status: 'SUCCESS',
      responseTimeMs: 1.4,
    },
    {
      id: 'act-3',
      timestamp: new Date(Date.now() - 1000 * 45).toISOString(),
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
      timestamp: new Date(Date.now() - 1000 * 80).toISOString(),
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
      timestamp: new Date(Date.now() - 1000 * 120).toISOString(),
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
      timestamp: new Date(Date.now() - 1000 * 165).toISOString(),
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
      timestamp: new Date(Date.now() - 1000 * 220).toISOString(),
      method: 'GET',
      path: '/api/export/bulk-dump',
      clientIp: '194.26.29.112',
      country: 'NL',
      statusCode: 403,
      status: 'BLOCKED',
      responseTimeMs: 0.4,
      threatType: 'RATE_LIMIT_EXCEEDED',
    },
  ]);

  // Activity filters & controls
  const [activityFilter, setActivityFilter] = useState<'all' | 'successful' | 'blocked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Manual block & attack simulation states
  const [inputIp, setInputIp] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [alertBanner, setAlertBanner] = useState<string | null>(null);

  // Fetch API activity from server
  const fetchApiActivity = async () => {
    try {
      const res = await fetch('/api/security/api-activity');
      if (res.ok) {
        const data = await res.json();
        if (data.logs && Array.isArray(data.logs) && data.logs.length > 0) {
          setApiLogs(data.logs);
        }
      }
    } catch {
      // Keep local in-memory fallback
    }
  };

  // Fetch system status
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/security/status');
      if (res.ok) {
        const data = await res.json();
        if (data.totalBlocked) setTotalBlocked(data.totalBlocked);
        if (data.blockedList) setBlockedList(data.blockedList);
        if (data.recentEvents) setRecentEvents(data.recentEvents);
      }
    } catch {}
  };

  // Initial load
  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      fetchApiActivity();
    }
  }, [isOpen]);

  // Real-time live polling interval
  useEffect(() => {
    if (!isOpen || !isLiveStreaming) return;

    const interval = setInterval(() => {
      fetchApiActivity();
    }, 3500);

    return () => clearInterval(interval);
  }, [isOpen, isLiveStreaming]);

  if (!isOpen) return null;

  // Filtered API logs
  const filteredApiLogs = apiLogs.filter((log) => {
    if (activityFilter === 'successful' && log.status !== 'SUCCESS') return false;
    if (activityFilter === 'blocked' && log.status !== 'BLOCKED') return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.path.toLowerCase().includes(q) ||
        log.clientIp.toLowerCase().includes(q) ||
        log.method.toLowerCase().includes(q) ||
        String(log.statusCode).includes(q) ||
        (log.threatType && log.threatType.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate live statistics
  const successCount = apiLogs.filter(l => l.status === 'SUCCESS').length;
  const blockedCount = apiLogs.filter(l => l.status === 'BLOCKED').length;
  const avgLatency = apiLogs.length > 0 
    ? Math.round((apiLogs.reduce((acc, l) => acc + l.responseTimeMs, 0) / apiLogs.length) * 10) / 10 
    : 0.5;

  // Simulate new live traffic request (successful or blocked)
  const handleSimulateLiveTraffic = async () => {
    setIsSimulatingTraffic(true);
    try {
      const res = await fetch('/api/security/simulate-traffic', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.activity) {
          setApiLogs(prev => [data.activity, ...prev]);
          if (data.activity.status === 'BLOCKED') {
            setTotalBlocked(prev => prev + 1);
            setAlertBanner(`داواکاری بلۆککراو لەلایەن IP Shield: ${data.activity.method} ${data.activity.path} (IP: ${data.activity.clientIp})`);
            setTimeout(() => setAlertBanner(null), 4500);
          }
        }
      } else {
        throw new Error('Fallback');
      }
    } catch {
      // Local generator fallback
      const isBlockedAttempt = Math.random() > 0.6;
      const fakeNew: ApiActivityLog = isBlockedAttempt
        ? {
            id: `act-${Date.now()}`,
            timestamp: new Date().toISOString(),
            method: 'GET',
            path: `/api/records?probe=malicious_${Math.floor(Math.random() * 900)}`,
            clientIp: `198.51.100.${Math.floor(10 + Math.random() * 80)}`,
            country: 'SUSPECT',
            statusCode: 403,
            status: 'BLOCKED',
            responseTimeMs: 0.3,
            threatType: 'PROBE_BLOCKED',
          }
        : {
            id: `act-${Date.now()}`,
            timestamp: new Date().toISOString(),
            method: Math.random() > 0.4 ? 'GET' : 'POST',
            path: Math.random() > 0.5 ? '/api/records?table=tbl-erp' : '/api/audit-trail',
            clientIp: '192.168.1.102',
            country: 'LOCAL',
            statusCode: 200,
            status: 'SUCCESS',
            responseTimeMs: Math.round((0.4 + Math.random() * 1.5) * 10) / 10,
          };

      setApiLogs(prev => [fakeNew, ...prev]);
      if (fakeNew.status === 'BLOCKED') {
        setTotalBlocked(prev => prev + 1);
        setAlertBanner(`داواکاری بلۆککراو لەلایەن IP Shield: ${fakeNew.method} ${fakeNew.path}`);
        setTimeout(() => setAlertBanner(null), 4500);
      }
    } finally {
      setIsSimulatingTraffic(false);
    }
  };

  // Clear API activity logs
  const handleClearApiLogs = async () => {
    try {
      await fetch('/api/security/api-activity/clear', { method: 'DELETE' });
    } catch {}
    setApiLogs([]);
  };

  // Simulate Attack
  const handleSimulateAttack = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/security/simulate-attack', { method: 'POST' });
      const data = await res.json();
      if (data.detectedThreat) {
        setRecentEvents(prev => [data.detectedThreat, ...prev]);
        setBlockedList(prev => [data.detectedThreat.ip, ...prev]);
        setTotalBlocked(prev => prev + 1);
        setAlertBanner(`هێرشی ${data.detectedThreat.threatType} لەلایەن IP: ${data.detectedThreat.ip} ڕاگیرا و دەستبەجێ بلۆککرا!`);
        setTimeout(() => setAlertBanner(null), 5000);
        fetchApiActivity();
      }
    } catch {
      const fakeIp = `192.0.2.${Math.floor(Math.random() * 250)}`;
      const newEv: SecurityEvent = {
        id: `sec-${Date.now()}`,
        ip: fakeIp,
        country: 'PROBE',
        timestamp: 'دەستبەجێ ئێستا',
        threatType: 'SQL_INJECTION',
        status: 'BLOCKED',
        path: '/api/database/records?id=1+OR+1=1',
        severity: 'CRITICAL',
      };
      setRecentEvents(prev => [newEv, ...prev]);
      setBlockedList(prev => [fakeIp, ...prev]);
      setTotalBlocked(prev => prev + 1);
      setAlertBanner(`هێرشی خۆکار ڕاگیرا لەلایەن IP: ${fakeIp}`);
      setTimeout(() => setAlertBanner(null), 5000);
    } finally {
      setIsSimulating(false);
    }
  };

  // Manual Block
  const handleManualBlock = async () => {
    if (!inputIp.trim()) return;
    try {
      await fetch('/api/security/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: inputIp.trim() }),
      });
    } catch {}
    
    setBlockedList(prev => [inputIp.trim(), ...prev]);
    setTotalBlocked(prev => prev + 1);
    setInputIp('');
    fetchApiActivity();
  };

  // Manual Unblock
  const handleUnblock = async (ipToUnblock: string) => {
    try {
      await fetch('/api/security/unblock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: ipToUnblock }),
      });
    } catch {}
    setBlockedList(prev => prev.filter(ip => ip !== ipToUnblock));
    setTotalBlocked(prev => Math.max(0, prev - 1));
  };

  const formatTimestamp = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl h-[720px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden"
        dir={currentLang === 'en' ? 'ltr' : 'rtl'}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {t.ipShieldTitle}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{t.shieldActive}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t.ipShieldSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Attack Alert Toast if triggered */}
        {alertBanner && (
          <div className="px-5 py-2.5 bg-rose-600 text-white text-xs font-bold flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{alertBanner}</span>
            </div>
            <button onClick={() => setAlertBanner(null)} className="text-white hover:opacity-80">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 pb-3">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">کۆی داواکارییەکان (API Requests)</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
                {apiLogs.length}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">داواکاری سەرکەوتوو (200 OK)</div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
                {successCount}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">هەوڵی بلۆککراو (Blocked)</div>
              <div className="text-2xl font-extrabold text-rose-400 font-mono mt-0.5">
                {totalBlocked}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Ban className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">تێکڕای خێرایی (Avg Latency)</div>
              <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-0.5">
                {avgLatency}ms
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 pt-1 bg-slate-950/40 text-xs font-semibold">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'activity'
                  ? 'border-indigo-500 text-indigo-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{t.recentApiActivity}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'activity' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {apiLogs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('threats')}
              className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'threats'
                  ? 'border-rose-500 text-rose-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t.liveThreatFeed}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'threats' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {recentEvents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'rules'
                  ? 'border-indigo-500 text-indigo-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Ban className="w-4 h-4" />
              <span>{currentLang === 'ku' ? 'لیستی ڕەش و بلۆککردن' : 'IP Blacklist & Rules'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-800 text-slate-400">
                {blockedList.length}
              </span>
            </button>
          </div>

          {/* Quick live indicator toggle */}
          {activeTab === 'activity' && (
            <div className="flex items-center gap-2 pb-2">
              <button
                onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  isLiveStreaming 
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400' 
                    : 'bg-slate-800 text-slate-400'
                }`}
                title={isLiveStreaming ? 'Pause live polling' : 'Resume live polling'}
              >
                {isLiveStreaming ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{t.autoRefresh}</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Paused</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* ======================================================== */}
          {/* TAB 1: RECENT API ACTIVITY LOG VIEWER                    */}
          {/* ======================================================== */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              
              {/* Controls & Filter Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                
                {/* Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <label htmlFor="activity-filter-select" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 shrink-0">
                    <Filter className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{currentLang === 'ku' ? 'فلتەری داواکارییەکان:' : currentLang === 'ar' ? 'تصفية الطلبات:' : 'Filter Requests:'}</span>
                  </label>
                  <div className="relative">
                    <select
                      id="activity-filter-select"
                      value={activityFilter}
                      onChange={(e) => setActivityFilter(e.target.value as 'all' | 'successful' | 'blocked')}
                      className={`appearance-none pl-7 pr-8 rtl:pr-7 rtl:pl-8 py-1.5 rounded-xl border text-xs font-bold focus:outline-none transition-all shadow-inner cursor-pointer ${
                        activityFilter === 'blocked'
                          ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                          : activityFilter === 'successful'
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-white hover:bg-slate-850 focus:border-indigo-500'
                      }`}
                    >
                      <option value="all" className="bg-slate-900 text-white py-1">
                        {currentLang === 'ku' ? `هەموو داواکارییەکان / All (${apiLogs.length})` : currentLang === 'ar' ? `كافة الطلبات / All (${apiLogs.length})` : `All Requests (${apiLogs.length})`}
                      </option>
                      <option value="blocked" className="bg-slate-900 text-rose-400 py-1 font-semibold">
                        {currentLang === 'ku' ? `داواکاری بلۆککراو / Blocked (${blockedCount})` : currentLang === 'ar' ? `الطلبات المحظورة / Blocked (${blockedCount})` : `Blocked Requests (${blockedCount})`}
                      </option>
                      <option value="successful" className="bg-slate-900 text-emerald-400 py-1 font-semibold">
                        {currentLang === 'ku' ? `داواکاری سەرکەوتوو / Successful (${successCount})` : currentLang === 'ar' ? `الطلبات الناجحة / Successful (${successCount})` : `Successful Requests (${successCount})`}
                      </option>
                    </select>
                    <ChevronDown className="absolute left-2 rtl:left-2 ltr:right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Status Quick Pills */}
                <div className="hidden lg:flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold gap-1">
                  <button
                    onClick={() => setActivityFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      activityFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{t.allRequests}</span>
                  </button>

                  <button
                    onClick={() => setActivityFilter('blocked')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                      activityFilter === 'blocked' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-rose-300'
                    }`}
                  >
                    <Ban className="w-3 h-3" />
                    <span>{t.blockedRequests}</span>
                  </button>

                  <button
                    onClick={() => setActivityFilter('successful')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                      activityFilter === 'successful' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t.successfulRequests}</span>
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative flex-1 min-w-[180px] max-w-xs">
                  <Search className="absolute right-3 rtl:right-3 ltr:left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={currentLang === 'ku' ? 'گەڕان لە Path, IP, Status...' : 'Filter by path, IP, code...'}
                    className="w-full pl-3 pr-8 rtl:pr-8 ltr:pl-8 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                {/* Actions: Simulate Live Traffic & Clear */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateLiveTraffic}
                    disabled={isSimulatingTraffic}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
                    title="Simulate realistic incoming API request"
                  >
                    <Zap className={`w-3.5 h-3.5 ${isSimulatingTraffic ? 'animate-spin' : ''}`} />
                    <span>{t.simulateTraffic}</span>
                  </button>

                  <button
                    onClick={async () => {
                      setIsRefreshing(true);
                      await fetchApiActivity();
                      setTimeout(() => setIsRefreshing(false), 500);
                    }}
                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                    title="Refresh logs"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
                  </button>

                  <button
                    onClick={handleClearApiLogs}
                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 border border-slate-800 transition-colors cursor-pointer"
                    title="Clear API activity log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* API Activity Log Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 shadow-inner">
                <table className="w-full text-xs text-right rtl:text-right ltr:text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 select-none">
                      <th className="p-3 w-28">دۆخ (Status)</th>
                      <th className="p-3 w-20">Method</th>
                      <th className="p-3">ئامانج / API Endpoint Path</th>
                      <th className="p-3 w-36">ناونیشانی Client IP</th>
                      <th className="p-3 w-24 text-center">خێرایی</th>
                      <th className="p-3 w-28 font-mono">کات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 font-mono">
                    {filteredApiLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                          {currentLang === 'ku' ? 'هیچ داواکارییەک لەم فلتەرەدا نەدۆزرایەوە.' : 'No API activity matching the current filter.'}
                        </td>
                      </tr>
                    ) : (
                      filteredApiLogs.map((log) => {
                        const isSuccess = log.status === 'SUCCESS';
                        const isBlocked = log.status === 'BLOCKED';

                        return (
                          <tr 
                            key={log.id} 
                            className={`transition-colors hover:bg-slate-850/50 ${
                              isBlocked ? 'bg-rose-950/10' : ''
                            }`}
                          >
                            {/* Status Badge */}
                            <td className="p-3">
                              {isSuccess ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>{log.statusCode} OK</span>
                                </span>
                              ) : isBlocked ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                  <Ban className="w-3 h-3 text-rose-400" />
                                  <span>{log.statusCode} BLOCKED</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                                  <span>{log.statusCode}</span>
                                </span>
                              )}
                            </td>

                            {/* HTTP Method Badge */}
                            <td className="p-3 font-bold">
                              <span 
                                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                  log.method === 'GET' 
                                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                    : log.method === 'POST'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : log.method === 'PUT'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {log.method}
                              </span>
                            </td>

                            {/* Path */}
                            <td className="p-3 font-sans">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-white text-xs font-medium">
                                  {log.path}
                                </span>
                                {log.threatType && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono border border-rose-500/30">
                                    {log.threatType}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Client IP & Origin */}
                            <td className="p-3 text-slate-300">
                              <div className="flex items-center gap-1.5">
                                <span>{log.clientIp}</span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  [{log.country}]
                                </span>
                              </div>
                            </td>

                            {/* Latency */}
                            <td className="p-3 text-center text-xs">
                              <span className={`font-mono ${
                                log.responseTimeMs < 1 ? 'text-emerald-400' : log.responseTimeMs < 3 ? 'text-cyan-400' : 'text-amber-400'
                              }`}>
                                {log.responseTimeMs}ms
                              </span>
                            </td>

                            {/* Timestamp */}
                            <td className="p-3 text-slate-500 text-[11px]">
                              {formatTimestamp(log.timestamp)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Real-time Stream Footer */}
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>
                    {currentLang === 'ku'
                      ? `پشکنەری ڕاستەوخۆ چالاکە: ${apiLogs.length} تۆمار، نوێکردنەوەی ئۆتۆماتیک کارایە.`
                      : `Live API Inspector active: streaming ${apiLogs.length} recent requests.`}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-emerald-400">Success: {Math.round((successCount / (apiLogs.length || 1)) * 100)}%</span>
                  <span className="text-rose-400">Blocked: {Math.round((blockedCount / (apiLogs.length || 1)) * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: THREAT DETECTION LOGS                             */}
          {/* ======================================================== */}
          {activeTab === 'threats' && (
            <div className="space-y-4">
              {/* Action Row: Simulate Attack */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    تاقیکردنەوەی بەرگری ڕاستەوخۆ (Interactive Defense Test)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    هێرشێکی ئەلیکترۆنی دەستکرد بنێرە تا شێوازی دەستبەجێ بلۆککردنی IP لەلایەن IP Shield ببینی.
                  </p>
                </div>

                <button
                  onClick={handleSimulateAttack}
                  disabled={isSimulating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{t.simulateAttack}</span>
                </button>
              </div>

              {/* Recent Threat Logs Feed Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 shadow-inner">
                <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                      <th className="p-3">ناونیشانی IP</th>
                      <th className="p-3">جۆری هەڕەشە (Threat Vector)</th>
                      <th className="p-3">ئامانج / Path</th>
                      <th className="p-3">دۆخی بەرگری</th>
                      <th className="p-3 font-mono">کات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 font-mono">
                    {recentEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-850/40">
                        <td className="p-3 text-white font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                          <span>{ev.ip}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            {ev.threatType}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 max-w-[200px] truncate" title={ev.path}>
                          {ev.path}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            AUTO-BLOCKED
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">
                          {ev.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: IP BLACKLIST & MANUAL CONTROL RULES               */}
          {/* ======================================================== */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              {/* Manual Block Form */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-white">
                  {currentLang === 'ku' ? 'بلۆککردنی دەستی ناونیشانی IP نوێ:' : 'Manually Block IP Address:'}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputIp}
                    onChange={(e) => setInputIp(e.target.value)}
                    placeholder={t.ipInputPlaceholder}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                  />
                  <button
                    onClick={handleManualBlock}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-colors cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.manualBlock}</span>
                  </button>
                </div>
              </div>

              {/* Blocked IP List Chips */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300">
                  {currentLang === 'ku' ? 'لیستی IPیە بلۆککراوەکانی ئێستا (Active Blacklist):' : 'Currently Quarantined IP Addresses:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {blockedList.map((ip) => (
                    <span
                      key={ip}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono shadow-sm"
                    >
                      <Ban className="w-3.5 h-3.5 text-rose-400" />
                      <span>{ip}</span>
                      <button
                        onClick={() => handleUnblock(ip)}
                        title="Unblock IP"
                        className="hover:text-white transition-colors cursor-pointer ml-1 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Deep Packet Inspection & Security Rules List */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300">
                  {currentLang === 'ku' ? 'ڕێساکانی بەرگری چالاک لە سێرڤەردا:' : 'Active Perimeter Firewall Rules:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">SQL Injection Deep Packet Inspection</span>
                    <span className="text-emerald-400 font-bold">Enabled</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">Adaptive Rate Limiter (120 req/min)</span>
                    <span className="text-emerald-400 font-bold">Enabled</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">Brute-force Auth Auto-Quarantine</span>
                    <span className="text-emerald-400 font-bold">Enabled</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">Known Malicious Tor / Proxy Filter</span>
                    <span className="text-emerald-400 font-bold">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
