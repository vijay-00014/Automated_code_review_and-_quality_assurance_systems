import React from 'react';

export function MetricCard({ title, value, max = 100, icon: Icon, color = 'var(--primary)' }) {
  const numericVal = typeof value === 'number' ? value : 0;
  const percentage = Math.min(100, Math.max(0, numericVal));

  return (
    <div className="metric-card">
      <div className="metric-title">
        <span>{title}</span>
        {Icon && <Icon size={16} style={{ color }} />}
      </div>
      <div className="metric-value" style={{ color: typeof value === 'number' ? color : 'var(--text-main)' }}>
        {value}
        {typeof value === 'number' ? '%' : ''}
      </div>
      {typeof value === 'number' && (
        <div className="score-bar-bg">
          <div
            className="score-bar-fill"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
      )}
    </div>
  );
}
