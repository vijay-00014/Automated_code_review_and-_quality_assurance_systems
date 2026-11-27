/**
 * Google Gemini Live AI Code Review Integration
 * Connects to Google Generative AI REST endpoint if user supplies an API Key,
 * falling back seamlessly to heuristicReviewer when offline or without key.
 */

import { reviewCodeHeuristically } from './heuristicReviewer';

export async function reviewCodeWithAI(code, language = 'javascript', apiKey = '', options = {}) {
  // If no API key is provided, use heuristic engine directly
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    return reviewCodeHeuristically(code, language, options);
  }

  const prompt = `You are a world-class senior code reviewer and security auditor.
Analyze the following ${language} code for bugs, security vulnerabilities (OWASP top 10), performance bottlenecks, and code smells.

Respond strictly in valid JSON format with no extra markdown wrapping (do not use \`\`\`json tags if possible, or format cleanly as raw JSON):
{
  "overallScore": number (0-100),
  "grade": string ("A+"|"A"|"B"|"C"|"D"|"F"),
  "metrics": {
    "securityScore": number (0-100),
    "performanceScore": number (0-100),
    "maintainabilityScore": number (0-100),
    "complexityRating": string ("Low"|"Moderate"|"High"),
    "testabilityScore": number (0-100)
  },
  "summaryText": "Concise 2-sentence review summary",
  "issues": [
    {
      "line": number (1-indexed line number in original code),
      "severity": "critical" | "major" | "minor" | "info",
      "category": "Security" | "Performance" | "Quality" | "Bug Risk" | "Style",
      "title": "Short title",
      "description": "Detailed explanation of why this line is problematic",
      "recommendation": "Exact suggestion to fix it",
      "codeSnippet": "The original line code"
    }
  ],
  "refactoredCode": "Complete refactored and fixed version of the original code"
}

Original ${language} Code:
${code}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
        })
      }
    );

    if (!response.ok) {
      console.warn('Gemini API returned error status, falling back to heuristic engine:', response.status);
      return reviewCodeHeuristically(code, language, options);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return reviewCodeHeuristically(code, language, options);
    }

    // Clean JSON response if wrapped in markdown fenced block
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedResult = JSON.parse(cleanedText);

    const issues = parsedResult.issues || [];
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const majorCount = issues.filter(i => i.severity === 'major').length;
    const minorCount = issues.filter(i => i.severity === 'minor').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;

    return {
      timestamp: new Date().toISOString(),
      overallScore: parsedResult.overallScore || 80,
      grade: parsedResult.grade || 'B',
      metrics: parsedResult.metrics || { securityScore: 80, performanceScore: 80, maintainabilityScore: 80, complexityRating: 'Moderate', testabilityScore: 80 },
      counts: { total: issues.length, critical: criticalCount, major: majorCount, minor: minorCount, info: infoCount },
      issues: issues,
      refactoredCode: parsedResult.refactoredCode || code,
      summaryText: parsedResult.summaryText || 'AI review completed.'
    };
  } catch (error) {
    console.error('Error calling Gemini API for code review:', error);
    // Graceful fallback to offline heuristic reviewer on any API error or network failure
    return reviewCodeHeuristically(code, language, options);
  }
}
