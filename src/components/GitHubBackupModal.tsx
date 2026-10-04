import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Check, 
  Copy, 
  Terminal, 
  UploadCloud, 
  FileCode, 
  FolderGit2, 
  GitBranch, 
  Lock, 
  AlertCircle,
  Loader2,
  Download,
  Share2,
  CheckCircle2,
  FileSpreadsheet,
  Database,
  Code2
} from 'lucide-react';
import { DatabaseTable, DatabaseRecord } from '../types/database';
import { Language } from '../i18n/translations';
import { 
  exportTableToJson, 
  exportAllTablesToJson, 
  exportTableToCsv,
  generateSqlSchema,
  generateTypeScriptDefinitions,
  generateGitHubReadme,
  exportSourcePackage
} from '../utils/exportUtils';

interface GitHubBackupModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
  currentTable: DatabaseTable;
  allTables: DatabaseTable[];
  activeRecords: DatabaseRecord[];
  onAuditLog?: (action: string, details: string) => void;
}

export const GitHubBackupModal: React.FC<GitHubBackupModalProps> = ({
  currentLang,
  isOpen,
  onClose,
  currentTable,
  allTables,
  activeRecords,
  onAuditLog,
}) => {
  const [activeTab, setActiveTab] = useState<'api' | 'cli' | 'gist'>('api');
  
  // GitHub Direct Push Form State
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('jadoo_gh_token') || '');
  const [repoPath, setRepoPath] = useState(() => localStorage.getItem('jadoo_gh_repo') || '');
  const [branch, setBranch] = useState('main');
  const [filePath, setFilePath] = useState(`data/${currentTable.id}_records.json`);
  const [backupScope, setBackupScope] = useState<'current' | 'csv' | 'all' | 'source' | 'sql'>('current');
  const [commitMessage, setCommitMessage] = useState(`Backup: ${currentTable.name} records & schema from Jadoo Studio`);
  
  // Status states
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccessUrl, setPushSuccessUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopiedJson, setIsCopiedJson] = useState(false);
  const [isCopiedCli, setIsCopiedCli] = useState(false);

  if (!isOpen) return null;

  // Payload Generator for GitHub commit or copy
  const getPayloadString = () => {
    if (backupScope === 'sql') {
      return generateSqlSchema(allTables);
    }
    if (backupScope === 'source') {
      return generateGitHubReadme(allTables, currentTable);
    }
    if (backupScope === 'csv') {
      const headers = [
        'Record #',
        ...currentTable.fields.map(f => `"${(f.name || f.nameKu || f.id).replace(/"/g, '""')}"`),
        'Approval Status'
      ];
      const rows = activeRecords.map(r => {
        const fieldValues = currentTable.fields.map(f => `"${String(r[f.id] ?? '').replace(/"/g, '""')}"`);
        return [`"${r.recordNumber}"`, ...fieldValues, `"${r.approvalStatus}"`].join(',');
      });
      return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    }
    if (backupScope === 'all') {
      return JSON.stringify({
        schemaVersion: '2.5.0',
        platform: 'Wizard (Jadoo) Database Studio',
        backupType: 'FULL_WORKSPACE_BACKUP',
        exportedAt: new Date().toISOString(),
        totalTables: allTables.length,
        totalRecords: allTables.reduce((acc, t) => acc + t.records.length, 0),
        tables: allTables,
      }, null, 2);
    }
    return JSON.stringify({
      schemaVersion: '2.5.0',
      platform: 'Wizard (Jadoo) Database Studio',
      exportedAt: new Date().toISOString(),
      table: {
        id: currentTable.id,
        name: currentTable.name,
        nameKu: currentTable.nameKu,
        nameAr: currentTable.nameAr,
        category: currentTable.category,
        recordsCount: activeRecords.length,
      },
      fields: currentTable.fields,
      records: activeRecords,
    }, null, 2);
  };

  // Push to GitHub API
  const handlePushToGitHub = async () => {
    if (!githubToken.trim()) {
      setErrorMessage(
        currentLang === 'ku'
          ? 'تکایە Personal Access Token (PAT)ی GitHub بنووسە.'
          : currentLang === 'ar'
          ? 'يرجى إدخال رمز الوصول الشخصي (Personal Access Token) الخاص بـ GitHub.'
          : 'Please provide a valid GitHub Personal Access Token (PAT).'
      );
      return;
    }

    const cleanRepo = repoPath.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    if (!cleanRepo || !cleanRepo.includes('/')) {
      setErrorMessage(
        currentLang === 'ku'
          ? 'ناوی کۆگای GitHub دەبێت بە شێوازی username/repo بێت (وەک: octocat/my-database).'
          : currentLang === 'ar'
          ? 'اسم المستودع يجب أن يكون بصيغة username/repo (مثال: octocat/my-database).'
          : 'Repository name must be in "owner/repo" format (e.g. octocat/my-database).'
      );
      return;
    }

    setErrorMessage(null);
    setPushSuccessUrl(null);
    setIsPushing(true);

    try {
      // Save for user convenience
      localStorage.setItem('jadoo_gh_token', githubToken.trim());
      localStorage.setItem('jadoo_gh_repo', cleanRepo);

      const contentString = getPayloadString();
      // Base64 encoding compatible with UTF-8
      const encodedContent = btoa(unescape(encodeURIComponent(contentString)));
      const apiUrl = `https://api.github.com/repos/${cleanRepo}/contents/${filePath.trim()}`;

      // 1. Check if file already exists to get its SHA
      let sha: string | undefined = undefined;
      const getFileRes = await fetch(`${apiUrl}?ref=${branch.trim()}`, {
        headers: {
          Authorization: `Bearer ${githubToken.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      }

      // 2. Put / Commit file to GitHub
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubToken.trim()}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage || `Update ${filePath} from Jadoo Studio`,
          content: encodedContent,
          branch: branch.trim(),
          ...(sha ? { sha } : {}),
        }),
      });

      if (!putRes.ok) {
        const errorJson = await putRes.json().catch(() => ({}));
        throw new Error(errorJson.message || `GitHub API error (${putRes.status})`);
      }

      const resData = await putRes.json();
      const htmlUrl = resData.content?.html_url || `https://github.com/${cleanRepo}/blob/${branch}/${filePath}`;
      setPushSuccessUrl(htmlUrl);

      if (onAuditLog) {
        onAuditLog('GITHUB_BACKUP', `Pushed ${backupScope === 'all' ? 'all tables' : currentTable.name} to GitHub repository ${cleanRepo} (${branch})`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to push file to GitHub. Please check your token permissions.');
    } finally {
      setIsPushing(false);
    }
  };

  // Copy JSON Code
  const handleCopyJson = () => {
    navigator.clipboard.writeText(getPayloadString());
    setIsCopiedJson(true);
    setTimeout(() => setIsCopiedJson(false), 2500);
  };

  // Copy Terminal Commands
  const terminalCommands = `# 1. Initialize git directory
git init

# 2. Save exported database file as ${filePath}
# (Save your exported JSON file into this folder)

# 3. Add and commit database schema & records
git add ${filePath}
git commit -m "${commitMessage}"

# 4. Set main branch and remote
git branch -M ${branch || 'main'}
git remote add origin https://github.com/${repoPath.trim() || 'USERNAME/REPOSITORY'}.git

# 5. Push to GitHub
git push -u origin ${branch || 'main'}`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(terminalCommands);
    setIsCopiedCli(true);
    setTimeout(() => setIsCopiedCli(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir={currentLang === 'en' ? 'ltr' : 'rtl'}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white shadow-md">
              <FolderGit2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>
                  {currentLang === 'ku'
                    ? 'پاراستنی سۆرس و داتا لە GitHub'
                    : currentLang === 'ar'
                    ? 'حفظ الكود وقواعد البيانات في GitHub'
                    : 'Save Source & Database to GitHub'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  GitHub Sync
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {currentLang === 'ku'
                  ? 'هەناردەکردن و پاشەکەوتکردنی ڕاستەوخۆی خشتە و کۆدەکان بۆ ناو کۆگای GitHub'
                  : currentLang === 'ar'
                  ? 'تصدير ومزامنة الجداول والبيانات مباشرة إلى مستودع GitHub الخاص بك'
                  : 'Directly commit and backup relational schemas & active records to your GitHub repository'}
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-5 pt-3 gap-2 bg-slate-950/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('api')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'api'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>
              {currentLang === 'ku'
                ? 'پاشەکەوتی ڕاستەوخۆ (GitHub API)'
                : currentLang === 'ar'
                ? 'مزامنة مباشرة (GitHub API)'
                : 'Direct Push (GitHub API)'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'cli'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>
              {currentLang === 'ku'
                ? 'فەرمانەکانی Git CLI'
                : currentLang === 'ar'
                ? 'أوامر Git للطرفية'
                : 'Terminal Git Commands'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gist')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'gist'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>
              {currentLang === 'ku'
                ? 'کۆپی کۆد و GitHub Gist'
                : currentLang === 'ar'
                ? 'نسخ ومشاركة عبر Gist'
                : 'Quick Gist & JSON Code'}
            </span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: Direct GitHub Push API */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              {/* Scope Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {currentLang === 'ku' ? 'چی بنێردرێت بۆ کۆگای GitHub؟ (Data & Source Scope):' : 'What to commit & backup to GitHub?'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setBackupScope('current');
                      setFilePath(`data/${currentTable.id}_records.json`);
                      setCommitMessage(`Backup: ${currentTable.name} records from Jadoo Studio`);
                    }}
                    className={`px-2.5 py-2 rounded-xl font-bold transition-all text-center cursor-pointer ${
                      backupScope === 'current'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{currentLang === 'ku' ? `خشتەی چالاک (${activeRecords.length})` : `Active Table JSON`}</span>
                    <span className="block text-[10px] font-mono opacity-80">.JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBackupScope('csv');
                      setFilePath(`data/${currentTable.id}_records.csv`);
                      setCommitMessage(`Export: ${currentTable.name} active records as CSV`);
                    }}
                    className={`px-2.5 py-2 rounded-xl font-bold transition-all text-center cursor-pointer ${
                      backupScope === 'csv'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{currentLang === 'ku' ? 'تۆمارەکان بە CSV' : 'Active Records CSV'}</span>
                    <span className="block text-[10px] font-mono opacity-80">.CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBackupScope('all');
                      setFilePath('data/jadoo_workspace_backup.json');
                      setCommitMessage('Backup: Complete Jadoo Database Workspace (All 4 Tables)');
                    }}
                    className={`px-2.5 py-2 rounded-xl font-bold transition-all text-center cursor-pointer ${
                      backupScope === 'all'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{currentLang === 'ku' ? 'تەواوی داتابەیس' : 'Full 4 Tables'}</span>
                    <span className="block text-[10px] font-mono opacity-80">.JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBackupScope('sql');
                      setFilePath('schema.sql');
                      setCommitMessage('Add SQL DDL Schema and Seed Records for PostgreSQL/SQLite');
                    }}
                    className={`px-2.5 py-2 rounded-xl font-bold transition-all text-center cursor-pointer ${
                      backupScope === 'sql'
                        ? 'bg-cyan-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{currentLang === 'ku' ? 'سکیما و کۆدی SQL' : 'SQL Schema DDL'}</span>
                    <span className="block text-[10px] font-mono opacity-80">.SQL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBackupScope('source');
                      setFilePath('README.md');
                      setCommitMessage('Initialize GitHub Repository Documentation from Jadoo Studio');
                    }}
                    className={`px-2.5 py-2 rounded-xl font-bold transition-all text-center cursor-pointer sm:col-span-2 ${
                      backupScope === 'source'
                        ? 'bg-amber-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{currentLang === 'ku' ? 'دۆکیومێنت و سۆرسی پڕۆژە (README.md)' : 'Repo Documentation & Source'}</span>
                    <span className="block text-[10px] font-mono opacity-80">.MD</span>
                  </button>
                </div>
              </div>

              {/* Input: GitHub Token */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>GitHub Personal Access Token (PAT)</span>
                  </label>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=Jadoo%20Studio%20Database%20Backup"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{currentLang === 'ku' ? 'دروستکردنی Token لە GitHub' : 'Generate Token on GitHub'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-500">
                  {currentLang === 'ku'
                    ? 'پێویستی بە مۆڵەتی "repo" هەیە بۆ خەزنکردنی فایلەکان. تۆکنەکە بە پارێزراوی لەناو وێبگەڕەکەتدا دەمێنێتەوە.'
                    : 'Requires "repo" scope to commit files. The token remains private in your local browser.'}
                </p>
              </div>

              {/* Grid: Repo & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {currentLang === 'ku' ? 'ناوی کۆگا (Owner/Repo)' : 'Repository (Owner/Repo)'}
                  </label>
                  <input
                    type="text"
                    value={repoPath}
                    onChange={(e) => setRepoPath(e.target.value)}
                    placeholder="username/my-database-repo"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{currentLang === 'ku' ? 'لق (Branch)' : 'Branch'}</span>
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="main"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Input: Target Path in Repo */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {currentLang === 'ku' ? 'شوێن و ناوی فایل لەناو GitHub (File Path)' : 'File Path in Repository'}
                </label>
                <input
                  type="text"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  placeholder="data/records.json"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Commit Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {currentLang === 'ku' ? 'پەیامی گۆڕانکاری (Commit Message)' : 'Commit Message'}
                </label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Result */}
              {pushSuccessUrl && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>
                      {currentLang === 'ku'
                        ? 'سۆرس و داتاکان بە سەرکەوتوویی لە کۆگای GitHub پاشەکەوت کران!'
                        : 'Source and database records successfully committed to GitHub!'}
                    </span>
                  </div>
                  <div className="pt-1">
                    <a
                      href={pushSuccessUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 text-white font-mono text-xs font-bold transition-colors"
                    >
                      <span>{currentLang === 'ku' ? 'بینینی فایل لە GitHub' : 'View file on GitHub'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Action Buttons: Download options & Push */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Download CSV */}
                  <button
                    type="button"
                    onClick={() => exportTableToCsv(currentTable, activeRecords)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                    title="Download active records as CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>

                  {/* Download JSON */}
                  <button
                    type="button"
                    onClick={() => {
                      if (backupScope === 'all') {
                        exportAllTablesToJson(allTables);
                      } else {
                        exportTableToJson(currentTable, activeRecords);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
                    title="Download records as JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>JSON</span>
                  </button>

                  {/* Download Source Package */}
                  <button
                    type="button"
                    onClick={() => exportSourcePackage(allTables, currentTable)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-purple-300 border border-purple-500/30 transition-colors cursor-pointer"
                    title="Download full project repository source bundle (SQL + TS + README + JSON)"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{currentLang === 'ku' ? 'سۆرسی پڕۆژە (Source)' : 'Source Bundle'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handlePushToGitHub}
                  disabled={isPushing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPushing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{currentLang === 'ku' ? 'خەریکی ناردن بۆ GitHub...' : 'Pushing to GitHub...'}</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>{currentLang === 'ku' ? 'بپارێزە لە GitHub' : 'Commit & Push to GitHub'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Git CLI Commands */}
          {activeTab === 'cli' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300">
                {currentLang === 'ku'
                  ? 'دەتوانی فایلی JSON دابەزێنیت و بەم فەرمانانە ڕاستەوخۆ لە ڕێگەی Terminal یاخود Git Bash بینێریت بۆ کۆگای GitHub:'
                  : 'Download the JSON data and execute the following Git commands in your terminal to push your active schema and records directly to GitHub:'}
              </div>

              <div className="relative">
                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed text-left rtl:text-left">
                  {terminalCommands}
                </pre>
                <button
                  onClick={handleCopyCli}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isCopiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopiedCli ? (currentLang === 'ku' ? 'کۆپیکرا' : 'Copied') : (currentLang === 'ku' ? 'کۆپیکردنی فەرمانەکان' : 'Copy Commands')}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => exportTableToJson(currentTable, activeRecords)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{currentLang === 'ku' ? '١. دابەزاندنی فایلی JSON' : '1. Download JSON File'}</span>
                </button>

                <a
                  href="https://github.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors inline-flex"
                >
                  <span>{currentLang === 'ku' ? '٢. دروستکردنی کۆگای نوێ لە GitHub' : '2. Create New GitHub Repo'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: Quick Gist & JSON Code */}
          {activeTab === 'gist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  {currentLang === 'ku'
                    ? 'پێشبینینی کۆدی JSON بۆ دروستکردنی خێرای GitHub Gist:'
                    : 'Preview formatted JSON payload to create an instant public or secret GitHub Gist:'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isCopiedJson ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopiedJson ? (currentLang === 'ku' ? 'کۆپیکرا!' : 'Copied!') : (currentLang === 'ku' ? 'کۆپیکردنی هەموو داتاکە' : 'Copy All JSON')}</span>
                  </button>
                  <a
                    href="https://gist.github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors inline-flex"
                  >
                    <span>Gist.github.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="relative max-h-64 overflow-y-auto rounded-2xl bg-slate-950 border border-slate-800 p-3 text-left rtl:text-left font-mono text-[11px] text-amber-300">
                <pre>{getPayloadString()}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              {currentLang === 'ku' 
                ? `خشتەی ئێستا: ${currentTable.nameKu} (${activeRecords.length} تۆمار)` 
                : `Active Table: ${currentTable.name} (${activeRecords.length} records)`}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {currentLang === 'ku' ? 'داخستن' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
