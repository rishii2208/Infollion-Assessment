# Tree Visualizer

React Flow powered tree view that renders hierarchical data with clean spacing, centered parents, and expand/collapse interactions.

## Features

- Automatic tree layout that centers each parent above its visible children
- Smooth expand/collapse toggling with layout recalculation
- Styled edges with arrow markers and hover effects on nodes
- React Flow controls and background grid for easy navigation

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the URL printed in the terminal (defaults to http://localhost:5173).

## Customizing the Tree

Edit `src/data/sampleTree.ts` to adjust labels, metadata, or the hierarchy depth. Nodes with children automatically receive expand/collapse controls.

## Build for Production

```bash
npm run build
npm run preview
```

The build output appears in `dist/`.
