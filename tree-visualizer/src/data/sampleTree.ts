export type TreeNode = {
  id: string;
  label: string;
  metadata?: string;
  children?: TreeNode[];
};

export const exampleTree: TreeNode = {
  id: 'root',
  label: 'Root',
  metadata: 'Global overview',
  children: [
    {
      id: 'child-1',
      label: 'Child 1',
      metadata: 'Sales funnel',
      children: [
        { id: 'child-1a', label: 'New Node', metadata: 'Prospects' },
        { id: 'child-1b', label: 'New Node', metadata: 'Leads' },
        { id: 'child-1c', label: 'New Node', metadata: 'Deals' }
      ]
    },
    {
      id: 'child-2',
      label: 'Child 2',
      metadata: 'Operations',
      children: [
        { id: 'child-2a', label: 'New Node', metadata: 'Warehousing' },
        { id: 'child-2b', label: 'New Node', metadata: 'Logistics' }
      ]
    },
    { id: 'child-3', label: 'New Node', metadata: 'Finance' },
    {
      id: 'child-4',
      label: 'New Node',
      metadata: 'Product',
      children: [{ id: 'child-4a', label: 'New Node', metadata: 'Roadmap' }]
    },
    { id: 'child-5', label: 'New Node', metadata: 'People' }
  ]
};
