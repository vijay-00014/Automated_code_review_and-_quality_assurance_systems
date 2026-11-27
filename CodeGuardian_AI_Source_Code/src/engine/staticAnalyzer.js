/**
 * Static Analysis Rule Scanner
 * Performs real-time regex & pattern checks on code lines to identify instant syntax & vulnerability flags.
 */

export function runStaticAnalysis(code, language = 'javascript') {
  if (!code || typeof code !== 'string') return [];

  const lines = code.split('\n');
  const staticIssues = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();

    // 1. Security: Hardcoded API Secrets / Keys
    if (
      /(api[_-]?key|secret[_-]?key|jwt[_-]?secret|password|private[_-]?key)\s*[:=]\s*["'][A-Za-z0-9_\-!@#$%^&*]{8,}["']/i.test(trimmed) &&
      !trimmed.startsWith('//') && !trimmed.startsWith('#')
    ) {
      staticIssues.push({
        line: lineNumber,
        severity: 'critical',
        category: 'Security',
        title: 'Hardcoded Credential or Secret Detected',
        description: 'Hardcoding secrets or private credentials directly in source code creates high risk of data leaks and unauthorized access.',
        recommendation: 'Move credentials into environment variables (e.g. process.env or .env file) or a secrets manager.',
        codeSnippet: trimmed
      });
    }

    // 2. Security: SQL Injection Risk
    if (
      /(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\s+.*(\+|=|\$|\.format\(|\%\s*\(|\$\{).*/i.test(trimmed) &&
      !trimmed.includes('?') && !trimmed.includes('$1') && !trimmed.includes(':')
    ) {
      staticIssues.push({
        line: lineNumber,
        severity: 'critical',
        category: 'Security',
        title: 'Potential SQL Injection Vulnerability',
        description: 'Constructing SQL query strings with string concatenation or raw string formatting allows untrusted user input to alter database query execution.',
        recommendation: 'Use parameterized queries, prepared statements, or ORM parameter binding.',
        codeSnippet: trimmed
      });
    }

    // 3. Security: Code Execution / Dynamic Evaluation
    if (
      /\b(eval|exec|Function)\s*\(/.test(trimmed) &&
      !trimmed.startsWith('//') && !trimmed.startsWith('#')
    ) {
      staticIssues.push({
        line: lineNumber,
        severity: 'critical',
        category: 'Security',
        title: 'Dangerous Dynamic Code Execution (eval/exec)',
        description: 'Using dynamic evaluation functions can allow arbitrary Remote Code Execution (RCE) if input is manipulated by an attacker.',
        recommendation: 'Avoid dynamic code execution entirely; parse structured data using JSON parsing or safe lookup tables.',
        codeSnippet: trimmed
      });
    }

    // 4. Performance: O(n^2) Nested Loops
    if (/for\s*\(.*for\s*\(/.test(trimmed) || /while\s*\(.*for\s*\(/.test(trimmed)) {
      staticIssues.push({
        line: lineNumber,
        severity: 'major',
        category: 'Performance',
        title: 'Nested Loop Detected (Quadratic Complexity O(n²))',
        description: 'Executing nested iterations over dynamic datasets degrades application responsiveness and causes event-loop blocking.',
        recommendation: 'Refactor using HashMaps/Set lookup structures to achieve O(n) linear performance.',
        codeSnippet: trimmed
      });
    }

    // 5. Bug Risk: Missing try/catch or Unhandled Promise
    if (
      /\bawait\s+fetch\(/.test(trimmed) &&
      !code.substring(Math.max(0, code.indexOf(line) - 200), code.indexOf(line)).includes('try {')
    ) {
      staticIssues.push({
        line: lineNumber,
        severity: 'major',
        category: 'Bug Risk',
        title: 'Unhandled Asynchronous Network Call',
        description: 'Invoking async network request without an enclosing try/catch block can cause unhandled promise rejections and crash the process.',
        recommendation: 'Wrap the asynchronous fetch call in a try/catch block and provide fallback error state handling.',
        codeSnippet: trimmed
      });
    }

    // 6. Bug Risk: Loose Equality Operator (== instead of ===)
    if (
      /==/.test(trimmed) &&
      !/===/.test(trimmed) &&
      !/!=/.test(trimmed) &&
      !/!==/.test(trimmed) &&
      (language === 'javascript' || language === 'typescript') &&
      !trimmed.startsWith('//')
    ) {
      staticIssues.push({
        line: lineNumber,
        severity: 'minor',
        category: 'Quality',
        title: 'Use Strict Equality (===) Over Loose Equality (==)',
        description: 'Loose equality comparison coerces types implicitly, leading to unintended edge-case behavior (e.g. 0 == false).',
        recommendation: 'Replace "==" with strict equality operator "===".',
        codeSnippet: trimmed
      });
    }

    // 7. Bug Risk: Java/C++ Object Comparison with '=='
    if (
      /\.equals\(/.test(code) === false &&
      /\b(userRole|name|status|role|str|input)\s*==\s*["']/.test(trimmed) &&
      (language === 'java' || language === 'cpp')
    ) {
      staticIssues.push({
        line: lineNumber,
        severity: 'major',
        category: 'Bug Risk',
        title: 'String Reference Comparison Bug',
        description: 'In Java/C++, comparing Object or String references using "==" checks reference identity rather than value equality.',
        recommendation: 'Use .equals() method for String comparison (e.g. "ADMIN".equals(userRole)).',
        codeSnippet: trimmed
      });
    }

    // 8. Quality: Direct State Mutation in React (items.push)
    if (
      /\b\w+\.push\(/.test(trimmed) &&
      code.includes('useState') &&
      (language === 'javascript' || language === 'typescript')
    ) {
      staticIssues.push({
        line: lineNumber,
        severity: 'major',
        category: 'Bug Risk',
        title: 'Direct State Array Mutation',
        description: 'Mutating array state directly via .push() bypasses React state change detection, causing component re-render failures.',
        recommendation: 'Use immutable array updates with spread syntax: setState(prev => [...prev, newItem]).',
        codeSnippet: trimmed
      });
    }

    // 9. Style & Debug: Leftover Debug Console Log Statements
    if (
      /(console\.log|print\(|System\.out\.println)/.test(trimmed) &&
      !trimmed.startsWith('//') && !trimmed.startsWith('#')
    ) {
      staticIssues.push({
        line: lineNumber,
        severity: 'info',
        category: 'Style',
        title: 'Production Logging Code Detected',
        description: 'Leaving raw console.log or print statements pollutes production logs and may inadvertently expose sensitive runtime variables.',
        recommendation: 'Remove debug log calls or replace with a structured logger (e.g., winston, pino, or python logging module).',
        codeSnippet: trimmed
      });
    }
  });

  return staticIssues;
}
