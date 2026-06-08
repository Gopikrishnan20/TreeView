/**
 * COMPREHENSIVE PROPS TEST — exercises every TreeViewProps entry in order.
 * Each section is labelled with the prop(s) it tests.
 */
import { useRef, useState } from 'react';
import TreeView from './components/TreeView';
import type { TreeViewRef } from './components/TreeView';
import './components/TreeView/treeview.css';
import './components/TreeView/treeview.fluent.blue.light.css';

// ── shared data ───────────────────────────────────────────────────────────────

const hierItems = [
  { id: 1, name: 'Animals', open: true, kids: [
    { id: 2, name: 'Mammals', open: false, kids: [
      { id: 5, name: 'Dog', chosen: true },
      { id: 6, name: 'Cat' },
    ]},
    { id: 3, name: 'Birds', off: true, kids: [
      { id: 7, name: 'Eagle' },
      { id: 8, name: 'Parrot' },
    ]},
    { id: 4, name: 'Reptiles', kids: [
      { id: 9, name: 'Crocodile' },
    ]},
  ]},
  { id: 10, name: 'Plants', kids: [
    { id: 11, name: 'Trees' },
    { id: 12, name: 'Flowers' },
  ]},
];

const flatItems = [
  { uid: 'a', pid: null, label: 'Continents' },
  { uid: 'b', pid: 'a',  label: 'Asia' },
  { uid: 'c', pid: 'a',  label: 'Europe' },
  { uid: 'd', pid: 'b',  label: 'India' },
  { uid: 'e', pid: 'b',  label: 'China' },
  { uid: 'f', pid: 'c',  label: 'France' },
  { uid: 'g', pid: 'c',  label: 'Germany' },
];

const simpleItems = [
  { id: 1, text: 'Alpha', items: [{ id: 11, text: 'Alpha-1' }, { id: 12, text: 'Alpha-2' }] },
  { id: 2, text: 'Beta',  items: [{ id: 21, text: 'Beta-1'  }, { id: 22, text: 'Beta-2'  }] },
  { id: 3, text: 'Gamma' },
];

const hasItemsData = [
  { id: 1, text: 'Folder A', hasItems: true, items: [] },
  { id: 2, text: 'Folder B', hasItems: false },
  { id: 3, text: 'File C' },
];

// ── helpers ───────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: '#0f548c', marginBottom: 6, borderBottom: '1px solid #e0e0e0', paddingBottom: 4 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Box({ h = 200, children }: { h?: number; children: React.ReactNode }) {
  return (
    <div style={{ height: h, border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
      {children}
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function PropsTest() {
  const ref = useRef<TreeViewRef>(null);
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) => setLog(p => [msg, ...p.slice(0, 19)]);

  // controlled search
  const [ctrlSearch, setCtrlSearch] = useState('');
  // controlled selection
  const [ctrlKeys, setCtrlKeys] = useState<any[]>([]);
  // visible toggle
  const [visible, setVisible] = useState(true);
  // disabled toggle
  const [dis, setDis] = useState(false);
  // rtl toggle
  const [rtl, setRtl] = useState(false);

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif', fontSize: 13, maxWidth: 1400 }}>
      <h2 style={{ marginBottom: 20 }}>TreeView — Full Props Test</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>

        {/* ── 1. items (default) ─────────────────────────────────────── */}
        <Section title="1. items (default prop)">
          <Box>
            <TreeView items={simpleItems} />
          </Box>
        </Section>

        {/* ── 2. dataSource (array form) ─────────────────────────────── */}
        <Section title="2. dataSource (array)">
          <Box>
            <TreeView dataSource={simpleItems} />
          </Box>
        </Section>

        {/* ── 3. dataStructure="plain" + parentIdExpr + rootValue ────── */}
        <Section title="3. dataStructure=plain + parentIdExpr + rootValue">
          <Box h={180}>
            <TreeView
              items={flatItems as any}
              dataStructure="plain"
              keyExpr="uid"
              displayExpr="label"
              parentIdExpr="pid"
              rootValue={null}
              expandEvent="click"
            />
          </Box>
        </Section>

        {/* ── 4. keyExpr + displayExpr (custom field names) ──────────── */}
        <Section title="4. keyExpr + displayExpr (custom fields)">
          <Box>
            <TreeView
              items={hierItems as any}
              keyExpr="id"
              displayExpr="name"
              itemsExpr="kids"
            />
          </Box>
        </Section>

        {/* ── 5. itemsExpr + expandedExpr + selectedExpr + disabledExpr */}
        <Section title="5. itemsExpr + expandedExpr + selectedExpr + disabledExpr">
          <Box>
            <TreeView
              items={hierItems as any}
              keyExpr="id"
              displayExpr="name"
              itemsExpr="kids"
              expandedExpr="open"
              selectedExpr="chosen"
              disabledExpr="off"
              showCheckBoxesMode="normal"
              selectionMode="multiple"
            />
          </Box>
        </Section>

        {/* ── 6. hasItemsExpr ────────────────────────────────────────── */}
        <Section title="6. hasItemsExpr (Folder A shows toggle, B does not)">
          <Box h={160}>
            <TreeView items={hasItemsData} hasItemsExpr="hasItems" />
          </Box>
        </Section>

        {/* ── 7. searchEnabled + searchMode ──────────────────────────── */}
        <Section title="7. searchEnabled + searchMode (startswith)">
          <Box>
            <TreeView
              items={simpleItems}
              searchEnabled
              searchMode="startswith"
              onItemClick={e => addLog(`click: ${e.itemData?.text}`)}
            />
          </Box>
        </Section>

        {/* ── 8. searchValue (controlled) ────────────────────────────── */}
        <Section title="8. searchValue (controlled)">
          <div style={{ marginBottom: 6, display: 'flex', gap: 6 }}>
            <button onClick={() => setCtrlSearch('Beta')}>Search "Beta"</button>
            <button onClick={() => setCtrlSearch('')}>Clear</button>
          </div>
          <Box h={160}>
            <TreeView items={simpleItems} searchEnabled searchValue={ctrlSearch} />
          </Box>
        </Section>

        {/* ── 9. searchExpr (search by custom field) ─────────────────── */}
        <Section title="9. searchExpr (search 'name' field)">
          <Box>
            <TreeView
              items={hierItems as any}
              keyExpr="id"
              displayExpr="name"
              itemsExpr="kids"
              searchEnabled
              searchExpr="name"
            />
          </Box>
        </Section>

        {/* ── 10. selectionMode="single" + selectByClick ─────────────── */}
        <Section title="10. selectionMode=single + selectByClick">
          <Box h={160}>
            <TreeView
              items={simpleItems}
              selectionMode="single"
              selectByClick
              onItemClick={e => addLog(`single-click: ${e.itemData?.text}`)}
            />
          </Box>
        </Section>

        {/* ── 11. selectionMode="multiple" + selectNodesRecursive ─────── */}
        <Section title="11. selectionMode=multiple + selectNodesRecursive">
          <Box>
            <TreeView
              items={simpleItems}
              selectionMode="multiple"
              selectNodesRecursive
              showCheckBoxesMode="normal"
              onSelectionChanged={e => addLog(`multi-sel: ${JSON.stringify(e)}`)}
            />
          </Box>
        </Section>

        {/* ── 12. selectedItemKeys (controlled) ──────────────────────── */}
        <Section title="12. selectedItemKeys (controlled)">
          <div style={{ marginBottom: 6, display: 'flex', gap: 6 }}>
            <button onClick={() => setCtrlKeys([11, 21])}>Select 11+21</button>
            <button onClick={() => setCtrlKeys([])}>Clear</button>
          </div>
          <Box>
            <TreeView
              items={simpleItems}
              selectionMode="multiple"
              showCheckBoxesMode="normal"
              selectedItemKeys={ctrlKeys}
            />
          </Box>
        </Section>

        {/* ── 13. expandEvent="click" ─────────────────────────────────── */}
        <Section title="13. expandEvent=click (click row to expand)">
          <Box>
            <TreeView
              items={simpleItems}
              expandEvent="click"
              onItemExpanded={e => addLog(`expanded: ${e.itemData?.text}`)}
              onItemCollapsed={e => addLog(`collapsed: ${e.itemData?.text}`)}
            />
          </Box>
        </Section>

        {/* ── 14. expandNodesRecursive ────────────────────────────────── */}
        <Section title="14. expandNodesRecursive (select child → parents expand)">
          <Box>
            <TreeView
              items={hierItems as any}
              keyExpr="id"
              displayExpr="name"
              itemsExpr="kids"
              selectionMode="multiple"
              showCheckBoxesMode="normal"
              expandNodesRecursive
              selectNodesRecursive
            />
          </Box>
        </Section>

        {/* ── 15. expandAllEnabled (* key) ───────────────────────────── */}
        <Section title="15. expandAllEnabled (focus tree, press * to expand all)">
          <Box>
            <TreeView items={simpleItems} expandAllEnabled focusStateEnabled />
          </Box>
        </Section>

        {/* ── 16. showCheckBoxesMode variants ────────────────────────── */}
        <Section title='16. showCheckBoxesMode — none / normal / selectAll'>
          <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11 }}>↓ none</span>
          </div>
          <Box h={120}><TreeView items={simpleItems} showCheckBoxesMode="none" /></Box>
          <div style={{ marginTop: 6, fontSize: 11 }}>↓ normal</div>
          <Box h={120}><TreeView items={simpleItems} showCheckBoxesMode="normal" selectionMode="multiple" /></Box>
          <div style={{ marginTop: 6, fontSize: 11 }}>↓ selectAll + custom selectAllText</div>
          <Box h={140}><TreeView items={simpleItems} showCheckBoxesMode="selectAll" selectionMode="multiple" selectAllText="Check Everything" /></Box>
        </Section>

        {/* ── 17. noDataText ──────────────────────────────────────────── */}
        <Section title="17. noDataText (empty items)">
          <Box h={80}>
            <TreeView items={[]} noDataText="Nothing to show here 🚫" />
          </Box>
        </Section>

        {/* ── 18. itemTemplate ────────────────────────────────────────── */}
        <Section title="18. itemTemplate (custom render function)">
          <Box>
            <TreeView
              items={simpleItems}
              itemTemplate={(item: any) => (
                <span style={{ color: '#0f548c', fontWeight: 600 }}>📁 {item.text}</span>
              )}
            />
          </Box>
        </Section>

        {/* ── 19. itemRender ──────────────────────────────────────────── */}
        <Section title="19. itemRender (React alias)">
          <Box>
            <TreeView
              items={simpleItems}
              itemRender={(item: any, idx) => (
                <span style={{ color: '#7b2d8b' }}>★ [{idx}] {item.text}</span>
              )}
            />
          </Box>
        </Section>

        {/* ── 20. itemComponent ───────────────────────────────────────── */}
        <Section title="20. itemComponent (React component alias)">
          <Box>
            <TreeView
              items={simpleItems}
              itemComponent={({ data }: { data: any }) => (
                <span style={{ color: '#337ab7', fontStyle: 'italic' }}>⚙ {data.text}</span>
              )}
            />
          </Box>
        </Section>

        {/* ── 21. expandIcon + collapseIcon ───────────────────────────── */}
        <Section title="21. expandIcon + collapseIcon (custom SVG)">
          <Box>
            <TreeView
              items={simpleItems}
              expandIcon="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%230f548c' d='M12 2l10 18H2z'/%3E%3C/svg%3E"
              collapseIcon="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%230f548c'/%3E%3C/svg%3E"
            />
          </Box>
        </Section>

        {/* ── 22. disabled ────────────────────────────────────────────── */}
        <Section title="22. disabled">
          <div style={{ marginBottom: 6, display: 'flex', gap: 6 }}>
            <button onClick={() => setDis(d => !d)}>{dis ? 'Enable' : 'Disable'}</button>
          </div>
          <Box h={160}>
            <TreeView items={simpleItems} disabled={dis} showCheckBoxesMode="normal" selectionMode="multiple" />
          </Box>
        </Section>

        {/* ── 23. visible ─────────────────────────────────────────────── */}
        <Section title="23. visible (toggle show/hide)">
          <div style={{ marginBottom: 6 }}>
            <button onClick={() => setVisible(v => !v)}>{visible ? 'Hide' : 'Show'}</button>
          </div>
          <Box h={160}>
            <TreeView items={simpleItems} visible={visible} />
          </Box>
        </Section>

        {/* ── 24. width + height ──────────────────────────────────────── */}
        <Section title="24. width + height (explicit)">
          <TreeView items={simpleItems} width={220} height={180} />
        </Section>

        {/* ── 25. hint ────────────────────────────────────────────────── */}
        <Section title="25. hint (hover the tree for tooltip)">
          <Box h={120}>
            <TreeView items={simpleItems} hint="I am the TreeView hint tooltip" />
          </Box>
        </Section>

        {/* ── 26. accessKey + tabIndex ────────────────────────────────── */}
        <Section title="26. accessKey + tabIndex">
          <Box h={120}>
            <TreeView items={simpleItems} accessKey="t" tabIndex={5} />
          </Box>
        </Section>

        {/* ── 27. rtlEnabled ──────────────────────────────────────────── */}
        <Section title="27. rtlEnabled">
          <div style={{ marginBottom: 6 }}>
            <button onClick={() => setRtl(r => !r)}>Toggle RTL (currently: {rtl ? 'ON' : 'OFF'})</button>
          </div>
          <Box h={160}>
            <TreeView items={simpleItems} rtlEnabled={rtl} />
          </Box>
        </Section>

        {/* ── 28. hoverStateEnabled / activeStateEnabled / focusStateEnabled */}
        <Section title="28. hoverStateEnabled + activeStateEnabled + focusStateEnabled">
          <Box h={160}>
            <TreeView
              items={simpleItems}
              hoverStateEnabled
              activeStateEnabled
              focusStateEnabled
            />
          </Box>
        </Section>

        {/* ── 29. elementAttr ─────────────────────────────────────────── */}
        <Section title="29. elementAttr (data-testid on root element)">
          <Box h={120}>
            <TreeView items={simpleItems} elementAttr={{ 'data-testid': 'my-tree', id: 'tree-root-29' }} />
          </Box>
        </Section>

        {/* ── 30. itemHoldTimeout + onItemHold ────────────────────────── */}
        <Section title="30. itemHoldTimeout + onItemHold (hold 600ms)">
          <Box h={120}>
            <TreeView
              items={simpleItems}
              itemHoldTimeout={600}
              onItemHold={e => addLog(`hold: ${e.itemData?.text}`)}
            />
          </Box>
        </Section>

        {/* ── 31. onContentReady + onInitialized ──────────────────────── */}
        <Section title="31. onContentReady + onInitialized (check event log)">
          <Box h={120}>
            <TreeView
              items={simpleItems}
              onInitialized={() => addLog('onInitialized fired')}
              onContentReady={() => addLog('onContentReady fired')}
            />
          </Box>
        </Section>

        {/* ── 32. onOptionChanged ─────────────────────────────────────── */}
        <Section title="32. onOptionChanged (via instance.option)">
          <div style={{ marginBottom: 6 }}>
            <button onClick={() => { ref.current?.option('disabled', true); setTimeout(() => ref.current?.option('disabled', false), 800); }}>
              Toggle disabled via option()
            </button>
          </div>
          <Box h={120}>
            <TreeView
              ref={ref}
              items={simpleItems}
              onOptionChanged={e => addLog(`optionChanged: ${e.name}=${JSON.stringify(e.value)}`)}
            />
          </Box>
        </Section>

        {/* ── 33. onItemContextMenu ────────────────────────────────────── */}
        <Section title="33. onItemContextMenu (right-click item)">
          <Box h={120}>
            <TreeView
              items={simpleItems}
              onItemContextMenu={e => addLog(`contextMenu: ${e.itemData?.text}`)}
            />
          </Box>
        </Section>

        {/* ── 34. onItemRendered ───────────────────────────────────────── */}
        <Section title="34. onItemRendered (fires per item)">
          <Box h={120}>
            <TreeView
              items={simpleItems.slice(0, 2)}
              onItemRendered={e => addLog(`rendered: ${e.itemData?.text}`)}
            />
          </Box>
        </Section>

        {/* ── 35. onSelectAllValueChanged ─────────────────────────────── */}
        <Section title="35. onSelectAllValueChanged (click Select All)">
          <Box h={160}>
            <TreeView
              items={simpleItems}
              showCheckBoxesMode="selectAll"
              selectionMode="multiple"
              onSelectAllValueChanged={e => addLog(`selectAllChanged: ${e.value}`)}
            />
          </Box>
        </Section>

        {/* ── 36. createChildren (lazy load) ──────────────────────────── */}
        <Section title="36. createChildren (lazy load on expand)">
          <Box h={140}>
            <TreeView
              items={[
                { id: 1, text: 'Root A', hasItems: true },
                { id: 2, text: 'Root B', hasItems: true },
              ]}
              hasItemsExpr="hasItems"
              createChildren={(node: any) => {
                addLog(`createChildren: ${node.text}`);
                return new Promise(res => setTimeout(() => res([
                  { id: node.key * 10 + 1, text: `${node.text} > Child 1` },
                  { id: node.key * 10 + 2, text: `${node.text} > Child 2` },
                ]), 400));
              }}
            />
          </Box>
        </Section>

      </div>

      {/* ── Event Log ────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#0f548c', marginBottom: 6 }}>Event Log</div>
        <div style={{ background: '#fafafa', border: '1px solid #e0e0e0', padding: 8, height: 200, overflow: 'auto', fontFamily: 'monospace', fontSize: 11 }}>
          {log.length === 0 && <span style={{ color: '#999' }}>Interact with any tree above to see events…</span>}
          {log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
        <button style={{ marginTop: 6 }} onClick={() => setLog([])}>Clear Log</button>
      </div>
    </div>
  );
}
