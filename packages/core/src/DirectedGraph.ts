export class DirectedGraph<T> {
    private adjacencyList: Map<T, T[]>;

    constructor() {
        this.adjacencyList = new Map();
    }

    // 添加顶点
    addVertex(vertex: T): void {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }

    // 添加边（有向）
    addEdge(from: T, to: T): void {
        if (!this.adjacencyList.has(from)) this.addVertex(from);
        if (!this.adjacencyList.has(to)) this.addVertex(to);

        const edges = this.adjacencyList.get(from)!;
        if (!edges.includes(to)) {
            edges.push(to);
        }
    }

    // 删除边
    removeEdge(from: T, to: T): void {
        const edges = this.adjacencyList.get(from);
        if (edges) {
            const index = edges.indexOf(to);
            if (index !== -1) {
                edges.splice(index, 1);
            }
        }
    }

    // 删除顶点（同时删除相关边）
    removeVertex(vertex: T): void {
        // 删除该顶点作为起点的边
        this.adjacencyList.delete(vertex);

        // 删除其他顶点指向该顶点的边
        for (const [_, edges] of this.adjacencyList) {
            const index = edges.indexOf(vertex);
            if (index !== -1) {
                edges.splice(index, 1);
            }
        }
    }

    // 获取所有顶点
    getVertices(): T[] {
        return Array.from(this.adjacencyList.keys());
    }

    // 获取顶点的邻接节点（出边）
    getNeighbors(vertex: T): T[] {
        return [...(this.adjacencyList.get(vertex) || [])];
    }

    // 深度优先遍历
    dfs(start: T, callback: (vertex: T) => void): void {
        const visited = new Set<T>();
        const stack: T[] = [start];

        while (stack.length) {
            const vertex = stack.pop()!;
            if (!visited.has(vertex)) {
                visited.add(vertex);
                callback(vertex);
                this.getNeighbors(vertex)
                    .reverse()
                    .forEach((neighbor) => {
                        if (!visited.has(neighbor)) {
                            stack.push(neighbor);
                        }
                    });
            }
        }
    }

    // 广度优先遍历
    bfs(start: T, callback: (vertex: T) => void): void {
        const visited = new Set<T>([start]);
        const queue: T[] = [start];

        while (queue.length) {
            const vertex = queue.shift()!;
            callback(vertex);

            this.getNeighbors(vertex).forEach((neighbor) => {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            });
        }
    }

    // 拓扑排序（Kahn算法）
    topologicalSort(): T[] | null {
        const inDegree = new Map<T, number>();
        const queue: T[] = [];
        const result: T[] = [];

        // 初始化入度
        for (const vertex of this.adjacencyList.keys()) {
            inDegree.set(vertex, 0);
        }

        // 计算入度
        for (const neighbors of this.adjacencyList.values()) {
            for (const neighbor of neighbors) {
                inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
            }
        }

        // 入度为0的节点入队
        for (const [vertex, degree] of inDegree) {
            if (degree === 0) queue.push(vertex);
        }

        // 处理队列
        while (queue.length) {
            const vertex = queue.shift()!;
            result.push(vertex);

            for (const neighbor of this.getNeighbors(vertex)) {
                const newDegree = inDegree.get(neighbor)! - 1;
                inDegree.set(neighbor, newDegree);
                if (newDegree === 0) queue.push(neighbor);
            }
        }

        // 检查是否有环
        return result.length === this.adjacencyList.size ? result : null;
    }

    // 检测环（使用拓扑排序）
    hasCycle(): boolean {
        return this.topologicalSort() === null;
    }

    // 检测环（DFS方法）
    hasCycleDFS(): boolean {
        const visited = new Set<T>();
        const recStack = new Set<T>();

        const isCyclic = (vertex: T): boolean => {
            if (!visited.has(vertex)) {
                visited.add(vertex);
                recStack.add(vertex);

                for (const neighbor of this.getNeighbors(vertex)) {
                    if (!visited.has(neighbor) && isCyclic(neighbor)) {
                        return true;
                    } else if (recStack.has(neighbor)) {
                        return true;
                    }
                }
            }

            recStack.delete(vertex);
            return false;
        };

        for (const vertex of this.adjacencyList.keys()) {
            if (isCyclic(vertex)) return true;
        }
        return false;
    }
}
