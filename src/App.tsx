import React, { useState, useEffect } from 'react';
import { initialTables } from './data/initialTemplates';
import { DatabaseTable, DatabaseRecord, FieldDefinition } from './types/database';
import { Language, translations } from './i18n/translations';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesGrid } from './components/FeaturesGrid';
import { TemplatesShowcase } from './components/TemplatesShowcase';
import { DatabaseStudio } from './components/DatabaseStudio';
import { IntegrationsSection } from './components/IntegrationsSection';
import { ComparisonSection } from './components/ComparisonSection';
import { MobileAppSection } from './components/MobileAppSection';
import { Footer } from './components/Footer';
import { MagicAIAgentModal } from './components/MagicAIAgentModal';
import { IPShieldConsole } from './components/IPShieldConsole';
import { SeoOptimizerModal } from './components/SeoOptimizerModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('ku');
  const [tables, setTables] = useState<DatabaseTable[]>(initialTables);
  const [activeTableId, setActiveTableId] = useState<string>('tbl-erp');
  const [studioInitialView, setStudioInitialView] = useState<'sheet' | 'gantt' | 'pivot' | 'approvals' | 'audit'>('sheet');

  // Modals state
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);
  const [isIpShieldOpen, setIsIpShieldOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  // Sync document direction and lang attribute
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'en' ? 'ltr' : 'rtl';
    
    // Update document title dynamically
    const t = translations[currentLang];
    document.title = `${t.brandName} - ${t.heroHeadline}`;
  }, [currentLang]);

  // Jump to Studio
  const handleOpenStudio = () => {
    const el = document.getElementById('studio-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Switch table records
  const handleUpdateTableRecords = (tableId: string, records: DatabaseRecord[]) => {
    setTables(prev => prev.map(tbl => tbl.id === tableId ? { ...tbl, records } : tbl));
  };

  // Add column
  const handleAddTableColumn = (tableId: string, field: FieldDefinition) => {
    setTables(prev => prev.map(tbl => {
      if (tbl.id !== tableId) return tbl;
      return {
        ...tbl,
        fields: [...tbl.fields, field],
      };
    }));
  };

  // Add custom table (e.g. from AI Agent)
  const handleAddCustomTable = (newTable: DatabaseTable) => {
    setTables(prev => [newTable, ...prev]);
    setActiveTableId(newTable.id);
    handleOpenStudio();
  };

  const currentTable = tables.find(t => t.id === activeTableId) || tables[0];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 ${currentLang === 'en' ? 'font-sans' : 'font-kurdish'}`}>
      
      {/* Top Sticky Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenStudio={handleOpenStudio}
        onOpenAiAgent={() => setIsAiAgentOpen(true)}
        onOpenIpShield={() => setIsIpShieldOpen(true)}
        onOpenSeo={() => setIsSeoModalOpen(true)}
        onOpenInstall={() => setIsInstallOpen(true)}
      />

      <main>
        {/* Hero Section with interactive preview */}
        <HeroSection
          currentLang={currentLang}
          onOpenStudio={handleOpenStudio}
          onOpenAiAgent={() => setIsAiAgentOpen(true)}
          onOpenIpShield={() => setIsIpShieldOpen(true)}
        />

        {/* 8 Core Features Grid */}
        <FeaturesGrid
          currentLang={currentLang}
          onOpenStudio={handleOpenStudio}
          onOpenAiAgent={() => setIsAiAgentOpen(true)}
          onOpenIpShield={() => setIsIpShieldOpen(true)}
          onOpenSeo={() => setIsSeoModalOpen(true)}
          onSelectStudioView={(view) => {
            setStudioInitialView(view);
            handleOpenStudio();
          }}
        />

        {/* 4 Pre-built Business Templates */}
        <TemplatesShowcase
          currentLang={currentLang}
          onSelectTable={(tableId) => {
            setActiveTableId(tableId);
            handleOpenStudio();
          }}
          onOpenStudio={handleOpenStudio}
        />

        {/* Live Interactive Database Studio (Grid, Gantt, Pivot, Approvals) */}
        <DatabaseStudio
          key={`${activeTableId}-${studioInitialView}`}
          currentLang={currentLang}
          tables={tables}
          activeTableId={activeTableId}
          onSelectTable={setActiveTableId}
          onUpdateTableRecords={handleUpdateTableRecords}
          onAddTableColumn={handleAddTableColumn}
          onOpenAiAgent={() => setIsAiAgentOpen(true)}
          onOpenIpShield={() => setIsIpShieldOpen(true)}
          initialView={studioInitialView}
        />

        {/* Integrations: Google Workspace, Outlook, Zapier, Make, n8n */}
        <IntegrationsSection currentLang={currentLang} />

        {/* Comparison: Why Magic? vs Salesforce, Excel, Legacy ERP */}
        <ComparisonSection
          currentLang={currentLang}
          onOpenStudio={handleOpenStudio}
        />

        {/* Mobile Apps Showcase: iOS & Android */}
        <MobileAppSection
          currentLang={currentLang}
          onOpenStudio={handleOpenStudio}
          onOpenInstall={() => setIsInstallOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onOpenStudio={handleOpenStudio}
        onOpenAiAgent={() => setIsAiAgentOpen(true)}
        onOpenIpShield={() => setIsIpShieldOpen(true)}
        onOpenSeo={() => setIsSeoModalOpen(true)}
      />

      {/* Modals */}
      <MagicAIAgentModal
        currentLang={currentLang}
        isOpen={isAiAgentOpen}
        onClose={() => setIsAiAgentOpen(false)}
        currentTable={currentTable}
        onAddCustomTable={handleAddCustomTable}
      />

      <IPShieldConsole
        currentLang={currentLang}
        isOpen={isIpShieldOpen}
        onClose={() => setIsIpShieldOpen(false)}
      />

      <SeoOptimizerModal
        currentLang={currentLang}
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
      />

      <PWAInstallModal
        currentLang={currentLang}
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />

      <OfflineIndicator currentLang={currentLang} />

    </div>
  );
}
