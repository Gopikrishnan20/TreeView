import TreeView from 'devextreme-react/tree-view';
import 'devextreme/dist/css/dx.fluent.blue.light.css';
import { useRef } from 'react';
import type { ItemClickEvent, ItemExpandedEvent, ItemCollapsedEvent } from 'devextreme/ui/tree_view';

const employees = [
  {
    id: '1', text: 'Management',
    items: [
      { id: '1_1', text: 'CEO' },
      { id: '1_2', text: 'CTO', items: [
        { id: '1_2_1', text: 'Architect' },
        { id: '1_2_2', text: 'Senior Dev' },
        { id: '1_2_3', text: 'Junior Dev', selected: true },
      ]},
      { id: '1_3', text: 'CFO', expanded: true, items: [
        { id: '1_3_1', text: 'Accountant' },
        { id: '1_3_2', text: 'Analyst' },
      ]},
    ],
  },
  { id: '2', text: 'Sales', items: [
    { id: '2_1', text: 'Sales Manager' },
    { id: '2_2', text: 'Sales Rep', disabled: true },
  ]},
  { id: '3', text: 'Support', items: [
    { id: '3_1', text: 'L1 Support' },
    { id: '3_2', text: 'L2 Support' },
  ]},
];

const flatCategories = [
  { id: 1,  parentId: 0,  text: 'Vehicles' },
  { id: 2,  parentId: 1,  text: 'Cars' },
  { id: 3,  parentId: 1,  text: 'Trucks' },
  { id: 4,  parentId: 2,  text: 'Sedans' },
  { id: 5,  parentId: 2,  text: 'SUVs' },
  { id: 6,  parentId: 3,  text: 'Pickup Trucks' },
  { id: 7,  parentId: 0,  text: 'Electronics' },
  { id: 8,  parentId: 7,  text: 'Phones' },
  { id: 9,  parentId: 7,  text: 'Laptops' },
  { id: 10, parentId: 8,  text: 'Android' },
  { id: 11, parentId: 8,  text: 'iOS' },
];

const products = [
  { id: 1, text: 'Computers', items: [
    { id: 11, text: 'Laptops', items: [
      { id: 111, text: 'Gaming Laptops' },
      { id: 112, text: 'Ultrabooks' },
    ]},
    { id: 12, text: 'Desktops' },
  ]},
  { id: 2, text: 'Smartphones', items: [
    { id: 21, text: 'Android' },
    { id: 22, text: 'iPhone' },
  ]},
  { id: 3, text: 'TV & Audio', items: [
    { id: 31, text: 'Smart TVs' },
    { id: 32, text: 'Headphones' },
  ]},
];

export default function App() {
  const treeRef = useRef<TreeView>(null);

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20, flexWrap: 'wrap', fontFamily: 'inherit' }}>

      <div style={{ flex: '1 1 300px' }}>
        <h3>Hierarchical + checkboxes + search</h3>
        <div style={{ height: 320, border: '1px solid #e0e0e0', borderRadius: 4 }}>
          <TreeView
            ref={treeRef}
            items={employees}
            showCheckBoxesMode="selectAll"
            selectionMode="multiple"
            selectNodesRecursive
            searchEnabled
            animationEnabled
            onItemClick={(e: ItemClickEvent) => console.log('click', e.itemData?.text)}
            onItemExpanded={(e: ItemExpandedEvent) => console.log('expanded', e.itemData?.text)}
            onItemCollapsed={(e: ItemCollapsedEvent) => console.log('collapsed', e.itemData?.text)}
          />
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={() => treeRef.current?.instance().expandAll()}>Expand All</button>
          <button onClick={() => treeRef.current?.instance().collapseAll()}>Collapse All</button>
          <button onClick={() => treeRef.current?.instance().selectAll()}>Select All</button>
          <button onClick={() => treeRef.current?.instance().unselectAll()}>Unselect All</button>
        </div>
      </div>

      <div style={{ flex: '1 1 280px' }}>
        <h3>Plain (flat) data — click to expand</h3>
        <div style={{ height: 240, border: '1px solid #e0e0e0', borderRadius: 4 }}>
          <TreeView
            items={flatCategories}
            dataStructure="plain"
            rootValue={0}
            expandEvent="click"
            selectByClick
            selectionMode="single"
          />
        </div>
      </div>

      <div style={{ flex: '1 1 280px' }}>
        <h3>showCheckBoxesMode="selectAll"</h3>
        <div style={{ height: 280, border: '1px solid #e0e0e0', borderRadius: 4 }}>
          <TreeView
            items={products}
            showCheckBoxesMode="selectAll"
            selectionMode="multiple"
            selectNodesRecursive
            selectAllText="Select All Products"
          />
        </div>
      </div>

      <div style={{ flex: '1 1 280px' }}>
        <h3>Instance API (option / beginUpdate)</h3>
        <div style={{ height: 200, border: '1px solid #e0e0e0', borderRadius: 4 }}>
          <TreeView items={employees} showCheckBoxesMode="normal" selectionMode="multiple" />
        </div>
      </div>

    </div>
  );
}
