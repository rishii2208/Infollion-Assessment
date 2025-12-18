import { ReactFlowProvider } from 'reactflow';
import TreeFlow from './components/TreeFlow';
import { exampleTree } from './data/sampleTree';

function App() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <ReactFlowProvider>
          <TreeFlow root={exampleTree} />
        </ReactFlowProvider>
      </main>
    </div>
  );
}

export default App;
