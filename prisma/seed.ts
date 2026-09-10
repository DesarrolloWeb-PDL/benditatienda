import nextEnv from '@next/env';
import { createConfiguredPrismaClient } from '../src/lib/prisma-client';

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const prisma = createConfiguredPrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear categorías
  const indumentariaCategory = await prisma.category.upsert({
    where: { slug: 'indumentaria' },
    update: {},
    create: {
      name: 'Indumentaria',
      slug: 'indumentaria',
      description: 'Ropa deportiva para CrossFit y entrenamiento funcional',
      order: 1,
    },
  });

  const equipamientoCategory = await prisma.category.upsert({
    where: { slug: 'equipamiento' },
    update: {},
    create: {
      name: 'Equipamiento',
      slug: 'equipamiento',
      description: 'Guantes, tobilleras, rodilleras y accesorios de entrenamiento',
      order: 2,
    },
  });

  const suplementosCategory = await prisma.category.upsert({
    where: { slug: 'suplementos' },
    update: {},
    create: {
      name: 'Suplementos',
      slug: 'suplementos',
      description: 'Proteínas, creatinas, pre-entreno y suplementación deportiva',
      order: 3,
    },
  });

  const accesoriosCategory = await prisma.category.upsert({
    where: { slug: 'accesorios' },
    update: {},
    create: {
      name: 'Accesorios',
      slug: 'accesorios',
      description: 'Botellas, barras de proteinas, cinturones y más',
      order: 4,
    },
  });

  console.log('✅ Categorías creadas');

  // Crear productos de ejemplo
  const products = [
    // ── Indumentaria ──
    {
      name: 'Remera CrossFit Dry-Fit',
      slug: 'remera-crossfit-dryfit',
      description: 'Remera deportiva de secado rápido, ideal para WODs intensos. Tela liviana y transpirable.',
      price: 8500,
      weight: 200,
      ingredients: 'Poliéster 100%',
      allergens: [],
      riskNote: null,
      imageUrl: '/images/productos/remera-crossfit.jpg',
      imageAlt: 'Remera CrossFit Dry-Fit',
      weeklyStock: 50,
      allowSlicing: false,
      isActive: true,
      categoryId: indumentariaCategory.id,
    },
    {
      name: 'Pantalón de Compresión',
      slug: 'pantalon-compresion',
      description: 'Pantalón de compresión para entrenamiento. Soporte muscular y comodidad.',
      price: 12000,
      weight: 250,
      ingredients: 'Nylon + Elastano',
      allergens: [],
      riskNote: null,
      imageUrl: '/images/productos/pantalon-compresion.jpg',
      imageAlt: 'Pantalón de Compresión',
      weeklyStock: 30,
      allowSlicing: false,
      isActive: true,
      categoryId: indumentariaCategory.id,
    },
    {
      name: 'Buzo con Capucha Fitness',
      slug: 'buzo-capucha-fitness',
      description: 'Buzo oversized con capucha, ideal para calentar antes del entrenamiento.',
      price: 18000,
      weight: 400,
      ingredients: 'Algodón 80%, Poliéster 20%',
      allergens: [],
      riskNote: null,
      imageUrl: '/images/productos/buzo-capucha.jpg',
      imageAlt: 'Buzo con Capucha Fitness',
      weeklyStock: 20,
      allowSlicing: false,
      isActive: true,
      categoryId: indumentariaCategory.id,
    },
    {
      name: 'Musculosa Tank Top',
      slug: 'musculosa-tank-top',
      description: 'Musculosa amplia para entrenamiento. Distribución libre de movimiento.',
      price: 6500,
      weight: 150,
      ingredients: 'Algodón 100%',
      allergens: [],
      riskNote: null,
      imageUrl: '/images/productos/musculosa-tank.jpg',
      imageAlt: 'Musculosa Tank Top',
      weeklyStock: 40,
      allowSlicing: false,
      isActive: true,
      categoryId: indumentariaCategory.id,
    },
    // ── Equipamiento ──
    {
      name: 'Guantes de Gimnasio Pro',
      slug: 'guantes-gimnasio-pro',
      description: 'Guantes acolchados con cierre de velcro. Protección para levantamientos pesados.',
      price: 7500,
      weight: 100,
      ingredients: 'Cuero sintético + Neopreno',
      allergens: [],
      riskNote: null,
      imageUrl: '/images/productos/guantes-gimnasio.jpg',
      imageAlt: 'Guantes de Gimnasio Pro',
      weeklyStock: 35,
      allowSlicing: false,
      isActive: true,
      categoryId: equipamientoCategory.id,
    },
    {
      name: 'Tobilleras de CrossFit',
      slug: 'tobilleras-crossfit',
      description: 'Tobilleras ajustables para soap cleans y snatch. Estabilidad y protección.',
      price: 9000,
      weight: 80,
      ingredients: 'Neopreno + Nylon',
      allergens: [],
      riskNote: null,
      imageUrl: '/images/productos/tobilleras.jpg',
      imageAlt: 'Tobilleras de CrossFit',
      weeklyStock: 25,
      allowSlicing: false,
      isActive: true,
      categoryId: equipamientoCategory.id,
    },
    {
      name: 'Rodilleras de Compresión',
      slug: 'rodilleras-compresion',
      description: 'Rodilleras de compresión para soporte articular. Ideales para sentadillas y statics.',
      price: 8000,
      weight: 120,
      ingredients: 'Neopreno + Elastano',
      allergens: [],
      riskNote: null,
      imageUrl: '/images/productos/rodilleras.jpg',
      imageAlt: 'Rodilleras de Compresión',
      weeklyStock: 30,
      allowSlicing: false,
      isActive: true,
      categoryId: equipamientoCategory.id,
    },
    {
      name: 'Cinturón de Levantamiento',
      slug: 'cinturon-levantamiento',
      description: 'Cinturón de cuero para levantamiento pesado. Soporte lumbar y estabilidad.',
      price: 15000,
      weight: 300,
      ingredients: 'Cuero genuino',
      allergens: [],
      riskNote: null,
      imageUrl: '/images/productos/cinturon.jpg',
      imageAlt: 'Cinturón de Levantamiento',
      weeklyStock: 15,
      allowSlicing: false,
      isActive: true,
      categoryId: equipamientoCategory.id,
    },
    // ── Suplementos ──
    {
      name: 'Proteína Whey 1kg',
      slug: 'proteina-whey-1kg',
      description: 'Proteína whey concentrada de alta calidad. Sabor chocolate. 24g de proteína por porción.',
      price: 25000,
      weight: 1000,
      ingredients: 'Concentrado de proteína de suero, cacao, edulcorante',
      allergens: ['Leche'],
      riskNote: null,
      imageUrl: '/images/productos/proteina-whey.jpg',
      imageAlt: 'Proteína Whey 1kg',
      weeklyStock: 20,
      allowSlicing: false,
      isActive: true,
      categoryId: suplementosCategory.id,
    },
    {
      name: 'Creatina Monohidratada 500g',
      slug: 'creatina-monohidratada-500g',
      description: 'Creatina monohidratada pura. 5g por porción. Sin sabor, se mezcla fácil.',
      price: 12000,
      weight: 500,
      ingredients: 'Creatina monohidratada',
      allergens: [],
      riskNote: null,
      imageUrl: '/images/productos/creatina.jpg',
      imageAlt: 'Creatina Monohidratada 500g',
      weeklyStock: 25,
      allowSlicing: false,
      isActive: true,
      categoryId: suplementosCategory.id,
    },
    {
      name: 'Pre-Entreno 300g',
      slug: 'pre-entreno-300g',
      description: 'Pre-entreno con cafeína, beta-alanina y citrulina. Máximo rendimiento.',
      price: 18000,
      weight: 300,
      ingredients: 'Cafeína, beta-alanina, citrulina, taurina, vitaminas',
      allergens: [],
      riskNote: 'Contiene cafeína. No recomendado para menores de 18 años.',
      imageUrl: '/images/productos/pre-entreno.jpg',
      imageAlt: 'Pre-Entreno 300g',
      weeklyStock: 20,
      allowSlicing: false,
      isActive: true,
      categoryId: suplementosCategory.id,
    },
    {
      name: 'BCAA 2:1:1 200g',
      slug: 'bcaa-211-200g',
      description: 'Aminos ramificados BCAA en proporción 2:1:1. Sabor frutas tropicales.',
      price: 14000,
      weight: 200,
      ingredients: 'L-Leucina, L-Valina, L-Isoleucina, saborizante',
      allergens: [],
      riskNote: null,
      imageUrl: '/images/productos/bcaa.jpg',
      imageAlt: 'BCAA 2:1:1 200g',
      weeklyStock: 20,
      allowSlicing: false,
      isActive: true,
      categoryId: suplementosCategory.id,
    },
    // ── Accesorios ──
    {
      name: 'Botella Térmica 750ml',
      slug: 'botella-termica-750ml',
      description: 'Botella térmica de acero inoxidable. Mantiene bebidas frías por 24h o calientes por 12h.',
      price: 8000,
      weight: 350,
      ingredients: 'Acero inoxidable',
      allergens: [],
      riskNote: null,
      imageUrl: '/images/productos/botella-termica.jpg',
      imageAlt: 'Botella Térmica 750ml',
      weeklyStock: 30,
      allowSlicing: false,
      isActive: true,
      categoryId: accesoriosCategory.id,
    },
    {
      name: 'Barra de Proteína x12',
      slug: 'barra-proteina-x12',
      description: 'Caja con 12 barras de proteína. Sabor chocolate crunch. 20g de proteína por barra.',
      price: 22000,
      weight: 1200,
      ingredients: 'Proteína de leche, chocolate, avena, miel',
      allergens: ['Leche', 'Gluten', 'Frutos secos'],
      riskNote: null,
      imageUrl: '/images/productos/barra-proteina.jpg',
      imageAlt: 'Barra de Proteína x12',
      weeklyStock: 15,
      allowSlicing: false,
      isActive: true,
      categoryId: accesoriosCategory.id,
    },
    {
      name: 'Gorra CrossFit',
      slug: 'gorra-crossfit',
      description: 'Gorra deportiva con visera curva. Tela transpirable con cierre ajustable.',
      price: 4500,
      weight: 80,
      ingredients: 'Poliéster',
      allergens: [],
      riskNote: null,
      imageUrl: '/images/productos/gorra.jpg',
      imageAlt: 'Gorra CrossFit',
      weeklyStock: 40,
      allowSlicing: false,
      isActive: true,
      categoryId: accesoriosCategory.id,
    },
    {
      name: 'Toalla Deportiva Grande',
      slug: 'toalla-deportiva-grande',
      description: 'Toalla de microfibra de secado rápido. Tamaño 80x160cm.',
      price: 5500,
      weight: 200,
      ingredients: 'Microfibra',
      allergens: [],
      riskNote: null,
      imageUrl: '/images/productos/toalla-deportiva.jpg',
      imageAlt: 'Toalla Deportiva Grande',
      weeklyStock: 25,
      allowSlicing: false,
      isActive: true,
      categoryId: accesoriosCategory.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        allergens: JSON.stringify(product.allergens),
      },
    });
  }

  console.log('✅ Productos creados');

  // Crear puntos de recogida
  const pickupPoints = [
    {
      name: 'Bendito Cross (Sede Principal)',
      address: 'Av. Principal 1234',
      city: 'Paso de los Libres',
      postalCode: 'W3230',
      schedule: 'Lunes a Viernes 8:00-21:00, Sábados 9:00-14:00',
      instructions: 'Retirar en la recepción del gimnasio',
      isActive: true,
      order: 1,
    },
    {
      name: 'Suplementería Fit Store',
      address: 'Calle San Martín 567',
      city: 'Paso de los Libres',
      postalCode: 'W3230',
      schedule: 'Lunes a Viernes 10:00-20:00, Sábados 10:00-14:00',
      instructions: null,
      isActive: true,
      order: 2,
    },
  ];

  await prisma.pickupPoint.deleteMany({});
  await prisma.pickupPoint.createMany({
    data: pickupPoints,
  });

  console.log('✅ Puntos de recogida creados');

  // Configuración del sitio
  const configs = [
    { key: 'time_gating_enabled', value: 'false' },
    { key: 'opening_day', value: '1' },
    { key: 'opening_hour', value: '8' },
    { key: 'closing_day', value: '6' },
    { key: 'closing_hour', value: '20' },
    { key: 'shipping_cost_national', value: '5950' },
    { key: 'shipping_cost_local', value: '3500' },
  ];

  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    });
  }

  console.log('✅ Configuración del sitio creada');
  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
