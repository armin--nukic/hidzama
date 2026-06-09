import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api, localized, type BlogPost } from '../lib/api';
import { PageHeader, Section } from '../components/Section';
import { Seo } from '../components/Seo';

const isImage = (url?: string | null) => Boolean(url && /\.(png|jpe?g|webp|svg)$/i.test(url));

export function Blog() {
  const { t, i18n } = useTranslation();
  const { data = [] } = useQuery({ queryKey: ['blog'], queryFn: () => api<BlogPost[]>('/blog') });
  return (
    <>
      <Seo title={t('blog.title')} description="Edukativni tekstovi o hidžami." />
      <PageHeader title={t('blog.title')} />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {data.map((post) => <Link key={post.id} to={`/blog/${post.slug}`} className="focus-ring overflow-hidden rounded-[8px] bg-white shadow-sm">{isImage(post.coverImage) && <img src={post.coverImage ?? ''} alt="" className="h-48 w-full object-cover" />}<div className="p-6"><p className="text-sm font-bold text-gold">{localized(post.category ?? {}, 'name', i18n.language)}</p><h2 className="mt-2 text-2xl font-bold">{localized(post, 'title', i18n.language)}</h2><p className="mt-3 leading-7 text-ink/70">{localized(post, 'excerpt', i18n.language)}</p><span className="mt-4 inline-block font-bold text-forest">{t('blog.read')}</span></div></Link>)}
        </div>
      </Section>
    </>
  );
}

export function BlogDetail() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const { data } = useQuery({ queryKey: ['blog', slug], queryFn: () => api<BlogPost>(`/blog/${slug}`), enabled: Boolean(slug) });
  if (!data) return <PageHeader title="..." />;
  return (
    <>
      <Seo title={localized(data, 'title', i18n.language)} description={localized(data, 'excerpt', i18n.language)} />
      <PageHeader title={localized(data, 'title', i18n.language)} subtitle={localized(data, 'excerpt', i18n.language)} />
      <Section>
        <article className="max-w-3xl text-lg leading-8 text-ink/80">
          {isImage(data.coverImage) && <img src={data.coverImage ?? ''} alt="" className="mb-8 max-h-[460px] w-full rounded-[8px] object-cover shadow-soft" />}
          {data.coverImage && !isImage(data.coverImage) && <a href={data.coverImage} target="_blank" rel="noreferrer" className="mb-8 inline-block rounded-full bg-sage px-5 py-3 font-bold text-forest">Otvori attachment</a>}
          <p>{localized(data, 'content', i18n.language)}</p>
        </article>
      </Section>
    </>
  );
}
