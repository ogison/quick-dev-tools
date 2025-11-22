'use client';

import { Check, Mail, MessageSquare, Send, User, AlertCircle } from 'lucide-react';
import { useState, useCallback } from 'react';


import CommonLayoutWithHeader from '@/components/layout/CommonLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
      <CommonLayoutWithHeader
        title="お問い合わせ"
        description="ご質問やご意見がございましたら、お気軽にお問い合わせください。"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'お問い合わせ', isCurrentPage: true },
        ]}
      >
        <Card className="border-green-200 bg-green-50 shadow-lg dark:border-green-700 dark:bg-green-900/20">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-green-800 dark:text-green-300">
              お問い合わせありがとうございます
            </h2>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              新しいお問い合わせ
            </Button>
          </CardContent>
        </Card>
      </CommonLayoutWithHeader>
    );
  }

  return (
    <CommonLayoutWithHeader
      title="お問い合わせ"
      description="ご質問やご意見がございましたら、お気軽にお問い合わせください。"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'お問い合わせ', isCurrentPage: true },
      ]}
    >

        <Card className="border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-8">
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
          </CardContent>
        </Card>
    </CommonLayoutWithHeader>
  );
}
