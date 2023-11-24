export class PriorityQueue<T> {
  private elements: T[];

  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.elements = [];
    this.compare = compare;
  }

  enqueue(element: T): void {
    this.elements.push(element);
    this.heapifyUp();
  }

  dequeue(): T | undefined {
    const root = this.elements[0];
    const last = this.elements.pop();

    if (this.elements.length > 0 && last !== undefined) {
      this.elements[0] = last;
      this.heapifyDown();
    }

    return root;
  }

  private heapifyUp(): void {
    let index = this.elements.length - 1;

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.elements[index], this.elements[parentIndex]) < 0) {
        this.swap(index, parentIndex);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  private heapifyDown(): void {
    let index = 0;

    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let smallestChildIndex = index;

      if (
        leftChildIndex < this.elements.length &&
        this.compare(
          this.elements[leftChildIndex],
          this.elements[smallestChildIndex],
        ) < 0
      ) {
        smallestChildIndex = leftChildIndex;
      }

      if (
        rightChildIndex < this.elements.length &&
        this.compare(
          this.elements[rightChildIndex],
          this.elements[smallestChildIndex],
        ) < 0
      ) {
        smallestChildIndex = rightChildIndex;
      }

      if (smallestChildIndex !== index) {
        this.swap(index, smallestChildIndex);
        index = smallestChildIndex;
      } else {
        break;
      }
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.elements[i];
    this.elements[i] = this.elements[j];
    this.elements[j] = temp;
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }

  peek(): T | undefined {
    return this.elements[0];
  }

  size(): number {
    return this.elements.length;
  }

  // 获取前 k 个元素
  getTopK(k: number): T[] {
    const topK: T[] = [];
    const clonedQueue = new PriorityQueue<T>(this.compare);

    // 克隆当前队列，以保留原队列的元素
    clonedQueue.elements = [...this.elements];

    // 获取前 k 个元素
    for (let i = 0; i < k && !clonedQueue.isEmpty(); i++) {
      topK.push(clonedQueue.dequeue()!);
    }

    return topK;
  }
}

// 示例使用：
// 定义一个比较函数，例如按照数字大小升序排列
// const compareFunction = (a: number, b: number) => a - b;

// 创建一个优先队列实例
// const priorityQueue = new PriorityQueue<number>(compareFunction);

// 入队
// priorityQueue.enqueue(3);
// priorityQueue.enqueue(1);
// priorityQueue.enqueue(4);
// priorityQueue.enqueue(2);
// priorityQueue.enqueue(5);

// 获取前 3 个元素
// const top3 = priorityQueue.getTopK(3);
// console.log(top3); // 输出 [1, 2, 3]
