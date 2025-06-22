import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export type GenerationType = 'words' | 'sentences' | 'paragraphs';
export type TextLanguage = 'latin' | 'japanese' | 'programming';
export type OutputFormat = 'plain' | 'html' | 'markdown';

export interface TextStatistics {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
}

// Latin Lorem Ipsum words
const LATIN_WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
  'at',
  'vero',
  'eos',
  'accusantium',
  'et',
  'iusto',
  'odio',
  'dignissimos',
  'ducimus',
  'blanditiis',
  'praesentium',
  'voluptatum',
  'deleniti',
  'atque',
  'corrupti',
  'quos',
  'dolores',
];

// Japanese words inspired by classic literature
const JAPANESE_WORDS = [
  'あの',
  'イーハトーヴォ',
  'の',
  'すき',
  'とおった',
  '風',
  'の',
  'なかから',
  'また',
  'どこか',
  'で',
  'きっと',
  'みんな',
  'の',
  'いい',
  'ことば',
  'が',
  'きこえる',
  'とき',
  'が',
  'くる',
  'でしょう',
  'それでは',
  'みなさん',
  'さようなら',
  '春',
  '夏',
  '秋',
  '冬',
  '山',
  '川',
  '海',
  '空',
  '雲',
  '風',
  '雨',
  '雪',
  '花',
  '鳥',
  '虫',
  '魚',
  '木',
  '草',
  '石',
  '水',
  '火',
  '土',
  '光',
  '影',
  '朝',
  '昼',
  '夜',
  '月',
  '星',
  '太陽',
  '森',
  '野',
  '谷',
  '峠',
  '道',
  '橋',
  '家',
  '町',
  '村',
  '人',
  '子',
  '母',
  '父',
  '友',
  '先生',
  '学校',
  '本',
  '机',
  '窓',
  '扉',
  '庭',
  '池',
  '井戸',
  '畑',
  '田',
  '麦',
  '米',
  '茶',
  '酒',
  '食',
];

// Programming-style words
const PROGRAMMING_WORDS = [
  'function',
  'variable',
  'array',
  'object',
  'string',
  'number',
  'boolean',
  'const',
  'let',
  'var',
  'if',
  'else',
  'for',
  'while',
  'return',
  'import',
  'export',
  'class',
  'interface',
  'type',
  'async',
  'await',
  'promise',
  'callback',
  'handler',
  'component',
  'props',
  'state',
  'event',
  'data',
  'config',
  'utils',
  'helper',
  'service',
  'api',
  'endpoint',
  'request',
  'response',
  'error',
  'success',
  'loading',
  'pending',
  'complete',
];

export const useLoremGenerator = () => {
  const [generationType, setGenerationType] = useState<GenerationType>('paragraphs');
  const [count, setCount] = useState(3);
  const [language, setLanguage] = useState<TextLanguage>('latin');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('plain');
  const [generatedText, setGeneratedText] = useState('');
  const [statistics, setStatistics] = useState<TextStatistics>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
  });
  const [autoGenerate, setAutoGenerate] = useState(false);

  // Get word list based on language
  const getWordList = (lang: TextLanguage): string[] => {
    switch (lang) {
      case 'japanese':
        return JAPANESE_WORDS;
      case 'programming':
        return PROGRAMMING_WORDS;
      default:
        return LATIN_WORDS;
    }
  };

  // Generate random words
  const generateWords = (wordCount: number, wordList: string[]): string[] => {
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    return words;
  };

  // Generate sentences
  const generateSentences = (sentenceCount: number, wordList: string[]): string[] => {
    const sentences: string[] = [];
    for (let i = 0; i < sentenceCount; i++) {
      const wordCount = Math.floor(Math.random() * 12) + 8; // 8-19 words per sentence
      const words = generateWords(wordCount, wordList);
      const sentence = words.join(' ');
      const capitalizedSentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      sentences.push(capitalizedSentence + (language === 'japanese' ? '。' : '.'));
    }
    return sentences;
  };

  // Generate paragraphs
  const generateParagraphs = (paragraphCount: number, wordList: string[]): string[] => {
    const paragraphs: string[] = [];
    for (let i = 0; i < paragraphCount; i++) {
      const sentenceCount = Math.floor(Math.random() * 4) + 4; // 4-7 sentences per paragraph
      const sentences = generateSentences(sentenceCount, wordList);
      paragraphs.push(sentences.join(' '));
    }
    return paragraphs;
  };

  // Format output based on format type
  const formatOutput = (content: string[], format: OutputFormat): string => {
    switch (format) {
      case 'html':
        if (generationType === 'paragraphs') {
          return content.map((p) => `<p>${p}</p>`).join('\\n');
        } else if (generationType === 'sentences') {
          return `<p>${content.join(' ')}</p>`;
        } else {
          return `<p>${content.join(' ')}</p>`;
        }
      case 'markdown':
        if (generationType === 'paragraphs') {
          return content.join('\\n\\n');
        } else {
          return content.join(' ');
        }
      default:
        if (generationType === 'paragraphs') {
          return content.join('\\n\\n');
        } else {
          return content.join(' ');
        }
    }
  };

  // Calculate text statistics
  const calculateStatistics = (text: string): TextStatistics => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\\s+/).length : 0;
    const sentences = text.split(/[.。!?！？]/).filter((s) => s.trim()).length;
    const paragraphs = text.split(/\\n\\s*\\n/).filter((p) => p.trim()).length;

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
    };
  };

  // Generate text
  const generateText = useCallback(() => {
    if (count <= 0) {
      toast.error('0より大きい数値を入力してください');
      return;
    }

    const wordList = getWordList(language);
    let content: string[] = [];

    switch (generationType) {
      case 'words':
        content = generateWords(count, wordList);
        break;
      case 'sentences':
        content = generateSentences(count, wordList);
        break;
      case 'paragraphs':
        content = generateParagraphs(count, wordList);
        break;
    }

    const formattedText = formatOutput(content, outputFormat);
    setGeneratedText(formattedText);
    setStatistics(calculateStatistics(formattedText));
  }, [generationType, count, language, outputFormat]);

  // Auto-generate when settings change
  useEffect(() => {
    if (autoGenerate && count > 0) {
      generateText();
    }
  }, [generationType, count, language, outputFormat, autoGenerate, generateText]);

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!generatedText.trim()) {
      toast.error('コピーするテキストがありません');
      return;
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(generatedText);
        toast.success('テキストをクリップボードにコピーしました');
      } else {
        toast.error('クリップボードへのコピーがサポートされていません');
      }
    } catch (err) {
      toast.error('コピーに失敗しました');
    }
  };

  // Clear all
  const clearAll = () => {
    setGeneratedText('');
    setStatistics({
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
    });
    setCount(3);
    setGenerationType('paragraphs');
    setLanguage('latin');
    setOutputFormat('plain');
    setAutoGenerate(false);
  };

  return {
    // State
    generationType,
    count,
    language,
    outputFormat,
    generatedText,
    statistics,
    autoGenerate,

    // Setters
    setGenerationType,
    setCount,
    setLanguage,
    setOutputFormat,
    setAutoGenerate,

    // Actions
    generateText,
    copyToClipboard,
    clearAll,
  };
};
