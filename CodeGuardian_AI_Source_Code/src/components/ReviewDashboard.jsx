import React from 'react';
import { MetricCard } from './MetricCard';
import { Shield, Zap, Wrench, Activity, AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export function ReviewDashboard({ reviewData, selectedFilter, onFilterChange }) {
  if (!reviewData) {
    return (
      <div className="glass-panel" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '380px', textAlign: 'center' }}>
        <Shield size={48} style={{ color: 'var(--primary)', opacity: 0.5 }} />
        <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', color: 'var(--text-main)' }}>Ready for Automated Review</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '360px' }}>
          Click <strong>Review Code</strong> above or choose a sample snippet to run static & AI quality analysis.
        </p>
      </div>
    );
  }

  const { overallScore, grade, metrics, counts, summaryText } = reviewData;

  const getGaugeColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#6366f1';
    if (score >= 50) return '#f59e0b';
    return '#f43f5e';
  };

  const scoreColor = getGaugeColor(overallScore);
  const strokeDashoffset = 283 - (283 * overallScore) / 100;

  return (
    <div className="glass-panel">
      {/* Gauge & Summary Header */}
      <div className="score-gauge-container">
        <div className="gauge-circle">
          <svg width="90" height="90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
          </svg>
          <div className="gauge-text">
            <span className="score-num" style={{ color: scoreColor }}>{overallScore}</span>
            <span className="score-grade">GRADE {grade}</span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Overall Quality Score</h3>
            <span className="badge" style={{ backgroundColor: `${scoreColor}20`, color: scoreColor, border: `1px solid ${scoreColor}40` }}>
              {grade === 'A+' || grade === 'A' ? 'PASSED' : 'ACTION REQUIRED'}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            {summaryText}
          </p>
        </div>
      </div>

      {/* 4 Score Metrics */}
      <div className="metrics-grid">
        <MetricCard
          title="Security Score"
          value={metrics.securityScore}
          icon={Shield}
          color="var(--critical)"
        />
        <MetricCard
          title="Performance"
          value={metrics.performanceScore}
          icon={Zap}
          color="var(--accent-cyan)"
        />
        <MetricCard
          title="Maintainability"
          value={metrics.maintainabilityScore}
          icon={Wrench}
          color="var(--accent-purple)"
        />
        <MetricCard
          title="Complexity"
          value={metrics.complexityRating}
          icon={Activity}
          color="var(--major)"
        />
      </div>

      {/* Severity Filter Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Filter Issues ({counts.total} found):
        </span>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            className={`btn ${selectedFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
            onClick={() => onFilterChange('all')}
          >
            All ({counts.total})
          </button>

          <button
            className={`btn ${selectedFilter === 'critical' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--critical)' }}
            onClick={() => onFilterChange('critical')}
          >
            <AlertCircle size={12} color="var(--critical)" />
            Critical ({counts.critical})
          </button>

          <button
            className={`btn ${selectedFilter === 'major' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--major)' }}
            onClick={() => onFilterChange('major')}
          >
            <AlertTriangle size={12} color="var(--major)" />
            Major ({counts.major})
          </button>

          <button
            className={`btn ${selectedFilter === 'minor' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--minor)' }}
            onClick={() => onFilterChange('minor')}
          >
            Minor ({counts.minor})
          </button>

          <button
            className={`btn ${selectedFilter === 'info' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--info)' }}
            onClick={() => onFilterChange('info')}
          >
            <Info size={12} color="var(--info)" />
            Info ({counts.info})
          </button>
        </div>
      </div>
    </div>
  );
}
