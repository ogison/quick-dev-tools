import { renderHook, act } from '@testing-library/react';

import { useCopyToClipboard } from '../useCopyToClipboard';

// Mock navigator.clipboard
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should copy text to clipboard', async () => {
    mockWriteText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(mockWriteText).toHaveBeenCalledWith('test text');
    expect(result.current.copied).toBe(true);
  });

  it('should reset copied state after timeout', async () => {
    mockWriteText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
  });

  it('should copy with key and manage state', async () => {
    mockWriteText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copyWithKey('test text', 'test-key');
    });

    expect(result.current.copyState['test-key']).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.copyState['test-key']).toBe(false);
  });

  it('should handle clipboard API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockWriteText.mockRejectedValue(new Error('Clipboard error'));

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(consoleSpy).toHaveBeenCalledWith('コピーに失敗しました:', expect.any(Error));
    expect(result.current.copied).toBe(false);

    consoleSpy.mockRestore();
  });
});
