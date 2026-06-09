import { FormEvent, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, CheckCircle2, Clock, MessageSquareText, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api, localized, type Availability, type Service } from '../lib/api';
import { PageHeader, Section } from '../components/Section';
import { Seo } from '../components/Seo';

export function Booking() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ serviceId: '', date: today, time: '', customerName: '', customerEmail: '', customerPhone: '', notes: '' });
  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: () => api<Service[]>('/services') });
  const { data: availability = { all: [], available: [], booked: [] } } = useQuery({
    queryKey: ['availability', form.date],
    queryFn: () => api<Availability>(`/availability?date=${form.date}`)
  });
  const selectedService = useMemo(() => services.find((service) => service.id === form.serviceId), [services, form.serviceId]);
  const mutation = useMutation({
    mutationFn: () => api('/appointments', { method: 'POST', body: JSON.stringify(form) }),
    onSuccess: async () => {
      setForm((value) => ({ ...value, time: '', customerName: '', customerEmail: '', customerPhone: '', notes: '' }));
      await queryClient.invalidateQueries({ queryKey: ['availability'] });
    }
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <>
      <Seo title={t('booking.title')} description="Rezervišite termin za hidžamu i akupunkturu online." />
      <PageHeader title={t('booking.title')} subtitle="Odaberite uslugu, datum i slobodan termin. Zauzeti termini su jasno oznaceni." />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <form onSubmit={submit} className="grid gap-5 rounded-[8px] bg-white p-5 shadow-soft">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[8px] bg-sage p-4"><CalendarDays className="h-5 w-5 text-forest" /><p className="mt-2 text-sm font-bold">1. Usluga i datum</p></div>
              <div className="rounded-[8px] bg-sage p-4"><Clock className="h-5 w-5 text-forest" /><p className="mt-2 text-sm font-bold">2. Slobodan termin</p></div>
              <div className="rounded-[8px] bg-sage p-4"><UserRound className="h-5 w-5 text-forest" /><p className="mt-2 text-sm font-bold">3. Podaci klijenta</p></div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 font-semibold">{t('booking.service')}
                <select required className="rounded-[8px] border border-forest/20 bg-white p-3" value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
                  <option value="">Odaberite uslugu</option>
                  {services.map((service) => <option key={service.id} value={service.id}>{localized(service, 'title', i18n.language)} - {service.priceBam} KM</option>)}
                </select>
              </label>
              <label className="grid gap-2 font-semibold">{t('booking.date')}
                <input required min={today} className="rounded-[8px] border border-forest/20 p-3" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value, time: '' })} />
              </label>
            </div>

            <fieldset>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <legend className="font-semibold">{t('booking.time')}</legend>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full bg-sage px-3 py-1">Slobodno</span>
                  <span className="rounded-full bg-clay/15 px-3 py-1 text-clay">Zauzeto</span>
                  <span className="rounded-full bg-forest px-3 py-1 text-white">Odabrano</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {availability.all.map((slot) => {
                  const isBooked = availability.booked.includes(slot);
                  const isSelected = form.time === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={isBooked}
                      onClick={() => setForm({ ...form, time: slot })}
                      className={`focus-ring rounded-[8px] px-4 py-4 text-left font-bold transition ${isSelected ? 'bg-forest text-white shadow-soft' : isBooked ? 'cursor-not-allowed bg-clay/10 text-clay line-through opacity-75' : 'bg-sage text-ink hover:bg-gold/25'}`}
                    >
                      <span className="block text-lg">{slot}</span>
                      <span className="mt-1 block text-xs">{isBooked ? 'Zauzeto' : 'Slobodno'}</span>
                    </button>
                  );
                })}
              </div>
              {availability.booked.length > 0 && <p className="mt-3 text-sm text-ink/65">Zauzeti termini za ovaj datum: {availability.booked.join(', ')}</p>}
            </fieldset>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 font-semibold">{t('booking.name')}<input required className="rounded-[8px] border border-forest/20 p-3" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></label>
              <label className="grid gap-2 font-semibold">{t('booking.email')}<input required type="email" className="rounded-[8px] border border-forest/20 p-3" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} /></label>
              <label className="grid gap-2 font-semibold">{t('booking.phone')}<input required className="rounded-[8px] border border-forest/20 p-3" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} /></label>
              <label className="grid gap-2 font-semibold md:col-span-2">{t('booking.notes')}<textarea className="min-h-28 rounded-[8px] border border-forest/20 p-3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
            </div>

            <button disabled={!form.time || !form.serviceId || mutation.isPending} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 font-bold text-white disabled:opacity-50 md:w-fit">
              <CheckCircle2 className="h-5 w-5" /> {t('booking.submit')}
            </button>
            {mutation.isSuccess && <p className="rounded-[8px] bg-sage p-4 font-semibold text-forest">{t('booking.success')}</p>}
            {mutation.isError && <p className="rounded-[8px] bg-clay/10 p-4 font-semibold text-clay">{mutation.error.message}</p>}
          </form>

          <aside className="h-fit rounded-[8px] bg-ink p-5 text-white shadow-soft">
            <img src="/logo-shifa.svg" alt="Sifa Hidžama" className="h-20 w-20 rounded-full" />
            <h2 className="mt-5 text-2xl font-bold">Pregled rezervacije</h2>
            <div className="mt-5 grid gap-4 text-sm">
              <p><span className="block text-white/55">Usluga</span><strong>{selectedService ? localized(selectedService, 'title', i18n.language) : '-'}</strong></p>
              <p><span className="block text-white/55">Datum</span><strong>{form.date}</strong></p>
              <p><span className="block text-white/55">Vrijeme</span><strong>{form.time || '-'}</strong></p>
              {selectedService && <p><span className="block text-white/55">Cijena i trajanje</span><strong>{selectedService.priceBam} KM • {selectedService.durationMin} min</strong></p>}
            </div>
            <div className="mt-6 rounded-[8px] bg-white/10 p-4">
              <MessageSquareText className="h-5 w-5 text-gold" />
              <p className="mt-2 text-sm leading-6 text-white/75">Nakon slanja zahtjeva dobit cete email potvrdu, a ordinacija dobija obavijest za provjeru termina.</p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
