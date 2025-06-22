'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});

  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            break;
          case 'first-input':
            setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }));
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({ 
                ...prev, 
                cls: (prev.cls || 0) + (entry as any).value 
              }));
            }
            break;
        }
      }
    });

    // Observe Core Web Vitals
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

    // Get navigation timing
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics(prev => ({
        ...prev,
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart
      }));
    }

    // Get FCP
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
    }

    return () => observer.disconnect();
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="mb-1 font-bold">Performance Metrics</div>
      {metrics.fcp && (
        <div className={metrics.fcp < 1500 ? 'text-green-400' : metrics.fcp < 2500 ? 'text-yellow-400' : 'text-red-400'}>
          FCP: {Math.round(metrics.fcp)}ms
        </div>
      )}
      {metrics.lcp && (
        <div className={metrics.lcp < 2500 ? 'text-green-400' : metrics.lcp < 4000 ? 'text-yellow-400' : 'text-red-400'}>
          LCP: {Math.round(metrics.lcp)}ms
        </div>
      )}
      {metrics.cls !== undefined && (
        <div className={metrics.cls < 0.1 ? 'text-green-400' : metrics.cls < 0.25 ? 'text-yellow-400' : 'text-red-400'}>
          CLS: {metrics.cls.toFixed(3)}
        </div>
      )}
      {metrics.fid && (
        <div className={metrics.fid < 100 ? 'text-green-400' : metrics.fid < 300 ? 'text-yellow-400' : 'text-red-400'}>
          FID: {Math.round(metrics.fid)}ms
        </div>
      )}
      {metrics.ttfb && (
        <div className={metrics.ttfb < 200 ? 'text-green-400' : metrics.ttfb < 500 ? 'text-yellow-400' : 'text-red-400'}>
          TTFB: {Math.round(metrics.ttfb)}ms
        </div>
      )}
    </div>
  );
}