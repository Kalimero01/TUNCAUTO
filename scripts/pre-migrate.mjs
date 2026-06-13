import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("[pre-migrate] Cleaning legacy data before schema push...");

  const deletedMessages = await prisma.$executeRaw`
    DELETE FROM chat_messages WHERE "conversationId" IS NULL
  `;
  console.log(`[pre-migrate] Removed ${deletedMessages} orphaned chat_messages.`);

  const backfilledPhones = await prisma.$executeRaw`
    UPDATE seller_submissions SET "sellerPhone" = 'unbekannt' WHERE "sellerPhone" IS NULL
  `;
  console.log(`[pre-migrate] Backfilled ${backfilledPhones} seller_submissions without phone.`);
}

main()
  .catch((error) => {
    console.error("[pre-migrate] Failed.", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
