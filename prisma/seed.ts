import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMeImmediately123!", 12);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@tuncauto.com",
      name: "Tuncauto Admin",
      passwordHash,
      mustChangePassword: true,
      role: "ADMIN",
    },
  });

  await prisma.company.upsert({
    where: { id: "company" },
    update: {},
    create: {
      id: "company",
      name: "TUNC AUTO",
      address: "Musterstraße 1, 10115 Berlin, Deutschland",
      phone: "+49 30 12345678",
      email: "info@tuncauto.com",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.0!2d13.405!3d52.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDMxJzEyLjAiTiAxM8KwMjQnMTguMCJF!5e0!3m2!1sde!2sde!4v1",
      impressum: `## Impressum

**TUNC AUTO**
Musterstraße 1
10115 Berlin

Geschäftsführer: Tunc Auto GmbH
Handelsregister: HRB 000000
USt-IdNr.: DE000000000

Kontakt: info@tuncauto.com`,
      privacyPolicy: `## Datenschutzerklärung

Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten auf unserer Website.

### Verantwortlicher
TUNC AUTO, Musterstraße 1, 10115 Berlin

### Erhobene Daten
Kontaktformulare, Fahrzeugverkaufsanfragen und Live-Chat-Nachrichten.

### Ihre Rechte
Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung.`,
    },
  });

  await prisma.about.upsert({
    where: { id: "about" },
    update: {},
    create: {
      id: "about",
      title: "Über uns",
      content: `TUNC AUTO steht für Premium-Fahrzeuge, Transparenz und erstklassigen Service.

Als unabhängiger Autohändler bieten wir sorgfältig geprüfte Fahrzeuge in einer exklusiven Atmosphäre. Unser Team begleitet Sie von der ersten Beratung bis zur Übergabe — persönlich, kompetent und zuverlässig.`,
    },
  });

  await prisma.visionMission.upsert({
    where: { id: "vision_mission" },
    update: {},
    create: {
      id: "vision_mission",
      title: "Vision & Mission",
      content: `**Unsere Vision**
Die erste Adresse für Premium-Fahrzeuge in Deutschland zu sein — mit Vertrauen, Eleganz und digitaler Exzellenz.

**Unsere Mission**
Jedes Fahrzeug mit höchster Sorgfalt auszuwählen, faire Preise zu bieten und unseren Kunden ein unvergessliches Kauferlebnis zu ermöglichen.`,
    },
  });

  const socialCount = await prisma.socialLink.count();
  if (socialCount === 0) {
    await prisma.socialLink.createMany({
      data: [
        { platform: "INSTAGRAM", url: "https://instagram.com/tuncauto", isActive: true },
        { platform: "TIKTOK", url: "https://tiktok.com/@tuncauto", isActive: true },
      ],
    });
  }

  const textCount = await prisma.homeText.count();
  if (textCount === 0) {
    await prisma.homeText.createMany({
      data: [
        {
          title: "Premium Automobile",
          content:
            "Entdecken Sie unsere exklusive Auswahl an Fahrzeugen — geprüft, transparent und mit erstklassigem Service.",
          sortOrder: 0,
        },
        {
          title: "Verkaufen Sie Ihr Fahrzeug",
          content:
            "Schnelle Bewertung, faire Preise und professionelle Abwicklung — online in wenigen Minuten.",
          sortOrder: 1,
        },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
