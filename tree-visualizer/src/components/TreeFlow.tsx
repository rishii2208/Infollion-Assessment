import { useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Handle,
  MarkerType,
  Node,
  NodeProps,
  Position,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { TreeNode } from '../data/sampleTree';

const HORIZONTAL_SPACING = 220;
const VERTICAL_SPACING = 140;

type TreeFlowProps = {
  root: TreeNode;
};

type TreeNodeData = {
  label: string;
  metadata?: string;
  hasChildren: boolean;
  collapsed: boolean;
  depth: number;
  onToggle?: () => void;
};

type LayoutNode = {
  id: string;
  depth: number;
  xUnit: number;
  hasChildren: boolean;
  collapsed: boolean;
  node: TreeNode;
};

type LayoutEdge = {
  source: string;
  target: string;
};

const TreeNodeCard = ({ data }: NodeProps<TreeNodeData>) => {
  const { label, metadata, hasChildren, collapsed, depth, onToggle } = data;

  const handleStyle = {
    width: 10,
    height: 10,
    borderRadius: '50%',
    border: 'none',
    background: '#9aa6bf',
    pointerEvents: 'none'
  } as const;

  return (
    <div className="tree-node" data-collapsed={collapsed}>
      {depth > 0 ? (
        <Handle
          type="target"
          position={Position.Top}
          style={{
            ...handleStyle,
            top: -6,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          isConnectable={false}
        />
      ) : null}
      <div className="tree-node__label">{label}</div>
      {metadata ? <div className="tree-node__meta">{metadata}</div> : null}
      {hasChildren ? (
        <button className="tree-node__toggle" type="button" onClick={onToggle}>
          {collapsed ? '+' : '-'}
        </button>
      ) : null}
      {hasChildren ? (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            ...handleStyle,
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          isConnectable={false}
        />
      ) : null}
    </div>
  );
};

const nodeTypes = { treeNode: TreeNodeCard };

const layoutTree = (root: TreeNode, collapsedSet: Set<string>) => {
  const layoutNodes: LayoutNode[] = [];
  const layoutEdges: LayoutEdge[] = [];
  let nextXUnit = 0;
  let minXUnit = Number.POSITIVE_INFINITY;

  const traverse = (node: TreeNode, depth: number): number => {
    const isCollapsed = collapsedSet.has(node.id);
    const fullChildren = node.children ?? [];
    const visibleChildren = isCollapsed ? [] : fullChildren;

    if (visibleChildren.length === 0) {
      const xUnit = nextXUnit;
      nextXUnit += 1;
      minXUnit = Math.min(minXUnit, xUnit);
      layoutNodes.push({
        id: node.id,
        depth,
        xUnit,
        hasChildren: fullChildren.length > 0,
        collapsed: isCollapsed,
        node
      });
      return xUnit;
    }

    const childUnits: number[] = [];

    for (const child of visibleChildren) {
      const childUnit = traverse(child, depth + 1);
      childUnits.push(childUnit);
      layoutEdges.push({ source: node.id, target: child.id });
    }

    const xUnit = childUnits.reduce((sum, value) => sum + value, 0) / childUnits.length;
    minXUnit = Math.min(minXUnit, xUnit);

    layoutNodes.push({
      id: node.id,
      depth,
      xUnit,
      hasChildren: fullChildren.length > 0,
      collapsed: isCollapsed,
      node
    });

    return xUnit;
  };

  traverse(root, 0);

  const normalizedNodes = layoutNodes.map((layoutNode) => ({
    ...layoutNode,
    xUnit: layoutNode.xUnit - minXUnit
  }));

  return { nodes: normalizedNodes, edges: layoutEdges };
};

const TreeFlow = ({ root }: TreeFlowProps) => {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(null);

  const toggleNode = (nodeId: string) => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const { nodes, edges } = useMemo(() => {
    const { nodes: layoutNodes, edges: layoutEdges } = layoutTree(root, collapsed);

    const flowNodes: Node<TreeNodeData>[] = layoutNodes.map((layoutNode) => ({
      id: layoutNode.id,
      type: 'treeNode',
      position: {
        x: layoutNode.xUnit * HORIZONTAL_SPACING,
        y: layoutNode.depth * VERTICAL_SPACING
      },
      selectable: true,
      draggable: false,
      data: {
        label: layoutNode.node.label,
        metadata: layoutNode.node.metadata,
        hasChildren: layoutNode.hasChildren,
        collapsed: layoutNode.collapsed,
        depth: layoutNode.depth,
        onToggle: layoutNode.hasChildren ? () => toggleNode(layoutNode.id) : undefined
      }
    }));

    const flowEdges: Edge[] = layoutEdges.map((edge) => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: false,
      style: { strokeWidth: 2.4, stroke: '#7b8794' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 16,
        height: 16,
        color: '#7b8794'
      }
    }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [collapsed, root]);

  useEffect(() => {
    if (flowInstance) {
      flowInstance.fitView({ padding: 0.2, duration: 600 });
    }
  }, [nodes, flowInstance]);

  return (
    <div className="tree-flow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag
        proOptions={{ hideAttribution: true }}
        onInit={setFlowInstance}
      >
        <Background gap={24} color="#e4e7eb" />
        <Controls position="top-right" showInteractive={false} />
      </ReactFlow>
    </div>
  );
};

export default TreeFlow;
