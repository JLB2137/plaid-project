// Request Queue
export class RequestQueue {
    queue: (() => Promise<void>)[] = [];
    delay: number;
    processing = false;
  
    constructor(delay: number) {
      this.delay = delay; // Delay between requests in ms
    }
  
    enqueue(request: () => Promise<void>) {
      this.queue.push(request);
      this.processQueue();
    }
  
    async processQueue() {
      if (this.processing) return;
      this.processing = true;
  
      while (this.queue.length > 0) {
        const nextRequest = this.queue.shift();
        if (nextRequest) {
          const sendRequest = async () => {
            await nextRequest()
          }
          
          setTimeout(sendRequest,this.delay);
        }
      }
  
      this.processing = false;
    }
}