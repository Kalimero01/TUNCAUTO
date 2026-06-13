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
  mapEmbedUrl: null,
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

Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst.`,
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
    create: { id: "company", ...companyData },
  });
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
