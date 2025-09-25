
import type { AlgorithmInfo } from './types';

export const GRID_ROWS = 21;
export const GRID_COLS = 35;

export const START_NODE_ROW = 10;
export const START_NODE_COL = 5;
export const END_NODE_ROW = 10;
export const END_NODE_COL = 29;

export const ALGORITHMS: AlgorithmInfo[] = [
    { name: 'A*', description: 'Best for finding the shortest path with heuristics.' },
    { name: 'Dijkstra', description: 'Guarantees the shortest path without heuristics.' },
    { name: 'BFS', description: 'Finds the shortest path in unweighted graphs.' },
    { name: 'DFS', description: 'Explores as far as possible along each branch.' },
];
