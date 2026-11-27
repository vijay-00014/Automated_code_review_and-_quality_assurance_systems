import React from 'react';
import { AlertCircle, AlertTriangle, Info, ShieldAlert, Sparkles, Check } from 'lucide-react';

export function InlineAnnotationView({ code, issues, selectedFilter }) {
  if (!code) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        No code available to display annotations.
      </div>
    );
  }

  const lines = code.split('\n');

  // Filter issues based on selected severity filter
  const filteredIssues = (issues || []).filter(issue => {
    if (selectedFilter === 'all') return true;
    return issue.severity === selectedFilter;
  });

  // Map line numbers to array of issues for quick line rendering
  const issuesByLine = new Map();
  filteredIssues.forEach(issue => {
    const list = issuesByLine.get(issue.line) || [];
    list.push(issue);
    issuesByLine.set(issue.line, list);
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return <span className="badge badge-critical"><ShieldAlert size={12} /> Critical</span>;
      case 'major':
        return <span className="badge badge-major"><AlertTriangle size={12} /> Major</span>;
      case 'minor':
        return <span className="badge badge-minor"><AlertCircle size={12} /> Minor</span>;
      case 'info':
      default:
        return <span className="badge badge-info"><Info size={12} /> Info</span>;
    }
  };

  const getCardStyle = (severity) => {
    switch (severity) {
      case 'critical':
        return { background: 'var(--critical-bg)', border: '1px solid var(--critical-border)', color: '#fca5a5' };
      case 'major':
        return { background: 'var(--major-bg)', border: '1px solid var(--major-border)', color: '#fde68a' };
      case 'minor':
        return { background: 'var(--minor-bg)', border: '1px solid var(--minor-border)', color: '#fef08a' };
      case 'info':
      default:
        return { background: 'var(--info-bg)', border: '1px solid var(--info-border)', color: '#93c5fd' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: '#0d1117', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', maxHeight: '520px', overflowY: 'auto' }}>
      {lines.map((lineText, index) => {
        const lineNum = index + 1;
        const lineIssues = issuesByLine.get(lineNum) || [];
        const hasIssue = lineIssues.length > 0;

        return (
          <div key={lineNum} className={`annotated-line ${hasIssue ? 'has-issue' : ''}`}>
            <div className="line-content-row">
              <div className="line-num-cell" style={{ color: hasIssue ? 'var(--critical)' : 'var(--text-dim)' }}>
                {lineNum}
              </div>
              <div className="line-code-cell">
                {lineText || ' '}
              </div>
            </div>

            {/* Render inline issue comment cards below the line */}
            {lineIssues.map((issue, idx) => (
              <div key={idx} className="inline-comment-card" style={getCardStyle(issue.severity)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getSeverityBadge(issue.severity)}
                    <span style={{ fontWeight: 700, color: 'white' }}>{issue.title}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.8 }}>
                    Category: {issue.category}
                  </span>
                </div>

                <p style={{ margin: '0.2rem 0', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.4' }}>
                  {issue.description}
                </p>

                {issue.recommendation && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginTop: '0.2rem', padding: '0.4rem 0.6rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px', fontSize: '0.8rem', color: '#6ee7b7' }}>
                    <Sparkles size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Fix Suggestion:</strong> {issue.recommendation}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
