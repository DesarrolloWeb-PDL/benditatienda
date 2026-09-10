'use client'

import { useLanguage } from '@/components/language-provider'
import { AddToCartButton } from '@/components/productos/add-to-cart-button'

interface TranslatedProductDetailProps {
  product: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    weight?: number | null
    imageUrl: string
    allergens: string[]
    riskNote?: string | null
    category: { name: string }
  }
  availableStock: number
  galleryImages: Array<{ id: string; url: string; altText: string }>
}

export function TranslatedProductDetail({ product, availableStock, galleryImages }: TranslatedProductDetailProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-gold-dark font-medium">{product.category.name}</p>
      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-2xl font-bold text-brand-gold-dark">
        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(product.price)}
      </p>

      {product.weight && <p className="text-sm text-gray-500">{t.productWeight}: {product.weight}g</p>}

      {product.allergens.length > 0 && (
        <p className="text-sm text-gray-600">{t.productAllergens}: {product.allergens.join(', ')}</p>
      )}

      {product.riskNote && (
        <p className="text-sm text-red-700">{product.riskNote}</p>
      )}

      <div className="pt-2">
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          productSlug={product.slug}
          price={product.price}
          imageUrl={galleryImages[0]?.url ?? product.imageUrl}
          weight={product.weight ?? undefined}
          maxStock={availableStock}
          disabled={availableStock <= 0}
        />
      </div>
    </div>
  )
}
