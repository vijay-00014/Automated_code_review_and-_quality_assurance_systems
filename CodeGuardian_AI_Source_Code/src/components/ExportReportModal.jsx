import React, { useState } from 'react';
import { X, Download, FileText, Code2, Check } from 'lucide-react';
import { exportReviewReport } from '../utils/reportFormatter';

export function ExportReportModal({ isOpen, onClose, reviewData }) {
  const [format, setFormat] = useState('markdown');
  const [filename, setFilename] = useState('code-review-report');

  if (!isOpen || !reviewData) return null;

  const handleExport = () => {
    exportReviewReport(reviewData, filename, format);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Export Code Review Report</h3>
          </div>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.3rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>
              Report File Name:
            </label>
            <input
              type="text"
              className="select-input"
              style={{ width: '100%', padding: '0.6rem' }}
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>
              Select Export Format:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div
                onClick={() => setFormat('markdown')}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  border: `2px solid ${format === 'markdown' ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: format === 'markdown' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <FileText size={24} color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Markdown (.md)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Best for GitHub PRs, docs & Jira</div>
                </div>
              </div>

              <div
                onClick={() => setFormat('json')}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  border: `2px solid ${format === 'json' ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                  background: format === 'json' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Code2 size={24} color="var(--accent-cyan)" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>JSON Data (.json)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Programmatic CI/CD ingestion</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleExport}>
            <Download size={16} />
            <span>Download Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
