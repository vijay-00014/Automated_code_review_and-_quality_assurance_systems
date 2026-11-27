import React from 'react';
import { ShieldCheck, Play, Sparkles, Settings, Download, FolderOpen, RefreshCw } from 'lucide-react';

export function Navbar({ onRunReview, isAnalyzing, onOpenPresets, onOpenSettings, onOpenExport, hasResults }) {
  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-icon">
          <ShieldCheck size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="brand-title">CodeGuardian AI</span>
            <span className="brand-badge">v2.5 Pro</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Automated Code Reviewer & Security Auditor
          </span>
        </div>
      </div>

      <div className="nav-actions">
        <button className="btn btn-secondary" onClick={onOpenPresets} title="Browse Sample Code Snippets">
          <FolderOpen size={16} />
          <span>Samples</span>
        </button>

        <button className="btn btn-secondary" onClick={onOpenSettings} title="Settings & Gemini API Key">
          <Settings size={16} />
          <span>Settings</span>
        </button>

        {hasResults && (
          <button className="btn btn-accent" onClick={onOpenExport} title="Download Review Report">
            <Download size={16} />
            <span>Export Report</span>
          </button>
        )}

        <button
          className="btn btn-primary"
          onClick={onRunReview}
          disabled={isAnalyzing}
          style={{ minWidth: '130px' }}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Play size={16} fill="white" />
              <span>Review Code</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
