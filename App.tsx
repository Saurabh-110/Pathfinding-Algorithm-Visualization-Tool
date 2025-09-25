import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Controls } from './components/Controls';
import { PathfindingGrid } from './components/PathfindingGrid';
import { GRID_ROWS, GRID_COLS, START_NODE_ROW, START_NODE_COL, END_NODE_ROW, END_NODE_COL, ALGORITHMS } from './constants';
import type { Node, Grid, AlgorithmType } from './types';

const createInitialGrid = (): Grid => {
    const grid: Grid = [];
    for (let row = 0; row < GRID_ROWS; row++) {
        const currentRow: Node[] = [];
        for (let col = 0; col < GRID_COLS; col++) {
            currentRow.push({
                row,
                col,
                isStart: row === START_NODE_ROW && col === START_NODE_COL,
                isEnd: row === END_NODE_ROW && col === END_NODE_COL,
                isWall: false,
            });
        }
        grid.push(currentRow);
    }
    return grid;
};

const ThemeToggle: React.FC<{ theme: 'light' | 'dark'; onToggle: () => void }> = ({ theme, onToggle }) => (
    <button
        onClick={onToggle}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
        aria-label="Toggle theme"
    >
        {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
        )}
    </button>
);

const App: React.FC = () => {
    const [grid, setGrid] = useState<Grid>(createInitialGrid);
    const [selectedAlgorithms, setSelectedAlgorithms] = useState<AlgorithmType[]>([]);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [visualizationSpeed, setVisualizationSpeed] = useState<number>(20); // Default delay: 20ms
    const [resetCounter, setResetCounter] = useState(0);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    const [startNode, setStartNode] = useState({ row: START_NODE_ROW, col: START_NODE_COL });
    const [endNode, setEndNode] = useState({ row: END_NODE_ROW, col: END_NODE_COL });

    const runningVisualizations = useRef(0);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };
    
    const triggerReset = () => setResetCounter(c => c + 1);

    const handleAlgorithmSelection = useCallback((algorithm: AlgorithmType) => {
        setSelectedAlgorithms(prev =>
            prev.includes(algorithm)
                ? prev.filter(a => a !== algorithm)
                : [...prev, algorithm]
        );
    }, []);

    const handleSpeedChange = useCallback((speed: number) => {
        if (isVisualizing) return;
        setVisualizationSpeed(speed);
    }, [isVisualizing]);

    const handleVisualize = () => {
        if (isVisualizing || selectedAlgorithms.length === 0) return;
        triggerReset();
        runningVisualizations.current = selectedAlgorithms.length;
        setIsVisualizing(true);
    };

    const handleVisualizationEnd = useCallback(() => {
        runningVisualizations.current -= 1;
        if (runningVisualizations.current <= 0) {
            setIsVisualizing(false);
        }
    }, []);
    
    const handleClearWalls = () => {
        if (isVisualizing) return;
        const newGrid = grid.map(row =>
            row.map(node => ({ ...node, isWall: false }))
        );
        setGrid(newGrid);
        triggerReset();
    };

    const handleClearPath = () => {
        if (isVisualizing) return;
        triggerReset();
    };

    const handleClearBoard = () => {
        if (isVisualizing) return;
        setGrid(createInitialGrid());
        setStartNode({ row: START_NODE_ROW, col: START_NODE_COL });
        setEndNode({ row: END_NODE_ROW, col: END_NODE_COL });
        triggerReset();
    };

    const handleToggleWall = useCallback((row: number, col: number) => {
        if (isVisualizing) return;
        setGrid(prevGrid => {
            const newGrid = prevGrid.slice();
            const node = newGrid[row][col];
            if (node.isStart || node.isEnd) return newGrid;
            const newNode = { ...node, isWall: !node.isWall };
            newGrid[row] = [...newGrid[row]];
            newGrid[row][col] = newNode;
            return newGrid;
        });
        triggerReset();
    }, [isVisualizing]);
    
    const handleMoveNode = useCallback((row: number, col: number, isStartNode: boolean) => {
        if (isVisualizing) return;
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(r => r.map(n => ({ ...n })));
            if (isStartNode) {
                const prevStart = startNode;
                newGrid[prevStart.row][prevStart.col].isStart = false;
                newGrid[row][col].isStart = true;
                newGrid[row][col].isWall = false;
                setStartNode({ row, col });
            } else {
                const prevEnd = endNode;
                newGrid[prevEnd.row][prevEnd.col].isEnd = false;
                newGrid[row][col].isEnd = true;
                newGrid[row][col].isWall = false;
                setEndNode({ row, col });
            }
            return newGrid;
        });
        triggerReset();
    }, [isVisualizing, startNode, endNode]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col items-center p-4 md:p-8 transition-colors duration-300">
            <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
            <header className="w-full max-w-7xl text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                    Pathfinding Algorithm Comparator
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Select algorithms and draw walls to see them compete side-by-side.
                </p>
            </header>
            
            <Controls
                algorithms={ALGORITHMS}
                selectedAlgorithms={selectedAlgorithms}
                onAlgorithmChange={handleAlgorithmSelection}
                onVisualize={handleVisualize}
                onClearWalls={handleClearWalls}
                onClearPath={handleClearPath}
                onClearBoard={handleClearBoard}
                isVisualizing={isVisualizing}
                hasSelection={selectedAlgorithms.length > 0}
                visualizationSpeed={visualizationSpeed}
                onSpeedChange={handleSpeedChange}
            />

            {selectedAlgorithms.length > 0 ? (
                <main className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {selectedAlgorithms.map((algo) => (
                        <PathfindingGrid
                            key={algo}
                            algorithmType={algo}
                            grid={grid}
                            startNode={startNode}
                            endNode={endNode}
                            isVisualizing={isVisualizing}
                            visualizationSpeed={visualizationSpeed}
                            onToggleWall={handleToggleWall}
                            onMoveNode={handleMoveNode}
                            onVisualizationEnd={handleVisualizationEnd}
                            resetCounter={resetCounter}
                        />
                    ))}
                </main>
            ) : (
                <div className="flex-grow w-full max-w-7xl flex items-center justify-center mt-6 text-center text-gray-600 dark:text-gray-500">
                    <p className="text-xl">Select at least one algorithm to begin.</p>
                </div>
            )}
            
            <footer className="w-full max-w-7xl mt-12 p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-center text-teal-500 dark:text-teal-400">Algorithm Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ALGORITHMS.map(algo => (
                        <div key={algo.name}>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{algo.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{algo.description}</p>
                        </div>
                    ))}
                </div>
            </footer>
        </div>
    );
};

export default App;
