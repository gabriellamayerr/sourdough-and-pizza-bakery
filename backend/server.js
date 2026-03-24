import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()
const port = Number(process.env.API_PORT || 4000)
const qaApiKey = process.env.QA_API_KEY || 'qa-local-key'

const qaScenarios = {
  empty: [],
  'bakery-demo-day': [
    {
      flour: 1200,
      hydration: 72,
      starter: 20,
      salt: 2,
    },
    {
      flour: 850,
      hydration: 68,
      starter: 18,
      salt: 2,
    },
  ],
}

const qaState = {
  scenario: 'empty',
  calculations: [],
}

const premiumCatalog = [
  {
    id: 'course-sourdough-essentials',
    type: 'course',
    title: 'Sourdough Essentials Masterclass',
    description: 'Video training for starter care, fermentation timing, and bakery consistency.',
    priceRon: 349,
    currency: 'RON',
  },
  {
    id: 'course-pizza-lab',
    type: 'course',
    title: 'Pizza Dough Lab Pro',
    description: 'Advanced hydration and dough-strength workflow for urban pizza production.',
    priceRon: 429,
    currency: 'RON',
  },
  {
    id: 'product-premium-flour-kit',
    type: 'exclusive-product',
    title: 'Premium Flour Blend Kit',
    description: 'Curated flour selection with hydration guidelines used in our atelier.',
    priceRon: 189,
    currency: 'RON',
  },
  {
    id: 'product-fermentation-journal',
    type: 'exclusive-product',
    title: 'Fermentation Control Journal',
    description: 'Exclusive operational notebook for tracking batches, proofing and results.',
    priceRon: 129,
    currency: 'RON',
  },
]

const mockPaymentProviders = {
  netopia: {
    id: 'netopia',
    label: 'NETOPIA Payments (Mock)',
    country: 'RO',
    currency: 'RON',
  },
}

const premiumOrders = new Map()

app.use(cors())
app.use(express.json())

function calculateDough(payload) {
  const flour = Number(payload.flour)
  const hydration = Number(payload.hydration)
  const starter = Number(payload.starter)
  const salt = Number(payload.salt)

  if (!Number.isFinite(flour) || flour <= 0) {
    return { error: 'flour must be a positive number' }
  }

  if (![hydration, starter, salt].every((value) => Number.isFinite(value) && value >= 0)) {
    return { error: 'hydration, starter, and salt must be non-negative numbers' }
  }

  const water = (flour * hydration) / 100
  const starterWeight = (flour * starter) / 100
  const saltWeight = (flour * salt) / 100
  const totalDough = flour + water + starterWeight + saltWeight

  return {
    result: {
      flour,
      water,
      starter: starterWeight,
      salt: saltWeight,
      totalDough,
    },
  }
}

function requireQaAccess(request, response, next) {
  if (request.headers['x-qa-key'] !== qaApiKey) {
    response.status(401).json({ message: 'invalid QA API key' })
    return
  }

  next()
}

function createOrderId() {
  return `ord_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

function mapCatalogById() {
  return premiumCatalog.reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, {})
}

app.get('/api/health', (_, response) => {
  response.json({ status: 'ok', service: 'bakery-api' })
})

app.post('/api/calculate', (request, response) => {
  const calculation = calculateDough(request.body)

  if (calculation.error) {
    response.status(400).json({ message: calculation.error })
    return
  }

  response.json(calculation)
})

app.get('/api/test/catalog', requireQaAccess, (_, response) => {
  response.json({
    scenarios: Object.keys(qaScenarios),
  })
})

app.post('/api/test/reset', requireQaAccess, (_, response) => {
  qaState.scenario = 'empty'
  qaState.calculations = []

  response.json({
    message: 'qa state reset',
    state: qaState,
  })
})

app.post('/api/test/seed', requireQaAccess, (request, response) => {
  const scenario = request.body?.scenario

  if (!qaScenarios[scenario]) {
    response.status(400).json({
      message: `unknown scenario: ${scenario}`,
      availableScenarios: Object.keys(qaScenarios),
    })
    return
  }

  const seededCalculations = qaScenarios[scenario]
    .map((item) => calculateDough(item).result)
    .filter(Boolean)

  qaState.scenario = scenario
  qaState.calculations = seededCalculations

  response.json({
    message: 'qa scenario seeded',
    state: qaState,
  })
})

app.get('/api/test/state', requireQaAccess, (_, response) => {
  response.json({ state: qaState })
})

app.post('/api/test/calculate/batch', requireQaAccess, (request, response) => {
  const items = request.body?.items

  if (!Array.isArray(items) || items.length === 0) {
    response.status(400).json({ message: 'items must be a non-empty array' })
    return
  }

  const results = []

  for (const [index, item] of items.entries()) {
    const calculation = calculateDough(item)

    if (calculation.error) {
      response.status(400).json({
        message: `invalid item at index ${index}: ${calculation.error}`,
      })
      return
    }

    results.push(calculation.result)
  }

  response.json({
    count: results.length,
    results,
  })
})

app.get('/api/premium/catalog', (_, response) => {
  response.json({
    items: premiumCatalog,
    paymentProviders: Object.values(mockPaymentProviders),
  })
})

app.post('/api/premium/checkout', (request, response) => {
  const items = request.body?.items
  const customer = request.body?.customer
  const paymentProvider = request.body?.paymentProvider || 'netopia'
  const provider = mockPaymentProviders[paymentProvider]

  if (!provider) {
    response.status(400).json({ message: 'unsupported payment provider' })
    return
  }

  if (!customer?.name || !customer?.email) {
    response.status(400).json({ message: 'customer name and email are required' })
    return
  }

  if (!Array.isArray(items) || items.length === 0) {
    response.status(400).json({ message: 'items must be a non-empty array' })
    return
  }

  const catalogById = mapCatalogById()
  const normalizedItems = []

  for (const [index, item] of items.entries()) {
    const catalogItem = catalogById[item?.id]
    const quantity = Number(item?.quantity)

    if (!catalogItem) {
      response.status(400).json({ message: `unknown item at index ${index}` })
      return
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      response.status(400).json({ message: `invalid quantity at index ${index}` })
      return
    }

    normalizedItems.push({
      id: catalogItem.id,
      title: catalogItem.title,
      quantity,
      unitPriceRon: catalogItem.priceRon,
      lineTotalRon: catalogItem.priceRon * quantity,
    })
  }

  const totalRon = normalizedItems.reduce((sum, item) => sum + item.lineTotalRon, 0)
  const orderId = createOrderId()

  const order = {
    id: orderId,
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
    },
    items: normalizedItems,
    totalRon,
    status: 'pending_payment',
    paymentProvider,
    createdAt: new Date().toISOString(),
  }

  premiumOrders.set(orderId, order)

  response.status(201).json({
    order,
    paymentSession: {
      provider: provider.id,
      providerLabel: provider.label,
      paymentUrl: `https://sandbox.netopia-payments.mock/checkout/${orderId}`,
      token: `np_mock_${orderId}`,
      message: 'Mock NETOPIA session created. Use the confirm endpoint for dummy payment.',
    },
  })
})

app.post('/api/premium/payment/mock-netopia/charge', (request, response) => {
  const orderId = request.body?.orderId
  const cardToken = request.body?.cardToken || '4111111111111111'
  const order = premiumOrders.get(orderId)

  if (!order) {
    response.status(404).json({ message: 'order not found' })
    return
  }

  if (order.status === 'paid') {
    response.json({
      message: 'payment already confirmed',
      order,
    })
    return
  }

  if (!String(cardToken).trim()) {
    response.status(400).json({ message: 'cardToken is required for mock payment' })
    return
  }

  const paidOrder = {
    ...order,
    status: 'paid',
    paidAt: new Date().toISOString(),
    payment: {
      provider: 'netopia',
      transactionId: `txn_${Date.now()}`,
      cardTokenLast4: String(cardToken).slice(-4),
    },
  }

  premiumOrders.set(orderId, paidOrder)

  response.json({
    message: 'mock payment approved',
    order: paidOrder,
  })
})

app.get('/api/premium/orders/:orderId', (request, response) => {
  const order = premiumOrders.get(request.params.orderId)

  if (!order) {
    response.status(404).json({ message: 'order not found' })
    return
  }

  response.json({ order })
})

app.listen(port, () => {
  console.log(`bakery-api listening on port ${port}`)
})
