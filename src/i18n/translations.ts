export type Language = 'ku' | 'en' | 'ar';

export interface Translations {
  brandName: string;
  brandTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBadge: string;
  ctaLaunchStudio: string;
  ctaExploreTemplates: string;
  ctaLearnMore: string;
  ctaLiveDemo: string;
  officialSiteNotice: string;
  officialSiteBtn: string;

  // Nav
  navFeatures: string;
  navTemplates: string;
  navAiAgent: string;
  navSecurity: string;
  navIntegrations: string;
  navComparison: string;
  navMobile: string;
  navStudio: string;

  // Features Section
  featuresTitle: string;
  featuresSubtitle: string;
  featAiAgentTitle: string;
  featAiAgentDesc: string;
  featSimplicityTitle: string;
  featSimplicityDesc: string;
  featErpCrmTitle: string;
  featErpCrmDesc: string;
  featAnalyticsTitle: string;
  featAnalyticsDesc: string;
  featIntegrationsTitle: string;
  featIntegrationsDesc: string;
  featMultilingualTitle: string;
  featMultilingualDesc: string;
  featSeoTitle: string;
  featSeoDesc: string;
  featIpShieldTitle: string;
  featIpShieldDesc: string;

  // Templates Section
  templatesTitle: string;
  templatesSubtitle: string;
  tplErpTitle: string;
  tplErpDesc: string;
  tplCrmTitle: string;
  tplCrmDesc: string;
  tplBomTitle: string;
  tplBomDesc: string;
  tplProjectsTitle: string;
  tplProjectsDesc: string;
  openInStudio: string;

  // Why Magic Section
  whyTitle: string;
  whySubtitle: string;
  whyCostTitle: string;
  whyCostDesc: string;
  whySpeedTitle: string;
  whySpeedDesc: string;
  whySecurityTitle: string;
  whySecurityDesc: string;
  vsSalesforce: string;
  vsExcel: string;
  vsMagic: string;

  // Studio / Database Workspace
  studioTitle: string;
  studioSubtitle: string;
  viewSheet: string;
  viewGantt: string;
  viewPivot: string;
  viewApprovals: string;
  viewAuditLog: string;
  addRow: string;
  addField: string;
  exportCsv: string;
  exportJson: string;
  exportPdf: string;
  exportFullBackup: string;
  saveToGithub: string;
  githubBackupDesc: string;
  exportData: string;
  searchPlaceholder: string;
  recordsCount: string;
  recordDetails: string;
  approvalStatus: string;
  subTableTitle: string;
  submitApproval: string;
  approve: string;
  reject: string;
  approvedBadge: string;
  pendingBadge: string;
  draftBadge: string;
  rejectedBadge: string;
  historyLog: string;
  aiAssistantBtn: string;

  // AI Agent Modal
  aiModalTitle: string;
  aiModalSubtitle: string;
  aiPromptPlaceholder: string;
  aiSend: string;
  aiSuggestedPrompts: string;
  aiApplySchema: string;

  // IP Shield Console
  ipShieldTitle: string;
  ipShieldSubtitle: string;
  ipBlockedCount: string;
  simulateAttack: string;
  manualBlock: string;
  ipInputPlaceholder: string;
  liveThreatFeed: string;
  shieldActive: string;
  recentApiActivity: string;
  allRequests: string;
  successfulRequests: string;
  blockedRequests: string;
  simulateTraffic: string;
  autoRefresh: string;

  // Mobile App
  mobileTitle: string;
  mobileSubtitle: string;
  downloadIos: string;
  downloadAndroid: string;
  availableOnStores: string;

  // SEO
  seoModalTitle: string;
  seoGooglePreview: string;
  seoSchemaLd: string;
  seoCopySnippet: string;

  // PWA / App Install
  installAsApp: string;
  installAppDesc: string;
  installAppModalTitle: string;
  installAppBtn: string;
  installIosTitle: string;
  installIosStep1: string;
  installIosStep2: string;
  installDesktopTitle: string;
  installDesktopDesc: string;
  appAlreadyInstalled: string;
  offlineNotice: string;

  // Footer
  footerRights: string;
  footerAbout: string;
  footerKurdishTech: string;
}

export const translations: Record<Language, Translations> = {
  ku: {
    brandName: 'جادوو (Jadoo)',
    brandTagline: 'باشترین بنکەی دروستکردنی ماڵپەڕ و داتای بێکۆد',
    heroHeadline: 'باشترین بنکەی دروستکردنی ماڵپەڕ و داتای بێکۆد',
    heroSubheadline: 'تەواو بەستراوەتەوە لەگەڵ بریکاری ژیریی دەستکرد (AI Agent) - تەنها کاری دروستکردنی داتا نەبێت، بەڵکو دروستکردنی ماڵپەڕ و پرۆسەکانی کارکردنە بەبێ نووسینی هیچ کۆدێک.',
    heroBadge: 'نەوەی نوێی تەکنەلۆژیای داتابەیس و ماڵپەڕساز • جێگرەوەی ژیری Salesforce و سیستەمە گرانبەهاکان',
    ctaLaunchStudio: 'دەستپێکردن و دروستکردنی داتابەیس',
    ctaExploreTemplates: 'بینینی قاڵبە ئامادەکراوەکان',
    ctaLearnMore: 'زانیاری زیاتر',
    ctaLiveDemo: 'تاقیکردنەوەی ڕاستەوخۆ',
    officialSiteNotice: 'پلاتفۆرمی فەرمی و پێشکەوتووی جادوو (Jadoo No-Code Platform)',
    officialSiteBtn: 'ماڵپەڕی فەرمی جادوو (Jadoo)',

    navFeatures: 'تایبەتمەندییەکان',
    navTemplates: 'قاڵبە ئامادەکراوەکان',
    navAiAgent: 'بریکاری ژیریی دەستکرد (AI Agent)',
    navSecurity: 'پاراستن و IP Shield',
    navIntegrations: 'بەستنەوەکان',
    navComparison: 'بۆچی جادوو؟',
    navMobile: 'ئەپڵیکەیشن',
    navStudio: 'ستۆدیۆی کار',

    featuresTitle: 'تایبەتمەندییە سەرەکییەکانی جادوو (Jadoo)',
    featuresSubtitle: 'هەموو ئەو کەرەستانەی پێویستتن بۆ بەڕێوەبردنی تەواوی پرۆسەکان لە یەک شوێندا بەبێ نووسینی کۆد.',
    featAiAgentTitle: 'بریکاری ژیریی دەستکرد (AI Agent)',
    featAiAgentDesc: 'بەبێ پێویستی بە ڕێکخستنی ئاڵۆز، ڕاستەوخۆ لەناو بنکەی دادەکەت کاردەکات؛ خشتە، هاوکێشە، شیکاری و بڕیاردان ئۆتۆماتیک دەکات.',
    featSimplicityTitle: 'سادەیی وەک ئێکسڵ (Excel-like)',
    featSimplicityDesc: 'دروستکردنی خشتە و سیستەم بە شێوازی هاوشێوەی Excel بەبێ نووسینی هیچ کۆدێک؛ سادە بۆ بەکارهێنەر، بەهێز وەک ڕێژەیین.',
    featErpCrmTitle: 'سیستەمی ERP و CRM',
    featErpCrmDesc: 'ڕابطەی نێوان خشتەکان، ناردنی داواکاری، بڕیاردان و ڕەزامەندی چەند قۆناغی (Multi-tier Approval Workflow).',
    featAnalyticsTitle: 'ڕاپۆرت، گانت چارت و پێڤۆت',
    featAnalyticsDesc: 'دروستکردنی گانت چارت (Gantt Chart)، پێڤۆت تەیبڵ (Pivot Table) و کاتژمێری ئەلیکترۆنی بۆ شیکاری وردی ژمارەکان.',
    featIntegrationsTitle: 'بەستنەوە بە بەڕێوەبەرایەتییەکان',
    featIntegrationsDesc: 'گونجاو و تەواو هاوئاهەنگ لەگەڵ Google Workspace, Outlook, Zapier, Make و n8n لەڕێگەی Webhook و API.',
    featMultilingualTitle: 'پشتیوانی سێ زمان (Multi-lingual)',
    featMultilingualDesc: 'بەردەستبوونی تەواوی ڕووکاری سیستەمەکە بە هەرسێ زمانی کوردی (سۆرانی)، ئینگلیزی و عەرەبی بە دیزاینی ڕەسەنی RTL و LTR.',
    featSeoTitle: 'بەهێزکردنی بزوێنەری گەڕان (SEO)',
    featSeoDesc: 'باشترکردنی دەرکەوتنی ماڵپەڕ و ناوەڕۆکەکان لە موتورەکانی گەڕاندا بە کلیلەوشەکان، تاگە کۆمەڵایەتییەکان و Schema.org JSON-LD.',
    featIpShieldTitle: 'پاراستن و بلۆککردنی IP',
    featIpShieldDesc: 'ئاسایشی بەرز و پاراستنی داتابەیس لەڕێگەی بلۆککردنی خۆکارۆکی ئەو IPیانەی هەوڵی هاککردن یان هێرشی ئەلیکترۆنی دەدەن.',

    templatesTitle: 'سیستەم و قاڵبە ئامادەکراوەکان (Templates)',
    templatesSubtitle: 'دەتوانیت بە یەک کلیک ئەم سیستەمە دەوڵەمەندانە کارا بکەیت و دەستبەجێ بەکاریان بهێنیت.',
    tplErpTitle: 'بەڕێوەبردنی سەرچاوەی کار (ERP)',
    tplErpDesc: 'پرۆسەکانی فرۆشتن، کڕین، کۆگا، فاکتۆڕ، خشتەی ژێرەوەی بابەتەکان (Line Items) و ژمێریاری.',
    tplCrmTitle: 'پەیوەندی لەگەڵ کڕیاران (CRM)',
    tplCrmDesc: 'بەدواداچوون بۆ کڕیارە نوێیەکان، دەرفەتەکانی فرۆشتن (Deals)، قۆناغەکانی پایپلاین و پێشبینی داهات.',
    tplBomTitle: 'بەڕێوەبردنی بەرهەمهێنان و کۆگا (BOM)',
    tplBomDesc: 'پرۆسەی دروستکردن و لیستەی کەرەستە سەرەتاییەکان (Bill of Materials) و بەدواداچوونی باچەکان.',
    tplProjectsTitle: 'پڕۆژە و کارەکان (Projects & Tasks)',
    tplProjectsDesc: 'دابەشکردنی ئەرکەکان، بەدواداچوون بۆ کات (Time Tracking) و نەخشەی زەمەنی گانت چارت.',
    openInStudio: 'کردنەوە لە ستۆدیۆی جادوودا',

    whyTitle: 'بۆچی جادوو (Jadoo)؟',
    whySubtitle: 'جیاوازییە گەورەکانی نێوان جادوو و سیستەمە باوەکانی تری جیهان.',
    whyCostTitle: 'کەمکردنەوەی تێچوو (Cost Reduction)',
    whyCostDesc: 'جێگرەوەیەکی زۆر بەهێز و کەم تێچوو بۆ سیستەمە گرانبەهاکانی وەک Salesforce و SAP؛ پێویست بە مانگانەی خەیاڵی ناکات.',
    whySpeedTitle: 'خێرایی لە جێبەجێکردن (Rapid Deployment)',
    whySpeedDesc: 'دروستکردنی سیستەمی تەواوی کار لە چەند ڕۆژێک یان چەند کاتژمێرێکدا نەک چەندین مانگ و ساڵ.',
    whySecurityTitle: 'ئاسایشی بەرز و تۆماری گۆڕانکاری',
    whySecurityDesc: 'پاراستنی زانیارییەکان، تۆماری وردی گۆڕانکارییەکان (History Log) و پاراستن لە هێرشی ئەلیکترۆنی بە IP Shield.',
    vsSalesforce: 'Salesforce / SAP',
    vsExcel: 'ئێکسڵی ئاسایی',
    vsMagic: 'جادوو (Jadoo)',

    studioTitle: 'ستۆدیۆی کاری جادوو',
    studioSubtitle: 'بەڕێوەبردن، دەستکاریکردنی ڕاستەوخۆ، گانت چارت، و پرۆسەی ڕەزامەندی',
    viewSheet: 'خشتەی سەرەکی (Sheet Grid)',
    viewGantt: 'گانت چارت (Gantt Chart)',
    viewPivot: 'پێڤۆت تەیبڵ و شیکاری (Pivot Analytics)',
    viewApprovals: 'پرۆسەی ڕەزامەندی (Approval Board)',
    viewAuditLog: 'تۆماری وردبینی (Audit Trail)',
    addRow: 'تۆماری نوێ (Add Row)',
    addField: 'زیادکردنی خانە (Add Column)',
    exportCsv: 'دابەزاندنی CSV',
    exportJson: 'دابەزاندنی JSON (Export JSON)',
    exportPdf: 'دابەزاندنی بەڵگەنامەی PDF',
    exportFullBackup: 'پاڵپشتی تەواوی داتابەیس (JSON Backup)',
    saveToGithub: 'پاراستنی سۆرس لە گیتهەب (GitHub)',
    githubBackupDesc: 'پاشەکەوتکردن و بەستنەوەی ڕاستەوخۆ بە کۆگای GitHub',
    exportData: 'هەناردەکردنی داتا (Export)',
    searchPlaceholder: 'گەڕان لەناو تۆمارەکاندا...',
    recordsCount: 'تۆمار',
    recordDetails: 'وردەکارییەکانی تۆمار',
    approvalStatus: 'دۆخی ڕەزامەندی',
    subTableTitle: 'خشتەی بەستراوەی ژێرەوە (Sub-Table Line Items)',
    submitApproval: 'ناردن بۆ پەسەندکردن',
    approve: 'پەسەندکردن (Approve)',
    reject: 'ڕەتکردنەوە (Reject)',
    approvedBadge: 'پەسەندکراوە',
    pendingBadge: 'لە چاوەڕوانیدایە',
    draftBadge: 'ڕەشنووس',
    rejectedBadge: 'ڕەتکراوەتەوە',
    historyLog: 'مێژووی گۆڕانکارییەکان (Audit Trail)',
    aiAssistantBtn: 'بریکاری ژیریی دەستکرد',

    aiModalTitle: 'بریکاری ژیریی دەستکردی جادوو (Jadoo AI Agent)',
    aiModalSubtitle: 'ڕاستەوخۆ لەناو بنکەی دادەکەت کاردەکات بەبێ پێویستی بە ڕێکخستنی ئاڵۆز',
    aiPromptPlaceholder: 'داواکارییەکەت بنووسە... (بۆ نموونە: هاوکێشەی حسابکردنی باج دروستبکە یان خشتەیەکی نوێ پێشنیاربکە)',
    aiSend: 'ناردن بۆ بریکاری ژیریی دەستکرد',
    aiSuggestedPrompts: 'پێشنیارە خێراکان:',
    aiApplySchema: 'جێبەجێکردنی ئەم خشتەیە لە ستۆدیۆ',

    ipShieldTitle: 'پاراستنی ئاسایش و بلۆککردنی IP (Jadoo IP Shield)',
    ipShieldSubtitle: 'سیستەمی پێشکەوتووی بەرگری بۆ بلۆککردنی خۆکارۆکی ئەو IPیانەی هەوڵی هاککردن دەدەن',
    ipBlockedCount: 'IP بلۆککراون',
    simulateAttack: 'تاقیکردنەوەی هێرشی ئەلیکترۆنی (Simulate Threat)',
    manualBlock: 'بلۆککردنی دەستی',
    ipInputPlaceholder: 'ناونیشانی IP (بۆ نموونە: 185.220.101.5)',
    liveThreatFeed: 'تۆماری ڕاستەوخۆی هەڕەشەکان و بلۆککردن',
    shieldActive: 'بەرگری چالاکە (Active Protection)',
    recentApiActivity: 'تۆماری چالاکیەکانی ئەم دواییەی API (Recent API Activity)',
    allRequests: 'هەموو داواکارییەکان',
    successfulRequests: 'سەرکەوتوو (200 OK)',
    blockedRequests: 'بلۆککراو (403 Forbidden)',
    simulateTraffic: 'ناردنی داواکاری ڕاستەوخۆ',
    autoRefresh: 'پەخشی ڕاستەوخۆ (Live Stream)',

    mobileTitle: 'بەدەستگەیشتنی ڕاستەوخۆ لە مۆبایل و تابلێت',
    mobileSubtitle: 'بەبێ پێویستی بە دابەزاندن لە ئەپ ستۆر یان گووگڵ پلەی، ڕاستەوخۆ لە هەموو مۆبایل و تابلێتێک کار دەکات.',
    downloadIos: 'کردنەوە لە Safari / iOS',
    downloadAndroid: 'کردنەوە لە Chrome / Android',
    availableOnStores: 'کارکردنی ڕاستەوخۆ بەبێ پێویستی بە دابەزاندن لە ستۆر',

    seoModalTitle: 'پشکنەری بەهێزکردنی مەکینەکانی گەڕان (SEO Inspector)',
    seoGooglePreview: 'دەرکەوتن لە گووگڵ (Google Search Preview)',
    seoSchemaLd: 'کۆدی پێکهاتەی داتا (Schema.org JSON-LD)',
    seoCopySnippet: 'کۆپیکردنی تاگەکان',

    installAsApp: 'دابەزاندن وەک ئەپ',
    installAppDesc: 'جادوو دابەزێنە سەر کۆمپیوتەر یان مۆبایلەکەت بۆ بەکارهێنانی خێرا و کارکردن بەبێ ئینتەرنێت',
    installAppModalTitle: 'دابەزاندنی جادوو وەک ئەپڵیکەیشن (Install as App)',
    installAppBtn: 'دابەزاندنی ئەپ ئێستا',
    installIosTitle: 'دابەزاندن لەسەر iPhone / iPad (iOS)',
    installIosStep1: '١. لە براوزەری Safari، کلیک لە دوگمەی هاوبەشکردن (Share) بکە.',
    installIosStep2: '٢. بڕۆ خوارەوە و کلیک لەسەر "Add to Home Screen" (زیادکردن بۆ پەڕەی سەرەکی) بکە.',
    installDesktopTitle: 'دابەزاندن لەسەر کۆمپیوتەر و ئەندرۆید',
    installDesktopDesc: 'کلیک لە دوگمەی خوارەوە بکە بۆ دابەزاندنی جادوو بەشێوەی ئەپڵیکەیشنی سەربەخۆ.',
    appAlreadyInstalled: 'ئەپڵیکەیشنەکە پێشتر دابەزێنراوە و کاردەکات!',
    offlineNotice: 'دۆخی بێ هێڵ (Offline) — داتاکانی خەزنکراو بەردەستن.',

    footerRights: 'هەموو مافەکان پارێزراون بۆ جادوو (Jadoo Platform)',
    footerAbout: 'جادوو بەهێزترین پلاتفۆرمی دروستکردنی داتابەیسی بێ کۆدە لە ناوچەکە و جیهان، بەستراوە بە ژیریی دەستکرد.',
    footerKurdishTech: 'بە خۆشەویستییەوە بۆ ئابووری و کەرتی تەکنەلۆژیای کوردی و نێودەوڵەتی دروستکراوە.',
  },

  en: {
    brandName: 'Wizard',
    brandTagline: 'Best No-Code Website & Database Builder',
    heroHeadline: 'Best No-Code Website & Database Builder',
    heroSubheadline: 'Fully integrated with an autonomous AI Agent — not just database creation, but building complete responsive websites and workflow apps without code.',
    heroBadge: 'Next-Gen Database & Web Builder Platform • Modern Alternative to Salesforce & Legacy ERP',
    ctaLaunchStudio: 'Launch Wizard Studio',
    ctaExploreTemplates: 'Explore Templates',
    ctaLearnMore: 'Learn More',
    ctaLiveDemo: 'Interactive Demo',
    officialSiteNotice: 'Enterprise-grade No-Code Database & Web Platform - Wizard',
    officialSiteBtn: 'Official Wizard Platform',

    navFeatures: 'Features',
    navTemplates: 'Templates',
    navAiAgent: 'AI Agent',
    navSecurity: 'IP Shield & Security',
    navIntegrations: 'Integrations',
    navComparison: 'Why Wizard?',
    navMobile: 'Mobile & Tablet',
    navStudio: 'Work Studio',

    featuresTitle: 'Core Capabilities of Wizard',
    featuresSubtitle: 'Everything modern enterprises require to build robust business applications without writing code.',
    featAiAgentTitle: 'Autonomous AI Agent',
    featAiAgentDesc: 'Native, out-of-the-box AI assistant working directly inside your database tables to generate schemas, formulas, and actionable insights.',
    featSimplicityTitle: 'Excel-like Simplicity',
    featSimplicityDesc: 'Build complex relational systems as easily as editing a spreadsheet—with zero programming required.',
    featErpCrmTitle: 'ERP & CRM Systems',
    featErpCrmDesc: 'Relational data modeling, purchase requests, quotation generation, and multi-tier approval workflows.',
    featAnalyticsTitle: 'Reports, Gantt & Pivot Tables',
    featAnalyticsDesc: 'Visualize timelines with Gantt charts, analyze performance with dynamic Pivot tables, and track real-time operational metrics.',
    featIntegrationsTitle: 'Enterprise Integrations',
    featIntegrationsDesc: 'Seamless synchronization with Google Workspace, Outlook, Zapier, Make, and n8n via resilient webhooks.',
    featMultilingualTitle: 'Multi-lingual Support',
    featMultilingualDesc: 'Complete native interface support for Kurdish (Sorani), English, and Arabic with full RTL and LTR ergonomics.',
    featSeoTitle: 'Google SEO Optimization',
    featSeoDesc: 'Enhanced search engine visibility with dynamic metadata, OpenGraph cards, and Schema.org JSON-LD structured data.',
    featIpShieldTitle: 'IP Shield & Auto-Blocking',
    featIpShieldDesc: 'Enterprise-grade cyber defense that monitors traffic and automatically blocks malicious IPs attempting attacks or brute force.',

    templatesTitle: 'Pre-built Business Templates',
    templatesSubtitle: 'Deploy battle-tested database architectures in seconds with a single click.',
    tplErpTitle: 'Enterprise Resource Planning (ERP)',
    tplErpDesc: 'Sales pipelines, purchase orders, warehouse inventory, invoice sub-tables (line items), and ledger balances.',
    tplCrmTitle: 'Customer Relationship Management (CRM)',
    tplCrmDesc: 'Lead scoring, customer profiles, deal stages, probability forecasting, and follow-up activities.',
    tplBomTitle: 'Manufacturing & Bill of Materials (BOM)',
    tplBomDesc: 'Production scheduling, BOM component trees, factory batch tracking, and raw material monitoring.',
    tplProjectsTitle: 'Projects & Tasks',
    tplProjectsDesc: 'Milestone assignments, time tracking, Gantt scheduling, and team sign-offs.',
    openInStudio: 'Open in Wizard Studio',

    whyTitle: 'Why Choose Wizard?',
    whySubtitle: 'Engineered for speed, cost efficiency, and zero operational friction.',
    whyCostTitle: 'Dramatic Cost Reduction',
    whyCostDesc: 'A formidable, high-velocity alternative to exorbitant suites like Salesforce and legacy SAP without runaway licensing fees.',
    whySpeedTitle: 'Days, Not Months',
    whySpeedDesc: 'Roll out functional enterprise databases in days rather than undergoing endless IT consultancy cycles.',
    whySecurityTitle: 'Bulletproof Security & Audit Trail',
    whySecurityDesc: 'Granular field-level permissions, immutable audit logs, and proactive IP firewall defense.',
    vsSalesforce: 'Salesforce / SAP',
    vsExcel: 'Traditional Excel',
    vsMagic: 'Wizard Platform',

    studioTitle: 'Wizard Work Studio',
    studioSubtitle: 'Real-time record editing, Gantt scheduling, Pivot analysis, and approval flows',
    viewSheet: 'Sheet Grid',
    viewGantt: 'Gantt Chart',
    viewPivot: 'Pivot Analytics',
    viewApprovals: 'Approval Board',
    viewAuditLog: 'Audit Trail',
    addRow: 'Add Row',
    addField: 'Add Column',
    exportCsv: 'Export CSV',
    exportJson: 'Export JSON',
    exportPdf: 'Export PDF Document',
    exportFullBackup: 'Full Workspace Backup (JSON)',
    saveToGithub: 'Save Source to GitHub',
    githubBackupDesc: 'Directly commit schema & active records to GitHub',
    exportData: 'Export Data',
    searchPlaceholder: 'Search records...',
    recordsCount: 'Records',
    recordDetails: 'Record Details',
    approvalStatus: 'Approval Status',
    subTableTitle: 'Sub-Table Line Items',
    submitApproval: 'Submit for Approval',
    approve: 'Approve',
    reject: 'Reject',
    approvedBadge: 'Approved',
    pendingBadge: 'Pending',
    draftBadge: 'Draft',
    rejectedBadge: 'Rejected',
    historyLog: 'Audit Trail & Change History',
    aiAssistantBtn: 'AI Agent',

    aiModalTitle: 'Wizard AI Agent',
    aiModalSubtitle: 'Directly orchestrates your database without complex configuration',
    aiPromptPlaceholder: 'Ask Wizard AI... (e.g. "Create a sales tax calculation formula" or "Design an inventory schema")',
    aiSend: 'Run Wizard AI',
    aiSuggestedPrompts: 'Suggested Actions:',
    aiApplySchema: 'Apply Template to Studio',

    ipShieldTitle: 'Wizard IP Shield & Threat Firewall',
    ipShieldSubtitle: 'Active perimeter defense that detects suspicious probes and quarantines malicious IPs in real-time',
    ipBlockedCount: 'IPs Blocked',
    simulateAttack: 'Simulate Threat Attack',
    manualBlock: 'Block IP Manually',
    ipInputPlaceholder: 'IP Address (e.g., 185.220.101.5)',
    liveThreatFeed: 'Real-Time Threat Detection Log',
    shieldActive: 'Firewall Active',
    recentApiActivity: 'Recent API Activity Log',
    allRequests: 'All Requests',
    successfulRequests: 'Successful (200 OK)',
    blockedRequests: 'Blocked (403 / 429)',
    simulateTraffic: 'Simulate API Call',
    autoRefresh: 'Live Stream',

    mobileTitle: 'Direct Access on Mobile & Tablet',
    mobileSubtitle: 'No App Store or Google Play downloads required — runs flawlessly across all smartphones and tablets with instant offline support.',
    downloadIos: 'Open in iOS Safari',
    downloadAndroid: 'Open in Android Chrome',
    availableOnStores: 'Direct Web & PWA — No Store Download Required',

    seoModalTitle: 'SEO & Structured Data Inspector',
    seoGooglePreview: 'Google Search Snippet Preview',
    seoSchemaLd: 'Schema.org JSON-LD Structured Data',
    seoCopySnippet: 'Copy Meta Tags',

    installAsApp: 'Install as App',
    installAppDesc: 'Install Wizard onto your mobile or desktop for instantaneous launching and offline access',
    installAppModalTitle: 'Install Wizard as App',
    installAppBtn: 'Install App Now',
    installIosTitle: 'Install on iPhone & iPad (iOS)',
    installIosStep1: '1. In Safari, tap the Share icon at the bottom of the screen.',
    installIosStep2: '2. Scroll down and tap "Add to Home Screen".',
    installDesktopTitle: 'Install on Android & Desktop',
    installDesktopDesc: 'Click the button below to install Wizard directly as a standalone desktop or mobile application.',
    appAlreadyInstalled: 'Wizard is already installed and running as a standalone app!',
    offlineNotice: 'Offline Mode — Cached data is actively being used.',

    footerRights: 'All rights reserved by Wizard No-Code Platform.',
    footerAbout: 'Wizard is an enterprise-grade no-code relational database engine powered by autonomous AI agents.',
    footerKurdishTech: 'Crafted with precision for global and regional enterprise workflows.',
  },

  ar: {
    brandName: 'ساحر (Sahir)',
    brandTagline: 'أفضل منصة لبناء المواقع وقواعد البيانات بدون كود',
    heroHeadline: 'أفضل منصة لبناء المواقع وقواعد البيانات بدون كود',
    heroSubheadline: 'متكاملة تماماً مع وكيل الذكاء الاصطناعي (AI Agent) — ليس فقط لإنشاء قواعد البيانات، بل لبناء مواقع متكاملة وأنظمة عمل بدون أي كود.',
    heroBadge: 'الجيل الجديد من منصات قواعد البيانات وبناء المواقع • البديل الذكي لـ Salesforce والأنظمة المكلفة',
    ctaLaunchStudio: 'ابدأ بناء قاعدة البيانات الآن',
    ctaExploreTemplates: 'استعراض القوالب الجاهزة',
    ctaLearnMore: 'تعرف على المزيد',
    ctaLiveDemo: 'تجربة حية وتفاعلية',
    officialSiteNotice: 'المنصة الرسمية المتقدمة لقواعد البيانات والمواقع ساحر (Sahir)',
    officialSiteBtn: 'موقع ساحر الرسمي (Sahir)',

    navFeatures: 'المميزات',
    navTemplates: 'القوالب',
    navAiAgent: 'وكيل الذكاء الاصطناعي',
    navSecurity: 'الحماية و IP Shield',
    navIntegrations: 'الربط والتكامل',
    navComparison: 'لماذا ساحر؟',
    navMobile: 'الهواتف واللوحيات',
    navStudio: 'استوديو العمل',

    featuresTitle: 'المميزات الرئيسية لمنصة ساحر (Sahir)',
    featuresSubtitle: 'كل الأدوات التي تحتاجها لإدارة كافة عمليات العمل في مكان واحد وبدون كتابة سطر كود واحد.',
    featAiAgentTitle: 'وكيل الذكاء الاصطناعي (AI Agent)',
    featAiAgentDesc: 'يعمل مباشرة داخل قاعدة بياناتك دون إعدادات معقدة؛ ينشئ الجداول، المعادلات الحسابية، ويحلل البيانات تلقائياً.',
    featSimplicityTitle: 'بساطة تشبه إكسل (Excel-like)',
    featSimplicityDesc: 'بناء الجداول والأنظمة بنفس مرونة الإكسل وبدون كود، مع قوة قواعد البيانات العلائقية الاحترافية.',
    featErpCrmTitle: 'أنظمة ERP و CRM متكاملة',
    featErpCrmDesc: 'ربط الجداول، تقديم طلبات الشراء، وإدارة دورات الموافقة متعددة المراحل (Approval Workflows).',
    featAnalyticsTitle: 'مخطط غانت وجداول بيفوت',
    featAnalyticsDesc: 'إنشاء مخطط غانت الزمني (Gantt Chart)، جداول بيفوت التحليلية (Pivot Tables)، وسجلات الوقت التشغيلية.',
    featIntegrationsTitle: 'الربط مع المنظومات الإدارية',
    featIntegrationsDesc: 'توافق كامل مع Google Workspace, Outlook, Zapier, Make و n8n عبر واجهات Webhook البرمجية.',
    featMultilingualTitle: 'دعم ثلاث لغات (Multi-lingual)',
    featMultilingualDesc: 'توفر واجهة النظام بالكامل بثلاث لغات: الكردية، الإنجليزية، والعربية مع دعم حقيقي لتنسيقات RTL و LTR.',
    featSeoTitle: 'تحسين محركات البحث (SEO)',
    featSeoDesc: 'تحسين ظهور الموقع والمحتويات في محركات البحث من خلال الكلمات المفتاحية، وبطاقات التواصل و Schema.org.',
    featIpShieldTitle: 'حماية وحظر عناوين IP المشبوهة',
    featIpShieldDesc: 'أمان فائق لحماية الموقع وقاعدة البيانات عبر الحظر التلقائي لعناوين IP التي تحاول الاختراق أو شن هجمات سيبرانية.',

    templatesTitle: 'الأنظمة والقوالب الجاهزة (Templates)',
    templatesSubtitle: 'يمكنك تفعيل هذه الأنظمة الشاملة بنقرة زر واحدة والبدء الفوري في العمل.',
    tplErpTitle: 'إدارة موارد العمل (ERP)',
    tplErpDesc: 'عمليات البيع، المشتريات، المخازن، الفواتير، الجداول الفرعية للبنود، والمحاسبة المالية.',
    tplCrmTitle: 'إدارة علاقات العملاء (CRM)',
    tplCrmDesc: 'متابعة العملاء المحتملين، صفقات المبيعات، مراحل القمع البيعي، وتوقعات الإيرادات.',
    tplBomTitle: 'إدارة التصنيع وقائمة المواد (BOM)',
    tplBomDesc: 'تخطيط الإنتاج، قائمة المواد الأولية (BOM)، مراقبة الدفعات الصناعية وحساب التكاليف.',
    tplProjectsTitle: 'المشاريع والمهام (Projects & Tasks)',
    tplProjectsDesc: 'توزيع المهام، تتبع ساعات العمل، والجدول الزمني التفاعلي عبر مخطط غانت.',
    openInStudio: 'فتح في استوديو ساحر',

    whyTitle: 'لماذا تختار ساحر (Sahir)؟',
    whySubtitle: 'فارق حقيقي في التكلفة، السرعة، والأمان مقارنة بالبرمجيات التقليدية.',
    whyCostTitle: 'تقليل التكاليف (Cost Reduction)',
    whyCostDesc: 'بديل قوي واقتصادي للأنظمة باهظة الثمن مثل Salesforce و SAP دون تكاليف تراخيص مرهقة.',
    whySpeedTitle: 'سرعة قياسية في التنفيذ',
    whySpeedDesc: 'بناء وإطلاق نظام إداري متكامل في غضون أيام قليلة بدلاً من شهور وسنوات من الاستشارات البرمجية.',
    whySecurityTitle: 'أمان متقدم وتتبع السجلات',
    whySecurityDesc: 'حماية كاملة للبيانات، سجل دقيق لكافة التعديلات (History Log)، وحماية فورية عبر جدار حظر IP.',
    vsSalesforce: 'Salesforce / SAP',
    vsExcel: 'إكسل التقليدي',
    vsMagic: 'منصة ساحر (Sahir)',

    studioTitle: 'استوديو العمل ساحر',
    studioSubtitle: 'تحرير فوري، مخطط غانت، تحليلات بيفوت، ومسارات الموافقة',
    viewSheet: 'الجدول الرئيسي (Sheet Grid)',
    viewGantt: 'مخطط غانت (Gantt Chart)',
    viewPivot: 'تحليلات بيفوت (Pivot Analytics)',
    viewApprovals: 'لوحة الموافقات (Approvals)',
    viewAuditLog: 'سجل التدقيق (Audit Trail)',
    addRow: 'إضافة سجل جديد',
    addField: 'إضافة عمود جديد',
    exportCsv: 'تصدير كـ CSV',
    exportJson: 'تصدير كـ JSON',
    exportPdf: 'تصدير كـ PDF',
    exportFullBackup: 'نسخة احتياطية كاملة (JSON Backup)',
    saveToGithub: 'حفظ المصدر في GitHub',
    githubBackupDesc: 'حفظ وتأمين المخطط والسجلات مباشرة في مستودع GitHub',
    exportData: 'تصدير البيانات (Export)',
    searchPlaceholder: 'بحث في السجلات...',
    recordsCount: 'سجلات',
    recordDetails: 'تفاصيل السجل',
    approvalStatus: 'حالة الاعتماد',
    subTableTitle: 'جدول البنود الفرعية (Sub-Table)',
    submitApproval: 'إرسال للاعتماد',
    approve: 'موافقة (Approve)',
    reject: 'رفض (Reject)',
    approvedBadge: 'معتمد',
    pendingBadge: 'قيد المراجعة',
    draftBadge: 'مسودة',
    rejectedBadge: 'مرفوض',
    historyLog: 'سجل التغييرات (Audit Trail)',
    aiAssistantBtn: 'وكيل الذكاء الاصطناعي',

    aiModalTitle: 'وكيل الذكاء الاصطناعي لمنصة ساحر (Sahir AI Agent)',
    aiModalSubtitle: 'يعمل مباشرة داخل قاعدة البيانات الخاصة بك دون إعدادات معقدة',
    aiPromptPlaceholder: 'اكتب طلبك لوكيل الذكاء الاصطناعي... (مثال: أنشئ صيغة لحساب الضرائب أو صمم جدولاً لإدارة المخازن)',
    aiSend: 'إرسال للوكيل',
    aiSuggestedPrompts: 'إجراءات مقترحة سريعة:',
    aiApplySchema: 'تطبيق هذا القالب في الاستوديو',

    ipShieldTitle: 'جدار حماية وحظر IP (Sahir IP Shield)',
    ipShieldSubtitle: 'نظام حماية متطور لرصد الهجمات وحظر عناوين IP المشبوهة تلقائياً في الوقت الفعلي',
    ipBlockedCount: 'عنوان IP محظور',
    simulateAttack: 'محاكاة هجوم سيبراني (Simulate Attack)',
    manualBlock: 'حظر يدوي لعنوان IP',
    ipInputPlaceholder: 'عنوان IP (مثال: 185.220.101.5)',
    liveThreatFeed: 'سجل التهديدات والحظر المباشر',
    shieldActive: 'الحماية نشطة',
    recentApiActivity: 'سجل نشاط الـ API الأخير (Recent API Activity)',
    allRequests: 'كافة الطلبات',
    successfulRequests: 'ناجحة (200 OK)',
    blockedRequests: 'محظورة (403 Forbidden)',
    simulateTraffic: 'محاكاة طلب API',
    autoRefresh: 'بث مباشر (Live Stream)',

    mobileTitle: 'وصول مباشر عبر الهواتف واللوحيات',
    mobileSubtitle: 'بدون الحاجة للتنزيل من App Store أو Google Play — تعمل المنصة بكفاءة فائقة على كافة الهواتف والأجهزة اللوحية مباشرة.',
    downloadIos: 'فتح عبر متصفح iOS',
    downloadAndroid: 'فتح عبر متصفح أندرويد',
    availableOnStores: 'وصول مباشر وتطبيق ويب تقدمي (PWA) دون الحاجة للمتاجر',

    seoModalTitle: 'فاحص تحسين محركات البحث والبيانات المنظمة',
    seoGooglePreview: 'معاينة النتيجة في بحث جوجل (Google Search Preview)',
    seoSchemaLd: 'البيانات المنظمة (Schema.org JSON-LD)',
    seoCopySnippet: 'نسخ وسوم الميتا',

    installAsApp: 'تثبيت كتطبيق',
    installAppDesc: 'قم بتثبيت ساحر على هاتفك أو حاسوبك للوصول الفوري والعمل بدون إنترنت',
    installAppModalTitle: 'تثبيت ساحر كتطبيق (Install as App)',
    installAppBtn: 'تثبيت التطبيق الآن',
    installIosTitle: 'التثبيت على آيفون وآيباد (iOS)',
    installIosStep1: '١. في متصفح Safari، اضغط على زر المشاركة (Share) في أسفل الشاشة.',
    installIosStep2: '٢. مرر لأسفل واضغط على "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).',
    installDesktopTitle: 'التثبيت على أندرويد والكمبيوتر',
    installDesktopDesc: 'اضغط على الزر أدناه لتثبيت ساحر مباشرة كتطبيق مستقل على جهازك.',
    appAlreadyInstalled: 'تم تثبيت ساحر بنجاح وهو يعمل الآن كتطبيق مستقل!',
    offlineNotice: 'وضع عدم الاتصال — يتم استخدام البيانات المحفوظة محلياً.',

    footerRights: 'كافة الحقوق محفوظة لمنصة ساحر (Sahir No-Code Platform).',
    footerAbout: 'ساحر هي المنصة الرائدة لبناء قواعد البيانات العلائقية بدون كود والمدمجة مع الذكاء الاصطناعي.',
    footerKurdishTech: 'صُممت بدقة لدعم قطاع الأعمال في المنطقة والعالم.',
  },
};
