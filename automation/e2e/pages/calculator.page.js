import BasePage from './base.page.js'

export default class CalculatorPage extends BasePage {
  get title() {
    return $('[data-testid="app-title"]')
  }

  get flourInput() {
    return $('[data-testid="flour-input"]')
  }

  get hydrationInput() {
    return $('[data-testid="hydration-input"]')
  }

  get starterInput() {
    return $('[data-testid="starter-input"]')
  }

  get saltInput() {
    return $('[data-testid="salt-input"]')
  }

  get validateApiButton() {
    return $('[data-testid="calculate-api"]')
  }

  get totalDoughResult() {
    return $('[data-testid="result-totaldoughg"]')
  }

  get apiResult() {
    return $('[data-testid="api-result"]')
  }

  async openCalculator() {
    await this.open('/calculator')
  }

  async waitForPageReady() {
    await this.waitUntilVisible(this.title)
  }

  async fillDoughInputs({ flour, hydration, starter, salt }) {
    await this.typeValue(this.flourInput, flour)
    await this.typeValue(this.hydrationInput, hydration)
    await this.typeValue(this.starterInput, starter)
    await this.typeValue(this.saltInput, salt)
  }

  async validateWithApi() {
    await this.click(this.validateApiButton)
    await this.waitUntilVisible(this.apiResult)
  }

  async getTitleText() {
    return this.title.getText()
  }

  async getTotalDoughText() {
    return this.totalDoughResult.getText()
  }

  async getApiResultText() {
    return this.apiResult.getText()
  }
}
