// ZEEX Commerce Frontend API Client
// Connects to Express backend endpoints with typed payloads and session token persistence

const API_BASE = '/api';

export function getStoredToken(): string | null {
  return localStorage.getItem('zeex_auth_token');
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem('zeex_auth_token', token);
  } else {
    localStorage.removeItem('zeex_auth_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; error?: string }> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: body.message || body.error || `HTTP ${res.status} Error`
      };
    }

    return { success: true, data: body };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network request failed'
    };
  }
}

export const api = {
  // Auth & Staff
  auth: {
    login: (usernameOrEmail: string, password: string) =>
      request<any>('/auth/login', { method: 'POST', body: JSON.stringify({ usernameOrEmail, password }) }),
    me: () => request<any>('/auth/me'),
    logout: () => request<any>('/auth/logout', { method: 'POST' }),
    switchBranch: (branchId: string) =>
      request<any>('/auth/switch-branch', { method: 'POST', body: JSON.stringify({ branchId }) }),
    getSessions: () => request<{ sessions: any[] }>('/auth/sessions'),
    revokeSession: (sessionId: string) =>
      request<any>('/auth/revoke-session', { method: 'POST', body: JSON.stringify({ sessionId }) }),
    getStaff: () => request<{ staff: any[] }>('/staff'),
    inviteStaff: (data: any) =>
      request<any>('/staff/invite', { method: 'POST', body: JSON.stringify(data) })
  },

  // Organization
  organization: {
    getHierarchy: () => request<any>('/organization/hierarchy')
  },

  // Accounting
  accounting: {
    getAccounts: () => request<{ accounts: any[] }>('/accounting/accounts'),
    getJournals: () => request<{ journals: any[] }>('/accounting/journals'),
    postJournal: (data: any) =>
      request<any>('/accounting/journals', { method: 'POST', body: JSON.stringify(data) }),
    reverseJournal: (id: string, reason: string) =>
      request<any>(`/accounting/journals/${id}/reverse`, { method: 'POST', body: JSON.stringify({ reason }) }),
    getReports: () => request<any>('/accounting/reports'),
    getFiscalPeriods: () => request<{ fiscalPeriods: any[] }>('/accounting/fiscal-periods'),
    lockPeriod: (id: string) =>
      request<any>(`/accounting/fiscal-periods/${id}/lock`, { method: 'POST' })
  },

  // Treasury
  treasury: {
    getBankAccounts: () => request<{ bankAccounts: any[] }>('/treasury/bank-accounts'),
    getPayouts: () => request<{ payouts: any[] }>('/treasury/payouts'),
    requestPayout: (data: any) =>
      request<any>('/treasury/payouts', { method: 'POST', body: JSON.stringify(data) }),
    approvePayout: (id: string) =>
      request<any>(`/treasury/payouts/${id}/approve`, { method: 'POST' })
  },

  // Retail & POS
  retail: {
    getProducts: () => request<{ products: any[] }>('/retail/products'),
    getCurrentShift: () => request<{ shift: any | null }>('/retail/shifts/current'),
    openShift: (data: any) =>
      request<any>('/retail/shifts/open', { method: 'POST', body: JSON.stringify(data) }),
    checkout: (data: any) =>
      request<any>('/retail/checkout', { method: 'POST', body: JSON.stringify(data) }),
    returnItems: (data: any) =>
      request<any>('/retail/returns', { method: 'POST', body: JSON.stringify(data) }),
    closeShift: (data: any) =>
      request<any>('/retail/shifts/close', { method: 'POST', body: JSON.stringify(data) })
  },

  // Automotive
  automotive: {
    getJobs: () => request<{ jobs: any[] }>('/automotive/jobs'),
    intake: (data: any) =>
      request<any>('/automotive/intake', { method: 'POST', body: JSON.stringify(data) }),
    updateEstimate: (id: string, data: any) =>
      request<any>(`/automotive/jobs/${id}/estimate`, { method: 'POST', body: JSON.stringify(data) }),
    issueParts: (id: string, data: any) =>
      request<any>(`/automotive/jobs/${id}/parts-issue`, { method: 'POST', body: JSON.stringify(data) }),
    completeJob: (id: string, data: any) =>
      request<any>(`/automotive/jobs/${id}/complete`, { method: 'POST', body: JSON.stringify(data) })
  },

  // Agribusiness
  agribusiness: {
    getPlots: () => request<{ plots: any[] }>('/agribusiness/plots'),
    logWeighbridge: (data: any) =>
      request<any>('/agribusiness/weighbridge', { method: 'POST', body: JSON.stringify(data) }),
    runProcessingBatch: (data: any) =>
      request<any>('/agribusiness/processing', { method: 'POST', body: JSON.stringify(data) }),
    sellProduce: (data: any) =>
      request<any>('/agribusiness/sales', { method: 'POST', body: JSON.stringify(data) })
  },

  // Logistics
  logistics: {
    getTrips: () => request<{ freightTrips: any[] }>('/logistics/trips'),
    dispatchTrip: (data: any) =>
      request<any>('/logistics/freight/dispatch', { method: 'POST', body: JSON.stringify(data) }),
    signPod: (id: string, signedByName: string) =>
      request<any>(`/logistics/freight/${id}/pod`, { method: 'POST', body: JSON.stringify({ signedByName }) })
  },

  // Fuel Station
  fuel: {
    getTanks: () => request<{ fuelTanks: any[] }>('/fuel/tanks'),
    recordDip: (data: any) =>
      request<any>('/fuel/dips', { method: 'POST', body: JSON.stringify(data) }),
    recordShift: (data: any) =>
      request<any>('/fuel/shifts', { method: 'POST', body: JSON.stringify(data) })
  },

  // HR & Payroll
  hr: {
    getEmployees: () => request<{ employees: any[] }>('/hr/employees'),
    getPayrollSummary: () => request<{ summaries: any[] }>('/payroll/summary'),
    getConfidentialCompensation: () => request<{ compensations: any[] }>('/payroll/confidential'),
    runPayroll: (periodName: string) =>
      request<any>('/payroll/run', { method: 'POST', body: JSON.stringify({ periodName }) })
  },

  // Audit
  audit: {
    getLogs: () => request<{ auditLogs: any[] }>('/audit/logs')
  }
};
