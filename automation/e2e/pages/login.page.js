import BasePage from './base.page.js'

export default class LoginPage extends BasePage {
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

  async openLogin() {
    await this.open('/login')
  }

  async login(email, password) {
    await this.waitUntilVisible(this.emailInput)
    await this.typeValue(this.emailInput, email)
    await this.typeValue(this.passwordInput, password)
    await this.click(this.submitButton)
  }
}
