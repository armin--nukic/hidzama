import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@sifahidzama.ba';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin123!ChangeMe';

async function main() {
  const password = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password, role: 'ADMIN' },
    create: {
      name: 'Sifa Admin',
      email: adminEmail,
      password,
      role: 'ADMIN'
    }
  });

  const services = [
    {
      slug: 'hidzama-sunnah',
      titleBs: 'Hidžama Sunnah',
      titleEn: 'Sunnah Hijama',
      summaryBs: 'Tradicionalna terapija prema sunnetskoj praksi.',
      summaryEn: 'Traditional therapy aligned with Sunnah practice.',
      descriptionBs: 'Pažljivo planiran tretman na preporučenim tačkama, uz sterilne jednokratne čaše i stručno savjetovanje.',
      descriptionEn: 'A carefully planned treatment on recommended points, using sterile disposable cups and professional guidance.',
      durationMin: 60,
      priceBam: 50
    },
    {
      slug: 'sportska-hidzama',
      titleBs: 'Sportska Hidžama',
      titleEn: 'Sports Hijama',
      summaryBs: 'Podrška oporavku, mobilnosti i smanjenju napetosti.',
      summaryEn: 'Supports recovery, mobility and reduced tension.',
      descriptionBs: 'Tretman prilagođen aktivnim osobama i sportistima, s fokusom na opterećene mišićne zone.',
      descriptionEn: 'A treatment tailored to active people and athletes, focused on overloaded muscle areas.',
      durationMin: 50,
      priceBam: 60
    },
    {
      slug: 'preventivna-hidzama',
      titleBs: 'Preventivna Hidžama',
      titleEn: 'Preventive Hijama',
      summaryBs: 'Redovna briga o ravnoteži tijela i općem blagostanju.',
      summaryEn: 'Regular care for body balance and general wellbeing.',
      descriptionBs: 'Blag preventivni pristup uz procjenu stanja i individualni raspored tretmana.',
      descriptionEn: 'A gentle preventive approach with assessment and an individual treatment schedule.',
      durationMin: 45,
      priceBam: 45
    },
    {
      slug: 'zenska-hidzama',
      titleBs: 'Ženska Hidžama',
      titleEn: "Women's Hijama",
      summaryBs: 'Diskretan tretman za žene u sigurnom i ugodnom okruženju.',
      summaryEn: 'Discreet therapy for women in a safe and comfortable environment.',
      descriptionBs: 'Individualan pristup za žene, uz poštovanje privatnosti i profesionalnih zdravstvenih standarda.',
      descriptionEn: 'An individual approach for women, with privacy and professional health standards respected.',
      durationMin: 60,
      priceBam: 55
    },
    {
      slug: 'akupunktura',
      titleBs: 'Akupunktura',
      titleEn: 'Acupuncture',
      summaryBs: 'Precizan tretman za balans, opuštanje i podršku oporavku.',
      summaryEn: 'Precise therapy for balance, relaxation and recovery support.',
      descriptionBs: 'Akupunktura se izvodi u mirnom ambijentu, uz individualan razgovor i pažljiv izbor tačaka prema potrebama klijenta.',
      descriptionEn: 'Acupuncture is performed in a calm setting, with individual consultation and careful point selection based on client needs.',
      durationMin: 45,
      priceBam: 50
    }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service
    });
  }

  const legacySlugs = ['hijama-sunnah', 'sportska-hijama', 'preventivna-hijama', 'zenska-hijama'];
  await prisma.service.updateMany({
    where: { slug: { in: legacySlugs } },
    data: { isActive: false }
  });

  const category = await prisma.category.upsert({
    where: { slug: 'edukacija' },
    update: { nameBs: 'Edukacija', nameEn: 'Education' },
    create: { slug: 'edukacija', nameBs: 'Edukacija', nameEn: 'Education' }
  });

  const posts = [
    {
      slug: 'sta-je-hidzama',
      titleBs: 'Šta je hidžama?',
      titleEn: 'What is Hijama?',
      excerptBs: 'Kratak uvod u terapiju čašama, njenu tradiciju i savremeni pristup.',
      excerptEn: 'A short introduction to cupping therapy, its tradition and modern practice.',
      contentBs: 'Hidžama je tradicionalna metoda koja se izvodi kontrolisanim postavljanjem čaša na kožu. U Sifa Hidžama ordinaciji naglasak je na sterilnosti, procjeni stanja i jasnom razgovoru prije tretmana.',
      contentEn: 'Hijama is a traditional method performed by controlled placement of cups on the skin. At Sifa Hijama, the emphasis is on sterility, assessment and clear discussion before treatment.',
      published: true,
      publishedAt: new Date()
    },
    {
      slug: 'kako-se-pripremiti-za-termin',
      titleBs: 'Kako se pripremiti za termin',
      titleEn: 'How to prepare for your appointment',
      excerptBs: 'Praktični savjeti prije dolaska na tretman.',
      excerptEn: 'Practical tips before arriving for therapy.',
      contentBs: 'Prije tretmana preporučujemo lagan obrok, dovoljno vode i izbjegavanje intenzivnog treninga neposredno prije termina. Ponesite relevantne zdravstvene informacije.',
      contentEn: 'Before therapy we recommend a light meal, enough water and avoiding intense training immediately before your appointment. Bring relevant health information.',
      published: true,
      publishedAt: new Date()
    },
    {
      slug: 'akupunktura-i-oporavak',
      titleBs: 'Akupunktura i oporavak',
      titleEn: 'Acupuncture and recovery',
      excerptBs: 'Kako akupunktura može biti dio individualnog plana brige o tijelu.',
      excerptEn: 'How acupuncture can be part of an individual body-care plan.',
      contentBs: 'Akupunktura je precizna metoda koja se planira prema stanju klijenta. Cilj je podržati opuštanje, balans i oporavak kroz miran i profesionalan pristup.',
      contentEn: 'Acupuncture is a precise method planned around the client condition. The goal is to support relaxation, balance and recovery through a calm and professional approach.',
      published: true,
      publishedAt: new Date()
    }
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { ...post, categoryId: category.id },
      create: { ...post, categoryId: category.id }
    });
  }

  await prisma.blogPost.updateMany({
    where: { slug: 'sta-je-hijama' },
    data: { published: false }
  });

  const testimonials = [
    {
      name: 'Amina K.',
      quoteBs: 'Profesionalan pristup, miran ambijent i jasno objašnjen svaki korak tretmana.',
      quoteEn: 'Professional approach, calm atmosphere and every step clearly explained.',
      rating: 5
    },
    {
      name: 'Adnan M.',
      quoteBs: 'Nakon sportske hidžame osjetio sam lakši oporavak i manje napetosti.',
      quoteEn: 'After sports hijama I felt easier recovery and less tension.',
      rating: 5
    }
  ];

  for (const testimonial of testimonials) {
    const id = testimonial.name.toLowerCase().replace(/\W/g, '-');
    await prisma.testimonial.upsert({
      where: { id },
      update: testimonial,
      create: { id, ...testimonial }
    });
  }

  const settings = {
    clinicName: 'Sifa Hidžama',
    owner: 'Amir Uzunović',
    phone: '061 497 647',
    email: 'info@sifahidzama.ba',
    address: 'Porječani, Visoko, Bosna i Hercegovina',
    workingHours: 'Pon-Sub 09:00-18:00',
    mapsUrl: 'https://www.google.com/maps?q=Porjecani,+Visoko,+Bosnia+and+Herzegovina'
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }
}

main()
  .finally(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
