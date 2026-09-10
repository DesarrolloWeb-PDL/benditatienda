import CategoryProductsCard from '@/components/productos/category-products-card';
import { TranslatedHomeEmpty } from '@/components/translated-home-empty';
import { TranslatedHomeHero, TranslatedHomeInfo } from '@/components/translated-home-hero';
import { prisma } from '@/lib/db';
import { getTimeGatingRuntime } from '@/lib/time-gating';
import { getThemeConfig } from '@/lib/app-theme';

export const dynamic = 'force-dynamic';

const DAY_LABELS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

// Obtener productos directamente desde la DB
async function getProducts() {
  try {
    const { enabled, service } = await getTimeGatingRuntime();
    const status = enabled ? service.getTimeUntilOpening() : { isOpen: true };
    const weekId = service.getCurrentWeekId();

    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        products: {
          where: { isActive: true, published: true },
          orderBy: { name: 'asc' },
          include: {
            images: {
              select: { url: true, altText: true, order: true },
              orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
            },
            weeklyStocks: {
              where: { weekId },
            },
          },
        },
      },
    });

    const porCategoria = categories
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        productos: cat.products.map((p) => {
          const ws = p.weeklyStocks[0];
          const stockQty = ws
            ? Math.max(0, ws.currentStock - ws.reservedStock)
            : (p.stockType === 'UNLIMITED' ? 999 : p.weeklyStock);
          let allergens: string[] = [];
          try {
            allergens = JSON.parse(p.allergens || '[]');
          } catch {
            allergens = [];
          }
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price,
            weight: p.weight,
            imageUrl: p.imageUrl,
            imageAlt: p.imageAlt,
            images: p.images,
            allergens,
            stock: {
              available: stockQty,
              hasStock: p.stockType === 'UNLIMITED' || stockQty > 0,
              lowStock: p.stockType !== 'UNLIMITED' && stockQty > 0 && stockQty <= 3,
            },
            category: { name: cat.name },
            allowSlicing: p.allowSlicing,
          };
        }).filter((p) => !status.isOpen || p.stock.hasStock),
      }))
      .filter((cat) => cat.productos.length > 0);

    return { porCategoria, total: porCategoria.reduce((s, c) => s + c.productos.length, 0) };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { porCategoria: [], total: 0 };
  }
}

// Obtener time-gating directamente desde la lógica de negocio
async function getTimeGatingData() {
  try {
    const { enabled, service } = await getTimeGatingRuntime();
    const config = service.getConfig()

    if (!enabled) {
      return {
        isOpen: true,
        timeRemaining: undefined,
        nextOpening: undefined,
        openingDayLabel: DAY_LABELS[config.openingDay] ?? DAY_LABELS[3],
        openingHour: config.openingHour,
        openingMinute: config.openingMinute,
        closingDayLabel: DAY_LABELS[config.closingDay] ?? DAY_LABELS[0],
        closingHour: config.closingHour,
        closingMinute: config.closingMinute,
      };
    }

    const status = service.getTimeUntilOpening();
    return {
      isOpen: status.isOpen,
      timeRemaining: status.remainingMs != null
        ? service.formatTimeRemaining(status.remainingMs)
        : undefined,
      nextOpening: status.nextOpening
        ? (status.nextOpening.toISO() ?? undefined)
        : undefined,
      openingDayLabel: DAY_LABELS[config.openingDay] ?? DAY_LABELS[3],
      openingHour: config.openingHour,
      openingMinute: config.openingMinute,
      closingDayLabel: DAY_LABELS[config.closingDay] ?? DAY_LABELS[0],
      closingHour: config.closingHour,
      closingMinute: config.closingMinute,
    };
  } catch (error) {
    console.error('Error fetching time-gating:', error);
    return {
      isOpen: true,
      timeRemaining: undefined,
      nextOpening: undefined,
      openingDayLabel: DAY_LABELS[3],
      openingHour: 18,
      openingMinute: 0,
      closingDayLabel: DAY_LABELS[0],
      closingHour: 20,
      closingMinute: 0,
    };
  }
}

export default async function HomePage() {
  const [productsData, timeGatingData, themeConfig] = await Promise.all([
    getProducts(),
    getTimeGatingData(),
    getThemeConfig(),
  ]);

  return (
    <div
      className={`min-h-screen relative ${
        !themeConfig.heroImageUrl ? 'bg-gradient-to-b from-brand-gold/5 via-white to-brand-gold/5' : ''
      }`}
    >
      {themeConfig.heroImageUrl && (
        <>
          <div
            className="fixed inset-0 z-0"
            style={{
              backgroundImage: `url(${themeConfig.heroImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-0 bg-black/40" aria-hidden="true" />
        </>
      )}
      <div className="relative z-10">
        <TranslatedHomeHero
          themeConfig={themeConfig}
          timeGatingData={timeGatingData}
        />

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12" style={{ backgroundColor: 'var(--brand-section-products)' }}>
        {productsData.porCategoria.length === 0 ? (
          <TranslatedHomeEmpty isOpen={timeGatingData.isOpen} heroImageUrl={themeConfig.heroImageUrl} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {productsData.porCategoria.map((categoria: any) => (
              <CategoryProductsCard
                key={categoria.id}
                categoria={categoria}
                dark={!!themeConfig.heroImageUrl}
              />
            ))}
          </div>
        )}
      </section>

      <TranslatedHomeInfo themeConfig={themeConfig} />
      </div>
    </div>
  );
}
