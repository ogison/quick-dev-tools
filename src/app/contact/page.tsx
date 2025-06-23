'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    type: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // 仮の送信処理（実際にはAPIエンドポイントに送信）
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 送信をシミュレート
      console.log('Form submitted:', formData);
      setSubmitStatus('success');
      // フォームをリセット
      setFormData({
        name: '',
        email: '',
        subject: '',
        type: 'general',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">お問い合わせ</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>お問い合わせフォーム</CardTitle>
              <CardDescription>
                ご質問、ご要望、バグ報告など、お気軽にお問い合わせください。
                通常、2営業日以内にご返信いたします。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    お名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="山田 太郎"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="mb-2 block text-sm font-medium">
                    お問い合わせ種別 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="general">一般的なご質問</option>
                    <option value="bug">バグ報告</option>
                    <option value="feature">機能リクエスト</option>
                    <option value="other">その他</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                    件名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="お問い合わせの件名"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium">
                    メッセージ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="お問い合わせ内容をご記入ください"
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="rounded-md bg-green-50 p-4 text-green-800">
                    お問い合わせを受け付けました。ご連絡ありがとうございます。
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="rounded-md bg-red-50 p-4 text-red-800">
                    送信中にエラーが発生しました。しばらく待ってから再度お試しください。
                  </div>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? '送信中...' : '送信する'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>よくあるご質問</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600">
                お問い合わせの前に、
                <a href="/faq" className="text-blue-600 hover:underline">
                  FAQ
                </a>
                をご確認ください。 多くの質問への回答が掲載されています。
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>バグ報告について</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-gray-600">
                バグを報告する際は、以下の情報をお知らせください：
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                <li>使用しているブラウザとバージョン</li>
                <li>エラーメッセージ（ある場合）</li>
                <li>問題を再現する手順</li>
                <li>期待される動作</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
