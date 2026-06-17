/** Zentrale deutsche UI- und Fehlermeldungen */
export const de = {
  unauthorized: "Nicht autorisiert.",
  validationError: "Validierungsfehler.",
  vehicleNotFound: "Fahrzeug nicht gefunden.",
  submissionNotFound: "Angebot nicht gefunden.",
  testDriveNotFound: "Probefahrt-Anfrage nicht gefunden.",
  contactMessageNotFound: "Kontaktanfrage nicht gefunden.",
  tooManyRequests: "Zu viele Anfragen. Bitte warten.",
  tooManyAttempts: "Zu viele Versuche. Bitte warten.",
  userNotFound: "Benutzer nicht gefunden.",
  wrongPassword: "Aktuelles Passwort ist falsch.",
  passwordMustDiffer: "Das neue Passwort muss sich vom aktuellen unterscheiden.",
  loading: "Wird geladen...",
  logout: "Abmelden",
} as const;

export const submissionLabels = {
  contact: "Kontakt",
  firstName: "Vorname",
  lastName: "Nachname",
  email: "E-Mail",
  phone: "Telefonnummer",
  offersTitle: "Verkaufsangebote",
  noOffers: "Keine Angebote gefunden.",
  backToOffers: "← Angebote",
} as const;

export const contactLabels = {
  heading: "Kontaktieren Sie uns!",
  intro:
    "Das Team von Tunc Automobile in Ahlen steht Ihnen jederzeit zur Verfügung. Ob Fragen zu unseren Fahrzeugen, Finanzierung oder einer Probefahrt — wir helfen Ihnen gerne weiter.",
  customerName: "Vor- & Nachname",
  email: "E-Mail",
  phone: "Tel. Nr.",
  message: "Nachricht",
  submit: "Los geht's",
  submitting: "Wird gesendet...",
  successTitle: "Nachricht erhalten!",
  successMessage: "Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze bei Ihnen.",
  requestsTitle: "Kontaktanfragen",
  noRequests: "Keine Kontaktanfragen gefunden.",
  backToRequests: "← Kontaktanfragen",
  deleteConfirm: "Möchten Sie diese Kontaktanfrage wirklich löschen?",
} as const;

export const testDriveLabels = {
  title: "Probefahrt vereinbaren",
  heroTitle: "Jetzt Probefahrt vereinbaren",
  customerName: "Name & Nachname",
  phone: "Telefon",
  email: "E-Mail",
  preferredDateTime: "Datum / Uhrzeit",
  vehicleModel: "Bitte Modell eingeben (z. B. Audi A6)",
  submit: "Anfrage absenden",
  submitting: "Wird gesendet...",
  successTitle: "Anfrage erhalten!",
  successMessage: "Wir melden uns in Kürze, um Ihren Termin zu bestätigen.",
  backToHome: "Zur Startseite",
  requestsTitle: "Probefahrten",
  noRequests: "Keine Probefahrt-Anfragen gefunden.",
  backToRequests: "← Probefahrten",
  preferredDate: "Wunschtermin",
  model: "Fahrzeugmodell",
} as const;

export const publicNav = [
  { href: "/", label: "Startseite" },
  { href: "/hakkimizda", label: "Über uns" },
  { href: "/vizyon-misyon", label: "Vision & Mission" },
  { href: "/araclar", label: "Fahrzeuge" },
  { href: "/probefahrt", label: "Probefahrt" },
  { href: "/sat", label: "Ankauf" },
  { href: "/iletisim", label: "Kontakt" },
] as const;

export const adminNav = [
  { href: "/admin", label: "Übersicht", exact: true },
  { href: "/admin/homepage", label: "Startseite" },
  { href: "/admin/about", label: "Über uns" },
  { href: "/admin/vision-mission", label: "Vision & Mission" },
  { href: "/admin/vehicles", label: "Fahrzeuge" },
  { href: "/admin/submissions", label: "Angebote" },
  { href: "/admin/probefahrt", label: "Probefahrten" },
  { href: "/admin/kontaktanfragen", label: "Kontaktanfragen" },
  { href: "/admin/social", label: "Social Media" },
  { href: "/admin/contact", label: "Kontakt & Logo" },
  { href: "/admin/impressum", label: "Impressum" },
  { href: "/admin/live-chat", label: "Live-Chat" },
] as const;
