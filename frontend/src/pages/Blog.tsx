import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api, localized, type BlogPost } from '../lib/api';
import { PageHeader, Section } from '../components/Section';
import { Seo } from '../components/Seo';

const fallbackPosts: BlogPost[] = [
  {
    id: 'fallback-sta-je-hidzama',
    slug: 'sta-je-hidzama',
    titleBs: 'Šta je hidžama?',
    titleEn: 'What is Hijama?',
    excerptBs: 'Kratak uvod u terapiju čašama, tradiciju hidžame i savremeni pristup tretmanu.',
    excerptEn: 'A short introduction to cupping therapy, hijama tradition and a modern treatment approach.',
    contentBs: 'Hidžama je tradicionalna metoda terapije čašama koja se planira pažljivo i individualno. U profesionalnom ambijentu najvažniji su higijena, procjena stanja, sterilna oprema i jasan razgovor prije tretmana. Cilj nije obećavati izlječenje, nego pružiti siguran, smiren i odgovoran pristup brizi o tijelu.',
    contentEn: 'Hijama is a traditional cupping therapy method planned carefully and individually. In a professional setting, hygiene, assessment, sterile equipment and clear communication before therapy are most important.',
    publishedAt: new Date().toISOString(),
    category: { slug: 'edukacija', nameBs: 'Edukacija', nameEn: 'Education' }
  },
  {
    id: 'fallback-priprema',
    slug: 'kako-se-pripremiti-za-termin',
    titleBs: 'Kako se pripremiti za termin',
    titleEn: 'How to prepare for your appointment',
    excerptBs: 'Praktični savjeti prije dolaska na hidžamu ili akupunkturu.',
    excerptEn: 'Practical tips before arriving for hijama or acupuncture.',
    contentBs: 'Prije tretmana preporučuje se lagan obrok, dovoljno vode i izbjegavanje intenzivnog treninga neposredno prije termina. Ponesite relevantne zdravstvene informacije i dođite nekoliko minuta ranije kako bi se tretman mogao mirno planirati.',
    contentEn: 'Before therapy, a light meal, enough water and avoiding intense training shortly before the appointment are recommended.',
    publishedAt: new Date().toISOString(),
    category: { slug: 'savjeti', nameBs: 'Savjeti', nameEn: 'Tips' }
  },
  {
    id: 'fallback-akupunktura',
    slug: 'akupunktura-i-oporavak',
    titleBs: 'Akupunktura i oporavak',
    titleEn: 'Acupuncture and recovery',
    excerptBs: 'Kako akupunktura može biti dio individualnog plana brige o tijelu.',
    excerptEn: 'How acupuncture can be part of an individual body-care plan.',
    contentBs: 'Akupunktura se planira prema potrebama klijenta i izvodi u mirnom ambijentu. Pristup je individualan, uz pažljiv razgovor i odabir tačaka. Za specifična medicinska stanja uvijek je važno konsultovati ljekara.',
    contentEn: 'Acupuncture is planned around the client needs and performed in a calm setting, with careful consultation and point selection.',
    publishedAt: new Date().toISOString(),
    category: { slug: 'akupunktura', nameBs: 'Akupunktura', nameEn: 'Acupuncture' }
  }
];

const isImage = (url?: string | null) => Boolean(url && /\.(png|jpe?g|webp|svg)$/i.test(url));

function displayPosts(posts?: BlogPost[]) {
  return posts && posts.length > 0 ? posts : fallbackPosts;
}

export function Blog() {
  const { t, i18n } = useTranslation();
  const { data, isError, isLoading } = useQuery({ queryKey: ['blog'], queryFn: () => api<BlogPost[]>('/blog') });
  const posts = displayPosts(data);

  return (
    <>
      <Seo title={t('blog.title')} description="Edukativni tekstovi o hidžami, akupunkturi i pripremi za tretman u Šifa Hidžama." />
      <PageHeader title={t('blog.title')} subtitle="Edukacija, savjeti i odgovori za klijente prije dolaska na tretman." />
      <Section>
        {isLoading && <p className="surface-card rounded-[8px] p-5 font-bold">Učitavanje blogova...</p>}
        {isError && <p className="mb-5 rounded-[8px] bg-clay/10 p-4 font-bold text-clay">Blog API trenutno nije dostupan, prikazujemo osnovne edukativne tekstove.</p>}
        {!isLoading && data?.length === 0 && <p className="mb-5 rounded-[8px] bg-sage p-4 font-bold text-forest">Još nema objavljenih blogova u bazi. Admin ih može dodati u panelu.</p>}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="focus-ring surface-card group overflow-hidden rounded-[8px]">
              {isImage(post.coverImage) ? (
                <img src={post.coverImage ?? ''} alt="" className="h-48 w-full object-cover" />
              ) : (
                <div className="grid h-48 place-items-center bg-sage">
                  <BookOpen className="h-12 w-12 text-forest" />
                </div>
              )}
              <div className="p-6">
                <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-gold">{localized(post.category ?? {}, 'name', i18n.language) || 'Blog'}</p>
                <h2 className="mt-3 font-display text-2xl font-bold transition group-hover:text-forest">{localized(post, 'title', i18n.language)}</h2>
                <p className="mt-3 leading-7 text-ink/70">{localized(post, 'excerpt', i18n.language)}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-extrabold text-forest"><CalendarDays className="h-4 w-4" /> {t('blog.read')}</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

export function BlogDetail() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const { data } = useQuery({ queryKey: ['blog', slug], queryFn: () => api<BlogPost>(`/blog/${slug}`), enabled: Boolean(slug) });
  const fallback = fallbackPosts.find((post) => post.slug === slug);
  const post = data ?? fallback;

  if (!post) return <PageHeader title="Blog nije pronađen" subtitle="Objava trenutno nije dostupna." />;

  return (
    <>
      <Seo title={localized(post, 'title', i18n.language)} description={localized(post, 'excerpt', i18n.language)} />
      <PageHeader title={localized(post, 'title', i18n.language)} subtitle={localized(post, 'excerpt', i18n.language)} />
      <Section>
        <article className="surface-card max-w-3xl rounded-[8px] p-6 text-lg leading-8 text-ink/80 md:p-8">
          {isImage(post.coverImage) && <img src={post.coverImage ?? ''} alt="" className="mb-8 max-h-[460px] w-full rounded-[8px] object-cover shadow-soft" />}
          {post.coverImage && !isImage(post.coverImage) && <a href={post.coverImage} target="_blank" rel="noreferrer" className="mb-8 inline-block rounded-full bg-sage px-5 py-3 font-bold text-forest">Otvori attachment</a>}
          <p className="whitespace-pre-line">{localized(post, 'content', i18n.language)}</p>
        </article>
      </Section>
    </>
  );
}
