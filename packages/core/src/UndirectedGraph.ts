export class UndirectedGraph<T> {
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

    // 添加边（自动添加顶点）
    addEdge(vertex1: T, vertex2: T): void {
        if (!this.adjacencyList.has(vertex1)) this.addVertex(vertex1);
        if (!this.adjacencyList.has(vertex2)) this.addVertex(vertex2);

        const neighbors1 = this.adjacencyList.get(vertex1)!;
        const neighbors2 = this.adjacencyList.get(vertex2)!;

        if (!neighbors1.includes(vertex2)) neighbors1.push(vertex2);
        if (!neighbors2.includes(vertex1)) neighbors2.push(vertex1);
    }

    // 删除边
    removeEdge(vertex1: T, vertex2: T): void {
        if (this.adjacencyList.has(vertex1)) {
            const neighbors = this.adjacencyList.get(vertex1)!;
            const index = neighbors.indexOf(vertex2);
            if (index > -1) neighbors.splice(index, 1);
        }

        if (this.adjacencyList.has(vertex2)) {
            const neighbors = this.adjacencyList.get(vertex2)!;
            const index = neighbors.indexOf(vertex1);
            if (index > -1) neighbors.splice(index, 1);
        }
    }

    // 删除顶点
    removeVertex(vertex: T): void {
        if (!this.adjacencyList.has(vertex)) return;

        // 删除所有相关边
        const neighbors = this.adjacencyList.get(vertex)!;
        for (const neighbor of neighbors) {
            this.removeEdge(neighbor, vertex);
        }

        // 删除顶点
        this.adjacencyList.delete(vertex);
    }

    // 获取顶点邻居
    getNeighbors(vertex: T): T[] {
        return this.adjacencyList.get(vertex)?.slice() || [];
    }

    // 获取所有顶点
    getVertices(): T[] {
        return Array.from(this.adjacencyList.keys());
    }

    // 深度优先遍历 (递归)
    dfs(startVertex: T, callback?: (vertex: T) => void): T[] {
        const visited = new Set<T>();
        const result: T[] = [];

        const dfsVisit = (vertex: T) => {
            visited.add(vertex);
            result.push(vertex);
            callback?.(vertex);

            const neighbors = this.getNeighbors(vertex);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    dfsVisit(neighbor);
                }
            }
        };

        if (this.adjacencyList.has(startVertex)) {
            dfsVisit(startVertex);
        }
        return result;
    }

    // 广度优先遍历
    bfs(startVertex: T, callback?: (vertex: T) => void): T[] {
        const visited = new Set<T>();
        const queue: T[] = [];
        const result: T[] = [];

        if (this.adjacencyList.has(startVertex)) {
            visited.add(startVertex);
            queue.push(startVertex);

            while (queue.length > 0) {
                const current = queue.shift()!;
                result.push(current);
                callback?.(current);

                for (const neighbor of this.getNeighbors(current)) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);
                    }
                }
            }
        }
        return result;
    }

    // 打印图结构
    print(): string {
        let result = "";
        for (const [vertex, neighbors] of this.adjacencyList) {
            result += `${vertex} -> ${neighbors.join(", ")}\n`;
        }
        return result;
    }
}
