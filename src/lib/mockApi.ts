type JsonRecord = Record<string, unknown>;

type MockDb = {
  users: Array<{
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'inspector' | 'client' | 'assistant';
    strataId?: string;
  }>;
  stratas: Array<{
    id: string;
    strataPlan: string;
    complexName: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    propertyType: 'Bare Land' | 'Townhouse' | 'Apartment' | 'Mixed-Use' | 'Industrial';
    legalType: 'Standard' | 'Air-Parcel';
    companyId: string;
    propertyManagerId?: string;
    userIds: string[];
    createdAt: string;
  }>;
  serviceRequests: Array<{
    id: string;
    strataId: string;
    strataPlan: string;
    serviceType: string;
    status:
      | 'draft'
      | 'questions_complete'
      | 'documents_complete'
      | 'pending_approval'
      | 'approved'
      | 'inspection_scheduled'
      | 'inspection_complete'
      | 'draft_meeting_scheduled'
      | 'archived';
    progress: number;
    requestDate: string;
    createdAt: string;
    updatedAt: string;
  }>;
  surveyAnswersBySection: Record<string, Record<string, string>>;
  docStatusById: Record<string, 'pending' | 'uploaded' | 'n/a'>;
  notes: Array<{
    id: number;
    title: string;
    content: string;
    pinned: boolean;
    created_at: number;
  }>;
  notesNextId: number;
  authUserId?: string;
};

const STORAGE_KEY = 'srp-mock-db-v1';

function nowIso(): string {
  return new Date().toISOString();
}

function unixSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function defaultDb(): MockDb {
  const createdAt = '2024-03-01T10:00:00Z';

  const stratas: MockDb['stratas'] = [
    {
      id: 'strata-1',
      strataPlan: 'VIS 2345',
      complexName: 'Vancouver Heights',
      address: '100 Main St',
      city: 'Vancouver',
      province: 'BC',
      postalCode: 'V5K 0A1',
      country: 'Canada',
      propertyType: 'Apartment',
      legalType: 'Standard',
      companyId: 'company-1',
      propertyManagerId: 'user-client-1',
      userIds: ['user-client-1'],
      createdAt,
    },
    {
      id: 'strata-2',
      strataPlan: 'EPS 9921',
      complexName: 'Maple Ridge Complex',
      address: '250 Cedar Ave',
      city: 'Maple Ridge',
      province: 'BC',
      postalCode: 'V2X 0B2',
      country: 'Canada',
      propertyType: 'Townhouse',
      legalType: 'Standard',
      companyId: 'company-1',
      propertyManagerId: 'user-client-2',
      userIds: ['user-client-2'],
      createdAt,
    },
    {
      id: 'strata-3',
      strataPlan: 'KAS 1101',
      complexName: 'Sunset Villas',
      address: '75 Oceanview Dr',
      city: 'Victoria',
      province: 'BC',
      postalCode: 'V8V 1A1',
      country: 'Canada',
      propertyType: 'Bare Land',
      legalType: 'Standard',
      companyId: 'company-1',
      propertyManagerId: 'user-client-3',
      userIds: ['user-client-3'],
      createdAt,
    },
  ];

  const users: MockDb['users'] = [
    {
      id: 'user-client-1',
      name: 'John Doe',
      email: 'john.doe@strata.com',
      password: 'password123',
      role: 'client',
      strataId: 'strata-1',
    },
    {
      id: 'user-client-2',
      name: 'Jane Smith',
      email: 'jane.smith@strata.com',
      password: 'password123',
      role: 'client',
      strataId: 'strata-2',
    },
    {
      id: 'user-client-3',
      name: 'Alex Lee',
      email: 'alex.lee@strata.com',
      password: 'password123',
      role: 'client',
      strataId: 'strata-3',
    },
    {
      id: 'user-inspector-1',
      name: 'Jane Inspector',
      email: 'inspector@srp.com',
      password: 'inspect123',
      role: 'inspector',
    },
    {
      id: 'user-admin-1',
      name: 'SRP Admin',
      email: 'admin@srp.com',
      password: 'admin123',
      role: 'admin',
    },
  ];

  const serviceRequests: MockDb['serviceRequests'] = [
    {
      id: 'req-1',
      strataId: 'strata-1',
      strataPlan: 'VIS 2345',
      serviceType: 'Standard Depreciation Report',
      status: 'documents_complete',
      progress: 45,
      requestDate: '2026-01-20',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: 'req-2',
      strataId: 'strata-2',
      strataPlan: 'EPS 9921',
      serviceType: 'Check-up Inspection',
      status: 'pending_approval',
      progress: 25,
      requestDate: '2026-01-22',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];

  const notes: MockDb['notes'] = [
    {
      id: 1,
      title: 'Welcome',
      content: 'This is a GitHub Pages demo. Notes are stored in localStorage.',
      pinned: true,
      created_at: unixSeconds() - 3600,
    },
  ];

  return {
    users,
    stratas,
    serviceRequests,
    surveyAnswersBySection: {},
    docStatusById: {
      plan: 'pending',
      bylaws: 'pending',
      agm: 'pending',
      finance: 'pending',
      insurance: 'pending',
      depr: 'pending',
    },
    notes,
    notesNextId: 2,
    authUserId: 'user-client-1',
  };
}

function loadDb(): MockDb {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultDb();
    return JSON.parse(raw) as MockDb;
  } catch {
    return defaultDb();
  }
}

function saveDb(db: MockDb) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function notFound(): Response {
  return jsonResponse({ error: 'Not Found' }, 404);
}

function unauthorized(): Response {
  return jsonResponse({ error: 'Unauthorized' }, 401);
}

function computeHubStatus(db: MockDb) {
  // Basic progress from saved survey answers + doc statuses.
  const surveyCompleted = Object.keys(db.surveyAnswersBySection).length;
  const docValues = Object.values(db.docStatusById);
  const docCompleted = docValues.filter((s) => s !== 'pending').length;
  const docProgress = docValues.length > 0 ? Math.round((docCompleted / docValues.length) * 100) : 0;

  const sectionProgress: Record<string, number> = {
    docs: docProgress,
    exterior: db.surveyAnswersBySection.exterior ? 100 : 0,
    interior: db.surveyAnswersBySection.interior ? 100 : 0,
    services: db.surveyAnswersBySection.services ? 100 : 12,
    clubhouse: db.surveyAnswersBySection.clubhouse ? 100 : 0,
    amenity: db.surveyAnswersBySection.amenity ? 100 : 0,
    legal: db.surveyAnswersBySection.legal ? 100 : 0,
    council: db.surveyAnswersBySection.council ? 100 : 0,
    contacts: 80,
    inspection: 0,
  };

  const docsProgress = sectionProgress['docs'] ?? 0;

  const sections = [
    {
      id: 'docs',
      title: 'Mandatory Documents',
      description: 'Upload Strata Plan, AGM Minutes, and Financial Statements.',
      icon: 'FileText',
      progress: docsProgress,
      tags: docsProgress >= 100 ? ['Completed', 'Documents'] : ['Critical', 'Documents'],
      isApplicable: true,
      href: '/client/documents',
      gridClass: 'md:col-span-2',
    },
    {
      id: 'exterior',
      title: 'Building Exterior',
      description: 'Roofing, siding, windows, and exterior envelope details.',
      icon: 'Home',
      progress: sectionProgress.exterior,
      tags: ['Survey'],
      isApplicable: true,
    },
    {
      id: 'interior',
      title: 'Interior & Common',
      description: 'Review of common hallways, lobbies, and shared spaces.',
      icon: 'Home',
      progress: sectionProgress.interior,
      tags: ['Interior'],
      isApplicable: true,
    },
    {
      id: 'services',
      title: 'Mechanical Services',
      description: 'HVAC, plumbing, electrical systems, and shared utilities.',
      icon: 'Wrench',
      progress: sectionProgress.services,
      tags: ['Survey'],
      isApplicable: true,
    },
    {
      id: 'contacts',
      title: 'Contact Management',
      description: 'Confirm site contacts and property management details.',
      icon: 'Users',
      progress: sectionProgress.contacts,
      tags: ['Setup'],
      isApplicable: true,
      href: '/client/profile',
    },
    {
      id: 'inspection',
      title: 'Inspection Date',
      description: 'Schedule the site visit after documents are reviewed.',
      icon: 'ClipboardCheck',
      progress: sectionProgress.inspection,
      tags: ['Locked'],
      isApplicable: true,
      href: '/client/inspection',
      gridClass: 'md:col-span-full bg-gray-50/50 grayscale opacity-60',
    },
  ];

  const overallProgress = Math.min(
    100,
    Math.round(
      (docProgress + surveyCompleted * 20 + 20) / 2,
    ),
  );

  return {
    sections,
    overallProgress,
    overall_progress: overallProgress,
  };
}

function calculateTimeline(payload: JsonRecord) {
  const fileOpenedStr = String(payload.file_opened ?? '2024-01-01');
  const lastAgmStr = String(payload.last_agm_date ?? '2024-01-01');
  const fiscalStartMonth = Number(payload.fiscal_year_start_month ?? 1);

  const parseDate = (s: string) => {
    const [y, m, d] = s.split('-').map((v) => Number(v));
    return new Date(Date.UTC(y || 2024, (m || 1) - 1, d || 1));
  };

  const fileOpened = parseDate(fileOpenedStr);
  const lastAgm = parseDate(lastAgmStr);
  const today = new Date();

  const addDays = (dt: Date, days: number) => new Date(dt.getTime() + days * 86400000);
  const diffDays = (a: Date, b: Date) => Math.floor((a.getTime() - b.getTime()) / 86400000);

  const nextProjectedAgm = new Date(Date.UTC(
    lastAgm.getUTCFullYear() + 1,
    lastAgm.getUTCMonth(),
    lastAgm.getUTCDate(),
  ));
  const draftDeadline = addDays(nextProjectedAgm, -30);

  const y = today.getFullYear();
  let fiscalStart = new Date(Date.UTC(y, Math.max(0, fiscalStartMonth - 1), 1));
  if (fiscalStart.getTime() > today.getTime()) {
    fiscalStart = new Date(Date.UTC(y - 1, Math.max(0, fiscalStartMonth - 1), 1));
  }
  const fiscalEnd = addDays(new Date(Date.UTC(fiscalStart.getUTCFullYear() + 1, fiscalStart.getUTCMonth(), fiscalStart.getUTCDate())), -1);

  const fmt = (dt: Date) => dt.toISOString().slice(0, 10);

  return {
    next_projected_agm: fmt(nextProjectedAgm),
    draft_deadline: fmt(draftDeadline),
    days_into_fiscal: diffDays(today, fiscalStart),
    days_remaining_in_fiscal: diffDays(fiscalEnd, today),
    days_since_agm: today.getTime() >= lastAgm.getTime() ? diffDays(today, lastAgm) : null,
    days_since_file_opened: diffDays(today, fileOpened),
  };
}

function nextFridaysSlots(): Array<{ date: string; time: string; id: string }> {
  const slots: Array<{ date: string; time: string; id: string }> = [];
  const today = new Date();
  let current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let fridaysFound = 0;

  while (fridaysFound < 4) {
    current = new Date(current.getTime() + 86400000);
    if (current.getDay() === 5) {
      const date = current.toISOString().slice(0, 10);
      slots.push({ date, time: '10:00 AM', id: `${date}-10am` });
      slots.push({ date, time: '2:00 PM', id: `${date}-2pm` });
      fridaysFound += 1;
    }
  }

  return slots;
}

function ecsInspectionFindings() {
  return [
    {
      element: { name: 'Asphalt Shingle Roof', category: 'Envelope', age_years: 18 },
      finding: {
        condition_score: 54,
        observation: 'Fair condition. Signs of aging present.',
        recommendation: 'Plan for repairs in 3-5 years.',
        estimated_cost: 5000,
      },
    },
    {
      element: { name: 'Boiler Room #1', category: 'Mechanical', age_years: 5 },
      finding: {
        condition_score: 86,
        observation: 'Good condition. Minor cosmetic weathering.',
        recommendation: 'Routine maintenance.',
        estimated_cost: 500,
      },
    },
    {
      element: { name: 'Underground Parkade Membrane', category: 'Structure', age_years: 25 },
      finding: {
        condition_score: 35,
        observation: 'Poor condition. Immediate attention required.',
        recommendation: 'Replace within 12 months.',
        estimated_cost: 25000,
      },
    },
  ];
}

async function handleApi(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const path = url.pathname;

  if (!path.startsWith('/api/')) return null;

  const db = loadDb();

  // --- /api/time/ ---
  if (path === '/api/time/' && req.method === 'GET') {
    return jsonResponse([{ message: new Date().toLocaleTimeString() }]);
  }

  // --- Auth ---
  if (path === '/api/auth/login' && req.method === 'POST') {
    const body = (await req.json().catch(() => ({}))) as JsonRecord;
    const email = String(body.email ?? '');
    const password = String(body.password ?? '');

    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return unauthorized();

    // For demo: accept either correct password or anything non-empty for listed users.
    if (password && password !== user.password) return unauthorized();

    db.authUserId = user.id;
    saveDb(db);

    const responseUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      strataId: user.strataId,
    };
    return jsonResponse({ user: responseUser, token: 'demo-token' });
  }

  if (path === '/api/auth/me' && req.method === 'GET') {
    const user = db.users.find((u) => u.id === db.authUserId);
    if (!user) return unauthorized();
    return jsonResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      strataId: user.strataId,
    });
  }

  // Frontend calls /api/users (Rust uses /api/auth/list)
  if (path === '/api/users' && req.method === 'GET') {
    return jsonResponse(
      db.users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        strataId: u.strataId,
      })),
    );
  }

  // --- Stratas ---
  if (path === '/api/stratas' && req.method === 'GET') {
    return jsonResponse(db.stratas);
  }
  if (path === '/api/stratas/requests' && req.method === 'GET') {
    return jsonResponse(db.serviceRequests);
  }
  if (path === '/api/stratas/calculate-timeline' && req.method === 'POST') {
    const body = (await req.json().catch(() => ({}))) as JsonRecord;
    return jsonResponse(calculateTimeline(body));
  }
  if (path === '/api/stratas/update' && req.method === 'POST') {
    const body = (await req.json().catch(() => ({}))) as JsonRecord;
    const id = String(body.id ?? '');
    const idx = db.stratas.findIndex((s) => s.id === id);
    if (idx === -1) return notFound();
    db.stratas[idx] = { ...db.stratas[idx], ...(body as any) };
    saveDb(db);
    return jsonResponse(db.stratas[idx]);
  }
  if (path.startsWith('/api/stratas/') && req.method === 'GET') {
    const id = path.split('/').pop() || '';
    const strata = db.stratas.find((s) => s.id === id);
    if (!strata) return notFound();
    return jsonResponse(strata);
  }

  // --- Surveys ---
  if (path === '/api/surveys/status' && req.method === 'GET') {
    return jsonResponse(computeHubStatus(db));
  }
  if (path.startsWith('/api/surveys/sections/') && req.method === 'GET') {
    // Questions are statically embedded in this project; keep endpoint for completeness.
    return jsonResponse([]);
  }
  if (path === '/api/surveys/save-answers' && req.method === 'POST') {
    const body = (await req.json().catch(() => ({}))) as JsonRecord;
    const sectionId = String(body.sectionId ?? '');
    const answers = (body.answers ?? {}) as Record<string, string>;
    if (!sectionId) return jsonResponse({ status: 'error' }, 400);
    db.surveyAnswersBySection[sectionId] = answers;
    saveDb(db);
    return jsonResponse({ status: 'ok', message: 'Answers saved successfully' });
  }
  if (path === '/api/surveys/save-doc-status' && req.method === 'POST') {
    const body = (await req.json().catch(() => ({}))) as JsonRecord;
    const documentId = String(body.documentId ?? '');
    const status = String(body.status ?? 'pending') as any;
    if (!documentId) return jsonResponse({ status: 'error' }, 400);
    if (status !== 'pending' && status !== 'uploaded' && status !== 'n/a') {
      return jsonResponse({ status: 'error' }, 400);
    }
    db.docStatusById[documentId] = status;
    saveDb(db);
    return jsonResponse({ status: 'ok', message: 'Document status updated' });
  }

  // --- Logistics ---
  if (path === '/api/logistics/available-slots' && req.method === 'GET') {
    return jsonResponse(nextFridaysSlots());
  }

  // --- ECS ---
  if (path === '/api/ecs/inspection/simulate' && req.method === 'POST') {
    return jsonResponse(ecsInspectionFindings());
  }

  // --- Notes ---
  if (path === '/api/notes' && req.method === 'GET') {
    const q = url.searchParams.get('q');
    const normalized = q ? q.trim().toLowerCase() : '';
    const list = normalized
      ? db.notes.filter(
          (n) =>
            n.title.toLowerCase().includes(normalized) ||
            n.content.toLowerCase().includes(normalized),
        )
      : db.notes;
    // pinned first, then created_at desc
    const sorted = [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.created_at - a.created_at;
    });
    return jsonResponse(sorted);
  }

  if (path === '/api/notes' && req.method === 'POST') {
    const body = (await req.json().catch(() => ({}))) as JsonRecord;
    const title = String(body.title ?? '').trim();
    const content = String(body.content ?? '').trim();
    if (!title || !content) return jsonResponse({ error: 'Invalid payload' }, 400);

    const note = {
      id: db.notesNextId,
      title,
      content,
      pinned: false,
      created_at: unixSeconds(),
    };
    db.notesNextId += 1;
    db.notes.unshift(note);
    saveDb(db);
    return jsonResponse(note);
  }

  if (path === '/api/notes/update' && req.method === 'PUT') {
    const body = (await req.json().catch(() => ({}))) as JsonRecord;
    const id = Number(body.id);
    const title = String(body.title ?? '');
    const content = String(body.content ?? '');
    const idx = db.notes.findIndex((n) => n.id === id);
    if (idx === -1) return notFound();
    const existing = db.notes[idx];
    if (!existing) return notFound();
    db.notes[idx] = { ...existing, title, content };
    saveDb(db);
    return new Response(null, { status: 200 });
  }

  if (path === '/api/notes/pin' && req.method === 'PUT') {
    const body = (await req.json().catch(() => ({}))) as JsonRecord;
    const id = Number(body.id);
    const idx = db.notes.findIndex((n) => n.id === id);
    if (idx === -1) return notFound();
    const existing = db.notes[idx];
    if (!existing) return notFound();
    db.notes[idx] = { ...existing, pinned: !existing.pinned };
    saveDb(db);
    return new Response(null, { status: 200 });
  }

  if (path === '/api/notes/delete' && req.method === 'DELETE') {
    const body = (await req.json().catch(() => ({}))) as JsonRecord;
    const id = Number(body.id);
    db.notes = db.notes.filter((n) => n.id !== id);
    saveDb(db);
    return new Response(null, { status: 200 });
  }

  return notFound();
}

export function installMockApi(): void {
  if (import.meta.env.PUBLIC_DEMO_MODE !== '1') return;
  if (typeof window === 'undefined') return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (w.__SRP_MOCK_API_INSTALLED) return;
  w.__SRP_MOCK_API_INSTALLED = true;

  // Seed db if missing
  if (!localStorage.getItem(STORAGE_KEY)) {
    saveDb(defaultDb());
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const req = new Request(input, init);
    try {
      const maybe = await handleApi(req);
      if (maybe) return maybe;
    } catch (e) {
      // Fall through to network for anything unexpected.
      console.error('Mock API error:', e);
    }
    return originalFetch(input, init);
  };
}
