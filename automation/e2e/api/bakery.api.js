import { HttpClient } from './http.client.js'

const qaApiKey = process.env.QA_API_KEY || 'qa-local-key'

class BakeryApi {
  constructor() {
    this.client = new HttpClient({
      baseUrl: process.env.BAKERY_API_BASE_URL || 'http://localhost:4000',
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
    })
  }

  async health() {
    return this.client.request('/api/health')
  }

  async calculate(payload) {
    return this.client.request('/api/calculate', {
      method: 'POST',
      body: payload,
    })
  }

  async resetQaState() {
    return this.client.request('/api/test/reset', {
      method: 'POST',
      headers: { 'x-qa-key': qaApiKey },
    })
  }

  async seedQaState(scenario) {
    return this.client.request('/api/test/seed', {
      method: 'POST',
      headers: { 'x-qa-key': qaApiKey },
      body: { scenario },
    })
  }

  async getQaState() {
    return this.client.request('/api/test/state', {
      headers: { 'x-qa-key': qaApiKey },
    })
  }

  async listQaScenarios() {
    return this.client.request('/api/test/catalog', {
      headers: { 'x-qa-key': qaApiKey },
    })
  }

  async batchCalculate(items) {
    return this.client.request('/api/test/calculate/batch', {
      method: 'POST',
      headers: { 'x-qa-key': qaApiKey },
      body: { items },
    })
  }

  async listPremiumCatalog() {
    return this.client.request('/api/premium/catalog')
  }

  async createPremiumCheckout(payload) {
    return this.client.request('/api/premium/checkout', {
      method: 'POST',
      body: payload,
    })
  }

  async confirmMockNetopiaPayment(orderId, cardToken = '4111111111111111') {
    return this.client.request('/api/premium/payment/mock-netopia/charge', {
      method: 'POST',
      body: { orderId, cardToken },
    })
  }

  async getPremiumOrder(orderId) {
    return this.client.request(`/api/premium/orders/${orderId}`)
  }
}

export default new BakeryApi()
