import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CodeEditor } from './components/CodeEditor';
import { ReviewDashboard } from './components/ReviewDashboard';
import { InlineAnnotationView } from './components/InlineAnnotationView';
import { DiffViewer } from './components/DiffViewer';
import { SamplePresetsModal } from './components/SamplePresetsModal';
import { SettingsModal } from './components/SettingsModal';
import { ExportReportModal } from './components/ExportReportModal';
import { SAMPLE_PRESETS } from './engine/defaultPresets';
import { reviewCodeWithAI } from './engine/geminiReviewer';
import { reviewCodeHeuristically } from './engine/heuristicReviewer';
import { FileCode, Sparkles, Split, Bug, CheckCircle2 } from 'lucide-react';

export function App() {
  const [code, setCode] = useState(SAMPLE_PRESETS[0].code);
  const [language, setLanguage] = useState(SAMPLE_PRESETS[0].language);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  const [activeTab, setActiveTab] = useState('annotations');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [rulesConfig, setRulesConfig] = useState({ owasp: true, perf: true, clean: true, types: true });

  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Automatically trigger review on initial mount for instant demo presentation
  useEffect(() => {
    handleRunReview();
  }, []);

  const handleRunReview = async () => {
    if (!code || !code.trim()) return;

    setIsAnalyzing(true);

    try {
      let result;
      if (apiKey) {
        result = await reviewCodeWithAI(code, language, apiKey, rulesConfig);
      } else {
        // Run smart heuristic review
        result = reviewCodeHeuristically(code, language, rulesConfig);
      }

      setReviewData(result);
    } catch (err) {
      console.error('Error conducting review:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setCode(preset.code);
    setLanguage(preset.language);
    // Run review automatically on preset selection
    setTimeout(() => {
      let result;
      if (apiKey) {
        reviewCodeWithAI(preset.code, preset.language, apiKey, rulesConfig).then(setReviewData);
      } else {
        result = reviewCodeHeuristically(preset.code, preset.language, rulesConfig);
        setReviewData(result);
      }
    }, 50);
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleUpdateRules = (ruleId, enabled) => {
    setRulesConfig(prev => ({ ...prev, [ruleId]: enabled }));
  };

  const handleApplyFix = (refactoredCode) => {
    setCode(refactoredCode);
    // Re-run review to show wowed updated 100% clean score!
    setTimeout(() => {
      const cleanResult = reviewCodeHeuristically(refactoredCode, language, rulesConfig);
      setReviewData(cleanResult);
    }, 100);
  };

  return (
    <div className="app-container">
      {/* Top Header Navigation */}
      <Navbar
        onRunReview={handleRunReview}
        isAnalyzing={isAnalyzing}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        hasResults={!!reviewData}
      />

      {/* Main Grid: Code Editor on Left, Review & Results on Right */}
      <main className="main-grid">
        <CodeEditor
          code={code}
          onChangeCode={setCode}
          language={language}
          onChangeLanguage={setLanguage}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Summary Dashboard Card */}
          <ReviewDashboard
            reviewData={reviewData}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />

          {/* Interactive Results & Diff View Tabs */}
          {reviewData && (
            <div className="glass-panel">
              <div className="tabs-header">
                <button
                  className={`tab-btn ${activeTab === 'annotations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('annotations')}
                >
                  <Bug size={16} />
                  <span>Annotated Code ({reviewData.issues.length})</span>
                </button>

                <button
                  className={`tab-btn ${activeTab === 'diff' ? 'active' : ''}`}
                  onClick={() => setActiveTab('diff')}
                >
                  <Split size={16} />
                  <span>Refactoring Diff & Fix</span>
                </button>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                {activeTab === 'annotations' && (
                  <InlineAnnotationView
                    code={code}
                    issues={reviewData.issues}
                    selectedFilter={selectedFilter}
                  />
                )}

                {activeTab === 'diff' && (
                  <DiffViewer
                    originalCode={code}
                    refactoredCode={reviewData.refactoredCode}
                    onApplyFix={handleApplyFix}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <SamplePresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        rulesConfig={rulesConfig}
        onUpdateRules={handleUpdateRules}
      />

      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reviewData={reviewData}
      />
    </div>
  );
}

export default App;
