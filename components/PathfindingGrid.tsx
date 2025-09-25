import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Node, Grid, AlgorithmType, GridStats } from '../types';
import { runAStar, runDijkstra, runBFS, runDFS } from '../services/pathfinding';
import { GRID_COLS, GRID_ROWS } from '../constants';

interface PathfindingGridProps {
    algorithmType: AlgorithmType;
    grid: Grid;
    isVisualizing: boolean;
    visualizationSpeed: number;
    resetCounter: number;
    onVisualizationEnd: () => void;
    onToggleWall: (row: number, col: number) => void;
    onMoveNode: (row: number, col: number, isStartNode: boolean) => void;
    startNode: { row: number; col: number };
    endNode: { row: number; col: number };
}

const NodeComponent: React.FC<{
    node: Node,
    isVisited: boolean,
    isPath: boolean,
    onMouseDown: (row: number, col: number) => void,
    onMouseEnter: (row: number, col: number) => void,
    onMouseUp: () => void,
}> = React.memo(({ node, isVisited, isPath, onMouseDown, onMouseEnter, onMouseUp }) => {
    const { row, col, isStart, isEnd, isWall } = node;
    const extraClassName = isStart
        ? 'bg-green-500'
        : isEnd
        ? 'bg-red-500'
        : isPath
        ? 'bg-yellow-300 dark:bg-yellow-400 node-path'
        : isWall
        ? 'bg-gray-600 dark:bg-gray-700'
        : isVisited
        ? 'bg-cyan-200 dark:bg-blue-800/70'
        : 'bg-white dark:bg-gray-800';

    return (
        <div
            id={`node-${row}-${col}`}
            className={`w-full h-full border-t border-l border-gray-200 dark:border-gray-700/50 transition-colors duration-300 ${extraClassName}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={onMouseUp}
        ></div>
    );
});


export const PathfindingGrid: React.FC<PathfindingGridProps> = ({
    algorithmType,
    grid,
    isVisualizing,
    visualizationSpeed,
    onVisualizationEnd,
    onToggleWall,
    onMoveNode,
    startNode,
    endNode,
    resetCounter
}) => {
    const [visitedNodes, setVisitedNodes] = useState<Set<Node>>(new Set());
    const [path, setPath] = useState<Node[]>([]);
    const [stats, setStats] = useState<GridStats>({ visitedNodes: 0, pathLength: 0 });
    const isCleared = useRef(true);

    const [isMousePressed, setIsMousePressed] = useState(false);
    const [isDraggingStart, setIsDraggingStart] = useState(false);
    const [isDraggingEnd, setIsDraggingEnd] = useState(false);

    const clearVisualization = useCallback(() => {
        setVisitedNodes(new Set());
        setPath([]);
        setStats({ visitedNodes: 0, pathLength: 0 });
        isCleared.current = true;
    }, []);

    useEffect(() => {
        clearVisualization();
    }, [resetCounter, clearVisualization]);

    const animateVisualization = useCallback((visitedNodesInOrder: Node[], pathInOrder: Node[]) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    setPath(pathInOrder);
                    setStats({ visitedNodes: visitedNodesInOrder.length, pathLength: pathInOrder.length });
                    onVisualizationEnd();
                }, visualizationSpeed * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                setVisitedNodes(prev => new Set(prev).add(node));
            }, visualizationSpeed * i);
        }
    }, [onVisualizationEnd, visualizationSpeed]);
    
    useEffect(() => {
        if (isVisualizing && isCleared.current) {
            isCleared.current = false;
            
            const sNode = grid[startNode.row][startNode.col];
            const eNode = grid[endNode.row][endNode.col];

            let result;
            switch (algorithmType) {
                case 'A*':
                    result = runAStar(grid, sNode, eNode);
                    break;
                case 'Dijkstra':
                    result = runDijkstra(grid, sNode, eNode);
                    break;
                case 'BFS':
                    result = runBFS(grid, sNode, eNode);
                    break;
                case 'DFS':
                    result = runDFS(grid, sNode, eNode);
                    break;
                default:
                    result = { visitedNodesInOrder: [], path: [] };
            }
            animateVisualization(result.visitedNodesInOrder, result.path);
        }
    }, [isVisualizing, algorithmType, grid, startNode, endNode, animateVisualization]);

    const handleMouseDown = (row: number, col: number) => {
        if (isVisualizing) return;
        const node = grid[row][col];
        if (node.isStart) {
            setIsDraggingStart(true);
        } else if (node.isEnd) {
            setIsDraggingEnd(true);
        } else {
            onToggleWall(row, col);
        }
        setIsMousePressed(true);
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (!isMousePressed || isVisualizing) return;
        if (isDraggingStart) {
            onMoveNode(row, col, true);
        } else if (isDraggingEnd) {
            onMoveNode(row, col, false);
        } else {
            onToggleWall(row, col);
        }
    };

    const handleMouseUp = () => {
        setIsMousePressed(false);
        setIsDraggingStart(false);
        setIsDraggingEnd(false);
    };

    return (
        <div className="flex flex-col bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3 px-2">
                <h2 className="text-xl font-bold text-teal-500 dark:text-teal-400">{algorithmType}</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-4">
                    <span>Visited: <span className="font-semibold text-gray-800 dark:text-gray-200">{stats.visitedNodes}</span></span>
                    <span>Path: <span className="font-semibold text-gray-800 dark:text-gray-200">{stats.pathLength}</span></span>
                </div>
            </div>
            <div
                className="grid border-r border-b border-gray-200 dark:border-gray-700/50"
                style={{
                    gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
                    aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`
                }}
                onMouseLeave={handleMouseUp}
            >
                {grid.map((row, rowIdx) =>
                    row.map((node, nodeIdx) => (
                        <NodeComponent
                            key={`${rowIdx}-${nodeIdx}`}
                            node={node}
                            isVisited={visitedNodes.has(node)}
                            isPath={path.includes(node)}
                            onMouseDown={handleMouseDown}
                            onMouseEnter={handleMouseEnter}
                            onMouseUp={handleMouseUp}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
