'use client';

import { Copy, Clock, RotateCcw, CheckCircle2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  buildCronExpression,
  parseCronExpression,
  getNextExecutions,
  describeCronExpression,
  CronField,
  DEFAULT_CRON,
} from '../utils/cron';

export default function CronGenerator() {
  const [cronFields, setCronFields] = useState<CronField>(DEFAULT_CRON);
  const [cronExpression, setCronExpression] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [nextExecutions, setNextExecutions] = useState<Date[]>([]);
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'visual' | 'manual'>('visual');

  useEffect(() => {
    if (mode === 'visual') {
      const expression = buildCronExpression(cronFields);
      setCronExpression(expression);
      setManualInput(expression);
      updateExecutions(expression);
    }
  }, [cronFields, mode]);

  useEffect(() => {
    if (mode === 'manual') {
      const parsed = parseCronExpression(manualInput);
      if (parsed) {
        setCronFields(parsed);
        setCronExpression(manualInput);
        updateExecutions(manualInput);
      }
    }
  }, [manualInput, mode]);

  const updateExecutions = (expression: string) => {
    try {
      const executions = getNextExecutions(expression, 5);
      setNextExecutions(executions);
      setDescription(describeCronExpression(expression));
    } catch {
      setNextExecutions([]);
      setDescription('Invalid cron expression');
    }
  };

  const handleFieldChange = (field: keyof CronField, value: string) => {
    setCronFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cronExpression);
  };

  const handleReset = () => {
    setCronFields(DEFAULT_CRON);
    setManualInput('');
  };

  const loadTemplate = (template: CronField) => {
    setCronFields(template);
    setMode('visual');
  };

  const templates = [
    { name: '毎分', cron: { minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    {
      name: '毎時0分',
      cron: { minute: '0', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' },
    },
    {
      name: '毎日午前9時',
      cron: { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '*' },
    },
    {
      name: '平日午前9時',
      cron: { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1-5' },
    },
    {
      name: '毎週月曜日',
      cron: { minute: '0', hour: '0', dayOfMonth: '*', month: '*', dayOfWeek: '1' },
    },
    {
      name: '毎月1日',
      cron: { minute: '0', hour: '0', dayOfMonth: '1', month: '*', dayOfWeek: '*' },
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Mode Selector */}
      <Card>
        <CardHeader>
          <CardTitle>入力モード</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={mode === 'visual' ? 'default' : 'outline'}
              onClick={() => setMode('visual')}
            >
              ビジュアルエディター
            </Button>
            <Button
              variant={mode === 'manual' ? 'default' : 'outline'}
              onClick={() => setMode('manual')}
            >
              手動入力
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle>テンプレート</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {templates.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => loadTemplate(template.cron)}
              >
                {template.name}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              リセット
            </Button>
          </div>
        </CardContent>
      </Card>

      {mode === 'visual' ? (
        /* Visual Editor */
        <Card>
          <CardHeader>
            <CardTitle>Cron式エディター</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <div>
                <Label htmlFor="minute">分 (0-59)</Label>
                <Input
                  id="minute"
                  placeholder="0, *, 0-30, */5"
                  value={cronFields.minute}
                  onChange={(e) => handleFieldChange('minute', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hour">時 (0-23)</Label>
                <Input
                  id="hour"
                  placeholder="0, *, 9-17, */2"
                  value={cronFields.hour}
                  onChange={(e) => handleFieldChange('hour', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="day">日 (1-31)</Label>
                <Input
                  id="day"
                  placeholder="1, *, 1-15, */2"
                  value={cronFields.dayOfMonth}
                  onChange={(e) => handleFieldChange('dayOfMonth', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="month">月 (1-12)</Label>
                <Input
                  id="month"
                  placeholder="1, *, 1-6, */3"
                  value={cronFields.month}
                  onChange={(e) => handleFieldChange('month', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dow">曜日 (0-7)</Label>
                <Input
                  id="dow"
                  placeholder="0, *, 1-5, 1,3,5"
                  value={cronFields.dayOfWeek}
                  onChange={(e) => handleFieldChange('dayOfWeek', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <div>• * = すべての値</div>
              <div>• 0-23 = 範囲指定</div>
              <div>• */5 = 5間隔</div>
              <div>• 1,3,5 = 個別指定</div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Manual Input */
        <Card>
          <CardHeader>
            <CardTitle>Cron式手動入力</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="manual">Cron式（5フィールド形式）</Label>
              <Input
                id="manual"
                placeholder="0 9 * * 1-5"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="font-mono"
              />
              <div className="text-sm text-gray-600">形式: 分 時 日 月 曜日</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Cron Expression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            生成されたCron式
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!cronExpression}>
              <Copy className="mr-2 h-4 w-4" />
              コピー
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded bg-gray-50 p-4 font-mono text-lg">
              {cronExpression || '0 0 * * *'}
            </div>

            {description && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  <strong>説明:</strong> {description}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Executions */}
      {nextExecutions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              次回実行予定時刻
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {nextExecutions.map((execution, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded bg-gray-50 p-3"
                >
                  <div className="font-mono">
                    {execution.toLocaleString('ja-JP', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      weekday: 'short',
                    })}
                  </div>
                  <Badge variant="outline">{index === 0 ? '次回' : `+${index}`}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
