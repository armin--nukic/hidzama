import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CalendarCheck, Clock3, Mail, MapPin, Phone, Send, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      <Seo title="Kontakt Šifa Hidžama" description="Kontakt za Šifa Hidžama u Porječanima kod Visokog, Bosna i Hercegovina. Pozovite 061 497 647 ili pošaljite upit online." />
      <PageHeader title={t('contact.title')} subtitle="Porječani, Visoko | 061 497 647 | info@sifahidzama.ba" />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <form onSubmit={submit} className="surface-card grid gap-4 rounded-[8px] p-5 md:p-7">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-gold">Pošaljite upit</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Javimo se čim prije</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input required className="rounded-[8px] border border-forest/20 bg-white p-3.5" placeholder={t('booking.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input required type="email" className="rounded-[8px] border border-forest/20 bg-white p-3.5" placeholder={t('booking.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <input className="rounded-[8px] border border-forest/20 bg-white p-3.5" placeholder={t('booking.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input required className="rounded-[8px] border border-forest/20 bg-white p-3.5" placeholder={t('contact.subject')} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <textarea required className="min-h-40 rounded-[8px] border border-forest/20 bg-white p-3.5" placeholder={t('contact.message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button className="focus-ring inline-flex w-fit items-center gap-2 rounded-full bg-forest px-6 py-3 font-extrabold text-white">
              <Send className="h-4 w-4" /> {t('contact.send')}
            </button>
            {mutation.isSuccess && <p className="rounded-[8px] bg-sage p-3 font-bold text-forest">{t('contact.success')}</p>}
            {mutation.isError && <p className="rounded-[8px] bg-clay/12 p-3 font-bold text-clay">{mutation.error.message}</p>}
          </form>

          <aside className="grid gap-4">
            <div className="surface-card rounded-[8px] p-5 md:p-7">
              <div className="flex items-center gap-4">
                <img src="/logo-shifa.svg" alt="Šifa Hidžama" className="h-20 w-20 rounded-full bg-white" />
                <div>
                  <p className="font-display text-3xl font-bold">Šifa Hidžama</p>
                  <p className="text-sm font-bold text-forest">Amir Uzunović</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 leading-7">
                <p className="flex gap-3"><UserRound className="mt-1 h-5 w-5 text-gold" /> Vlasnik i terapeut: Amir Uzunović</p>
                <p className="flex gap-3"><MapPin className="mt-1 h-5 w-5 text-gold" /> Porječani, Visoko, Bosna i Hercegovina</p>
                <a className="flex gap-3 font-extrabold text-forest" href="tel:+38761497647"><Phone className="mt-1 h-5 w-5" /> 061 497 647</a>
                <a className="flex gap-3 font-extrabold text-forest" href="mailto:info@sifahidzama.ba"><Mail className="mt-1 h-5 w-5" /> info@sifahidzama.ba</a>
                <p className="flex gap-3"><Clock3 className="mt-1 h-5 w-5 text-gold" /> Pon-Sub 09:00-18:00</p>
              </div>
              <Link className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-extrabold text-ink" to="/booking">
                <CalendarCheck className="h-4 w-4" /> {t('cta.book')}
              </Link>
            </div>
            <iframe className="h-72 w-full rounded-[8px] border border-forest/10 shadow-soft" title="Google Maps" loading="lazy" src="https://www.google.com/maps?q=Porjecani,+Visoko,+Bosnia+and+Herzegovina&output=embed" />
          </aside>
        </div>
      </Section>
    </>
  );
}
