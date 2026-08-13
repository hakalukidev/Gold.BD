import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin@1234", 10);
  const demoPasswordHash = await bcrypt.hash("Demo@1234", 10);

  const admin = await prisma.user.upsert({
    where: { phone: "01700000000" },
    update: {},
    create: {
      phone: "01700000000",
      fullName: "Gold BD Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      kycStatus: "APPROVED",
      wallet: { create: { cashBalanceBDT: 0, goldBalanceMg: 0 } },
    },
  });

  await prisma.user.upsert({
    where: { phone: "01800000000" },
    update: {},
    create: {
      phone: "01800000000",
      fullName: "Demo User",
      passwordHash: demoPasswordHash,
      role: "USER",
      kycStatus: "APPROVED",
      wallet: { create: { cashBalanceBDT: 50000, goldBalanceMg: 0 } },
    },
  });

  // A short demo rate history (not real market data) so the landing page's rate
  // chart has more than one point on a fresh install. Only seeded once — leaves
  // real admin-set rates alone on subsequent `db seed` runs.
  const rateCount = await prisma.goldRate.count();
  if (rateCount === 0) {
    const daysAgoAndPrice: [number, number][] = [
      [42, 11800],
      [35, 11950],
      [28, 12100],
      [21, 12050],
      [14, 12300],
      [7, 12400],
      [0, 12500],
    ];
    for (const [daysAgo, price] of daysAgoAndPrice) {
      const effectiveAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      await prisma.goldRate.create({
        data: { pricePerGramBDT: price, setById: admin.id, effectiveAt },
      });
    }
  }

  console.log("Seeded: admin (01700000000 / Admin@1234), demo user (01800000000 / Demo@1234, 50000 BDT), gold rate.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
