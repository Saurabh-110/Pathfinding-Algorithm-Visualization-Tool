import React from 'react';
import type { AlgorithmType, AlgorithmInfo } from '../types';

interface ControlsProps {
    algorithms: AlgorithmInfo[];
    selectedAlgorithms: AlgorithmType[];
    onAlgorithmChange: (algorithm: AlgorithmType) => void;
    onVisualize: () => void;
    onClearWalls: () => void;
    onClearPath: () => void;
    onClearBoard: () => void;
    isVisualizing: boolean;
    hasSelection: boolean;
    visualizationSpeed: number;
    onSpeedChange: (speed: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
    algorithms,
    selectedAlgorithms,
    onAlgorithmChange,
    onVisualize,
    onClearWalls,
    onClearPath,
    onClearBoard,
    isVisualizing,
    hasSelection,
    visualizationSpeed,
    onSpeedChange,
}) => {
    const buttonBaseClasses = "w-full px-4 py-2 rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900";
    const primaryButtonClasses = `bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-400 ${isVisualizing || !hasSelection ? 'opacity-50 cursor-not-allowed' : ''}`;
    const secondaryButtonClasses = `bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:ring-gray-500 ${isVisualizing ? 'opacity-50 cursor-not-allowed' : ''}`;
    
    // Map delay (lower is faster) to a slider value (higher is faster)
    const MAX_SLIDER_VAL = 50;
    const speedValue = MAX_SLIDER_VAL + 1 - visualizationSpeed;

    const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
        <div className="relative flex items-center justify-center group">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none dark:bg-gray-700 whitespace-nowrap z-10">
                {text}
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-7xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <span className="font-bold mr-2 text-lg">Algorithms:</span>
                    {algorithms.map(algo => (
                        <label key={algo.name} className="relative flex items-center space-x-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-teal-500 focus:ring-teal-500 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                                checked={selectedAlgorithms.includes(algo.name)}
                                onChange={() => onAlgorithmChange(algo.name)}
                                disabled={isVisualizing}
                            />
                            <span className="group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">{algo.name}</span>
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 px-3 py-1.5 text-center text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none dark:bg-gray-700 z-10">
                                {algo.description}
                            </div>
                        </label>
                    ))}
                </div>
                <div className="flex items-center flex-wrap justify-center gap-3 mt-4 md:mt-0">
                     <Tooltip text="Adjust animation speed. Left is slower, right is faster.">
                        <div className="flex items-center gap-2">
                            <label htmlFor="speed-slider" className="font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Speed:</label>
                            <input
                                id="speed-slider"
                                type="range"
                                min="1"
                                max={MAX_SLIDER_VAL}
                                value={speedValue}
                                onChange={(e) => onSpeedChange(MAX_SLIDER_VAL + 1 - Number(e.target.value))}
                                disabled={isVisualizing}
                                className={`w-32 cursor-pointer transition-opacity ${isVisualizing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                aria-label="Visualization Speed"
                            />
                        </div>
                    </Tooltip>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2 hidden md:block"></div>
                    <Tooltip text="Run the selected algorithms on the current grid.">
                        <button onClick={onVisualize} className={`${buttonBaseClasses} ${primaryButtonClasses}`} disabled={isVisualizing || !hasSelection}>
                            {isVisualizing ? 'Visualizing...' : 'Visualize'}
                        </button>
                    </Tooltip>
                     <Tooltip text="Remove visualized paths and visited nodes.">
                        <button onClick={onClearPath} className={`${buttonBaseClasses} ${secondaryButtonClasses}`} disabled={isVisualizing}>
                            Clear Path
                        </button>
                    </Tooltip>
                    <Tooltip text="Remove all walls from the grid.">
                        <button onClick={onClearWalls} className={`${buttonBaseClasses} ${secondaryButtonClasses}`} disabled={isVisualizing}>
                            Clear Walls
                        </button>
                    </Tooltip>
                    <Tooltip text="Reset the grid, walls, and node positions.">
                        <button onClick={onClearBoard} className={`${buttonBaseClasses} ${secondaryButtonClasses}`} disabled={isVisualizing}>
                            Clear Board
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};