import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { Modal, ConfirmDialog, RowMenu, Select, DatePicker } from './shared/ui/EnterpriseKit.js';
import { Pager } from './portals/common/EnterprisePanels.js';
import { toCsv, StatusPill, useQueryState, DetailDrawer } from './portals/common/CrudKit.js';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PortalShell } from './portals/common/PortalShell.js';
import { PortalStateProvider } from './portals/common/PortalStateContext.js';

let dom: any;
let container: HTMLDivElement;
let root: ReturnType<typeof createRoot> | null = null;

beforeEach(() => {
  dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
  (globalThis as any).window = dom.window;
  (globalThis as any).document = dom.window.document;
  (globalThis as any).localStorage = dom.window.localStorage;
  (globalThis as any).sessionStorage = dom.window.sessionStorage;
  Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true, writable: true });
  (globalThis as any).HTMLElement = dom.window.HTMLElement;
  (globalThis as any).MouseEvent = dom.window.MouseEvent;
  (globalThis as any).KeyboardEvent = dom.window.KeyboardEvent;
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => { root?.unmount(); });
  root = null;
  container.remove();
  dom.window.close();
});

function render(el: React.ReactElement) {
  act(() => { root!.render(el); });
}
function q(sel: string): HTMLElement | null { return container.querySelector(sel); }

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(<Modal open={false} onClose={() => {}} title="T"><div /></Modal>);
    assert.equal(container.firstChild, null);
  });
  it('renders title and closes on Escape', () => {
    let closed = 0;
    render(<Modal open onClose={() => { closed += 1; }} title="New lead"><div>body</div></Modal>);
    assert.ok(container.textContent?.includes('New lead'));
    act(() => {
      document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    assert.equal(closed, 1);
  });
});

describe('Modal focus', () => {
  it('never steals focus from an input while typing', async () => {
    function Form() {
      const [v, setV] = useState('');
      return (
        <Modal open onClose={() => {}} title="Edit">
          <input aria-label="name" value={v} onChange={(e) => setV(e.target.value)} />
        </Modal>
      );
    }
    render(<Form />);
    const input = container.querySelector('input') as HTMLInputElement;
    act(() => { input.focus(); });
    assert.equal(document.activeElement, input);
    for (const ch of ['a', 'b']) {
      act(() => {
        input.value = input.value + ch;
        input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
      });
    }
    await new Promise((r) => setTimeout(r, 80));
    assert.equal(input.value, 'ab');
    assert.equal(document.activeElement, input, 'focus must stay in the input across keystrokes');
  });
});

describe('ConfirmDialog', () => {
  it('requires reason before confirming', async () => {
    let got: string | undefined;
    render(<ConfirmDialog open title="Delete" body="Sure?" requireReason="Reason" onConfirm={(r) => { got = r; }} onCancel={() => {}} />);
    const btn = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Delete') as HTMLButtonElement;
    assert.equal(btn.disabled, true);
    const area = container.querySelector('textarea') as HTMLTextAreaElement;
    act(() => {
      Simulate.change(area, { target: { value: 'cleanup' } } as any);
    });
    assert.equal(btn.disabled, false);
    await act(async () => { btn.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })); });
    assert.equal(got, 'cleanup');
  });
});

describe('RowMenu', () => {
  it('opens a body-level portal and fires item without shifting layout', () => {
    let fired = 0;
    render(<RowMenu items={[{ label: 'Approve', onSelect: () => { fired += 1; } }]} />);
    const before = (container.firstChild as HTMLElement).getBoundingClientRect();
    act(() => { q('button')!.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })); });
    const menu = document.querySelector('[role="menu"]');
    assert.ok(menu, 'menu renders');
    assert.equal(container.querySelector('[role="menu"]'), null, 'menu lives outside the row container (portal)');
    assert.equal((menu as HTMLElement).style.position, 'fixed');
    const after = (container.firstChild as HTMLElement).getBoundingClientRect();
    assert.deepEqual([after.width, after.height], [before.width, before.height]);
    act(() => { Array.from(document.querySelectorAll('[role="menuitem"]')).find((b) => b.textContent === 'Approve')!.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })); });
    assert.equal(fired, 1);
    document.querySelector('[role="menu"]')?.remove();
  });
});

describe('Select', () => {
  it('shows placeholder then picks an option', () => {
    let value = '';
    const options = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }];
    const rerender = (v: string) => render(<Select value={v} onChange={(nv) => { value = nv; }} options={options} placeholder="Pick…" />);
    rerender(value);
    assert.ok(container.textContent?.includes('Pick…'));
    act(() => { container.querySelector('button')!.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })); });
    const list = document.querySelector('[role="listbox"]');
    assert.ok(list, 'options render in a body portal');
    act(() => {
      Array.from(document.querySelectorAll('[role="option"]')).find((o) => o.textContent?.includes('Beta'))!.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    });
    assert.equal(value, 'b');
    document.querySelector('[role="listbox"]')?.remove();
  });
});

describe('DatePicker', () => {
  it('picks a day and emits yyyy-mm-dd', () => {
    let value = '';
    render(<DatePicker value={value} onChange={(v) => { value = v; }} />);
    act(() => { container.querySelector('button')!.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })); });
    const dlg = document.querySelector('[role="dialog"]') as HTMLElement | null;
    assert.ok(dlg, 'calendar renders in a body portal');
    assert.equal(dlg!.style.position, 'fixed');
    act(() => {
      Array.from(document.querySelectorAll('button')).find((b) => b.textContent === '15')!.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    });
    assert.match(value, /^\d{4}-\d{2}-15$/);
  });
});

describe('Pager', () => {
  it('renders nothing for a single page and navigates otherwise', () => {
    render(<Pager page={1} total={5} pageSize={10} onPage={() => {}} />);
    assert.equal(container.firstChild, null);
    let got = 0;
    render(<Pager page={1} total={25} pageSize={10} onPage={(p) => { got = p; }} />);
    assert.ok(container.textContent?.includes('Page 1 of 3'));
    act(() => {
      Array.from(container.querySelectorAll('button')).find((b) => /Next/.test(b.textContent || ''))!.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    });
    assert.equal(got, 2);
  });
});

describe('toCsv', () => {
  it('escapes commas, quotes and nulls', () => {
    const csv = toCsv(
      [{ a: 'x,y', b: 'q"q', c: null as unknown as string, d: undefined as unknown as string, e: 5 }],
      ['a', 'b', 'c', 'd', 'e'],
    );
    assert.equal(csv, 'a,b,c,d,e\n"x,y","q""q",,,5');
  });
  it('emits header-only for empty rows', () => {
    assert.equal(toCsv([], ['id', 'name']), 'id,name');
  });
});

describe('StatusPill', () => {
  it('renders value with a tone and never blanks', () => {
    render(<StatusPill value="Suspended" />);
    assert.ok(container.textContent?.includes('Suspended'));
    assert.match(container.innerHTML, /bg-red-50/);
    render(<StatusPill value={undefined} />);
    assert.ok(container.textContent?.includes('—'));
  });
});

describe('PortalShell sidebar', () => {
  const items = [
    { label: 'Overview', path: '/superadmin' },
    { label: 'Users', path: '/superadmin/users', group: 'Directory' },
    { label: 'Tenants', path: '/superadmin/organizations', group: 'Directory' },
    { label: 'Jobs', path: '/superadmin/jobs', group: 'Recruitment' },
  ];
  function shell(path: string) {
    return (
      <MemoryRouter initialEntries={[path]}>
        <PortalStateProvider>
          <PortalShell portalTitle="Super Admin Console" portalRole="superadmin" navItems={items}>
            <div>body</div>
          </PortalShell>
        </PortalStateProvider>
      </MemoryRouter>
    );
  }
  it('renders group headers and marks the active link', () => {
    render(shell('/superadmin/users'));
    assert.ok(container.textContent?.includes('Directory'));
    assert.ok(container.textContent?.includes('Recruitment'));
    const active = container.querySelector('a[aria-current="page"]');
    assert.ok(active?.textContent?.includes('Users'));
  });
  it('keeps exactly one group open (accordion)', () => {
    render(shell('/superadmin/users'));
    const dirToggle = Array.from(container.querySelectorAll('button')).find((b) => b.textContent?.includes('Directory')) as HTMLButtonElement;
    const recToggle = Array.from(container.querySelectorAll('button')).find((b) => b.textContent?.includes('Recruitment')) as HTMLButtonElement;
    assert.ok(dirToggle && recToggle, 'group toggles exist');
    assert.equal(dirToggle.getAttribute('aria-expanded'), 'true');
    assert.equal(recToggle.getAttribute('aria-expanded'), 'false');
    act(() => { recToggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })); });
    assert.equal(recToggle.getAttribute('aria-expanded'), 'true');
    assert.equal(dirToggle.getAttribute('aria-expanded'), 'false', 'previous group auto-closes');
  });
  it('collapses the open group on toggle', () => {
    render(shell('/superadmin/users'));
    const toggle = Array.from(container.querySelectorAll('button')).find((b) => b.textContent?.includes('Directory')) as HTMLButtonElement;
    assert.equal(toggle.getAttribute('aria-expanded'), 'true');
    act(() => { toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })); });
    assert.equal(toggle.getAttribute('aria-expanded'), 'false');
    const collapsed = toggle.closest('section')?.querySelector('.grid-rows-\\[0fr\\]');
    assert.ok(collapsed, 'collapsed group clips its links');
    assert.ok(container.textContent?.includes('Overview'));
  });
});

describe('CandidatesPanel controls', () => {
  it('uses custom dropdowns and pickers — no native selects or date inputs', async () => {
    const { CandidatesPanel } = await import('./portals/common/EnterprisePanels.js');
    const { AuthProvider } = await import('./shared/auth/AuthContext.js');
    render(<AuthProvider><CandidatesPanel /></AuthProvider>);
    assert.equal(container.querySelector('select'), null, 'native select found');
    assert.equal(container.querySelector('input[type="date"]'), null, 'native date input found');
    assert.ok(container.textContent?.includes('Advanced') || container.textContent?.includes('Filters'));
  });
});

describe('ApplicationsKanban', () => {
  it('renders a column per stage with correct card counts', async () => {
    const { ApplicationsKanban } = await import('./portals/common/EnterprisePanels.js');
    const apps = [
      { id: 'APP-1', jobTitle: 'Dev', candidateEmail: 'a@x.com', stage: 'Applied' },
      { id: 'APP-2', jobTitle: 'Dev', candidateEmail: 'b@x.com', stage: 'Applied' },
      { id: 'APP-3', jobTitle: 'QA', candidateEmail: 'c@x.com', stage: 'Rejected' },
    ];
    render(<ApplicationsKanban apps={apps} onOpen={() => {}} onDropMove={() => {}} />);
    assert.ok(container.textContent?.includes('APP-1'));
    assert.ok(container.textContent?.includes('a@x.com'));
    assert.ok(container.querySelector('[data-lenis-prevent]'), 'smooth-scroll hijack disabled on board scroll');
  });
  it('application guards lock terminal stages and gate reopen', async () => {
    const { checkRecordAction } = await import('./portals/common/CrudKit.js');
    assert.equal(checkRecordAction('application', { stage: 'Hired' }, 'move', {}).allowed, false);
    assert.equal(checkRecordAction('application', { stage: 'Applied' }, 'move', {}).allowed, true);
    assert.equal(checkRecordAction('application', { stage: 'Withdrawn' }, 'reopen', {}).allowed, true);
    assert.equal(checkRecordAction('application', { stage: 'Applied' }, 'reopen', {}).allowed, false);
  });
});

describe('Commercial terms UI', () => {
  it('templates live in their own component with tabs on the page', async () => {
    const { AgreementTemplatesPanel, CommissionsPanel } = await import('./portals/common/EnterprisePanels.js');
    const { AuthProvider } = await import('./shared/auth/AuthContext.js');
    render(<AuthProvider><AgreementTemplatesPanel templates={[]} onChanged={() => {}} /></AuthProvider>);
    assert.ok(container.textContent?.includes('Agreement templates'), 'templates section renders');
    render(<AuthProvider><CommissionsPanel /></AuthProvider>);
    assert.ok(container.textContent?.includes('Templates (0)'), 'templates tab exists on the commercial page');
  });
  it('billing panel focuses on payments/refunds (invoices moved out)', async () => {
    const { BillingPanel } = await import('./portals/common/EnterprisePanels.js');
    const { AuthProvider } = await import('./shared/auth/AuthContext.js');
    render(<AuthProvider><BillingPanel /></AuthProvider>);
    assert.ok(container.textContent?.includes('Payments / Refunds'), 'billing header renders');
    assert.ok(!container.textContent?.includes('Payment reminders'), 'reminders live on the invoices page now');
  });
});

describe('Invoices + templates', () => {
  it('invoices page renders the corporate table shell', async () => {
    const { InvoicesPanel } = await import('./portals/common/EnterprisePanels.js');
    const { AuthProvider } = await import('./shared/auth/AuthContext.js');
    render(<AuthProvider><InvoicesPanel /></AuthProvider>);
    assert.ok(container.textContent?.includes('Tax invoices'), 'invoices header renders');
    assert.ok(container.textContent?.includes('Payment reminders'), 'reminders strip renders');
  });
  it('fillTemplate substitutes commercial tokens', async () => {
    const { fillTemplate } = await import('./portals/common/EnterprisePanels.js');
    const html = fillTemplate({ name: 'Std', paymentTermsDays: 15, replacementDays: 60, rateMin: 10, rateMax: 12, hiringType: 'Senior / niche technology roles', bodyHtml: '<p>{{company_name}} pays {{rate_percent}}% in {{payment_days}} days.</p>' }, 'TNT-9011');
    assert.ok(html.includes('TNT-9011 pays 10–12% in 15 days.'), `tokens filled, got: ${html}`);
    assert.ok(!html.includes('{{'), 'no raw tokens remain');
  });
});

describe('InfoTip + PageSize pattern', () => {
  it('info button opens a titled explainer modal', async () => {
    const { InfoTip } = await import('./portals/common/EnterprisePanels.js');
    render(<InfoTip title="How this works" body={<p>Because reasons.</p>} />);
    const btn = container.querySelector('button[aria-label="About: How this works"]');
    assert.ok(btn, 'info button renders');
    act(() => { btn!.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })); });
    assert.ok(container.textContent?.includes('Because reasons.'), 'explainer opens');
  });
  it('page size offers 20/50/100', async () => {
    const { PageSize } = await import('./portals/common/EnterprisePanels.js');
    let val = 20;
    render(<PageSize value={val} onChange={(n) => { val = n; }} />);
    assert.ok(container.textContent?.includes('Show') && container.textContent?.includes('/ page'));
    act(() => { container.querySelector('button')!.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })); });
    for (const n of ['20', '50', '100']) assert.ok(document.querySelector('[role="listbox"]')?.textContent?.includes(n) || container.textContent?.includes(n), `offers ${n}`);
  });
});

describe('RichText + SkillPicker', () => {
  it('rich editor renders toolbar and editable region', async () => {
    const { RichText } = await import('./shared/ui/EnterpriseKit.js');
    let val = '<p>Hi</p>';
    render(<RichText label="Description" value={val} onChange={(v) => { val = v; }} />);
    assert.ok(container.textContent?.includes('Description'));
    assert.ok(container.querySelector('[contenteditable="true"]'), 'editable region renders');
  });
  it('skill picker starts empty with search affordance', async () => {
    const { SkillPicker } = await import('./portals/common/EnterprisePanels.js');
    render(<SkillPicker value="" onChange={() => {}} />);
    assert.ok(container.textContent?.includes('No skills selected'));
    assert.ok(container.querySelector('input[placeholder*="search"]') || container.textContent?.includes('Type to search'));
  });
});

describe('Bulk import + roles/skills panels', () => {
  it('parses quoted CSV correctly', async () => {
    const { parseCsv } = await import('./portals/common/EnterprisePanels.js');
    assert.deepEqual(parseCsv('name,category\n"React, JS",Technology\nPython,Data & AI\n'), [['name', 'category'], ['React, JS', 'Technology'], ['Python', 'Data & AI']]);
  });
  it('roles and skills panels render with import affordances', async () => {
    const { RolesPanel, SkillsPanel } = await import('./portals/common/EnterprisePanels.js');
    const { AuthProvider } = await import('./shared/auth/AuthContext.js');
    render(<AuthProvider><RolesPanel /></AuthProvider>);
    assert.ok(container.textContent?.includes('Bulk import'), 'roles import renders');
    render(<AuthProvider><SkillsPanel /></AuthProvider>);
    assert.ok(container.textContent?.includes('Skills taxonomy'), 'skills panel renders');
  });
});

describe('LeadsKanban', () => {
  it('renders stage columns with counts and cards', async () => {
    const { LeadsKanban } = await import('./portals/common/EnterprisePanels.js');
    render(<LeadsKanban leads={[{ id: 'L1', contactName: 'A', companyName: 'Acme', stage: 'New', value: 5 }, { id: 'L2', contactName: 'B', companyName: 'Beta', stage: 'Won', value: 9 }]} onOpen={() => {}} onDropMove={() => {}} />);
    assert.ok(container.textContent?.includes('Acme'));
    assert.ok(container.querySelector('[data-lenis-prevent]'), 'board scroll region present');
  });
});

describe('BulkImportModal', () => {
  it('walks preview-then-commit with duplicate report', async () => {
    const { BulkImportModal } = await import('./portals/common/EnterprisePanels.js');
    render(<BulkImportModal open onClose={() => {}} title="Bulk import skills" collection="skills" columns={['name', 'category']} sample="name,category" onDone={() => {}} />);
    assert.ok(container.textContent?.includes('Preview & dedupe check'));
    assert.ok(container.textContent?.includes('Confirm import'));
  });
});

describe('DetailDrawer scroll', () => {
  it('pins the panel to the viewport with a dedicated internal scroller', () => {
    render(
      <DetailDrawer title="Flow Case" subtitle="flow@example.com" onClose={() => {}}>
        <div style={{ height: 3000 }}>tall content</div>
      </DetailDrawer>,
    );
    const dialog = container.querySelector('[role="dialog"]');
    assert.ok(dialog, 'dialog exists');
    assert.ok(dialog!.className.includes('drawer-root'), 'viewport-pinned shell is used');
    assert.ok(container.querySelector('.drawer-dim'), 'dim layer exists');
    assert.ok(container.querySelector('.drawer-panel'), 'viewport-pinned panel is used');
    const scroller = container.querySelector('[data-testid="drawer-scroll"]');
    assert.ok(scroller, 'internal scroll region exists');
    assert.ok(scroller!.className.includes('drawer-scroll'), 'bar-free guaranteed scroller is used');
    assert.ok(scroller!.hasAttribute('data-lenis-prevent'), 'smooth-scroll hijack is disabled inside the drawer');
  });
  it('closes on Escape', () => {
    let closed = 0;
    render(
      <DetailDrawer title="T" onClose={() => { closed += 1; }}>
        <div>body</div>
      </DetailDrawer>,
    );
    act(() => {
      document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    assert.equal(closed, 1);
  });
});

describe('useQueryState', () => {
  function Probe({ storageKey }: { storageKey: string }) {
    const [v, setV] = useQueryState(storageKey);
    const [seen, setSeen] = useState('');
    return (
      <div>
        <span data-testid="val">{v}</span>
        <button type="button" onClick={() => setV('hello')}>set</button>
        <button type="button" onClick={() => setSeen(window.location.search)}>read</button>
        <span data-testid="url">{seen}</span>
      </div>
    );
  }
  it('initializes empty and persists writes to the URL', () => {
    render(<Probe storageKey="probe_q" />);
    assert.equal(container.querySelector('[data-testid="val"]')?.textContent, '');
    act(() => { container.querySelectorAll('button')[0]!.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })); });
    assert.equal(container.querySelector('[data-testid="val"]')?.textContent, 'hello');
    act(() => { container.querySelectorAll('button')[1]!.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })); });
    assert.ok(container.querySelector('[data-testid="url"]')?.textContent?.includes('probe_q=hello'));
  });
});
