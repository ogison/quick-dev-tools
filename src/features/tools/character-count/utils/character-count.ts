export interface CharacterCountResult {
  characters: number;
  charactersWithoutSpaces: number;
  bytes: number;
  words: number;
  lines: number;
  paragraphs: number;
  hiragana: number;
  katakana: number;
  kanji: number;
  alphabetic: number;
  numeric: number;
  symbols: number;
  spaces: number;
}

export function countCharacters(text: string): CharacterCountResult {
  if (!text) {
    return {
      characters: 0,
      charactersWithoutSpaces: 0,
      bytes: 0,
      words: 0,
      lines: 0,
      paragraphs: 0,
      hiragana: 0,
      katakana: 0,
      kanji: 0,
      alphabetic: 0,
      numeric: 0,
      symbols: 0,
      spaces: 0,
    };
  }

  const characters = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, '').length;
  const bytes = new TextEncoder().encode(text).length;
  
  // Lines count
  const lines = text === '' ? 0 : text.split('\n').length;
  
  // Paragraphs count (empty lines separate paragraphs)
  const paragraphs = text.trim() === '' ? 0 : text.trim().split(/\n\s*\n/).filter(p => p.trim() !== '').length;
  
  // Words count (considering Japanese text)
  const words = countWords(text);
  
  // Character type counts
  let hiragana = 0;
  let katakana = 0;
  let kanji = 0;
  let alphabetic = 0;
  let numeric = 0;
  let symbols = 0;
  let spaces = 0;
  
  for (const char of text) {
    if (/[\u3040-\u309F]/.test(char)) {
      hiragana++;
    } else if (/[\u30A0-\u30FF]/.test(char)) {
      katakana++;
    } else if (/[\u4E00-\u9FAF\u3400-\u4DBF]/.test(char)) {
      kanji++;
    } else if (/[a-zA-Z]/.test(char)) {
      alphabetic++;
    } else if (/[0-9]/.test(char)) {
      numeric++;
    } else if (/\s/.test(char)) {
      spaces++;
    } else {
      symbols++;
    }
  }

  return {
    characters,
    charactersWithoutSpaces,
    bytes,
    words,
    lines,
    paragraphs,
    hiragana,
    katakana,
    kanji,
    alphabetic,
    numeric,
    symbols,
    spaces,
  };
}

function countWords(text: string): number {
  if (!text.trim()) {return 0;}
  
  // Japanese text handling
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  let wordCount = 0;
  
  // Split by whitespace and punctuation for basic word counting
  const segments = text.split(/\s+/).filter(segment => segment.length > 0);
  
  for (const segment of segments) {
    if (japaneseRegex.test(segment)) {
      // For Japanese text, count each character as a word unit
      // This is a simplified approach - in reality, Japanese word segmentation is complex
      const japaneseChars = segment.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g);
      const englishWords = segment.match(/[a-zA-Z]+/g);
      const numbers = segment.match(/[0-9]+/g);
      
      wordCount += (japaneseChars?.length || 0);
      wordCount += (englishWords?.length || 0);
      wordCount += (numbers?.length || 0);
    } else {
      // For English text, split by word boundaries
      const words = segment.match(/\b\w+\b/g);
      wordCount += words?.length || 0;
    }
  }
  
  return wordCount;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('ja-JP');
}

export function calculateReadingTime(characterCount: number): string {
  // Average reading speed for Japanese: 300-600 characters per minute
  // Using 400 characters per minute as average
  const avgCharsPerMinute = 400;
  const minutes = Math.ceil(characterCount / avgCharsPerMinute);
  
  if (minutes < 1) {
    return '1分未満';
  } else if (minutes < 60) {
    return `約${minutes}分`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes > 0) {
      return `約${hours}時間${remainingMinutes}分`;
    } else {
      return `約${hours}時間`;
    }
  }
}

export function getTextStatsSummary(result: CharacterCountResult): string {
  const stats = [
    `文字数: ${formatNumber(result.characters)}`,
    `単語数: ${formatNumber(result.words)}`,
    `行数: ${formatNumber(result.lines)}`,
    `バイト数: ${formatNumber(result.bytes)}`,
  ];
  
  return stats.join(' | ');
}