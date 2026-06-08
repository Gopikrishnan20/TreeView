import { useRef, useState } from 'react';
import TreeView from './components/TreeView';
import type { TreeViewRef, ItemClickEvent, ItemExpandedEvent, ItemCollapsedEvent, SelectionChangedEvent } from './components/TreeView';
import './components/TreeView/treeview.css';
import './components/TreeView/treeview.fluent.blue.light.css';

const employees = [
  {
    id: '1',
    text: 'Management',
    items: [
      { id: '1_1', text: 'CEO' },
      {
        id: '1_2', text: 'CTO',
        items: [
          { id: '1_2_1', text: 'Architect' },
          { id: '1_2_2', text: 'Senior Dev' },
          { id: '1_2_3', text: 'Junior Dev', selected: true },
        ],
      },
      { id: '1_3', text: 'CFO', expanded: true,
        items: [
          { id: '1_3_1', text: 'Accountant' },
          { id: '1_3_2', text: 'Analyst' },
        ],
      },
    ],
  },
  {
    id: '2',
    text: 'Sales',
    items: [
      { id: '2_1', text: 'Sales Manager' },
      { id: '2_2', text: 'Sales Rep', disabled: true },
    ],
  },
  {
    id: '3', text: 'Support',
    items: [
      { id: '3_1', text: 'L1 Support' },
      { id: '3_2', text: 'L2 Support' },
    ],
  },
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
  const treeRef = useRef<TreeViewRef>(null);
  const instRef = useRef<TreeViewRef>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [selectedText, setSelectedText] = useState<string>('(none)');

  const log = (msg: string) => setEventLog(prev => [msg, ...prev.slice(0, 14)]);

  const handleItemClick = (e: ItemClickEvent) => log(`itemClick: "${e.itemData?.text}"`);
  const handleExpanded = (e: ItemExpandedEvent) => log(`expanded: "${e.itemData?.text}"`);
  const handleCollapsed = (e: ItemCollapsedEvent) => log(`collapsed: "${e.itemData?.text}"`);
  const handleSelectionChanged = (_e: SelectionChangedEvent) => {
    const keys = treeRef.current?.getSelectedNodeKeys() ?? [];
    setSelectedText(keys.length ? String(keys.join(', ')) : '(none)');
    log(`selectionChanged (${keys.length} selected)`);
  };

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
            onItemClick={handleItemClick}
            onItemExpanded={handleExpanded}
            onItemCollapsed={handleCollapsed}
            onSelectionChanged={handleSelectionChanged}
          />
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={() => treeRef.current?.expandAll()}>Expand All</button>
          <button onClick={() => treeRef.current?.collapseAll()}>Collapse All</button>
          <button onClick={() => treeRef.current?.selectAll()}>Select All</button>
          <button onClick={() => treeRef.current?.unselectAll()}>Unselect All</button>
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>
          Selected: {selectedText}
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
            onItemClick={e => log(`flat click: "${e.itemData?.text}"`)}
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
            onItemSelectionChanged={e => log(`itemSelection: "${e.itemData?.text}"`)}
          />
        </div>
      </div>

      <div style={{ flex: '1 1 280px' }}>
        <h3>Instance API (option / beginUpdate)</h3>
        <div style={{ height: 200, border: '1px solid #e0e0e0', borderRadius: 4 }}>
          <TreeView ref={instRef} items={employees} showCheckBoxesMode="normal" selectionMode="multiple" />
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={() => { instRef.current?.option('disabled', true); log('disabled=true'); }}>Disable</button>
          <button onClick={() => { instRef.current?.option('disabled', false); log('disabled=false'); }}>Enable</button>
          <button onClick={() => {
            instRef.current?.beginUpdate();
            instRef.current?.option('showCheckBoxesMode', 'none');
            instRef.current?.option('selectionMode', 'single');
            instRef.current?.endUpdate();
            log('batchUpdate done');
          }}>BatchUpdate</button>
          <button onClick={() => { instRef.current?.resetOption('disabled'); log('resetOption(disabled)'); }}>Reset</button>
        </div>
      </div>

      <div style={{ flex: '1 1 100%' }}>
        <h3>Event Log</h3>
        <div style={{ background: '#fafafa', border: '1px solid #e0e0e0', padding: 8, height: 160, overflow: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
          {eventLog.length === 0 && <span style={{ color: '#999' }}>No events yet</span>}
          {eventLog.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      </div>
    </div>
  );
}
