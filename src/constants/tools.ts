import { ToolConfig } from '@/features/tools/types';

export const TOOL_CONFIGS: ToolConfig[] = [
  {
    id: 'json',
    name: 'JSON整形化ツール',
    description: 'JSONを美しく整形・検証'
  },
  {
    id: 'base64',
    name: 'Base64エンコード/デコード',
    description: 'Base64の変換処理'
  },
  {
    id: 'url',
    name: 'URLエンコード/デコード',
    description: 'URL文字列の変換処理'
  },
  {
    id: 'hash',
    name: 'ハッシュ生成ツール',
    description: 'MD5, SHA1, SHA256ハッシュ生成'
  },
  {
    id: 'regex',
    name: '正規表現テスター',
    description: '正規表現のテスト・検証'
  },
  {
    id: 'color',
    name: 'カラーパレット生成器',
    description: '開発用カラーコード生成'
  },
  {
    id: 'qr',
    name: 'QRコード生成器',
    description: 'テキストからQRコード生成'
  },
  {
    id: 'password',
    name: 'パスワード生成器',
    description: 'セキュアなパスワード生成'
  },
  {
    id: 'timestamp',
    name: 'タイムスタンプ変換器',
    description: 'Unix時間と日時の相互変換'
  },
  {
    id: 'lorem',
    name: 'Lorem Ipsum生成器',
    description: 'ダミーテキスト生成'
  }
];