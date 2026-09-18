import { PrismaClient } from '@prisma/client';
import { careTexts, careSymbols, countries, fibers, orders, users } from '../lib/mock-data';
import { hashPassword } from '../lib/password';

const prisma = new PrismaClient();

async function main() {
  const demoPasswordHash = await hashPassword('password123');
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, companyName: user.companyName, role: user.role, status: user.status, passwordHash: demoPasswordHash },
      create: { id: user.id, name: user.name, companyName: user.companyName, email: user.email, role: user.role, status: user.status, passwordHash: demoPasswordHash, createdAt: new Date(user.createdAt) },
    });
  }

  for (const name of countries) {
    await prisma.country.upsert({ where: { name }, update: { isActive: true }, create: { name } });
  }
  for (const name of fibers) {
    await prisma.fiber.upsert({ where: { name }, update: { isActive: true }, create: { name } });
  }
  for (const text of careTexts) {
    await prisma.careText.upsert({ where: { text }, update: { isActive: true }, create: { text } });
  }

  const symbolImages: Record<string, string> = {
    W1: '/symbols/image18.png',
    W2: '/symbols/image19.png',
    B1: '/symbols/image13.png',
    D1: '/symbols/image17.png',
    I1: '/symbols/image15.png',
    DC1: '/symbols/image14.png',
  };
  for (const code of careSymbols) {
    await prisma.careSymbol.upsert({
      where: { code },
      update: { imagePath: symbolImages[code] ?? '', isActive: true },
      create: { code, description: code, imagePath: symbolImages[code] ?? '' },
    });
  }

  for (const order of orders) {
    const customer = users.find((user) => user.name === order.customerName);
    if (!customer) continue;
    await prisma.order.upsert({
      where: { id: order.id },
      update: {
        customerId: customer.id,
        poNumber: order.poNumber,
        accountNumber: order.accountNumber,
        shapeNo: order.shapeNo,
        shapeName: order.shapeName,
        styleNo: order.styleNo,
        itemNo: order.itemNo,
        expectedDeliveryDate: new Date(order.expectedDeliveryDate),
        madeInCountry: order.madeInCountry,
        status: order.status,
        submittedAt: order.submittedAt ? new Date(order.submittedAt) : null,
      },
      create: {
        id: order.id,
        customerId: customer.id,
        poNumber: order.poNumber,
        accountNumber: order.accountNumber,
        shapeNo: order.shapeNo,
        shapeName: order.shapeName,
        styleNo: order.styleNo,
        itemNo: order.itemNo,
        expectedDeliveryDate: new Date(order.expectedDeliveryDate),
        madeInCountry: order.madeInCountry,
        status: order.status,
        createdAt: new Date(order.createdAt),
        submittedAt: order.submittedAt ? new Date(order.submittedAt) : null,
      },
    });
    await prisma.fiberContent.deleteMany({ where: { orderId: order.id } });
    await prisma.sizeQuantity.deleteMany({ where: { orderId: order.id } });
    await prisma.careSelection.deleteMany({ where: { orderId: order.id } });
    await prisma.careTextSelection.deleteMany({ where: { orderId: order.id } });
    await prisma.fiberContent.createMany({ data: order.fibers.map((fiber, position) => ({ orderId: order.id, name: fiber.name, percentage: fiber.percentage, position })) });
    await prisma.sizeQuantity.createMany({ data: order.sizes.map((size) => ({ orderId: order.id, size, quantity: 1 })) });
    const careGroups = [
      ['Washing', order.careSymbols.washing],
      ['Bleaching', order.careSymbols.bleaching],
      ['Drying', order.careSymbols.drying],
      ['Ironing', order.careSymbols.ironing],
      ['Dry Cleaning', order.careSymbols.dryCleaning],
    ] as const;
    await prisma.careSelection.createMany({ data: careGroups.flatMap(([group, codes]) => codes.map((code) => ({ orderId: order.id, group, code }))) });
    await prisma.careTextSelection.createMany({ data: order.careText.map((text, position) => ({ orderId: order.id, position, text })) });
  }
}

main().finally(() => prisma.$disconnect());
