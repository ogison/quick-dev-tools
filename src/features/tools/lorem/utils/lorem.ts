export function generateLoremIpsum(
  paragraphs: number = 1,
  wordsPerParagraph: number = 50
): string {
  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const result = [];
  
  for (let i = 0; i < paragraphs; i++) {
    const paragraph = [];
    
    for (let j = 0; j < wordsPerParagraph; j++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      paragraph.push(j === 0 ? capitalize(randomWord) : randomWord);
    }
    
    result.push(paragraph.join(' ') + '.');
  }
  
  return result.join('\n\n');
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function generateJapaneseLoremIpsum(
  paragraphs: number = 1,
  wordsPerParagraph: number = 30
): string {
  const words = [
    'あの', 'イーハトーヴォ', 'の', 'すき', 'とおった', '風', 'の', 'なかから',
    'また', 'どこか', 'で', 'きっと', 'みんな', 'の', 'いい', 'ことば', 'が',
    'きこえる', 'とき', 'が', 'くる', 'でしょう', 'それでは', 'みなさん', 'さようなら',
    '春', '夏', '秋', '冬', '山', '川', '海', '空', '雲', '風', '雨', '雪',
    '花', '鳥', '虫', '魚', '木', '草', '石', '水', '火', '土', '光', '影'
  ];

  const result = [];
  
  for (let i = 0; i < paragraphs; i++) {
    const paragraph = [];
    
    for (let j = 0; j < wordsPerParagraph; j++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      paragraph.push(randomWord);
    }
    
    result.push(paragraph.join('') + '。');
  }
  
  return result.join('\n\n');
}