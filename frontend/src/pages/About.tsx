import { Award, HeartHandshake, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader, Section } from "../components/Section";
import { Seo } from "../components/Seo";

export function About() {
  const { t } = useTranslation();
  return (
    <>
      <Seo
        title={t("about.title")}
        description="Priča, misija, vizija i tim Sifa Hidžama ordinacije."
      />
      <PageHeader title={t("about.title")} subtitle={t("about.story")} />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div className="overflow-hidden rounded-[8px] bg-white shadow-soft">
            <img
              src="/amir-uzunovic.jpg"
              onError={(event) => {
                event.currentTarget.src = "/amir-uzunovic.jpg";
              }}
              alt="Amir Uzunović"
              className="h-full max-h-[620px] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-bold uppercase text-gold">
              Vlasnik ordinacije
            </p>
            <h2 className="mt-3 text-4xl font-bold">Amir Uzunović</h2>
            <p className="mt-5 text-lg leading-8 text-ink/75">
              Šifa Hidžama u Porječanima kod Visokog posvećena je
              profesionalnom, smirenom i diskretnom pristupu hidžami,
              akupunkturi i terapiji čašama. Fokus je na higijeni, jasnom
              razgovoru prije tretmana i individualnom planu prema stanju
              klijenta.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[8px] bg-sage p-4">
                <ShieldCheck className="h-6 w-6 text-forest" />
                <p className="mt-2 text-sm font-bold">Sterilno</p>
              </div>
              <div className="rounded-[8px] bg-sage p-4">
                <HeartHandshake className="h-6 w-6 text-forest" />
                <p className="mt-2 text-sm font-bold">Diskretno</p>
              </div>
              <div className="rounded-[8px] bg-sage p-4">
                <Award className="h-6 w-6 text-forest" />
                <p className="mt-2 text-sm font-bold">Od 2006</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section muted>
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-[8px] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">{t("about.mission")}</h2>
            <p className="mt-4 leading-7 text-ink/70">
              {t("about.missionText")}
            </p>
          </article>
          <article className="rounded-[8px] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">{t("about.vision")}</h2>
            <p className="mt-4 leading-7 text-ink/70">
              {t("about.visionText")}
            </p>
          </article>
          <article className="rounded-[8px] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">{t("about.team")}</h2>
            <p className="mt-4 leading-7 text-ink/70">
              Certificirani terapeuti, administracija i ženski terapeutski tim
              za diskretan pristup.
            </p>
          </article>
        </div>
      </Section>
    </>
  );
}
