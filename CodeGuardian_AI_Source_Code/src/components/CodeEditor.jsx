import React, { useRef } from 'react';
import { Code, Trash2, Copy, Upload, Check } from 'lucide-react';

export function CodeEditor({ code, onChangeCode, language, onChangeLanguage }) {
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = useRef(null);

  const lineCount = (code || '').split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          onChangeCode(text);

          // Infer language from extension
          const ext = file.name.split('.').pop()?.toLowerCase();
          if (ext === 'py') onChangeLanguage('python');
          else if (ext === 'js' || ext === 'jsx') onChangeLanguage('javascript');
          else if (ext === 'ts' || ext === 'tsx') onChangeLanguage('typescript');
          else if (ext === 'java') onChangeLanguage('java');
          else if (ext === 'cpp' || ext === 'c') onChangeLanguage('cpp');
          else if (ext === 'go') onChangeLanguage('go');
          else if (ext === 'sql') onChangeLanguage('sql');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="glass-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Code size={18} style={{ color: 'var(--primary)' }} />
          <span>Source Code Editor</span>
        </div>

        <div className="editor-controls">
          <select
            className="select-input"
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript (Node/React)</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C / C++</option>
            <option value="go">Go</option>
            <option value="sql">SQL</option>
          </select>
        </div>
      </div>

      <div className="code-wrapper">
        <div className="line-numbers">
          {lineNumbers.map(n => (
            <div key={n}>{n}</div>
          ))}
        </div>

        <textarea
          className="code-textarea"
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          placeholder="// Paste your code or upload a file here to begin review..."
          spellCheck="false"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div>Lines: {lineCount} | Chars: {code.length}</div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.sql,.patch,.diff,.txt"
          />

          <button
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
          >
            <Upload size={14} />
            <span>Upload File</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
          >
            {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => onChangeCode('')}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: 'var(--critical)' }}
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}
