
import type { Node, Grid } from '../types';

// --- UTILITY FUNCTIONS ---
function getNeighbors(node: Node, grid: Grid): Node[] {
    const neighbors: Node[] = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isWall);
}

function getPath(endNode: Node): Node[] {
    const path: Node[] = [];
    let currentNode: Node | null | undefined = endNode;
    while (currentNode) {
        path.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return path;
}

function manhattanDistance(nodeA: Node, nodeB: Node): number {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

// Simple Priority Queue implementation for A* and Dijkstra
class PriorityQueue {
    private nodes: Node[] = [];

    enqueue(node: Node) {
        this.nodes.push(node);
        this.nodes.sort((a, b) => (a.fScore ?? Infinity) - (b.fScore ?? Infinity));
    }

    dequeue(): Node | undefined {
        return this.nodes.shift();
    }

    isEmpty(): boolean {
        return this.nodes.length === 0;
    }
}

// --- ALGORITHMS ---

export function runAStar(grid: Grid, startNode: Node, endNode: Node) {
    const visitedNodesInOrder: Node[] = [];
    const openSet = new PriorityQueue();

    // Reset grid nodes for calculation
    grid.forEach(row => row.forEach(node => {
        node.gScore = Infinity;
        node.fScore = Infinity;
        node.hScore = 0;
        node.previousNode = null;
        node.isVisited = false;
    }));

    startNode.gScore = 0;
    startNode.hScore = manhattanDistance(startNode, endNode);
    startNode.fScore = startNode.hScore;
    
    openSet.enqueue(startNode);
    
    while (!openSet.isEmpty()) {
        const currentNode = openSet.dequeue()!;
        
        if(currentNode.isVisited) continue;
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        
        if (currentNode === endNode) {
            return { visitedNodesInOrder, path: getPath(endNode) };
        }
        
        const neighbors = getNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (neighbor.isVisited) continue;

            const tentativeGScore = (currentNode.gScore ?? 0) + 1; // Assuming weight of 1

            if (tentativeGScore < (neighbor.gScore ?? Infinity)) {
                neighbor.previousNode = currentNode;
                neighbor.gScore = tentativeGScore;
                neighbor.hScore = manhattanDistance(neighbor, endNode);
                neighbor.fScore = neighbor.gScore + neighbor.hScore;
                openSet.enqueue(neighbor);
            }
        }
    }
    
    return { visitedNodesInOrder, path: [] }; // Path not found
}

export function runDijkstra(grid: Grid, startNode: Node, endNode: Node) {
    const visitedNodesInOrder: Node[] = [];
    const unvisitedNodes: Node[] = grid.flat();

    grid.forEach(row => row.forEach(node => {
        node.distance = Infinity;
        node.previousNode = null;
        node.isVisited = false;
    }));
    
    startNode.distance = 0;

    while (unvisitedNodes.length) {
        unvisitedNodes.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
        const closestNode = unvisitedNodes.shift();

        if (!closestNode || closestNode.isWall) continue;
        if ((closestNode.distance ?? Infinity) === Infinity) return { visitedNodesInOrder, path: [] };

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        
        if (closestNode === endNode) return { visitedNodesInOrder, path: getPath(endNode) };

        const neighbors = getNeighbors(closestNode, grid);
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited) {
                neighbor.distance = (closestNode.distance ?? 0) + 1;
                neighbor.previousNode = closestNode;
            }
        }
    }

    return { visitedNodesInOrder, path: [] };
}

export function runBFS(grid: Grid, startNode: Node, endNode: Node) {
    const visitedNodesInOrder: Node[] = [];
    const queue: Node[] = [startNode];
    const visited = new Set<Node>([startNode]);
    
    grid.forEach(row => row.forEach(node => {
        node.previousNode = null;
    }));
    
    while (queue.length > 0) {
        const currentNode = queue.shift()!;
        visitedNodesInOrder.push(currentNode);

        if (currentNode === endNode) {
            return { visitedNodesInOrder, path: getPath(endNode) };
        }

        const neighbors = getNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                neighbor.previousNode = currentNode;
                queue.push(neighbor);
            }
        }
    }

    return { visitedNodesInOrder, path: [] };
}


export function runDFS(grid: Grid, startNode: Node, endNode: Node) {
    const visitedNodesInOrder: Node[] = [];
    const stack: Node[] = [startNode];
    const visited = new Set<Node>();

    grid.forEach(row => row.forEach(node => {
        node.previousNode = null;
    }));

    while (stack.length > 0) {
        const currentNode = stack.pop()!;

        if (visited.has(currentNode)) continue;
        visited.add(currentNode);
        visitedNodesInOrder.push(currentNode);

        if (currentNode === endNode) {
            return { visitedNodesInOrder, path: getPath(endNode) };
        }

        const neighbors = getNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                neighbor.previousNode = currentNode;
                stack.push(neighbor);
            }
        }
    }

    return { visitedNodesInOrder, path: [] };
}
