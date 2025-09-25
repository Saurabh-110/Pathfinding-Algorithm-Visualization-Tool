
export interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  distance?: number;
  isVisited?: boolean;
  previousNode?: Node | null;
  gScore?: number;
  fScore?: number;
  hScore?: number;
}

export type Grid = Node[][];

export type AlgorithmType = 'A*' | 'Dijkstra' | 'BFS' | 'DFS';

export interface AlgorithmInfo {
  name: AlgorithmType;
  description: string;
}

export interface GridStats {
  visitedNodes: number;
  pathLength: number;
}
