import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import './treeview.css';

// ─── CSS class constants (match DevExtreme exactly) ────────────────────────

const WIDGET_CLASS = 'dx-treeview';
const NODE_CLASS = `${WIDGET_CLASS}-node`;
const NODE_CONTAINER_CLASS = `${NODE_CLASS}-container`;
const OPENED_NODE_CONTAINER_CLASS = `${NODE_CONTAINER_CLASS}-opened`;
const IS_LEAF_CLASS = `${NODE_CLASS}-is-leaf`;
const ROOT_NODE_CLASS = `${WIDGET_CLASS}-root-node`;
const ITEM_CLASS = `${WIDGET_CLASS}-item`;
const ITEM_CONTENT_CLASS = `${WIDGET_CLASS}-item-content`;
const ITEM_WITH_CHECKBOX_CLASS = `${ITEM_CLASS}-with-checkbox`;
const ITEM_WITHOUT_CHECKBOX_CLASS = `${ITEM_CLASS}-without-checkbox`;
const ITEM_WITH_CUSTOM_EXPANDER_CLASS = `${ITEM_CLASS}-with-custom-expander-icon`;
const TOGGLE_CLASS = `${WIDGET_CLASS}-toggle-item-visibility`;
const TOGGLE_OPENED_CLASS = `${TOGGLE_CLASS}-opened`;
const EXPANDER_STUB_CLASS = `${WIDGET_CLASS}-expander-icon-stub`;
/* exported for potential external use */
export const CUSTOM_COLLAPSE_ICON_CLASS = `${WIDGET_CLASS}-custom-collapse-icon`;
export const CUSTOM_EXPAND_ICON_CLASS = `${WIDGET_CLASS}-custom-expand-icon`;
const SELECT_ALL_CLASS = `${WIDGET_CLASS}-select-all-item`;
const SEARCH_CLASS = `${WIDGET_CLASS}-search`;
const WITH_SEARCH_CLASS = `${WIDGET_CLASS}-with-search`;
export const BORDER_VISIBLE_CLASS = `${WIDGET_CLASS}-border-visible`;
const NODE_LOADINDICATOR_CLASS = `${NODE_CLASS}-loadindicator`;
export const LOADINDICATOR_WRAPPER_CLASS = `${WIDGET_CLASS}-loadindicator-wrapper`;
const DATA_ITEM_ID = 'data-item-id';

// ─── Types ─────────────────────────────────────────────────────────────────

export type DataStructure = 'plain' | 'tree';
export type SingleOrMultiple = 'single' | 'multiple';
export type TreeViewCheckBoxMode = 'none' | 'normal' | 'selectAll';
export type TreeViewExpandEvent = 'dblclick' | 'click';
export type SearchMode = 'contains' | 'startswith' | 'equals';
export type ScrollDirection = 'both' | 'horizontal' | 'vertical';

export interface TreeViewItem {
  id?: number | string;
  parentId?: number | string;
  text?: string;
  html?: string;
  items?: TreeViewItem[];
  icon?: string;
  expanded?: boolean;
  hasItems?: boolean;
  selected?: boolean;
  disabled?: boolean;
  visible?: boolean;
  [key: string]: any;
}

export interface TreeViewNode<TItem = any, TKey = any> {
  children?: Array<TreeViewNode<TItem, TKey>>;
  disabled?: boolean;
  expanded?: boolean;
  itemData?: TItem;
  key?: TKey;
  parent?: TreeViewNode<TItem, TKey>;
  selected?: boolean;
  text?: string;
}

export interface DefaultOptionsRule<TItem extends TreeViewItem = TreeViewItem, TKey = any> {
  device?: any;
  options: Partial<TreeViewProps<TItem, TKey>>;
}

// ─── Event types ───────────────────────────────────────────────────────────

export interface ContentReadyEvent<TItem = any, TKey = any> {
  readonly element: HTMLElement;
  readonly component: TreeViewRef<TItem, TKey>;
}
export interface DisposingEvent<TItem = any, TKey = any> extends ContentReadyEvent<TItem, TKey> {}
export interface InitializedEvent<TItem = any, TKey = any> {
  readonly element?: HTMLElement;
  readonly component?: TreeViewRef<TItem, TKey>;
}
export interface OptionChangedEvent<TItem = any, TKey = any> extends ContentReadyEvent<TItem, TKey> {
  readonly name: string;
  readonly fullName: string;
  readonly value: any;
  readonly previousValue: any;
}
export interface ItemInfoEvent<TItem = any, TKey = any> {
  readonly itemData?: TItem;
  readonly itemElement?: HTMLElement;
  readonly itemIndex?: number;
  readonly node?: TreeViewNode<TItem, TKey>;
}
export interface ItemClickEvent<TItem = any, TKey = any>
  extends ContentReadyEvent<TItem, TKey>, ItemInfoEvent<TItem, TKey> {
  readonly event: MouseEvent | KeyboardEvent | PointerEvent;
}
export interface ItemCollapsedEvent<TItem = any, TKey = any>
  extends ContentReadyEvent<TItem, TKey>, ItemInfoEvent<TItem, TKey> {
  readonly event: MouseEvent | PointerEvent;
}
export interface ItemContextMenuEvent<TItem = any, TKey = any>
  extends ContentReadyEvent<TItem, TKey>, ItemInfoEvent<TItem, TKey> {
  readonly event: MouseEvent | PointerEvent | TouchEvent;
}
export interface ItemExpandedEvent<TItem = any, TKey = any>
  extends ContentReadyEvent<TItem, TKey>, ItemInfoEvent<TItem, TKey> {
  readonly event: MouseEvent | PointerEvent;
}
export interface ItemHoldEvent<TItem = any, TKey = any>
  extends ContentReadyEvent<TItem, TKey>, ItemInfoEvent<TItem, TKey> {
  readonly event: MouseEvent | PointerEvent | TouchEvent;
}
export interface ItemRenderedEvent<TItem = any, TKey = any>
  extends ContentReadyEvent<TItem, TKey>, ItemInfoEvent<TItem, TKey> {}
export interface ItemSelectionChangedEvent<TItem = any, TKey = any>
  extends ContentReadyEvent<TItem, TKey>, ItemInfoEvent<TItem, TKey> {}
export interface SelectAllValueChangedEvent<TItem = any, TKey = any>
  extends ContentReadyEvent<TItem, TKey> {
  readonly value?: boolean | undefined;
}
export interface SelectionChangedEvent<TItem = any, TKey = any>
  extends ContentReadyEvent<TItem, TKey> {}

// ─── Props ─────────────────────────────────────────────────────────────────

export interface TreeViewProps<TItem extends TreeViewItem = TreeViewItem, TKey = any> {
  // Data
  items?: TItem[];
  dataSource?: TItem[] | { items(): TItem[] } | null;
  dataStructure?: DataStructure;
  keyExpr?: string | ((item: TItem) => TKey);
  displayExpr?: string | ((item: TItem) => string);
  itemsExpr?: string | Function;
  selectedExpr?: string | Function;
  expandedExpr?: string | Function;
  disabledExpr?: string | Function;
  hasItemsExpr?: string | Function;
  parentIdExpr?: string | Function;
  rootValue?: any;
  // Search
  searchEnabled?: boolean;
  searchValue?: string;
  searchMode?: SearchMode;
  searchExpr?: string | Function | Array<string | Function>;
  searchEditorOptions?: Record<string, any>;
  searchTimeout?: number;
  // Selection
  selectionMode?: SingleOrMultiple;
  selectByClick?: boolean;
  selectNodesRecursive?: boolean;
  selectedItemKeys?: TKey[];
  selectedItems?: TItem[];
  selectedItem?: TItem;
  selectedIndex?: number;
  // Expand
  expandEvent?: TreeViewExpandEvent;
  expandNodesRecursive?: boolean;
  expandAllEnabled?: boolean;
  // Checkboxes
  showCheckBoxesMode?: TreeViewCheckBoxMode;
  selectAllText?: string;
  // Lazy loading
  createChildren?: (parentNode: TreeViewNode<TItem, TKey>) => PromiseLike<TItem[]> | TItem[];
  virtualModeEnabled?: boolean;
  // Appearance
  animationEnabled?: boolean;
  scrollDirection?: ScrollDirection;
  useNativeScrolling?: boolean;
  noDataText?: string;
  itemTemplate?: ((item: TItem, index: number, element: HTMLElement) => React.ReactNode);
  /** React alias for itemTemplate — accepts a rendering function */
  itemRender?: ((item: TItem, index: number) => React.ReactNode);
  /** React alias for itemTemplate — accepts a custom component */
  itemComponent?: React.ComponentType<{ data: TItem; index: number }>;
  // Icons
  expandIcon?: string | null;
  collapseIcon?: string | null;
  // Widget base
  disabled?: boolean;
  visible?: boolean;
  width?: number | string;
  height?: number | string;
  hint?: string;
  accessKey?: string;
  tabIndex?: number;
  rtlEnabled?: boolean;
  activeStateEnabled?: boolean;
  focusStateEnabled?: boolean;
  hoverStateEnabled?: boolean;
  elementAttr?: Record<string, any>;
  itemHoldTimeout?: number;
  // Events
  onContentReady?: (e: ContentReadyEvent<TItem, TKey>) => void;
  onDisposing?: (e: DisposingEvent<TItem, TKey>) => void;
  onInitialized?: (e: InitializedEvent<TItem, TKey>) => void;
  onOptionChanged?: (e: OptionChangedEvent<TItem, TKey>) => void;
  onItemClick?: (e: ItemClickEvent<TItem, TKey>) => void;
  onItemCollapsed?: (e: ItemCollapsedEvent<TItem, TKey>) => void;
  onItemContextMenu?: (e: ItemContextMenuEvent<TItem, TKey>) => void;
  onItemExpanded?: (e: ItemExpandedEvent<TItem, TKey>) => void;
  onItemHold?: (e: ItemHoldEvent<TItem, TKey>) => void;
  onItemRendered?: (e: ItemRenderedEvent<TItem, TKey>) => void;
  onItemSelectionChanged?: (e: ItemSelectionChangedEvent<TItem, TKey>) => void;
  onSelectAllValueChanged?: (e: SelectAllValueChangedEvent<TItem, TKey>) => void;
  onSelectionChanged?: (e: SelectionChangedEvent<TItem, TKey>) => void;
}

// ─── Ref interface ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TreeViewRef<TItem = any, TKey = any> {
  collapseAll(): void;
  collapseItem(arg: TItem | Element | TKey): Promise<void>;
  expandAll(): void;
  expandItem(arg: TItem | Element | TKey): Promise<void>;
  getNodes(): Array<TreeViewNode<TItem, TKey>>;
  getSelectedNodes(): Array<TreeViewNode<TItem, TKey>>;
  getSelectedNodeKeys(): TKey[];
  selectAll(): void;
  getScrollable(): HTMLElement | null;
  selectItem(arg: TItem | Element | TKey): boolean;
  unselectAll(): void;
  unselectItem(arg: TItem | Element | TKey): boolean;
  updateDimensions(): Promise<void>;
  scrollToItem(arg: TItem | Element | TKey): Promise<void>;
  getDataSource(): { items(): TItem[]; load(): Promise<TItem[]> } | null;
  focus(): void;
  repaint(): void;
  dispose(): void;
  instance(): TreeViewRef<TItem, TKey>;
  element(): HTMLElement;
  registerKeyHandler(key: string, handler: Function): void;
  option(): any;
  option(name: string): any;
  option(name: string, value: any): void;
  option(options: Record<string, any>): void;
  resetOption(name: string): void;
  on(eventName: string, handler: Function): void;
  on(events: Record<string, Function>): void;
  off(eventName: string): void;
  off(eventName: string, handler: Function): void;
  beginUpdate(): void;
  endUpdate(): void;
}

// ─── Internal node type ────────────────────────────────────────────────────

interface INode<TItem = any, TKey = any> {
  key: TKey;
  text: string;
  itemData: TItem;
  children: INode<TItem, TKey>[];
  parentKey: TKey | null;
  hasChildren: boolean;
  level: number;
}

// ─── Module-level state ────────────────────────────────────────────────────

const _instanceMap = new WeakMap<Element, TreeViewRef<any, any>>();
const _defaultOptionsRules: DefaultOptionsRule[] = [];

// ─── EventEmitter ──────────────────────────────────────────────────────────

class EventEmitter {
  private _h = new Map<string, Set<Function>>();
  on(e: string, h: Function) {
    if (!this._h.has(e)) this._h.set(e, new Set());
    this._h.get(e)!.add(h);
  }
  off(e: string, h?: Function) {
    if (!h) { this._h.delete(e); return; }
    this._h.get(e)?.delete(h);
  }
  emit(e: string, args: any) { this._h.get(e)?.forEach(fn => fn(args)); }
  clear() { this._h.clear(); }
}

// ─── Defaults ─────────────────────────────────────────────────────────────

const DEFAULTS: Partial<TreeViewProps> = {
  animationEnabled: true,
  dataStructure: 'tree',
  expandAllEnabled: false,
  hasItemsExpr: 'hasItems',
  selectNodesRecursive: true,
  expandNodesRecursive: true,
  showCheckBoxesMode: 'none',
  expandIcon: null,
  collapseIcon: null,
  selectAllText: 'Select All',
  scrollDirection: 'vertical',
  useNativeScrolling: true,
  virtualModeEnabled: false,
  rootValue: 0,
  focusStateEnabled: false,
  selectionMode: 'multiple',
  expandEvent: 'dblclick',
  selectByClick: false,
  disabled: false,
  visible: true,
  activeStateEnabled: false,
  hoverStateEnabled: true,
  rtlEnabled: false,
  tabIndex: 0,
  noDataText: 'No data to display',
  itemHoldTimeout: 750,
  keyExpr: 'id',
  displayExpr: 'text',
  itemsExpr: 'items',
  selectedExpr: 'selected',
  expandedExpr: 'expanded',
  disabledExpr: 'disabled',
  parentIdExpr: 'parentId',
  searchEnabled: false,
  searchValue: '',
  searchMode: 'contains',
  searchTimeout: 500,
};

// ─── Helper utilities ──────────────────────────────────────────────────────

function getExpr(item: any, expr: string | Function | undefined, defaultKey?: string): any {
  if (expr === undefined || expr === null) {
    return defaultKey !== undefined ? item?.[defaultKey] : undefined;
  }
  if (typeof expr === 'function') return expr(item);
  return item?.[expr as string];
}

function matchSearch(text: string, query: string, mode: SearchMode): boolean {
  const t = (text ?? '').toLowerCase();
  const q = (query ?? '').toLowerCase();
  if (!q) return true;
  switch (mode) {
    case 'startswith': return t.startsWith(q);
    case 'equals': return t === q;
    default: return t.includes(q);
  }
}

function buildTreeNodes<TItem extends TreeViewItem, TKey>(
  items: TItem[],
  opts: {
    keyExpr?: string | Function;
    displayExpr?: string | Function;
    itemsExpr?: string | Function;
    hasItemsExpr?: string | Function;
    expandedExpr?: string | Function;
    selectedExpr?: string | Function;
    dataStructure?: DataStructure;
    parentIdExpr?: string | Function;
    rootValue?: any;
  },
  loadedChildren: Map<any, TItem[]>,
  parentKey: TKey | null = null,
  level = 0
): INode<TItem, TKey>[] {
  const {
    keyExpr, displayExpr, itemsExpr, hasItemsExpr,
    dataStructure, parentIdExpr, rootValue,
  } = opts;

  if (dataStructure === 'plain') {
    const targetParent = parentKey === null ? (rootValue !== undefined ? rootValue : 0) : parentKey;
    return items
      .filter(item => {
        const pid = getExpr(item, parentIdExpr, 'parentId');
        // eslint-disable-next-line eqeqeq
        return pid == targetParent;
      })
      .map((item, idx) => {
        const key = getExpr(item, keyExpr, 'id') ?? idx as any;
        const text = typeof displayExpr === 'function' ? displayExpr(item) : (item[displayExpr as string ?? 'text'] ?? '');
        const children = buildTreeNodes<TItem, TKey>(items, opts, loadedChildren, key as TKey, level + 1);
        const extraChildren = loadedChildren.get(key) ?? [];
        const allChildren = [...children, ...buildTreeNodes<TItem, TKey>(extraChildren as TItem[], opts, loadedChildren, key as TKey, level + 1)];
        const hasExpr = getExpr(item, hasItemsExpr, 'hasItems');
        return {
          key: key as TKey,
          text,
          itemData: item,
          children: allChildren,
          parentKey: parentKey,
          hasChildren: allChildren.length > 0 || (hasExpr === true),
          level,
        };
      });
  }

  // tree structure
  return items
    .filter(item => item.visible !== false)
    .map((item, idx) => {
      const key = getExpr(item, keyExpr, 'id') ?? idx as any;
      const text = typeof displayExpr === 'function' ? displayExpr(item) : (item[(displayExpr as string) ?? 'text'] ?? '');
      const nestedItems: TItem[] = getExpr(item, itemsExpr, 'items') ?? [];
      const extraLoaded: TItem[] = loadedChildren.get(key) ?? [];
      const allNestedItems = [...nestedItems, ...extraLoaded];
      const children = buildTreeNodes<TItem, TKey>(allNestedItems, opts, loadedChildren, key as TKey, level + 1);
      const hasExpr = getExpr(item, hasItemsExpr, 'hasItems');
      return {
        key: key as TKey,
        text,
        itemData: item,
        children,
        parentKey: parentKey,
        hasChildren: children.length > 0 || (hasExpr === true),
        level,
      };
    });
}

function flattenNodes<TItem, TKey>(nodes: INode<TItem, TKey>[]): INode<TItem, TKey>[] {
  const result: INode<TItem, TKey>[] = [];
  function walk(list: INode<TItem, TKey>[]) {
    for (const n of list) {
      result.push(n);
      walk(n.children);
    }
  }
  walk(nodes);
  return result;
}

function filterNodes<TItem, TKey>(
  nodes: INode<TItem, TKey>[],
  query: string,
  mode: SearchMode,
  searchExpr?: string | Function | Array<string | Function>
): INode<TItem, TKey>[] {
  if (!query) return nodes;
  function nodeMatches(n: INode<TItem, TKey>): boolean {
    const exprs: Array<string | Function> = searchExpr
      ? (Array.isArray(searchExpr) ? searchExpr : [searchExpr])
      : ['text'];
    return exprs.some(expr => {
      const val = typeof expr === 'function' ? expr(n.itemData) : (n.itemData as any)?.[expr] ?? n.text;
      return matchSearch(String(val ?? ''), query, mode);
    });
  }
  function filterList(list: INode<TItem, TKey>[]): INode<TItem, TKey>[] {
    const result: INode<TItem, TKey>[] = [];
    for (const n of list) {
      const filteredChildren = filterList(n.children);
      if (nodeMatches(n) || filteredChildren.length > 0) {
        result.push({ ...n, children: filteredChildren });
      }
    }
    return result;
  }
  return filterList(nodes);
}

function getDescendantKeys<TItem, TKey>(node: INode<TItem, TKey>): TKey[] {
  const keys: TKey[] = [node.key];
  for (const c of node.children) keys.push(...getDescendantKeys(c));
  return keys;
}

function getAncestorKeys<TItem, TKey>(nodes: INode<TItem, TKey>[], key: TKey): TKey[] {
  const flat = flattenNodes(nodes);
  const nodeMap = new Map(flat.map(n => [n.key, n]));
  const keys: TKey[] = [];
  let node = nodeMap.get(key);
  while (node?.parentKey != null) {
    const parent = nodeMap.get(node.parentKey);
    if (!parent) break;
    keys.push(parent.key);
    node = parent;
  }
  return keys;
}

function computeSelectionState<TItem, TKey>(
  nodes: INode<TItem, TKey>[],
  selectedKeys: Set<TKey>,
  showCheckBoxes: boolean
): Map<TKey, 'selected' | 'indeterminate' | 'none'> {
  const result = new Map<TKey, 'selected' | 'indeterminate' | 'none'>();
  function process(n: INode<TItem, TKey>): 'selected' | 'indeterminate' | 'none' {
    if (!showCheckBoxes || n.children.length === 0) {
      const s = selectedKeys.has(n.key) ? 'selected' : 'none';
      result.set(n.key, s);
      return s;
    }
    const childStates = n.children.map(c => process(c));
    const allSel = childStates.every(s => s === 'selected');
    const noneSel = childStates.every(s => s === 'none');
    let state: 'selected' | 'indeterminate' | 'none';
    if (allSel) state = 'selected';
    else if (noneSel) state = selectedKeys.has(n.key) ? 'selected' : 'none';
    else state = 'indeterminate';
    result.set(n.key, state);
    return state;
  }
  nodes.forEach(process);
  return result;
}

function buildPublicNode<TItem, TKey>(
  n: INode<TItem, TKey>,
  selectedKeys: Set<TKey>,
  expandedKeys: Set<TKey>,
  nodeMap: Map<TKey, INode<TItem, TKey>>
): TreeViewNode<TItem, TKey> {
  const pub: TreeViewNode<TItem, TKey> = {
    key: n.key,
    text: n.text,
    itemData: n.itemData,
    disabled: getExpr(n.itemData, 'disabled', 'disabled') ?? false,
    expanded: expandedKeys.has(n.key),
    selected: selectedKeys.has(n.key),
    children: n.children.map(c => buildPublicNode(c, selectedKeys, expandedKeys, nodeMap)),
  };
  return pub;
}

function initExpandedKeys<TItem, TKey>(
  nodes: INode<TItem, TKey>[],
  expandedExpr?: string | Function,
  expandNodesRecursive?: boolean
): Set<TKey> {
  const keys = new Set<TKey>();
  function walk(list: INode<TItem, TKey>[], ancestors: TKey[]) {
    for (const n of list) {
      const isExpanded = getExpr(n.itemData, expandedExpr, 'expanded');
      if (isExpanded) {
        keys.add(n.key);
        if (expandNodesRecursive) ancestors.forEach(a => keys.add(a));
      }
      walk(n.children, [...ancestors, n.key]);
    }
  }
  walk(nodes, []);
  return keys;
}

function initSelectedKeys<TItem, TKey>(
  nodes: INode<TItem, TKey>[],
  selectedExpr?: string | Function,
  selectedItemKeys?: TKey[],
  selectNodesRecursive?: boolean
): Set<TKey> {
  const keys = new Set<TKey>();
  if (selectedItemKeys?.length) {
    selectedItemKeys.forEach(k => keys.add(k));
  }
  const flat = flattenNodes(nodes);
  for (const n of flat) {
    const isSel = getExpr(n.itemData, selectedExpr, 'selected');
    if (isSel) keys.add(n.key);
  }
  if (selectNodesRecursive) {
    const toAdd: TKey[] = [];
    for (const key of keys) {
      const node = flat.find(n => n.key === key);
      if (node) toAdd.push(...getDescendantKeys(node).slice(1));
    }
    toAdd.forEach(k => keys.add(k));
  }
  return keys;
}

// ─── Checkbox component ────────────────────────────────────────────────────

interface CheckboxProps {
  checked: boolean | 'indeterminate';
  disabled?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
  onClick?: (e: React.MouseEvent) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, disabled, label, onChange, onClick }) => {
  const cls = [
    'dx-checkbox',
    'dx-widget',
    checked === true ? 'dx-checkbox-checked' : '',
    checked === 'indeterminate' ? 'dx-checkbox-indeterminate' : '',
    disabled ? 'dx-state-disabled' : '',
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onClick?.(e);
    onChange?.(checked !== true);
  };

  return (
    <div className={cls} onClick={handleClick} role="checkbox" aria-checked={checked === 'indeterminate' ? 'mixed' : checked}>
      <div className="dx-checkbox-container">
        <span className="dx-checkbox-icon" />
        {label !== undefined && <span className="dx-checkbox-text">{label}</span>}
      </div>
    </div>
  );
};

// ─── Search input component ────────────────────────────────────────────────

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  editorOptions?: Record<string, any>;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = 'Search', editorOptions }) => (
  <div className={`${SEARCH_CLASS} dx-texteditor dx-editor-outlined dx-texteditor-empty`} style={{ marginBottom: 5 }}>
    <div className="dx-texteditor-container">
      <div className="dx-texteditor-input-container" style={{ display: 'flex', alignItems: 'center' }}>
        <span className="dx-icon dx-icon-search" aria-hidden="true" style={{ flexShrink: 0, marginRight: 6, display: 'flex', alignItems: 'center', color: '#999' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </span>
        <input
          className="dx-texteditor-input"
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: 0 }}
          {...(editorOptions?.inputAttr || {})}
        />
      </div>
    </div>
  </div>
);

// ─── Tree node component ───────────────────────────────────────────────────

interface TreeNodeProps<TItem, TKey> {
  node: INode<TItem, TKey>;
  isRoot: boolean;
  isExpanded: boolean;
  selectionState: 'selected' | 'indeterminate' | 'none';
  showCheckBoxes: boolean;
  expandEvent: TreeViewExpandEvent;
  animationEnabled: boolean;
  expandIcon?: string | null;
  collapseIcon?: string | null;
  disabled?: boolean;
  hoverStateEnabled?: boolean;
  itemTemplate?: ((item: TItem, index: number, el: HTMLElement) => React.ReactNode);
  loadingKeys: Set<TKey>;
  onToggleExpand: (node: INode<TItem, TKey>, e: React.MouseEvent) => void;
  onItemClick: (node: INode<TItem, TKey>, e: React.MouseEvent) => void;
  onItemDblClick: (node: INode<TItem, TKey>, e: React.MouseEvent) => void;
  onCheckboxChange: (node: INode<TItem, TKey>) => void;
  onContextMenu: (node: INode<TItem, TKey>, e: React.MouseEvent) => void;
  onItemHold?: (node: INode<TItem, TKey>, e: React.MouseEvent) => void;
  // Children rendering (already filtered/built)
  renderChildren: (children: INode<TItem, TKey>[], level: number) => React.ReactNode;
  focusedKey: TKey | null;
  onFocus: (key: TKey) => void;
  itemHoldTimeout?: number;
  nodeItemIndex: number;
}

function TreeNode<TItem, TKey>({
  node, isRoot, isExpanded, selectionState, showCheckBoxes,
  expandEvent, animationEnabled, expandIcon, collapseIcon,
  disabled: widgetDisabled, hoverStateEnabled,
  itemTemplate, loadingKeys,
  onToggleExpand, onItemClick, onItemDblClick, onCheckboxChange,
  onContextMenu, onItemHold, renderChildren, focusedKey, onFocus,
  itemHoldTimeout = 750, nodeItemIndex,
}: TreeNodeProps<TItem, TKey>) {
  const [hover, setHover] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemDisabled = getExpr(node.itemData, 'disabled', 'disabled') ?? false;
  const isDisabled = !!(widgetDisabled || itemDisabled);
  const isSelected = selectionState === 'selected';
  const isIndeterminate = selectionState === 'indeterminate';
  const isFocused = focusedKey === node.key;
  const isLeaf = !node.hasChildren;
  const isLoading = loadingKeys.has(node.key);

  const nodeClasses = [
    NODE_CLASS,
    isRoot ? ROOT_NODE_CLASS : '',
    isSelected ? 'dx-state-selected' : '',
    isLeaf ? IS_LEAF_CLASS : '',
    showCheckBoxes ? ITEM_WITH_CHECKBOX_CLASS : ITEM_WITHOUT_CHECKBOX_CLASS,
    isFocused ? 'dx-state-focused' : '',
    isDisabled ? 'dx-state-disabled' : '',
  ].filter(Boolean).join(' ');

  const itemClasses = [
    ITEM_CLASS,
    hover && hoverStateEnabled && !isDisabled ? 'dx-state-hover' : '',
  ].filter(Boolean).join(' ');

  const handleMouseEnter = () => { if (hoverStateEnabled) setHover(true); };
  const handleMouseLeave = () => { if (hoverStateEnabled) setHover(false); };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDisabled) return;
    holdTimerRef.current = setTimeout(() => {
      onItemHold?.(node, e);
    }, itemHoldTimeout);
  };

  const handleMouseUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handleItemClick = (e: React.MouseEvent) => {
    if (isDisabled) return;
    onFocus(node.key);
    onItemClick(node, e);
    if (expandEvent === 'click') onToggleExpand(node, e);
  };

  const handleItemDblClick = (e: React.MouseEvent) => {
    if (isDisabled) return;
    onItemDblClick(node, e);
    if (expandEvent === 'dblclick') onToggleExpand(node, e);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDisabled) onToggleExpand(node, e);
  };

  const icon: string | undefined = getExpr(node.itemData, undefined, 'icon');

  // Render the expander toggle/stub
  const renderExpander = () => {
    if (isLeaf && !isLoading) {
      return <div className={EXPANDER_STUB_CLASS} />;
    }
    if (isLoading) {
      return (
        <div className={NODE_LOADINDICATOR_CLASS}>
          <div className="dx-loadindicator-icon" />
        </div>
      );
    }
    if (expandIcon || collapseIcon) {
      const iconSrc = isExpanded ? (collapseIcon || expandIcon) : (expandIcon || collapseIcon);
      return (
        <div
          className={[TOGGLE_CLASS, isExpanded ? TOGGLE_OPENED_CLASS : '', ITEM_WITH_CUSTOM_EXPANDER_CLASS].filter(Boolean).join(' ')}
          onClick={handleToggleClick}
        >
          {iconSrc && <img src={iconSrc} alt="" style={{ width: '100%', height: '100%' }} />}
        </div>
      );
    }
    return (
      <div
        className={[TOGGLE_CLASS, isExpanded ? TOGGLE_OPENED_CLASS : ''].filter(Boolean).join(' ')}
        onClick={handleToggleClick}
        aria-label={isExpanded ? 'Collapse' : 'Expand'}
      />
    );
  };

  const renderItemContent = () => {
    if (itemTemplate) {
      const tempRef = document.createElement('div');
      return (
        <div className={ITEM_CONTENT_CLASS}>
          {itemTemplate(node.itemData, nodeItemIndex, tempRef)}
        </div>
      );
    }
    const htmlVal: string | undefined = getExpr(node.itemData, undefined, 'html');
    return (
      <div className={ITEM_CONTENT_CLASS}>
        {icon && (
          icon.startsWith('http') || icon.startsWith('/') || icon.includes('.')
            ? <img className="dx-icon" src={icon} alt="" style={{ width: 18, height: 18, marginInlineEnd: 8 }} />
            : <i className={`dx-icon dx-icon-${icon}`} />
        )}
        {htmlVal
          ? <span dangerouslySetInnerHTML={{ __html: htmlVal }} />
          : node.text
        }
      </div>
    );
  };

  return (
    <li
      className={nodeClasses}
      {...{ [DATA_ITEM_ID]: String(node.key) }}
      role="treeitem"
      aria-expanded={node.hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-disabled={isDisabled}
    >
      <div
        className={itemClasses}
        onClick={handleItemClick}
        onDoubleClick={handleItemDblClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onContextMenu={e => !isDisabled && onContextMenu(node, e as unknown as React.MouseEvent)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        role="presentation"
      >
        {renderExpander()}
        {showCheckBoxes && (
          <Checkbox
            checked={isIndeterminate ? 'indeterminate' : isSelected}
            disabled={isDisabled}
            onChange={() => !isDisabled && onCheckboxChange(node)}
          />
        )}
        {renderItemContent()}
      </div>

      {node.hasChildren && (
        <ul
          className={[
            NODE_CONTAINER_CLASS,
            isExpanded ? OPENED_NODE_CONTAINER_CLASS : '',
          ].filter(Boolean).join(' ')}
          role="group"
          style={animationEnabled ? undefined : undefined}
        >
          {isExpanded && renderChildren(node.children, node.level + 1)}
        </ul>
      )}
    </li>
  );
}

// ─── Main TreeView component ───────────────────────────────────────────────

const TreeViewInner = <TItem extends TreeViewItem = TreeViewItem, TKey = any>(
  props: TreeViewProps<TItem, TKey>,
  ref: React.Ref<TreeViewRef<TItem, TKey>>
) => {
  // ── Options resolution ────────────────────────────────────────────────────
  const [overrides, setOverrides] = useState<Partial<TreeViewProps<TItem, TKey>>>({});
  const [repaintKey, setRepaintKey] = useState(0);

  const resolved = useMemo<TreeViewProps<TItem, TKey>>(() => {
    const merged: any = { ...DEFAULTS };
    for (const rule of _defaultOptionsRules) {
      if (!rule.device || (typeof rule.device === 'function' && rule.device())) {
        Object.assign(merged, rule.options);
      }
    }
    Object.assign(merged, props);
    Object.assign(merged, overrides);
    return merged as TreeViewProps<TItem, TKey>;
  }, [props, overrides, repaintKey]);

  // Keep a sync ref so callbacks don't stale-close over old resolved values
  const resolvedRef = useRef(resolved);
  resolvedRef.current = resolved;

  // ── Items from props or dataSource ────────────────────────────────────────
  const rawItems = useMemo<TItem[]>(() => {
    if (resolved.items) return resolved.items;
    if (resolved.dataSource) {
      if (Array.isArray(resolved.dataSource)) return resolved.dataSource as TItem[];
      if (typeof (resolved.dataSource as any).items === 'function') {
        return (resolved.dataSource as any).items() as TItem[];
      }
    }
    return [];
  }, [resolved.items, resolved.dataSource]);

  // ── Build node tree ───────────────────────────────────────────────────────
  const [loadedChildren, setLoadedChildren] = useState<Map<TKey, TItem[]>>(() => new Map());

  const nodeTree = useMemo(() => buildTreeNodes<TItem, TKey>(
    rawItems,
    {
      keyExpr: resolved.keyExpr,
      displayExpr: resolved.displayExpr,
      itemsExpr: resolved.itemsExpr,
      hasItemsExpr: resolved.hasItemsExpr,
      expandedExpr: resolved.expandedExpr,
      selectedExpr: resolved.selectedExpr,
      dataStructure: resolved.dataStructure,
      parentIdExpr: resolved.parentIdExpr,
      rootValue: resolved.rootValue,
    },
    loadedChildren,
    null,
    0
  ), [rawItems, resolved.keyExpr, resolved.displayExpr, resolved.itemsExpr,
      resolved.hasItemsExpr, resolved.dataStructure,
      resolved.parentIdExpr, resolved.rootValue, loadedChildren]);

  const flatNodes = useMemo(() => flattenNodes(nodeTree), [nodeTree]);
  const nodeMap = useMemo(() => new Map(flatNodes.map(n => [n.key, n])), [flatNodes]);

  // ── Expanded state ────────────────────────────────────────────────────────
  const [expandedKeys, setExpandedKeys] = useState<Set<TKey>>(() =>
    initExpandedKeys(nodeTree, resolved.expandedExpr, resolved.expandNodesRecursive)
  );

  // ── Selected state ────────────────────────────────────────────────────────
  const [selectedKeys, setSelectedKeys] = useState<Set<TKey>>(() =>
    initSelectedKeys(nodeTree, resolved.selectedExpr, resolved.selectedItemKeys as TKey[], resolved.selectNodesRecursive)
  );
  // Ref always holds the latest selected keys so event handlers read correct
  // values even when fired synchronously before React commits the state update.
  const selectedKeysRef = useRef<Set<TKey>>(selectedKeys);
  selectedKeysRef.current = selectedKeys;

  // Sync selectedItemKeys from props when they change
  useEffect(() => {
    if (resolved.selectedItemKeys?.length) {
      setSelectedKeys(new Set(resolved.selectedItemKeys as TKey[]));
    }
  }, [resolved.selectedItemKeys]);

  // ── Loading state ─────────────────────────────────────────────────────────
  const [loadingKeys, setLoadingKeys] = useState<Set<TKey>>(new Set());

  // ── Search state ──────────────────────────────────────────────────────────
  const [internalSearchValue, setInternalSearchValue] = useState(resolved.searchValue ?? '');
  const searchValue = overrides.searchValue !== undefined ? overrides.searchValue : (props.searchValue ?? internalSearchValue);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredNodes = useMemo(() => {
    if (!resolved.searchEnabled || !searchValue) return nodeTree;
    return filterNodes(nodeTree, searchValue, resolved.searchMode ?? 'contains', resolved.searchExpr);
  }, [nodeTree, resolved.searchEnabled, searchValue, resolved.searchMode, resolved.searchExpr]);

  // ── Selection state map ───────────────────────────────────────────────────
  const selectionStateMap = useMemo(() =>
    computeSelectionState(nodeTree, selectedKeys, resolved.showCheckBoxesMode !== 'none'),
    [nodeTree, selectedKeys, resolved.showCheckBoxesMode]
  );

  // ── Refs ──────────────────────────────────────────────────────────────────
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const emitter = useRef(new EventEmitter()).current;
  const keyHandlers = useRef<Map<string, Function>>(new Map());
  const updateDepth = useRef(0);
  const pendingUpdates = useRef<Array<() => void>>([]);
  const [focusedKey, setFocusedKey] = useState<TKey | null>(null);
  const isDisposed = useRef(false);
  // Holds the refObject after it's created — avoids circular dependency
  const selfRef = useRef<TreeViewRef<TItem, TKey>>(null as any);

  // ── Event firing helpers ──────────────────────────────────────────────────
  const makeBaseEvent = useCallback(() => ({
    element: rootRef.current!,
    component: selfRef.current,
  }), []);

  const makeItemEvent = useCallback((node: INode<TItem, TKey>, itemEl?: HTMLElement) => ({
    ...makeBaseEvent(),
    itemData: node.itemData,
    itemElement: itemEl,
    itemIndex: flatNodes.findIndex(n => n.key === node.key),
    node: buildPublicNode(node, selectedKeys, expandedKeys, nodeMap),
  }), [makeBaseEvent, flatNodes, selectedKeys, expandedKeys, nodeMap]);

  // ── Core logic ────────────────────────────────────────────────────────────
  const toggleExpand = useCallback((node: INode<TItem, TKey>, e: React.MouseEvent) => {
    const r = resolvedRef.current;
    if (!node.hasChildren) return;

    const isCurrentlyExpanded = expandedKeys.has(node.key);
    const newExpanded = new Set(expandedKeys);

    if (isCurrentlyExpanded) {
      newExpanded.delete(node.key);
      setExpandedKeys(newExpanded);
      const evt = { ...makeItemEvent(node), event: e.nativeEvent as MouseEvent };
      r.onItemCollapsed?.(evt);
      emitter.emit('itemCollapsed', evt);
    } else {
      // Load children if createChildren is set
      if (r.createChildren && !loadedChildren.has(node.key) && node.children.length === 0) {
        const pubNode = buildPublicNode(node, selectedKeys, expandedKeys, nodeMap);
        const result = r.createChildren(pubNode);
        setLoadingKeys(prev => { const s = new Set(prev); s.add(node.key); return s; });
        Promise.resolve(result).then(children => {
          setLoadedChildren(prev => new Map(prev).set(node.key, children));
          setLoadingKeys(prev => { const s = new Set(prev); s.delete(node.key); return s; });
          setExpandedKeys(prev => {
            const s = new Set(prev);
            s.add(node.key);
            if (r.expandNodesRecursive) {
              getAncestorKeys(nodeTree, node.key).forEach(k => s.add(k));
            }
            return s;
          });
        });
        return;
      }

      newExpanded.add(node.key);
      if (r.expandNodesRecursive) {
        getAncestorKeys(nodeTree, node.key).forEach(k => newExpanded.add(k));
      }
      setExpandedKeys(newExpanded);
      const evt = { ...makeItemEvent(node), event: e.nativeEvent as MouseEvent };
      r.onItemExpanded?.(evt);
      emitter.emit('itemExpanded', evt);
    }
  }, [expandedKeys, loadedChildren, makeItemEvent, nodeMap, nodeTree, selectedKeys]);

  const handleItemClick = useCallback((node: INode<TItem, TKey>, e: React.MouseEvent) => {
    const r = resolvedRef.current;
    const evt: ItemClickEvent<TItem, TKey> = {
      ...makeItemEvent(node),
      event: e.nativeEvent as MouseEvent,
    };
    r.onItemClick?.(evt);
    emitter.emit('itemClick', evt);

    if (r.selectByClick && r.showCheckBoxesMode === 'none') {
      toggleSelection(node);
    }
  }, [makeItemEvent]);

  const handleItemDblClick = useCallback((_node: INode<TItem, TKey>, _e: React.MouseEvent) => {
    // expand/collapse is handled in toggleExpand called from dblclick handler
  }, []);

  const toggleSelection = useCallback((node: INode<TItem, TKey>) => {
    const r = resolvedRef.current;
    const next = new Set(selectedKeysRef.current);
    const currentState = selectionStateMap.get(node.key);
    const shouldSelect = currentState !== 'selected';

    if (r.selectionMode === 'single') {
      next.clear();
      if (shouldSelect) next.add(node.key);
    } else {
      if (shouldSelect) {
        next.add(node.key);
        if (r.selectNodesRecursive) getDescendantKeys(node).forEach(k => next.add(k));
      } else {
        next.delete(node.key);
        if (r.selectNodesRecursive) getDescendantKeys(node).forEach(k => next.delete(k));
      }
    }

    selectedKeysRef.current = next;
    setSelectedKeys(next);

    const evt = makeItemEvent(node);
    r.onItemSelectionChanged?.(evt);
    emitter.emit('itemSelectionChanged', evt);
    const selEvt = makeBaseEvent();
    r.onSelectionChanged?.(selEvt);
    emitter.emit('selectionChanged', selEvt);
  }, [selectionStateMap, makeItemEvent, makeBaseEvent]);

  const handleCheckboxChange = useCallback((node: INode<TItem, TKey>) => {
    toggleSelection(node);
  }, [toggleSelection]);

  const handleContextMenu = useCallback((node: INode<TItem, TKey>, e: React.MouseEvent) => {
    const r = resolvedRef.current;
    e.preventDefault();
    const evt: ItemContextMenuEvent<TItem, TKey> = {
      ...makeItemEvent(node),
      event: e.nativeEvent as MouseEvent,
    };
    r.onItemContextMenu?.(evt);
    emitter.emit('itemContextMenu', evt);
  }, [makeItemEvent]);

  const handleItemHold = useCallback((node: INode<TItem, TKey>, e: React.MouseEvent) => {
    const r = resolvedRef.current;
    const evt: ItemHoldEvent<TItem, TKey> = {
      ...makeItemEvent(node),
      event: e.nativeEvent as MouseEvent,
    };
    r.onItemHold?.(evt);
    emitter.emit('itemHold', evt);
  }, [makeItemEvent]);

  // Select All
  const allSelectState = useMemo<boolean | 'indeterminate'>(() => {
    if (flatNodes.length === 0) return false;
    const allSel = flatNodes.every(n => selectedKeys.has(n.key));
    const noneSel = flatNodes.every(n => !selectedKeys.has(n.key));
    if (allSel) return true;
    if (noneSel) return false;
    return 'indeterminate';
  }, [flatNodes, selectedKeys]);

  const handleSelectAll = useCallback(() => {
    const r = resolvedRef.current;
    const shouldSelectAll = allSelectState !== true;
    const newKeys = shouldSelectAll ? new Set(flatNodes.map(n => n.key)) : new Set<TKey>();
    selectedKeysRef.current = newKeys;
    setSelectedKeys(newKeys);
    const evt: SelectAllValueChangedEvent<TItem, TKey> = {
      ...makeBaseEvent(),
      value: shouldSelectAll,
    };
    r.onSelectAllValueChanged?.(evt);
    emitter.emit('selectAllValueChanged', evt);
    const selEvt = makeBaseEvent();
    r.onSelectionChanged?.(selEvt);
    emitter.emit('selectionChanged', selEvt);
  }, [allSelectState, flatNodes, makeBaseEvent]);

  // Search handler with debounce
  const handleSearchChange = useCallback((value: string) => {
    const r = resolvedRef.current;
    const timeout = r.searchTimeout ?? 500;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setInternalSearchValue(value);
    }, timeout);
    // immediate update for controlled
    setInternalSearchValue(value);
  }, []);

  // ── Resolve effective item template (itemTemplate > itemRender > itemComponent) ──
  const effectiveItemTemplate = useMemo<((item: TItem, index: number, el: HTMLElement) => React.ReactNode) | undefined>(() => {
    if (resolved.itemTemplate) return resolved.itemTemplate;
    if (resolved.itemRender) {
      return (item: TItem, index: number) => resolved.itemRender!(item, index);
    }
    if (resolved.itemComponent) {
      const Comp = resolved.itemComponent;
      return (item: TItem, index: number) => React.createElement(Comp, { data: item, index });
    }
    return undefined;
  }, [resolved.itemTemplate, resolved.itemRender, resolved.itemComponent]);

  // ── Render nodes recursively ───────────────────────────────────────────────
  const renderNodeList = useCallback((nodes: INode<TItem, TKey>[], _level: number): React.ReactNode => {
    return nodes.map((node, idx) => (
      <TreeNode<TItem, TKey>
        key={String(node.key)}
        node={node}
        isRoot={_level === 0}
        isExpanded={expandedKeys.has(node.key)}
        selectionState={selectionStateMap.get(node.key) ?? 'none'}
        showCheckBoxes={resolved.showCheckBoxesMode !== 'none'}
        expandEvent={resolved.expandEvent ?? 'dblclick'}
        animationEnabled={resolved.animationEnabled ?? true}
        expandIcon={resolved.expandIcon}
        collapseIcon={resolved.collapseIcon}
        disabled={resolved.disabled}
        hoverStateEnabled={resolved.hoverStateEnabled ?? true}
        itemTemplate={effectiveItemTemplate}
        loadingKeys={loadingKeys}
        onToggleExpand={toggleExpand}
        onItemClick={handleItemClick}
        onItemDblClick={handleItemDblClick}
        onCheckboxChange={handleCheckboxChange}
        onContextMenu={handleContextMenu}
        onItemHold={handleItemHold}
        renderChildren={renderNodeList}
        focusedKey={focusedKey}
        onFocus={setFocusedKey}
        itemHoldTimeout={resolved.itemHoldTimeout}
        nodeItemIndex={idx}
      />
    ));
  }, [expandedKeys, selectionStateMap, resolved, loadingKeys, toggleExpand,
      handleItemClick, handleItemDblClick, handleCheckboxChange, handleContextMenu,
      handleItemHold, focusedKey, effectiveItemTemplate]);

  // ── Keyboard handling ──────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const custom = keyHandlers.current.get(e.key);
    if (custom) { custom(e); return; }

    const r = resolvedRef.current;
    const allVisible = flattenNodes(filteredNodes);
    const idx = allVisible.findIndex(n => n.key === focusedKey);

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const next = allVisible[idx + 1];
        if (next) setFocusedKey(next.key);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = allVisible[Math.max(0, idx - 1)];
        if (prev) setFocusedKey(prev.key);
        break;
      }
      case 'ArrowRight': {
        if (focusedKey !== null) {
          const node = nodeMap.get(focusedKey);
          if (node?.hasChildren && !expandedKeys.has(focusedKey)) {
            setExpandedKeys(prev => { const s = new Set(prev); s.add(focusedKey!); return s; });
          }
        }
        break;
      }
      case 'ArrowLeft': {
        if (focusedKey !== null) {
          if (expandedKeys.has(focusedKey)) {
            setExpandedKeys(prev => { const s = new Set(prev); s.delete(focusedKey!); return s; });
          }
        }
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (focusedKey !== null) {
          const node = nodeMap.get(focusedKey);
          if (node) {
            if (r.showCheckBoxesMode !== 'none') {
              toggleSelection(node);
            } else if (node.hasChildren) {
              const syntheticE = { nativeEvent: e.nativeEvent, stopPropagation: () => {} } as unknown as React.MouseEvent;
              toggleExpand(node, syntheticE);
            }
          }
        }
        break;
      }
      case '*': {
        if (r.expandAllEnabled) {
          setExpandedKeys(new Set(flatNodes.filter(n => n.hasChildren).map(n => n.key)));
        }
        break;
      }
      case '-': {
        if (r.expandAllEnabled) {
          setExpandedKeys(new Set());
        }
        break;
      }
      case 'Delete': {
        if (focusedKey !== null) {
          const node = nodeMap.get(focusedKey);
          if (node) toggleSelection(node);
        }
        break;
      }
    }
  }, [focusedKey, flatNodes, filteredNodes, nodeMap, expandedKeys, toggleExpand, toggleSelection]);

  // ── Content ready / initialized ───────────────────────────────────────────
  useEffect(() => {
    const r = resolvedRef.current;
    const evt: InitializedEvent<TItem, TKey> = {
      element: rootRef.current ?? undefined,
      component: selfRef.current,
    };
    r.onInitialized?.(evt);
    emitter.emit('initialized', evt);
  }, []);

  useEffect(() => {
    const r = resolvedRef.current;
    const evt = makeBaseEvent();
    r.onContentReady?.(evt);
    emitter.emit('contentReady', evt);
  }, [repaintKey, filteredNodes.length]);

  // Register instance in WeakMap
  useEffect(() => {
    if (rootRef.current) _instanceMap.set(rootRef.current, selfRef.current as any);
    return () => {
      if (rootRef.current) _instanceMap.delete(rootRef.current);
    };
  }, []);

  // ── Imperative ref API ────────────────────────────────────────────────────
  const resolveNodeArg = useCallback((arg: TItem | Element | TKey): INode<TItem, TKey> | null => {
    if (arg instanceof Element) {
      const id = arg.getAttribute(DATA_ITEM_ID);
      if (!id) return null;
      return flatNodes.find(n => String(n.key) === id) ?? null;
    }
    if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
      const itemAsAny = arg as any;
      if ('key' in itemAsAny) return nodeMap.get(itemAsAny.key) ?? null;
      return flatNodes.find(n => n.itemData === arg) ?? null;
    }
    return nodeMap.get(arg as TKey) ?? null;
  }, [flatNodes, nodeMap]);

  const refObject: TreeViewRef<TItem, TKey> = useMemo(() => ({
    collapseAll() {
      setExpandedKeys(new Set());
    },
    collapseItem(arg) {
      const node = resolveNodeArg(arg as any);
      if (node) setExpandedKeys(prev => { const s = new Set(prev); s.delete(node.key); return s; });
      return Promise.resolve();
    },
    expandAll() {
      setExpandedKeys(new Set(flatNodes.filter(n => n.hasChildren).map(n => n.key)));
    },
    expandItem(arg) {
      const node = resolveNodeArg(arg as any);
      if (node) setExpandedKeys(prev => { const s = new Set(prev); s.add(node.key); return s; });
      return Promise.resolve();
    },
    getNodes() {
      return nodeTree.map(n => buildPublicNode(n, selectedKeys, expandedKeys, nodeMap));
    },
    getSelectedNodes() {
      return flatNodes.filter(n => selectedKeysRef.current.has(n.key))
        .map(n => buildPublicNode(n, selectedKeysRef.current, expandedKeys, nodeMap));
    },
    getSelectedNodeKeys() {
      return Array.from(selectedKeysRef.current);
    },
    selectAll() {
      const newKeys = new Set(flatNodes.map(n => n.key));
      selectedKeysRef.current = newKeys;
      setSelectedKeys(newKeys);
      const evt = makeBaseEvent();
      resolvedRef.current.onSelectionChanged?.(evt);
      emitter.emit('selectionChanged', evt);
    },
    getScrollable() {
      return scrollableRef.current;
    },
    selectItem(arg) {
      const node = resolveNodeArg(arg as any);
      if (!node) return false;
      const next = new Set(selectedKeysRef.current);
      next.add(node.key);
      selectedKeysRef.current = next;
      setSelectedKeys(next);
      return true;
    },
    unselectAll() {
      selectedKeysRef.current = new Set();
      setSelectedKeys(new Set());
      const evt = makeBaseEvent();
      resolvedRef.current.onSelectionChanged?.(evt);
      emitter.emit('selectionChanged', evt);
    },
    unselectItem(arg) {
      const node = resolveNodeArg(arg as any);
      if (!node) return false;
      const next = new Set(selectedKeysRef.current);
      next.delete(node.key);
      selectedKeysRef.current = next;
      setSelectedKeys(next);
      return false;
    },
    updateDimensions() {
      return Promise.resolve();
    },
    getDataSource() {
      const ds = resolvedRef.current.dataSource;
      if (!ds) return null;
      if (Array.isArray(ds)) {
        const items = ds as TItem[];
        return { items: () => items, load: () => Promise.resolve(items) };
      }
      if (typeof (ds as any).items === 'function') return ds as any;
      return null;
    },
    scrollToItem(arg) {
      const node = resolveNodeArg(arg as any);
      if (node && rootRef.current) {
        const el = rootRef.current.querySelector(`[${DATA_ITEM_ID}="${String(node.key)}"]`);
        el?.scrollIntoView({ block: 'nearest' });
      }
      return Promise.resolve();
    },
    focus() { rootRef.current?.focus(); },
    repaint() { setRepaintKey(k => k + 1); },
    dispose() {
      if (isDisposed.current) return;
      isDisposed.current = true;
      const evt = makeBaseEvent();
      resolvedRef.current.onDisposing?.(evt);
      emitter.emit('disposing', evt);
      emitter.clear();
    },
    instance() { return selfRef.current; },
    element() { return rootRef.current!; },
    registerKeyHandler(key, handler) { keyHandlers.current.set(key, handler); },
    option(nameOrOptions?: any, value?: any): any {
      if (nameOrOptions === undefined) return resolvedRef.current;
      if (typeof nameOrOptions === 'string' && value === undefined) {
        return (resolvedRef.current as any)[nameOrOptions];
      }
      if (typeof nameOrOptions === 'string') {
        const prev = (resolvedRef.current as any)[nameOrOptions];
        setOverrides(o => ({ ...o, [nameOrOptions]: value }));
        const evt: OptionChangedEvent<TItem, TKey> = {
          ...makeBaseEvent(),
          name: nameOrOptions,
          fullName: nameOrOptions,
          value,
          previousValue: prev,
        };
        resolvedRef.current.onOptionChanged?.(evt);
        emitter.emit('optionChanged', evt);
        return;
      }
      // object form
      const opts = nameOrOptions as Partial<TreeViewProps<TItem, TKey>>;
      setOverrides(o => ({ ...o, ...opts }));
      Object.entries(opts).forEach(([name, val]) => {
        const prev = (resolvedRef.current as any)[name];
        const evt: OptionChangedEvent<TItem, TKey> = {
          ...makeBaseEvent(),
          name,
          fullName: name,
          value: val,
          previousValue: prev,
        };
        resolvedRef.current.onOptionChanged?.(evt);
        emitter.emit('optionChanged', evt);
      });
    },
    resetOption(name) {
      setOverrides(o => { const n = { ...o }; delete (n as any)[name]; return n; });
    },
    on(eventOrMap: any, handler?: Function) {
      if (typeof eventOrMap === 'string' && handler) {
        emitter.on(eventOrMap, handler);
      } else if (typeof eventOrMap === 'object') {
        Object.entries(eventOrMap).forEach(([e, h]) => emitter.on(e, h as Function));
      }
    },
    off(event: string, handler?: Function) {
      emitter.off(event, handler);
    },
    beginUpdate() {
      updateDepth.current++;
    },
    endUpdate() {
      updateDepth.current = Math.max(0, updateDepth.current - 1);
      if (updateDepth.current === 0) {
        const updates = pendingUpdates.current.splice(0);
        updates.forEach(fn => fn());
      }
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [flatNodes, nodeTree, nodeMap, selectedKeys, expandedKeys, resolveNodeArg, makeBaseEvent, emitter]);

  // Keep selfRef in sync so makeBaseEvent always returns the current instance
  selfRef.current = refObject;

  useImperativeHandle(ref, () => refObject, [refObject]);

  // ── Rendering ─────────────────────────────────────────────────────────────
  const r = resolved;
  const isRtl = r.rtlEnabled;
  const showSearch = r.searchEnabled;
  const showSelectAll = r.showCheckBoxesMode === 'selectAll' && r.selectionMode === 'multiple';

  const rootStyle: React.CSSProperties = {
    width: r.width,
    height: r.height ?? '100%',
  };

  if (r.visible === false) rootStyle.display = 'none';

  const rootClasses = [
    'dx-widget',
    WIDGET_CLASS,
    'dx-visibility-change-handler',
    isRtl ? 'dx-rtl' : '',
    r.disabled ? 'dx-state-disabled' : '',
    showSearch ? WITH_SEARCH_CLASS : '',
    r.focusStateEnabled ? '' : '',
  ].filter(Boolean).join(' ');

  const { elementAttr = {} } = r;
  const extraAttrs: Record<string, any> = {};
  Object.entries(elementAttr).forEach(([k, v]) => { extraAttrs[k] = v; });

  const isEmpty = filteredNodes.length === 0 && !loadingKeys.size;

  return (
    <div
      ref={rootRef}
      className={rootClasses}
      style={rootStyle}
      tabIndex={r.tabIndex ?? 0}
      title={r.hint}
      accessKey={r.accessKey}
      onKeyDown={handleKeyDown}
      role="tree"
      aria-disabled={r.disabled}
      {...extraAttrs}
    >
      {showSearch && (
        <SearchInput
          value={searchValue ?? ''}
          onChange={handleSearchChange}
          editorOptions={r.searchEditorOptions}
        />
      )}

      <div
        ref={scrollableRef}
        className={[
          'dx-scrollable',
          'dx-scrollview',
          'dx-widget',
          'dx-visibility-change-handler',
          r.scrollDirection === 'both'
            ? 'dx-scrollable-both'
            : r.scrollDirection === 'horizontal'
              ? 'dx-scrollable-horizontal'
              : 'dx-scrollable-vertical',
          r.useNativeScrolling ? 'dx-scrollable-native' : '',
        ].filter(Boolean).join(' ')}
        style={{ height: showSearch ? 'calc(100% - 41px)' : '100%' }}
      >
        <div className="dx-scrollable-wrapper">
          <div className="dx-scrollable-container" style={{ overflow: 'auto', height: '100%' }}>
            <div className="dx-scrollable-content">

              {showSelectAll && (
                <div
                  className={`${SELECT_ALL_CLASS} ${ITEM_WITH_CHECKBOX_CLASS}`}
                  onClick={handleSelectAll}
                  role="checkbox"
                  aria-checked={allSelectState === true ? true : allSelectState === false ? false : 'mixed'}
                >
                  <Checkbox
                    checked={allSelectState === true ? true : allSelectState === 'indeterminate' ? 'indeterminate' : false}
                    label={r.selectAllText ?? 'Select All'}
                    onChange={handleSelectAll}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              )}

              {isEmpty ? (
                <div className="dx-empty-message">{r.noDataText}</div>
              ) : (
                <ul
                  className={`${NODE_CONTAINER_CLASS} ${OPENED_NODE_CONTAINER_CLASS}`}
                  role="group"
                >
                  {renderNodeList(filteredNodes, 0)}
                </ul>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Forward ref ───────────────────────────────────────────────────────────

export const TreeView = forwardRef(TreeViewInner) as unknown as TreeViewComponent;

// ─── TreeViewComponent type (with statics) ─────────────────────────────────

export type TreeViewComponent = React.ForwardRefExoticComponent<
  TreeViewProps & React.RefAttributes<TreeViewRef>
> & {
  getInstance(element: Element): TreeViewRef | undefined;
  defaultOptions(rule: DefaultOptionsRule): void;
};

// ─── Static methods ────────────────────────────────────────────────────────

(TreeView as any).getInstance = (element: Element): TreeViewRef | undefined =>
  _instanceMap.get(element);

(TreeView as any).defaultOptions = (rule: DefaultOptionsRule): void => {
  _defaultOptionsRules.push(rule);
};

// ─── TreeViewTypes namespace ───────────────────────────────────────────────

export const TreeViewTypes = {
  ContentReadyEvent: null as unknown as ContentReadyEvent,
  DisposingEvent: null as unknown as DisposingEvent,
  InitializedEvent: null as unknown as InitializedEvent,
  OptionChangedEvent: null as unknown as OptionChangedEvent,
  ItemClickEvent: null as unknown as ItemClickEvent,
  ItemCollapsedEvent: null as unknown as ItemCollapsedEvent,
  ItemContextMenuEvent: null as unknown as ItemContextMenuEvent,
  ItemExpandedEvent: null as unknown as ItemExpandedEvent,
  ItemHoldEvent: null as unknown as ItemHoldEvent,
  ItemRenderedEvent: null as unknown as ItemRenderedEvent,
  ItemSelectionChangedEvent: null as unknown as ItemSelectionChangedEvent,
  SelectAllValueChangedEvent: null as unknown as SelectAllValueChangedEvent,
  SelectionChangedEvent: null as unknown as SelectionChangedEvent,
  TreeViewCheckBoxMode: null as unknown as TreeViewCheckBoxMode,
  TreeViewExpandEvent: null as unknown as TreeViewExpandEvent,
};

export default TreeView;
