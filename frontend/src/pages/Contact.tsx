import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { PageHeader, Section } from '../components/Section';
import { Seo } from '../components/Seo';

export function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const mutation = useMutation({
    mutationFn: () => api('/contact', { method: 'POST', body: JSON.stringify(form) }),
    onSuccess: () => setForm({ name: '', email: '', phone: '', subject: '', message: '' })
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate();
  };
  return (
    <>
      <Seo title={t('contact.title')} description="Kontaktirajte Sifa Hidžama u Porječanima, Visoko. Telefon 061 497 647." />
      <PageHeader title={t('contact.title')} />
      <Section>
        <div className="grid gap-8 md:grid-cols-[1fr_.85fr]">
          <form onSubmit={submit} className="grid gap-4 rounded-[8px] bg-white p-5 shadow-soft">
            <input required className="rounded-[8px] border border-forest/20 p-3" placeholder={t('booking.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required type="email" className="rounded-[8px] border border-forest/20 p-3" placeholder={t('booking.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="rounded-[8px] border border-forest/20 p-3" placeholder={t('booking.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input required className="rounded-[8px] border border-forest/20 p-3" placeholder={t('contact.subject')} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <textarea required className="min-h-36 rounded-[8px] border border-forest/20 p-3" placeholder={t('contact.message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button className="focus-ring rounded-full bg-forest px-6 py-3 font-bold text-white md:w-fit">{t('contact.send')}</button>
            {mutation.isSuccess && <p className="font-semibold text-forest">{t('contact.success')}</p>}
            {mutation.isError && <p className="font-semibold text-clay">{mutation.error.message}</p>}
          </form>
          <aside className="rounded-[8px] bg-sage p-5">
            <img src="/logo-shifa.svg" alt="Sifa Hidžama" className="h-24 w-24 rounded-full" />
            <p className="mt-5 text-xl font-bold">Sifa Hidžama</p>
            <div className="mt-4 grid gap-3 leading-7">
              <p className="flex gap-2"><UserRound className="mt-1 h-5 w-5 text-forest" /> Amir Uzunović</p>
              <p className="flex gap-2"><MapPin className="mt-1 h-5 w-5 text-forest" /> Porječani, Visoko, Bosna i Hercegovina</p>
              <p className="flex gap-2"><Mail className="mt-1 h-5 w-5 text-forest" /> info@sifahidzama.ba</p>
              <a className="flex gap-2 font-bold text-forest" href="tel:+38761497647"><Phone className="mt-1 h-5 w-5" /> 061 497 647</a>
            </div>
            <p className="mt-6 font-bold">{t('contact.hours')}</p>
            <p>Pon-Sub 09:00-18:00</p>
            <iframe className="mt-6 h-64 w-full rounded-[8px] border-0" title="Google Maps" loading="lazy" src="https://www.google.com/maps?q=Porjecani,+Visoko,+Bosnia+and+Herzegovina&output=embed" />
          </aside>
        </div>
      </Section>
    </>
  );
}
