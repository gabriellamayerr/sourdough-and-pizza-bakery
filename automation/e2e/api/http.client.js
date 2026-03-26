export class HttpClient {
  constructor({ baseUrl, defaultHeaders = {} }) {
    this.baseUrl = baseUrl
    this.defaultHeaders = defaultHeaders
  }

  async request(path, { method = 'GET', headers = {}, body } = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const contentType = response.headers.get('content-type') || ''
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text()

    return {
      ok: response.ok,
      status: response.status,
      payload,
    }
  }
}
