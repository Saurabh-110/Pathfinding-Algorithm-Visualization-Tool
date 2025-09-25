<h1 align="center">🗺️ Pathfinding Algorithm Comparator</h1>

<p align="center">
A dynamic and interactive web application for visualizing and comparing popular pathfinding algorithms—A*, Dijkstra, Breadth-First Search (BFS), and Depth-First Search (DFS)—in real-time.
</p>

<p align="center">
  <img src="Demo.gif" alt="Project Demo" width="800"/>
</p>

---

## 📑 Table of Contents
- [About The Project](#about-the-project)
- [Key Features](#-key-features)
- [Built With](#️-built-with)
- [Getting Started](#-getting-started)
- [How to Use](#-how-to-use)
- [File Structure](#-file-structure)
- [Algorithm Explanations](#-algorithm-explanations)
- [Contributing](#-contributing)

---

## 📖 About The Project
This project provides an intuitive and educational platform for understanding the fundamental differences between various pathfinding algorithms. By running them simultaneously on identical grid setups, users can directly compare their performance, search patterns, and pathing strategies.

Whether you're a student learning about data structures, a developer brushing up on core computer science concepts, or simply curious about how algorithms solve mazes, this tool offers a hands-on and visually engaging experience.

---

## ✨ Key Features
- **Side-by-Side Comparison**: Select and run up to four different algorithms at once for a direct visual and statistical comparison.  
- **Interactive Grid**:  
  - **Draw Walls**: Simply click and drag on the grid to create complex mazes and obstacles.  
  - **Movable Nodes**: Easily drag the start (🟢) and end (🔴) nodes to create new challenges on the fly.  
- **Comprehensive Algorithm Suite**:  
  - **A*** Search: A powerful heuristic-based algorithm that is often the most efficient for finding the shortest path.  
  - **Dijkstra's Algorithm**: Guarantees the shortest path on a weighted grid by exploring from the start node.  
  - **Breadth-First Search (BFS)**: An excellent algorithm for unweighted grids that also guarantees the shortest path.  
  - **Depth-First Search (DFS)**: A non-optimal algorithm that explores paths to their conclusion before backtracking.  
- **Complete Visualization Control**:  
  - Speed Control: Adjust the animation speed with a slider.  
  - Board Management: Clear paths, remove walls, or reset the board instantly.  
- **Real-time Performance Metrics**: See statistics on nodes visited and path length for each algorithm.  
- **Modern UI/UX**: Responsive design with Dark/Light Mode using Tailwind CSS.  

---

## 🛠️ Built With
- **React** – A JavaScript library for building user interfaces  
- **TypeScript** – Strongly typed superset of JavaScript  
- **Tailwind CSS** – Utility-first CSS framework for rapid UI development  

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser  
- A simple HTTP server (like VS Code Live Server or Python’s built-in server)

### Installation & Running
1. Clone the repository:
   ```sh
   git clone https://github.com/Saurabh-110/Pathfinding-Algorithm-Visualization-Tool
   ```

2. Navigate to the project directory:
   ```sh
   cd pathfinding-comparator
   ```

3. Serve the files:  
   - **Option 1 (VS Code)**: Right-click `index.html` → "Open with Live Server"  
   - **Option 2 (Python)**:  
     ```sh
     python -m http.server
     ```

4. Open your browser:  
   Go to `http://localhost:8000`

---

## 📖 How to Use
1. **Select Algorithms** at the top of the page.  
2. **Create a Maze** by dragging on the grid to draw walls.  
3. **Set Points** by dragging start (🟢) and end (🔴) nodes.  
4. **Adjust Speed** using the slider.  
5. **Click Visualize** and watch algorithms in action.  
6. **Analyze Results** with visited nodes & path length metrics.  
7. **Iterate** using clear/reset options.  

---

## 📂 File Structure
```
/
├── components/
│   ├── Controls.tsx         # UI for algorithm selection, buttons, and speed slider
│   └── PathfindingGrid.tsx  # Renders grid and handles visualization logic
├── services/
│   └── pathfinding.ts       # Core logic for algorithms (A*, Dijkstra, etc.)
├── App.tsx                  # Main app component
├── constants.ts             # Global constants
├── index.html               # Entry HTML file
├── index.tsx                # Entry point for React app
├── metadata.json            # Project metadata
└── types.ts                 # Type definitions
```

---

## 🧠 Algorithm Explanations

- **A\*** Search  
  Uses heuristic (Manhattan distance) + path cost to guide search.  
  Guarantees shortest path: ✅  

- **Dijkstra’s Algorithm**  
  Explores outward from start node, always visiting closest node first.  
  Guarantees shortest path: ✅  

- **Breadth-First Search (BFS)**  
  Explores all neighbors at current depth before moving deeper.  
  Guarantees shortest path (unweighted grids): ✅  

- **Depth-First Search (DFS)**  
  Explores deep into one branch before backtracking.  
  Guarantees shortest path: ❌  

---

## 🤝 Contributing
Contributions are welcome!  

1. Fork the Project  
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)  
4. Push to the Branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

