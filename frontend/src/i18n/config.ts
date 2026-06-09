import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  bs: {
    translation: {
      nav: { home: 'Početna', about: 'O nama', services: 'Usluge', booking: 'Rezervacija', blog: 'Blog', faq: 'FAQ', contact: 'Kontakt', admin: 'Admin' },
      cta: { book: 'Rezerviši termin', call: 'Pozovi nas', details: 'Saznaj više' },
      home: {
        eyebrow: 'Profesionalna hidžama i akupunktura u BiH',
        title: 'Šifa Hidžama',
        subtitle: 'Siguran, čist i smiren pristup hidžami, akupunkturi i terapiji čašama, uz poštovanje tradicije i savremenih standarda.',
        benefits: 'Koristi tretmana',
        services: 'Usluge',
        testimonials: 'Iskustva klijenata',
        latest: 'Najnovije iz bloga'
      },
      about: {
        title: 'O nama',
        story: 'Šifa Hidžama je ordinacija posvećena stručnoj, diskretnoj i pažljivo planiranoj hidžami i akupunkturi.',
        mission: 'Misija',
        missionText: 'Pružiti sigurnu terapiju uz edukaciju, povjerenje i poštovanje svakog klijenta.',
        vision: 'Vizija',
        visionText: 'Biti prepoznatljiv centar za profesionalnu hidžamu i akupunkturu u Bosni i Hercegovini.',
        team: 'Tim'
      },
      services: { title: 'Usluge i cijene', duration: 'Trajanje', price: 'Cijena' },
      booking: {
        title: 'Online rezervacija',
        service: 'Usluga',
        date: 'Datum',
        time: 'Termin',
        name: 'Ime i prezime',
        email: 'Email',
        phone: 'Telefon',
        notes: 'Napomena',
        submit: 'Pošalji zahtjev',
        success: 'Zahtjev je poslan. Potvrda je poslana na email.'
      },
      blog: { title: 'Blog', read: 'Pročitaj' },
      faq: { title: 'Česta pitanja' },
      contact: { title: 'Kontakt', subject: 'Naslov', message: 'Poruka', send: 'Pošalji poruku', hours: 'Radno vrijeme', success: 'Poruka je poslana.' },
      admin: {
        login: 'Admin prijava',
        dashboard: 'Pregled',
        stats: 'Statistika',
        overview: 'Administracija ordinacije',
        overviewText: 'Brzi pregled rezervacija, upita i aktivnosti za Šifa Hidžama.',
        appointments: 'Termini',
        contacts: 'Kontakt upiti',
        services: 'Usluge',
        posts: 'Blog objave',
        testimonials: 'Iskustva',
        users: 'Korisnici',
        logout: 'Odjava',
        totalAppointments: 'Ukupno termina',
        upcomingAppointments: 'Nadolazeći termini',
        contactRequests: 'Kontakt upiti',
        pendingAppointments: 'Termini na čekanju',
        allTime: 'Svi zapisi',
        scheduled: 'Zakazano unaprijed',
        needsAction: 'Treba pregledati',
        pending: 'Čeka odluku',
        addUser: 'Dodaj korisnika',
        addService: 'Dodaj uslugu',
        addBlog: 'Dodaj blog',
        close: 'Zatvori',
        name: 'Ime',
        password: 'Lozinka',
        permission: 'Permisija',
        role: 'Uloga',
        staffRole: 'STAFF - dodaje blogove i usluge',
        adminRole: 'ADMIN - puni pristup',
        saveUser: 'Sačuvaj korisnika',
        saving: 'Spašavanje...',
        email: 'Email'
      }
    }
  },
  en: {
    translation: {
      nav: { home: 'Home', about: 'About', services: 'Services', booking: 'Booking', blog: 'Blog', faq: 'FAQ', contact: 'Contact', admin: 'Admin' },
      cta: { book: 'Book appointment', call: 'Call us', details: 'Learn more' },
      home: {
        eyebrow: 'Professional Hijama and acupuncture in BiH',
        title: 'Sifa Hijama',
        subtitle: 'A safe, clean and calm approach to Hijama, acupuncture and cupping therapy, respecting tradition and modern standards.',
        benefits: 'Treatment benefits',
        services: 'Services',
        testimonials: 'Testimonials',
        latest: 'Latest blog posts'
      },
      about: {
        title: 'About Us',
        story: 'Sifa Hijama is a clinic dedicated to professional, discreet and carefully planned Hijama and acupuncture.',
        mission: 'Mission',
        missionText: 'To provide safe therapy with education, trust and respect for every client.',
        vision: 'Vision',
        visionText: 'To become a recognized center for professional Hijama and acupuncture in Bosnia and Herzegovina.',
        team: 'Team'
      },
      services: { title: 'Services and pricing', duration: 'Duration', price: 'Price' },
      booking: {
        title: 'Online booking',
        service: 'Service',
        date: 'Date',
        time: 'Time',
        name: 'Full name',
        email: 'Email',
        phone: 'Phone',
        notes: 'Notes',
        submit: 'Send request',
        success: 'Request sent. Confirmation was sent by email.'
      },
      blog: { title: 'Blog', read: 'Read' },
      faq: { title: 'FAQ' },
      contact: { title: 'Contact', subject: 'Subject', message: 'Message', send: 'Send message', hours: 'Working hours', success: 'Message sent.' },
      admin: {
        login: 'Admin login',
        dashboard: 'Dashboard',
        stats: 'Statistics',
        overview: 'Clinic administration',
        overviewText: 'A quick overview of bookings, contact requests and Sifa Hijama activity.',
        appointments: 'Appointments',
        contacts: 'Contact requests',
        services: 'Services',
        posts: 'Blog posts',
        testimonials: 'Testimonials',
        users: 'Users',
        logout: 'Logout',
        totalAppointments: 'Total appointments',
        upcomingAppointments: 'Upcoming appointments',
        contactRequests: 'Contact requests',
        pendingAppointments: 'Pending appointments',
        allTime: 'All records',
        scheduled: 'Scheduled ahead',
        needsAction: 'Needs review',
        pending: 'Waiting for decision',
        addUser: 'Add user',
        addService: 'Add service',
        addBlog: 'Add blog',
        close: 'Close',
        name: 'Name',
        password: 'Password',
        permission: 'Permission',
        role: 'Role',
        staffRole: 'STAFF - can add blogs and services',
        adminRole: 'ADMIN - full access',
        saveUser: 'Save user',
        saving: 'Saving...',
        email: 'Email'
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('sifa_lang') ?? 'bs',
  fallbackLng: 'bs',
  interpolation: { escapeValue: false }
});

export default i18n;
