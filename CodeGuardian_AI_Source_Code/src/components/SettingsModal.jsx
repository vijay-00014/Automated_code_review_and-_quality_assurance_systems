import React, { useState } from 'react';
import { X, Settings, Key, Shield, Sliders, Check } from 'lucide-react';

export function SettingsModal({ isOpen, onClose, apiKey, onSaveApiKey, rulesConfig, onUpdateRules }) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [savedMsg, setSavedMsg] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(keyInput);
    setSavedMsg(true);
    setTimeout(() => {
      setSavedMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Reviewer Configuration & API Key</h3>
          </div>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.3rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Gemini API Key Section */}
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
            <Key size={16} color="var(--accent-cyan)" />
            <span>Google Gemini API Key (Optional)</span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            CodeGuardian AI features a built-in offline engine. Enter your Gemini API key below if you wish to enable live Gemini 1.5 LLM deep reviews.
          </p>

          <input
            type="password"
            className="select-input"
            style={{ width: '100%', fontFamily: 'var(--font-mono)', padding: '0.6rem', fontSize: '0.85rem' }}
            placeholder="AIzaSy..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
        </div>

        {/* Rule Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
            <Sliders size={16} color="var(--primary)" />
            <span>Active Review Rule Categories</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {[
              { id: 'owasp', name: 'OWASP Security Scans', desc: 'SQLi, Secret leaks, eval()' },
              { id: 'perf', name: 'Performance Rules', desc: 'Nested loops O(n^2), async blocking' },
              { id: 'clean', name: 'Clean Code & SOLID', desc: 'Function length, modularity' },
              { id: 'types', name: 'Type & Bug Safety', desc: 'Null pointers, type annotations' },
            ].map(rule => (
              <label
                key={rule.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '0.6rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={rulesConfig[rule.id] !== false}
                  onChange={(e) => onUpdateRules(rule.id, e.target.checked)}
                  style={{ marginTop: '3px', accentColor: 'var(--primary)' }}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{rule.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rule.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {savedMsg ? <Check size={16} /> : null}
            <span>{savedMsg ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
