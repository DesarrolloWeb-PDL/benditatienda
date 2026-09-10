export interface SiteContent {
  navProductsLabel: string
  navAboutLabel: string
  navContactLabel: string
  footerDescription: string
  footerScheduleTitle: string
  footerScheduleText: string
  footerDeliveryText: string
  footerContactTitle: string
  footerLegalNote: string
  contactEmail: string
  contactPhone: string
  contactWhatsapp: string
  contactInstagram: string
  contactAddress: string
  aboutTitle: string
  aboutBody: string
  aboutSecondaryBody: string
  contactTitle: string
  contactIntro: string
  deliveryPickupText: string
  deliveryLocalText: string
  deliveryCourierText: string
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  navProductsLabel: 'Productos',
  navAboutLabel: 'Sobre Nosotros',
  navContactLabel: 'Contacto',
  footerDescription:
    'Productos frescos de huerta directo al consumidor. Huevos caseros, verduras, frutas y más. Calidad sin intermediarios.',
  footerScheduleTitle: 'Horario de Pedidos',
  footerScheduleText: 'La carta abre los miércoles a las 18:00 y cierra el domingo a las 20:00.',
  footerDeliveryText: 'Recogida en punto, reparto local y envío a domicilio el día de reparto.',
  footerContactTitle: 'Contacto',
  footerLegalNote: 'Venta directa de productos de huerta. Producción limitada y trabajo bajo pedido para priorizar frescura y calidad.',
  contactEmail: 'contacto@clarayyema.com',
  contactPhone: '+34 600 000 000',
  contactWhatsapp: '+34 600 000 000',
  contactInstagram: 'https://www.instagram.com/clara.y.yema',
  contactAddress: 'Huerta: Calle Ejemplo 123, Utrera',
  aboutTitle: 'Sobre Nosotros',
  aboutBody:
    'Somos un proyecto de venta directa de productos de huerta. Trabajamos bajo pedido para ofrecerte lo más fresco posible. Cada semana abrimos una ventana de preventa y entregamos los productos directamente del campo a tu mesa.',
  aboutSecondaryBody:
    'Nuestra producción es limitada por diseño. Eso nos permite elegir los mejores productos, mantener la frescura y sostener una relación más directa con cada pedido y cada punto de entrega.',
  contactTitle: 'Contacto',
  contactIntro:
    'Escribinos para encargos, dudas sobre recogida, reparto o envío. Si necesitás seguimiento de tu pedido, te respondemos por email o WhatsApp.',
  deliveryPickupText:
    'Al hacer tu pedido podés elegir el punto de recogida que más te convenga. Nosotros elegimos los productos, vos decidís dónde retirar.',
  deliveryLocalText:
    'El reparto local se ofrece dentro del casco urbano y se coordina el día de reparto programado.',
  deliveryCourierText:
    'También podés optar por envío a domicilio. El pedido sale el día de reparto programado.',
}

export const SITE_CONTENT_KEYS = Object.keys(DEFAULT_SITE_CONTENT) as Array<keyof SiteContent>