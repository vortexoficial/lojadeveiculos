import { getClient, isMissingTable } from './helpers.js'

// SQL to enable tracking:
// CREATE TABLE page_views (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   device_id text NOT NULL,
//   page text,
//   created_at timestamptz DEFAULT now()
// );
// ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "anon_insert" ON page_views FOR INSERT TO anon WITH CHECK (true);
// CREATE POLICY "auth_select" ON page_views FOR SELECT TO authenticated USING (true);

const DEVICE_KEY = '_pb_did'

function getDeviceId() {
  try {
    let id = localStorage.getItem(DEVICE_KEY)
    if (!id) {
      id = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
      localStorage.setItem(DEVICE_KEY, id)
    }
    return id
  } catch (_) {
    return 'anonymous'
  }
}

export async function logVisit(page = '/') {
  try {
    const client = getClient()
    await client.from('page_views').insert({
      device_id: getDeviceId(),
      page,
      created_at: new Date().toISOString(),
    })
  } catch (_) {}
}

export async function getVisitorStats() {
  try {
    const client = getClient()
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await client
      .from('page_views')
      .select('device_id, created_at')
      .gte('created_at', monthStart)
      .limit(50000)

    if (error) {
      if (isMissingTable(error, 'page_views')) return null
      return null
    }

    if (!data) return { today: 0, week: 0, month: 0 }

    const todaySet = new Set()
    const weekSet = new Set()
    const monthSet = new Set()

    for (const row of data) {
      const at = row.created_at
      monthSet.add(row.device_id)
      if (at >= weekStart) weekSet.add(row.device_id)
      if (at >= todayStart) todaySet.add(row.device_id)
    }

    return { today: todaySet.size, week: weekSet.size, month: monthSet.size }
  } catch (_) {
    return null
  }
}
