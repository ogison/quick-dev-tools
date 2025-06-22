// Web Worker Manager utility
class WorkerManager {
  private workers: Map<string, Worker> = new Map();
  private messageId = 0;
  private pendingMessages: Map<number, { resolve: (value: any) => void; reject: (error: Error) => void }> = new Map();

  private getWorker(workerType: string): Worker {
    if (!this.workers.has(workerType)) {
      const worker = new Worker(`/workers/${workerType}-worker.js`);
      worker.onmessage = this.handleWorkerMessage.bind(this);
      worker.onerror = this.handleWorkerError.bind(this);
      this.workers.set(workerType, worker);
    }
    return this.workers.get(workerType)!;
  }

  private handleWorkerMessage(event: MessageEvent) {
    const { id, type, result, error } = event.data;
    const pending = this.pendingMessages.get(id);
    
    if (pending) {
      this.pendingMessages.delete(id);
      
      if (type === 'ERROR') {
        pending.reject(new Error(error));
      } else {
        pending.resolve(result);
      }
    }
  }

  private handleWorkerError(error: ErrorEvent) {
    console.error('Worker error:', error);
    // Reject all pending messages
    this.pendingMessages.forEach(({ reject }) => {
      reject(new Error('Worker error occurred'));
    });
    this.pendingMessages.clear();
  }

  public postMessage(workerType: string, messageType: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = ++this.messageId;
      const worker = this.getWorker(workerType);
      
      this.pendingMessages.set(id, { resolve, reject });
      
      worker.postMessage({
        id,
        type: messageType,
        data
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingMessages.has(id)) {
          this.pendingMessages.delete(id);
          reject(new Error('Worker operation timeout'));
        }
      }, 30000);
    });
  }

  public terminateWorker(workerType: string) {
    const worker = this.workers.get(workerType);
    if (worker) {
      worker.terminate();
      this.workers.delete(workerType);
    }
  }

  public terminateAllWorkers() {
    this.workers.forEach((worker) => worker.terminate());
    this.workers.clear();
    this.pendingMessages.clear();
  }

  public cleanup() {
    // Clear timeouts and pending messages
    this.pendingMessages.forEach(({ reject }) => {
      reject(new Error('Worker manager cleanup'));
    });
    this.pendingMessages.clear();
    this.terminateAllWorkers();
  }

  public getWorkerCount(): number {
    return this.workers.size;
  }

  public getPendingMessageCount(): number {
    return this.pendingMessages.size;
  }
}

// Singleton instance
export const workerManager = new WorkerManager();

// Cleanup on page unload and visibility change
if (typeof window !== 'undefined') {
  const cleanup = () => workerManager.terminateAllWorkers();
  
  window.addEventListener('beforeunload', cleanup);
  window.addEventListener('pagehide', cleanup);
  
  // Cleanup when page becomes hidden for more than 5 minutes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      setTimeout(() => {
        if (document.hidden) {
          workerManager.cleanup();
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
  });
}