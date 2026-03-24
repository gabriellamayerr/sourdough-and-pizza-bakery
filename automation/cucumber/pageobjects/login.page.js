class LoginPage {
  get emailInput() {
    return $('[data-testid="login-email-input"]')
  }

  get passwordInput() {
    return $('[data-testid="login-password-input"]')
  }

  get submitButton() {
    return $('[data-testid="login-submit"]')
  }

  get errorAlert() {
    return $('[data-testid="login-error"]')
  }

  async open() {
    await browser.url('/login')
  }

  async login(email, password) {
    await this.emailInput.waitForDisplayed({ timeout: 10000 })
    await this.emailInput.clearValue()
    await this.passwordInput.clearValue()
    await this.emailInput.setValue(email)
    await this.passwordInput.setValue(password)
    await this.submitButton.click()
  }
}

module.exports = new LoginPage()
