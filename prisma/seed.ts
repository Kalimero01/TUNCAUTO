import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const companyData = {
  name: "Tunc Automobile",
  owner: "Serkan Tunc",
  street: "Südstr. 48a",
  postalCode: "59227",
  city: "Ahlen",
  address: "Südstr. 48a\n59227 Ahlen\nDeutschland",
  phone: "01787306033",
  email: "tuncautomobile2022@gmail.com",
  taxId: "DE349004935",
  mapEmbedUrl: null as string | null,
  impressum: `Angaben gemäß § 5 TMG

Tunc Automobile
Inhaber: Serkan Tunc
Südstr. 48a
59227 Ahlen
Deutschland

Telefon: 01787306033
E-Mail: tuncautomobile2022@gmail.com

USt-IdNr.: DE349004935`,
  privacyPolicy: `Datenschutzerklärung

Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten auf unserer Website.

Verantwortlicher
Tunc Automobile
Inhaber: Serkan Tunc
Südstr. 48a
59227 Ahlen
E-Mail: tuncautomobile2022@gmail.com

Erhobene Daten
Kontaktformulare, Fahrzeugverkaufsanfragen und Live-Chat-Nachrichten.

Ihre Rechte
Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten.`,
};

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
    update: companyData,
    create: {
      id: "company",
      ...companyData,
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
        { platform: "FACEBOOK", url: "", isActive: false },
        { platform: "INSTAGRAM", url: "", isActive: false },
        { platform: "TIKTOK", url: "", isActive: false },
      ],
    });
  } else {
    const existing = await prisma.socialLink.findMany({ select: { platform: true } });
    const platforms = new Set(existing.map((s) => s.platform));
    const missing = (["FACEBOOK", "INSTAGRAM", "TIKTOK"] as const).filter((p) => !platforms.has(p));
    if (missing.length > 0) {
      await prisma.socialLink.createMany({
        data: missing.map((platform) => ({ platform, url: "", isActive: false })),
      });
    }
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
