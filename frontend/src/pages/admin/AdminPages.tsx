import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormEvent, useState } from 'react';
import type { ReactNode } from 'react';
import { CalendarCheck, CalendarClock, Hourglass, Inbox, Plus, TrendingUp, UploadCloud, X } from 'lucide-react';
import { adminApi, adminUpload, type Appointment, type BlogPost, type Service, type Testimonial } from '../../lib/api';
import { authStore } from '../../lib/auth';

function tokenOrRedirect() {
  const token = authStore.getToken();
  if (!token) return null;
  return token;
}

export function Protected({ children }: { children: ReactNode }) {
  return tokenOrRedirect() ? children : <Navigate to="/admin/login" replace />;
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <section className="rounded-[8px] bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold">{title}</h1>{action}</div><div className="mt-5 overflow-x-auto">{children}</div></section>;
}

export function Dashboard() {
  const { t } = useTranslation();
  const token = tokenOrRedirect()!;
  const { data } = useQuery({ queryKey: ['admin-stats'], queryFn: () => adminApi<Record<string, number>>('/stats', token) });
  const cards = [
    { key: 'totalAppointments', value: data?.totalAppointments ?? 0, label: t('admin.totalAppointments'), hint: t('admin.allTime'), icon: CalendarCheck, className: 'bg-forest text-white' },
    { key: 'upcomingAppointments', value: data?.upcomingAppointments ?? 0, label: t('admin.upcomingAppointments'), hint: t('admin.scheduled'), icon: CalendarClock, className: 'bg-gold text-ink' },
    { key: 'contactRequests', value: data?.contactRequests ?? 0, label: t('admin.contactRequests'), hint: t('admin.needsAction'), icon: Inbox, className: 'bg-white text-ink' },
    { key: 'pendingAppointments', value: data?.pendingAppointments ?? 0, label: t('admin.pendingAppointments'), hint: t('admin.pending'), icon: Hourglass, className: 'bg-clay text-white' }
  ];

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[8px] bg-ink p-5 text-white shadow-soft md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-shifa.svg" alt="Sifa Hidžama" className="h-16 w-16 rounded-full bg-white p-1" />
            <div>
              <p className="text-sm font-bold uppercase text-gold">{t('admin.dashboard')}</p>
              <h1 className="mt-1 text-2xl font-bold md:text-3xl">{t('admin.overview')}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70">{t('admin.overviewText')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[8px] bg-white/10 p-4">
            <TrendingUp className="h-6 w-6 text-gold" />
            <div>
              <p className="text-xs font-bold uppercase text-white/55">{t('admin.stats')}</p>
              <p className="text-lg font-bold">{cards.reduce((sum, card) => sum + card.value, 0)}</p>
            </div>
          </div>
        </div>
      </section>

      <Panel title={t('admin.stats')}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ key, value, label, hint, icon: Icon, className }) => (
            <div key={key} className={`rounded-[8px] border border-forest/10 p-5 shadow-sm ${className}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold opacity-75">{label}</p>
                  <p className="mt-3 text-4xl font-bold leading-none">{value}</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-current/10">
                  <Icon className="h-6 w-6" />
                </span>
              </div>
              <p className="mt-4 text-xs font-bold uppercase opacity-60">{hint}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function Appointments() {
  const token = tokenOrRedirect()!;
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ['admin-appointments'], queryFn: () => adminApi<Appointment[]>('/appointments', token) });
  const update = useMutation({ mutationFn: ({ id, status }: { id: string; status: string }) => adminApi(`/appointments/${id}`, token, { method: 'PATCH', body: JSON.stringify({ status }) }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-appointments'] }) });
  return <Panel title="Appointments"><table className="w-full min-w-[760px] text-left text-sm"><tbody>{data.map((item) => <tr key={item.id} className="border-t"><td className="py-3 font-bold">{item.customerName}</td><td>{item.service.titleBs}</td><td>{item.date.slice(0, 10)} {item.time}</td><td>{item.status}</td><td className="flex gap-2 py-2"><button onClick={() => update.mutate({ id: item.id, status: 'APPROVED' })} className="rounded-full bg-forest px-3 py-1 text-white">Approve</button><button onClick={() => update.mutate({ id: item.id, status: 'REJECTED' })} className="rounded-full bg-clay px-3 py-1 text-white">Reject</button><button onClick={() => update.mutate({ id: item.id, status: 'RESCHEDULED' })} className="rounded-full bg-gold px-3 py-1">Reschedule</button></td></tr>)}</tbody></table></Panel>;
}

export function ServicesAdmin() {
  const token = tokenOrRedirect()!;
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    titleBs: '',
    titleEn: '',
    summaryBs: '',
    summaryEn: '',
    descriptionBs: '',
    descriptionEn: '',
    durationMin: 45,
    priceBam: 50
  });
  const { data = [] } = useQuery({ queryKey: ['admin-services'], queryFn: () => adminApi<Service[]>('/services', token) });
  const create = useMutation({
    mutationFn: () => {
      const slug = form.titleBs
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'dj')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `service-${Date.now()}`;

      return adminApi('/services', token, {
        method: 'POST',
        body: JSON.stringify({
          slug,
          titleBs: form.titleBs,
          titleEn: form.titleEn || form.titleBs,
          summaryBs: form.summaryBs,
          summaryEn: form.summaryEn || form.summaryBs,
          descriptionBs: form.descriptionBs,
          descriptionEn: form.descriptionEn || form.descriptionBs,
          durationMin: Number(form.durationMin),
          priceBam: Number(form.priceBam),
          isActive: true
        })
      });
    },
    onSuccess: async () => {
      setForm({ titleBs: '', titleEn: '', summaryBs: '', summaryEn: '', descriptionBs: '', descriptionEn: '', durationMin: 45, priceBam: 50 });
      setShowForm(false);
      await queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    }
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    create.mutate();
  };

  return (
    <Panel
      title="Services"
      action={<button onClick={() => setShowForm((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-bold text-white">{showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{showForm ? 'Close' : 'Add service'}</button>}
    >
      {showForm && (
        <form onSubmit={submit} className="mb-6 grid gap-4 rounded-[8px] border border-forest/10 bg-sage/40 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">Ime usluge<input required className="rounded-[8px] border border-forest/20 bg-white p-3" value={form.titleBs} onChange={(e) => setForm({ ...form, titleBs: e.target.value })} /></label>
            <label className="grid gap-2 text-sm font-bold">Name EN opcionalno<input className="rounded-[8px] border border-forest/20 bg-white p-3" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">Kratak opis<input required className="rounded-[8px] border border-forest/20 bg-white p-3" value={form.summaryBs} onChange={(e) => setForm({ ...form, summaryBs: e.target.value })} /></label>
            <label className="grid gap-2 text-sm font-bold">Summary EN opcionalno<input className="rounded-[8px] border border-forest/20 bg-white p-3" value={form.summaryEn} onChange={(e) => setForm({ ...form, summaryEn: e.target.value })} /></label>
          </div>
          <label className="grid gap-2 text-sm font-bold">Detaljan opis<textarea required className="min-h-28 rounded-[8px] border border-forest/20 bg-white p-3" value={form.descriptionBs} onChange={(e) => setForm({ ...form, descriptionBs: e.target.value })} /></label>
          <label className="grid gap-2 text-sm font-bold">Description EN opcionalno<textarea className="min-h-24 rounded-[8px] border border-forest/20 bg-white p-3" value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} /></label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">Trajanje minuta<input required type="number" min="5" className="rounded-[8px] border border-forest/20 bg-white p-3" value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })} /></label>
            <label className="grid gap-2 text-sm font-bold">Cijena KM<input required type="number" min="1" step="0.01" className="rounded-[8px] border border-forest/20 bg-white p-3" value={form.priceBam} onChange={(e) => setForm({ ...form, priceBam: Number(e.target.value) })} /></label>
          </div>
          <button disabled={create.isPending} className="w-fit rounded-full bg-forest px-5 py-3 font-bold text-white disabled:opacity-60">{create.isPending ? 'Saving...' : 'Save service'}</button>
          {create.isError && <p className="rounded-[8px] bg-clay/10 p-3 text-sm font-bold text-clay">{create.error.message}</p>}
        </form>
      )}
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead><tr className="text-ink/60"><th className="pb-2">Ime</th><th className="pb-2">Opis</th><th className="pb-2">Trajanje</th><th className="pb-2">Cijena</th></tr></thead>
        <tbody>{data.map((item) => <tr key={item.id} className="border-t"><td className="py-3 font-bold">{item.titleBs}</td><td className="max-w-sm py-3 text-ink/70">{item.summaryBs}</td><td>{item.durationMin} min</td><td>{item.priceBam} KM</td></tr>)}</tbody>
      </table>
    </Panel>
  );
}

export function PostsAdmin() {
  const token = tokenOrRedirect()!;
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    titleBs: '',
    excerptBs: '',
    contentBs: '',
    titleEn: '',
    excerptEn: '',
    contentEn: '',
    published: true
  });
  const { data = [] } = useQuery({ queryKey: ['admin-posts'], queryFn: () => adminApi<BlogPost[]>('/blog-posts', token) });
  const create = useMutation({
    mutationFn: async () => {
      let coverImage = '';
      if (file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploaded = await adminUpload<{ url: string }>('/uploads', token, uploadData);
        coverImage = uploaded.url;
      }
      const slug = form.titleBs
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'dj')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `blog-${Date.now()}`;

      return adminApi('/blog-posts', token, {
        method: 'POST',
        body: JSON.stringify({
          slug,
          titleBs: form.titleBs,
          titleEn: form.titleEn || form.titleBs,
          excerptBs: form.excerptBs,
          excerptEn: form.excerptEn || form.excerptBs,
          contentBs: form.contentBs,
          contentEn: form.contentEn || form.contentBs,
          coverImage,
          published: form.published,
          categoryId: ''
        })
      });
    },
    onSuccess: async () => {
      setForm({ titleBs: '', excerptBs: '', contentBs: '', titleEn: '', excerptEn: '', contentEn: '', published: true });
      setFile(null);
      setShowForm(false);
      await queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
    }
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    create.mutate();
  };

  return (
    <Panel
      title="Blog Posts"
      action={<button onClick={() => setShowForm((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-bold text-white">{showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{showForm ? 'Close' : 'Add blog'}</button>}
    >
      {showForm && (
        <form onSubmit={submit} className="mb-6 grid gap-4 rounded-[8px] border border-forest/10 bg-sage/40 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">Naziv bloga<input required className="rounded-[8px] border border-forest/20 bg-white p-3" value={form.titleBs} onChange={(e) => setForm({ ...form, titleBs: e.target.value })} /></label>
            <label className="grid gap-2 text-sm font-bold">Title EN opcionalno<input className="rounded-[8px] border border-forest/20 bg-white p-3" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">Opis bloga<textarea required className="min-h-24 rounded-[8px] border border-forest/20 bg-white p-3" value={form.excerptBs} onChange={(e) => setForm({ ...form, excerptBs: e.target.value })} /></label>
            <label className="grid gap-2 text-sm font-bold">Description EN opcionalno<textarea className="min-h-24 rounded-[8px] border border-forest/20 bg-white p-3" value={form.excerptEn} onChange={(e) => setForm({ ...form, excerptEn: e.target.value })} /></label>
          </div>
          <label className="grid gap-2 text-sm font-bold">Tekst bloga<textarea required className="min-h-40 rounded-[8px] border border-forest/20 bg-white p-3" value={form.contentBs} onChange={(e) => setForm({ ...form, contentBs: e.target.value })} /></label>
          <label className="grid gap-2 text-sm font-bold">Content EN opcionalno<textarea className="min-h-32 rounded-[8px] border border-forest/20 bg-white p-3" value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} /></label>
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <label className="grid gap-2 text-sm font-bold">Attachment / cover slika
              <span className="flex items-center gap-3 rounded-[8px] border border-dashed border-forest/30 bg-white p-4">
                <UploadCloud className="h-5 w-5 text-forest" />
                <span className="text-ink/70">{file ? file.name : 'JPG, PNG, WEBP, SVG ili PDF do 5MB'}</span>
              </span>
              <input className="sr-only" type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
            <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Objavi odmah</label>
          </div>
          <button disabled={create.isPending} className="w-fit rounded-full bg-forest px-5 py-3 font-bold text-white disabled:opacity-60">{create.isPending ? 'Saving...' : 'Save blog'}</button>
          {create.isError && <p className="rounded-[8px] bg-clay/10 p-3 text-sm font-bold text-clay">{create.error.message}</p>}
        </form>
      )}

      <table className="w-full min-w-[760px] text-left text-sm">
        <thead><tr className="text-ink/60"><th className="pb-2">Cover</th><th className="pb-2">Naziv</th><th className="pb-2">Opis</th><th className="pb-2">Status</th><th className="pb-2">Datum</th></tr></thead>
        <tbody>{data.map((item) => <tr key={item.id} className="border-t"><td className="py-3">{item.coverImage ? <a href={item.coverImage} target="_blank" className="font-bold text-forest" rel="noreferrer">Attachment</a> : '-'}</td><td className="py-3 font-bold">{item.titleBs}</td><td className="max-w-sm py-3 text-ink/70">{item.excerptBs}</td><td>{item.published ? 'Published' : 'Draft'}</td><td>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '-'}</td></tr>)}</tbody>
      </table>
    </Panel>
  );
}

export function TestimonialsAdmin() {
  const token = tokenOrRedirect()!;
  const { data = [] } = useQuery({ queryKey: ['admin-testimonials'], queryFn: () => adminApi<Testimonial[]>('/testimonials', token) });
  return <Panel title="Testimonials"><table className="w-full text-left text-sm"><tbody>{data.map((item) => <tr key={item.id} className="border-t"><td className="py-3 font-bold">{item.name}</td><td>{item.rating}/5</td><td>{item.quoteBs}</td></tr>)}</tbody></table></Panel>;
}

export function ContactsAdmin() {
  const token = tokenOrRedirect()!;
  const { data = [] } = useQuery({ queryKey: ['admin-contacts'], queryFn: () => adminApi<Array<{ id: string; name: string; email: string; subject: string; isRead: boolean }>>('/contact-messages', token) });
  return <Panel title="Contact Requests"><table className="w-full text-left text-sm"><tbody>{data.map((item) => <tr key={item.id} className="border-t"><td className="py-3 font-bold">{item.name}</td><td>{item.email}</td><td>{item.subject}</td><td>{item.isRead ? 'Read' : 'New'}</td></tr>)}</tbody></table></Panel>;
}

export function UsersAdmin() {
  const { t } = useTranslation();
  const token = tokenOrRedirect()!;
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STAFF' as 'ADMIN' | 'STAFF' });
  const { data = [] } = useQuery({ queryKey: ['admin-users'], queryFn: () => adminApi<Array<{ id: string; name: string; email: string; role: string }>>('/users', token) });
  const create = useMutation({
    mutationFn: () => adminApi('/users', token, { method: 'POST', body: JSON.stringify(form) }),
    onSuccess: async () => {
      setForm({ name: '', email: '', password: '', role: 'STAFF' });
      setShowForm(false);
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    create.mutate();
  };

  return (
    <Panel
      title={t('admin.users')}
      action={<button onClick={() => setShowForm((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-bold text-white">{showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{showForm ? t('admin.close') : t('admin.addUser')}</button>}
    >
      {showForm && (
        <form onSubmit={submit} className="mb-6 grid gap-4 rounded-[8px] border border-forest/10 bg-sage/40 p-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold">{t('admin.name')}<input required className="rounded-[8px] border border-forest/20 bg-white p-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="grid gap-2 text-sm font-bold">{t('admin.email')}<input required type="email" className="rounded-[8px] border border-forest/20 bg-white p-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label className="grid gap-2 text-sm font-bold">{t('admin.password')}<input required type="password" minLength={8} className="rounded-[8px] border border-forest/20 bg-white p-3" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          <label className="grid gap-2 text-sm font-bold">{t('admin.permission')}
            <select className="rounded-[8px] border border-forest/20 bg-white p-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'ADMIN' | 'STAFF' })}>
              <option value="STAFF">{t('admin.staffRole')}</option>
              <option value="ADMIN">{t('admin.adminRole')}</option>
            </select>
          </label>
          <button disabled={create.isPending} className="w-fit rounded-full bg-forest px-5 py-3 font-bold text-white disabled:opacity-60">{create.isPending ? t('admin.saving') : t('admin.saveUser')}</button>
          {create.isError && <p className="rounded-[8px] bg-clay/10 p-3 text-sm font-bold text-clay">{create.error.message}</p>}
        </form>
      )}
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead><tr className="text-ink/60"><th className="pb-2">{t('admin.name')}</th><th className="pb-2">{t('admin.email')}</th><th className="pb-2">{t('admin.permission')}</th></tr></thead>
        <tbody>{data.map((item) => <tr key={item.id} className="border-t"><td className="py-3 font-bold">{item.name}</td><td>{item.email}</td><td><span className="rounded-full bg-sage px-3 py-1 text-xs font-bold">{item.role}</span></td></tr>)}</tbody>
      </table>
    </Panel>
  );
}
