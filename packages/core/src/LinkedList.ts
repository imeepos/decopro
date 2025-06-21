// 定义链表节点类
export class ListNode<T> {
    value: T; // 节点存储的值
    next: ListNode<T> | null; // 指向下一个节点的指针

    constructor(value: T) {
        this.value = value;
        this.next = null; // 初始时下一个节点为空
    }
}

// 定义链表类
export class LinkedList<T> {
    private head: ListNode<T> | null; // 链表头节点
    private tail: ListNode<T> | null; // 链表尾节点
    private _size: number; // 链表长度

    constructor() {
        this.head = null;
        this.tail = null;
        this._size = 0;
    }

    // 在链表尾部添加元素
    append(value: T): void {
        const newNode = new ListNode(value);

        if (this.tail) {
            this.tail.next = newNode; // 当前尾节点指向新节点
        } else {
            this.head = newNode; // 如果链表为空，新节点设为头节点
        }

        this.tail = newNode; // 更新尾节点为新节点
        this._size++;
    }

    // 在链表头部添加元素
    prepend(value: T): void {
        const newNode = new ListNode(value);

        if (this.head) {
            newNode.next = this.head; // 新节点指向当前头节点
        } else {
            this.tail = newNode; // 如果链表为空，新节点设为尾节点
        }

        this.head = newNode; // 更新头节点为新节点
        this._size++;
    }

    // 在指定索引位置插入元素
    insertAt(index: number, value: T): void {
        if (index < 0 || index > this._size) {
            throw new Error("Index out of bounds");
        }

        if (index === 0) {
            this.prepend(value);
            return;
        }

        if (index === this._size) {
            this.append(value);
            return;
        }

        const newNode = new ListNode(value);
        const prevNode = this.getNodeAt(index - 1)!; // 获取前一个节点

        // 插入新节点
        newNode.next = prevNode.next;
        prevNode.next = newNode;
        this._size++;
    }

    // 删除指定索引位置的节点
    removeAt(index: number): T | null {
        if (index < 0 || index >= this._size) {
            return null;
        }

        // 删除头节点
        if (index === 0) {
            const removedValue = this.head!.value;
            this.head = this.head!.next;

            // 如果链表只有一个节点
            if (this._size === 1) {
                this.tail = null;
            }

            this._size--;
            return removedValue;
        }

        const prevNode = this.getNodeAt(index - 1)!;
        const removedNode = prevNode.next!;
        prevNode.next = removedNode.next;

        // 如果删除的是尾节点
        if (index === this._size - 1) {
            this.tail = prevNode;
        }

        this._size--;
        return removedNode.value;
    }

    // 删除第一个匹配值的节点
    remove(value: T): T | null {
        let current = this.head;
        let prev: ListNode<T> | null = null;

        while (current) {
            if (current.value === value) {
                if (prev) {
                    prev.next = current.next;

                    // 如果删除的是尾节点
                    if (current === this.tail) {
                        this.tail = prev;
                    }
                } else {
                    // 删除头节点
                    this.head = current.next;

                    // 如果链表只有一个节点
                    if (this._size === 1) {
                        this.tail = null;
                    }
                }

                this._size--;
                return value;
            }

            prev = current;
            current = current.next;
        }

        return null; // 未找到匹配值
    }

    // 查找值对应的索引
    indexOf(value: T): number {
        let current = this.head;
        let index = 0;

        while (current) {
            if (current.value === value) {
                return index;
            }
            current = current.next;
            index++;
        }

        return -1; // 未找到
    }

    // 获取链表大小
    size(): number {
        return this._size;
    }

    // 检查链表是否为空
    isEmpty(): boolean {
        return this._size === 0;
    }

    // 将链表转换为数组
    toArray(): T[] {
        const result: T[] = [];
        let current = this.head;

        while (current) {
            result.push(current.value);
            current = current.next;
        }

        return result;
    }

    // 获取指定索引位置的节点（私有方法）
    private getNodeAt(index: number): ListNode<T> | null {
        if (index < 0 || index >= this._size) return null;

        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current!.next;
        }
        return current;
    }
}
