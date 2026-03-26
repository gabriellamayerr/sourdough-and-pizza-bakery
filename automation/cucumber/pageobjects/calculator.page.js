class CalculatorPage {
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

  get calculateApiButton() {
    return $('[data-testid="calculate-api"]')
  }

  get apiResult() {
    return $('[data-testid="api-result"]')
  }

  async open() {
    await browser.url('/calculator')
  }

  async enterFormula({ flour, hydration, starter, salt }) {
    await this.flourInput.waitForDisplayed({ timeout: 10000 })
    await this.flourInput.clearValue()
    await this.hydrationInput.clearValue()
    await this.starterInput.clearValue()
    await this.saltInput.clearValue()
    await this.flourInput.setValue(flour)
    await this.hydrationInput.setValue(hydration)
    await this.starterInput.setValue(starter)
    await this.saltInput.setValue(salt)
  }

  async requestApiCalculation() {
    await this.calculateApiButton.click()
  }
}

module.exports = new CalculatorPage()
