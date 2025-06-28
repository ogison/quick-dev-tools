'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';

import { Check, Mail, MessageSquare, Send, User, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'お名前は必須項目です';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須項目です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = '件名は必須項目です';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'メッセージは必須項目です';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'メッセージは10文字以上で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name, formData.email, formData.subject, formData.message]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        // TODO: 実際の送信処理をここに実装
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSubmitted(true);

        // フォームをリセット
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setErrors({});
      } catch (error) {
        console.error('送信エラー:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [setFormData, validateForm]
  );

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // エラーをクリア
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  const handleClear = () => {
    const shouldClear = Object.values(formData).some((value) => value.trim())
      ? window.confirm('フォームの内容をクリアします。よろしいですか？')
      : true;

    if (shouldClear) {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setErrors({});
      setIsSubmitted(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-900 dark:text-white">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Card className="border-green-200 bg-green-50 shadow-lg dark:border-green-700 dark:bg-green-900/20">
            <CardContent className="p-12 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-green-800 dark:text-green-300">
                お問い合わせありがとうございます
              </h2>
              <p className="mb-6 text-green-700 dark:text-green-400">
                お問い合わせを受け付けました。内容を確認の上、2-3営業日以内にご返信いたします。
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                新しいお問い合わせ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <nav className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          <ol className="list-reset flex">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="font-medium text-gray-900 dark:text-white">お問い合わせ</li>
          </ol>
        </nav>

        <div className="mb-12 text-left">
          <h1 className="mb-4 text-5xl font-bold">お問い合わせ</h1>
          <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            ご質問やご意見がございましたら、お気軽にお問い合わせください。
          </p>
        </div>

        <Card className="border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-8">
            <Tabs defaultValue="form" className="w-full">
              <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2 text-black dark:text-white">
                <TabsTrigger value="form">お問い合わせフォーム</TabsTrigger>
                <TabsTrigger value="info">お問い合わせについて</TabsTrigger>
              </TabsList>

              <TabsContent value="form" className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <User className="h-4 w-4" />
                        お名前 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={handleChange('name')}
                        className={`w-full rounded-lg border p-3 transition-colors focus:ring-2 focus:outline-none ${
                          errors.name
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-900/20'
                            : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900'
                        } dark:text-gray-100`}
                        placeholder="山田太郎"
                      />
                      {errors.name && (
                        <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Mail className="h-4 w-4" />
                        メールアドレス <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        className={`w-full rounded-lg border p-3 transition-colors focus:ring-2 focus:outline-none ${
                          errors.email
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-900/20'
                            : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900'
                        } dark:text-gray-100`}
                        placeholder="example@example.com"
                      />
                      {errors.email && (
                        <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <MessageSquare className="h-4 w-4" />
                      件名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={handleChange('subject')}
                      className={`w-full rounded-lg border p-3 transition-colors focus:ring-2 focus:outline-none ${
                        errors.subject
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-900/20'
                          : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900'
                      } dark:text-gray-100`}
                      placeholder="お問い合わせの件名をご入力ください"
                    />
                    {errors.subject && (
                      <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                        <AlertCircle className="h-3 w-3" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <MessageSquare className="h-4 w-4" />
                      メッセージ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={handleChange('message')}
                      rows={6}
                      className={`w-full rounded-lg border p-3 transition-colors focus:ring-2 focus:outline-none ${
                        errors.message
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-900/20'
                          : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900'
                      } dark:text-gray-100`}
                      placeholder="お問い合わせ内容を詳しくご記入ください（10文字以上）"
                    />
                    {errors.message && (
                      <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                        <AlertCircle className="h-3 w-3" />
                        {errors.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      現在の文字数: {formData.message.length}文字
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          送信中...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          送信
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleClear}
                      variant="outline"
                      className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      クリア
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="info" className="space-y-6">
                <div className="mx-auto max-w-2xl space-y-6">
                  <h3 className="text-center text-lg font-semibold">お問い合わせについて</h3>

                  <Card className="border-gray-200 dark:border-gray-700">
                    <CardContent className="space-y-4 p-6">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          📧 返信について
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          お問い合わせいただいた内容は、2-3営業日以内にご返信いたします。
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">⏰ 受付時間</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          平日 9:00 - 18:00（土日祝日は除く）
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          🔒 プライバシー
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          いただいた個人情報は、お問い合わせへの回答のみに使用し、適切に管理いたします。
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20">
                    <CardContent className="p-6">
                      <h4 className="mb-3 font-medium text-blue-900 dark:text-blue-300">
                        よくあるお問い合わせ
                      </h4>
                      <div className="space-y-3 text-sm text-blue-800 dark:text-blue-300">
                        <div>
                          <strong>Q: ツールの使い方がわからない</strong>
                          <p>各ツールページに使用方法の説明がございます。</p>
                        </div>
                        <div>
                          <strong>Q: 新しいツールのリクエスト</strong>
                          <p>お気軽にご要望をお聞かせください。検討いたします。</p>
                        </div>
                        <div>
                          <strong>Q: バグの報告</strong>
                          <p>具体的な手順と発生環境をお教えいただけると助かります。</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
