const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export type Service = {
  id: string;
  slug: string;
  titleBs: string;
  titleEn: string;
  summaryBs: string;
  summaryEn: string;
  descriptionBs: string;
  descriptionEn: string;
  durationMin: number;
  priceBam: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  titleBs: string;
  titleEn: string;
  excerptBs: string;
  excerptEn: string;
  contentBs: string;
  contentEn: string;
  coverImage?: string | null;
  published?: boolean;
  publishedAt: string;
  category?: { nameBs: string; nameEn: string; slug: string };
};

export type Testimonial = {
  id: string;
  name: string;
  quoteBs: string;
  quoteEn: string;
  rating: number;
};

export type Appointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: Service;
};

export type Availability = {
  all: string[];
  available: string[];
  booked: string[];
};

let cachedCsrfToken = '';

async function csrfToken(forceRefresh = false) {
  if (cachedCsrfToken && !forceRefresh) return cachedCsrfToken;
  const response = await fetch(`${API_URL}/csrf-token`, { credentials: 'include' });
  const data = await response.json();
  cachedCsrfToken = data.csrfToken as string;
  return cachedCsrfToken;
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.method && options.method !== 'GET') {
    headers.set('X-CSRF-Token', await csrfToken());
  }

  let response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  if (response.status === 403 && options.method && options.method !== 'GET') {
    headers.set('X-CSRF-Token', await csrfToken(true));
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include'
    });
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message ?? 'Request failed');
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function adminApi<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_URL}/admin${path}`, { ...options, headers });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.message ?? 'Request failed');
  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function adminUpload<T>(path: string, token: string, formData: FormData): Promise<T> {
  const response = await fetch(`${API_URL}/admin${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.message ?? 'Upload failed');
  return response.json();
}

export const localized = (item: object, key: string, language: string) =>
  String((item as Record<string, unknown>)[`${key}${language === 'en' ? 'En' : 'Bs'}`] ?? '');
