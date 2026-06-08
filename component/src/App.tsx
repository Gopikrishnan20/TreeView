import { useRef, useState } from 'react';
import TreeView from './components/TreeView';
import type { TreeViewRef } from './components/TreeView';
import './components/TreeView/treeview.css';

const treeItems = [
  {
    id: '1', text: 'Fruits',
    items: [
      { id: '1_1', text: 'Apple', selected: true },
      { id: '1_2', text: 'Banana' },
      { id: '1_3', text: 'Orange', expanded: true,
        items: [
          { id: '1_3_1', text: 'Navel Orange' },
          { id: '1_3_2', text: 'Blood Orange' },
        ]
      },
    ],
  },
  {
    id: '2', text: 'Vegetables',
    items: [
      { id: '2_1', text: 'Carrot', disabled: true },
      { id: '2_2', text: 'Broccoli' },
    ],
  },
  { id: '3', text: 'Grains' },
];

const flatItems = [
  { id: 1, parentId: 0, text: 'Inbox' },
  { id: 2, parentId: 1, text: 'Work' },
  { id: 3, parentId: 1, text: 'Personal' },
  { id: 4, parentId: 0, text: 'Sent' },
  { id: 5, parentId: 0, text: 'Drafts' },
  { id: 6, parentId: 0, text: 'Trash' },
  { id: 7, parentId: 2, text: 'Reports' },
  { id: 8, parentId: 2, text: 'Meetings' },
];

function App() {
  const ref1 = useRef<TreeViewRef>(null);
  const ref2 = useRef<TreeViewRef>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev.slice(0, 9)]);

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>TreeView Demo</h1>

      <h2>1. Tree Structure (with checkboxes, single selection)</h2>
      <div style={{ height: 300, border: '1px solid #ddd', marginBottom: 20 }}>
        <TreeView
          ref={ref1}
          items={treeItems}
          showCheckBoxesMode="selectAll"
          selectionMode="multiple"
          selectNodesRecursive
          searchEnabled
          animationEnabled
          onItemClick={e => addLog(`itemClick: ${e.itemData?.text}`)}
          onItemExpanded={e => addLog(`expanded: ${e.itemData?.text}`)}
          onItemCollapsed={e => addLog(`collapsed: ${e.itemData?.text}`)}
          onItemSelectionChanged={e => addLog(`selectionChanged: ${e.itemData?.text}`)}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={() => ref1.current?.expandAll()}>Expand All</button>
        <button onClick={() => ref1.current?.collapseAll()}>Collapse All</button>
        <button onClick={() => ref1.current?.selectAll()}>Select All</button>
        <button onClick={() => ref1.current?.unselectAll()}>Unselect All</button>
        <button onClick={() => {
          const keys = ref1.current?.getSelectedNodeKeys();
          addLog('Selected keys: ' + JSON.stringify(keys));
        }}>Get Selected Keys</button>
      </div>

      <h2>2. Plain (flat) Structure — no checkboxes, click to expand</h2>
      <div style={{ height: 200, border: '1px solid #ddd', marginBottom: 20 }}>
        <TreeView
          ref={ref2}
          items={flatItems}
          dataStructure="plain"
          rootValue={0}
          expandEvent="click"
          selectByClick
          selectionMode="single"
          onItemClick={e => addLog(`flat itemClick: ${e.itemData?.text}`)}
        />
      </div>

      <h2>3. Custom item template + custom icons</h2>
      <div style={{ height: 200, border: '1px solid #ddd', marginBottom: 20 }}>
        <TreeView
          items={treeItems}
          itemTemplate={(item) => (
            <span style={{ color: '#337ab7', fontWeight: 'bold' }}>★ {item.text}</span>
          )}
          showCheckBoxesMode="normal"
          selectionMode="multiple"
        />
      </div>

      <h2>Event Log</h2>
      <div style={{ background: '#f5f5f5', padding: 10, height: 150, overflow: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
        {log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}

export default App;
