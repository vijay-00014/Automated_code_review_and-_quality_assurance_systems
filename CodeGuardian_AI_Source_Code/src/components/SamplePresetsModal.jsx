import React from 'react';
import { SAMPLE_PRESETS } from '../engine/defaultPresets';
import { X, FolderOpen, ArrowRight } from 'lucide-react';

export function SamplePresetsModal({ isOpen, onClose, onSelectPreset }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FolderOpen size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Select Sample Code Preset</h3>
          </div>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.3rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Choose a pre-configured code snippet containing real-world vulnerabilities, memory leaks, performance bugs, or clean architecture.
        </p>

        <div className="preset-grid">
          {SAMPLE_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="preset-card"
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
            >
              <div className="preset-icon">{preset.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{preset.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {preset.description}
                </div>
              </div>
              <ArrowRight size={18} color="var(--primary)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
