const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Users
  const customer = await prisma.user.upsert({
    where: { email: 'customer@demo.com' },
    update: {},
    create: {
      email: 'customer@demo.com',
      name: 'Demo Customer',
      role: 'CUSTOMER',
    },
  });

  const officer = await prisma.user.upsert({
    where: { email: 'officer@demo.com' },
    update: {},
    create: {
      email: 'officer@demo.com',
      name: 'Inspector Sharma',
      role: 'OFFICER',
    },
  });

  // Create Demo Product
  const demoProduct = await prisma.product.upsert({
    where: { barcode: '123456789012' },
    update: {},
    create: {
      barcode: '123456789012',
      name: 'ABC Rice — 1 kg',
      category: 'Food & Grains',
      rulesJson: JSON.stringify([
        { field: 'Product Name', required: true },
        { field: 'Net Quantity', required: true },
        { field: 'Manufacturer', required: true },
        { field: 'Date', required: true },
        { field: 'MRP', required: true },
        { field: 'Consumer-care info', required: true }
      ])
    }
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
