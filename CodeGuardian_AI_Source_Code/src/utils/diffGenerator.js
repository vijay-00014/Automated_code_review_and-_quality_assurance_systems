/**
 * Diff Generator Utility
 * Computes line-by-line diff comparison between original code and refactored code.
 */

export function generateLineDiff(originalCode = '', refactoredCode = '') {
  const origLines = originalCode.split('\n');
  const refLines = refactoredCode.split('\n');

  const diffResult = [];
  const maxLines = Math.max(origLines.length, refLines.length);

  let i = 0;
  let j = 0;

  while (i < origLines.length || j < refLines.length) {
    const orig = origLines[i];
    const ref = refLines[j];

    if (orig === ref) {
      diffResult.push({ type: 'normal', origLine: i + 1, refLine: j + 1, content: orig || '' });
      i++;
      j++;
    } else if (orig !== undefined && ref !== undefined) {
      diffResult.push({ type: 'removed', origLine: i + 1, refLine: null, content: orig });
      diffResult.push({ type: 'added', origLine: null, refLine: j + 1, content: ref });
      i++;
      j++;
    } else if (orig !== undefined) {
      diffResult.push({ type: 'removed', origLine: i + 1, refLine: null, content: orig });
      i++;
    } else if (ref !== undefined) {
      diffResult.push({ type: 'added', origLine: null, refLine: j + 1, content: ref });
      j++;
    }
  }

  return diffResult;
}
