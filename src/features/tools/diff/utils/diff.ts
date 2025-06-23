export interface DiffResult {
  type: 'equal' | 'insert' | 'delete' | 'modify';
  oldLineNumber: number | null;
  newLineNumber: number | null;
  oldText: string;
  newText: string;
}

export interface DiffStats {
  additions: number;
  deletions: number;
  modifications: number;
  totalLines: number;
}

export const computeDiff = (oldText: string, newText: string): DiffResult[] => {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  
  const lcs = computeLCS(oldLines, newLines);
  return buildDiffResult(oldLines, newLines, lcs);
};

// Longest Common Subsequence algorithm
const computeLCS = (oldLines: string[], newLines: string[]): number[][] => {
  const m = oldLines.length;
  const n = newLines.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
};

const buildDiffResult = (oldLines: string[], newLines: string[], lcs: number[][]): DiffResult[] => {
  const result: DiffResult[] = [];
  let i = oldLines.length;
  let j = newLines.length;
  let oldLineNum = oldLines.length;
  let newLineNum = newLines.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      // Equal line
      result.unshift({
        type: 'equal',
        oldLineNumber: oldLineNum,
        newLineNumber: newLineNum,
        oldText: oldLines[i - 1],
        newText: newLines[j - 1],
      });
      i--;
      j--;
      oldLineNum--;
      newLineNum--;
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      // Insertion
      result.unshift({
        type: 'insert',
        oldLineNumber: null,
        newLineNumber: newLineNum,
        oldText: '',
        newText: newLines[j - 1],
      });
      j--;
      newLineNum--;
    } else if (i > 0) {
      // Deletion
      result.unshift({
        type: 'delete',
        oldLineNumber: oldLineNum,
        newLineNumber: null,
        oldText: oldLines[i - 1],
        newText: '',
      });
      i--;
      oldLineNum--;
    }
  }

  return result;
};

export const computeDiffStats = (diffResult: DiffResult[]): DiffStats => {
  const stats: DiffStats = {
    additions: 0,
    deletions: 0,
    modifications: 0,
    totalLines: diffResult.length,
  };

  diffResult.forEach(diff => {
    switch (diff.type) {
      case 'insert':
        stats.additions++;
        break;
      case 'delete':
        stats.deletions++;
        break;
      case 'modify':
        stats.modifications++;
        break;
    }
  });

  return stats;
};

export const generateUnifiedDiff = (oldText: string, newText: string, oldFileName = 'original', newFileName = 'modified'): string => {
  const diffResult = computeDiff(oldText, newText);
  const lines: string[] = [];
  
  lines.push(`--- ${oldFileName}`);
  lines.push(`+++ ${newFileName}`);
  
  let currentHunk: DiffResult[] = [];
  let oldStart = 1;
  let newStart = 1;
  
  for (let i = 0; i < diffResult.length; i++) {
    const diff = diffResult[i];
    
    if (diff.type === 'equal') {
      if (currentHunk.length > 0) {
        // Output current hunk
        lines.push(formatHunkHeader(oldStart, newStart, currentHunk));
        currentHunk.forEach(hunkDiff => {
          lines.push(formatDiffLine(hunkDiff));
        });
        currentHunk = [];
      }
      oldStart = diff.oldLineNumber! + 1;
      newStart = diff.newLineNumber! + 1;
    } else {
      currentHunk.push(diff);
    }
  }
  
  // Output final hunk if exists
  if (currentHunk.length > 0) {
    lines.push(formatHunkHeader(oldStart, newStart, currentHunk));
    currentHunk.forEach(hunkDiff => {
      lines.push(formatDiffLine(hunkDiff));
    });
  }
  
  return lines.join('\n');
};

const formatHunkHeader = (oldStart: number, newStart: number, hunk: DiffResult[]): string => {
  const oldCount = hunk.filter(d => d.type === 'delete' || d.type === 'equal').length;
  const newCount = hunk.filter(d => d.type === 'insert' || d.type === 'equal').length;
  
  return `@@ -${oldStart},${oldCount} +${newStart},${newCount} @@`;
};

const formatDiffLine = (diff: DiffResult): string => {
  switch (diff.type) {
    case 'insert':
      return `+${diff.newText}`;
    case 'delete':
      return `-${diff.oldText}`;
    case 'equal':
      return ` ${diff.oldText}`;
    default:
      return diff.oldText;
  }
};

export const highlightInlineDiff = (oldText: string, newText: string): { old: string; new: string } => {
  if (oldText === newText) {
    return { old: oldText, new: newText };
  }

  const oldChars = oldText.split('');
  const newChars = newText.split('');
  const charLcs = computeLCS(oldChars, newChars);
  
  const oldHighlighted = buildCharHighlight(oldChars, newChars, charLcs, 'old');
  const newHighlighted = buildCharHighlight(oldChars, newChars, charLcs, 'new');
  
  return { old: oldHighlighted, new: newHighlighted };
};

const buildCharHighlight = (oldChars: string[], newChars: string[], lcs: number[][], type: 'old' | 'new'): string => {
  const result: string[] = [];
  let i = oldChars.length;
  let j = newChars.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldChars[i - 1] === newChars[j - 1]) {
      // Equal character
      if (type === 'old') {
        result.unshift(oldChars[i - 1]);
      } else {
        result.unshift(newChars[j - 1]);
      }
      i--;
      j--;
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      // Insertion
      if (type === 'new') {
        result.unshift(`<span class="bg-green-200">${escapeHtml(newChars[j - 1])}</span>`);
      }
      j--;
    } else if (i > 0) {
      // Deletion
      if (type === 'old') {
        result.unshift(`<span class="bg-red-200">${escapeHtml(oldChars[i - 1])}</span>`);
      }
      i--;
    }
  }

  return result.join('');
};

const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const splitTextIntoWords = (text: string): string[] => {
  return text.split(/(\s+)/).filter(word => word.length > 0);
};

export const computeWordDiff = (oldText: string, newText: string): DiffResult[] => {
  const oldWords = splitTextIntoWords(oldText);
  const newWords = splitTextIntoWords(newText);
  
  const lcs = computeLCS(oldWords, newWords);
  return buildDiffResult(oldWords, newWords, lcs);
};