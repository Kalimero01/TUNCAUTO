/** Zentrale deutsche UI- und Fehlermeldungen */
export const de = {
  unauthorized: "Nicht autorisiert.",
  validationError: "Validierungsfehler.",
  vehicleNotFound: "Fahrzeug nicht gefunden.",
  submissionNotFound: "Angebot nicht gefunden.",
  tooManyRequests: "Zu viele Anfragen. Bitte warten.",
  tooManyMessages: "Zu viele Nachrichten. Bitte warten.",
  tooManyAttempts: "Zu viele Versuche. Bitte warten.",
  messageValidationError: "Nachrichtenvalidierung fehlgeschlagen.",
  messageEmpty: "Nachricht darf nicht leer sein.",
  submissionAlreadyProcessed: "Dieses Angebot wurde bereits bearbeitet.",
  invalidAction: "Ungültige Aktion.",
  userNotFound: "Benutzer nicht gefunden.",
  wrongPassword: "Aktuelles Passwort ist falsch.",
  passwordMustDiffer: "Das neue Passwort muss sich vom aktuellen unterscheiden.",
  loading: "Wird geladen...",
  logout: "Abmelden",
} as const;

export const publicNav = [
  { href: "/", label: "Startseite" },
  { href: "/hakkimizda", label: "Über uns" },
  { href: "/vizyon-misyon", label: "Vision & Mission" },
  { href: "/araclar", label: "Fahrzeuge" },
  { href: "/sat", label: "Fahrzeug verkaufen" },
  { href: "/iletisim", label: "Kontakt" },
] as const;

export const adminNav = [
  { href: "/admin", label: "Übersicht", exact: true },
  { href: "/admin/homepage", label: "Startseite" },
  { href: "/admin/about", label: "Über uns" },
  { href: "/admin/vision-mission", label: "Vision & Mission" },
  { href: "/admin/vehicles", label: "Fahrzeuge" },
  { href: "/admin/submissions", label: "Angebote" },
  { href: "/admin/social", label: "Social Media" },
  { href: "/admin/contact", label: "Kontakt & Logo" },
  { href: "/admin/impressum", label: "Impressum" },
  { href: "/admin/live-chat", label: "Live-Chat" },
] as const;
