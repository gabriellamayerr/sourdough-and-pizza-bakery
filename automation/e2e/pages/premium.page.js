import BasePage from './base.page.js'

export default class PremiumPage extends BasePage {
  get premiumPage() {
    return $('[data-testid="premium-page"]')
  }

  get firstCourseAddButton() {
    return $('[data-testid="premium-add-course-sourdough-essentials"]')
  }

  get firstCourseQuantity() {
    return $('[data-testid="checkout-qty-course-sourdough-essentials"]')
  }

  get customerNameInput() {
    return $('[data-testid="checkout-customer-name"]')
  }

  get customerEmailInput() {
    return $('[data-testid="checkout-customer-email"]')
  }

  get customerPhoneInput() {
    return $('[data-testid="checkout-customer-phone"]')
  }

  get checkoutTotal() {
    return $('[data-testid="checkout-total"]')
  }

  get checkoutSubmitButton() {
    return $('[data-testid="checkout-submit"]')
  }

  get orderResult() {
    return $('[data-testid="checkout-order-result"]')
  }

  get mockPayButton() {
    return $('[data-testid="checkout-mock-pay"]')
  }

  get paymentMessage() {
    return $('[data-testid="checkout-payment-message"]')
  }

  async openPremium() {
    await this.open('/premium')
  }

  async waitForPageReady() {
    await this.waitUntilVisible(this.premiumPage)
  }

  async addFirstCourseToCart() {
    await this.click(this.firstCourseAddButton)
  }

  async fillCustomer(customer) {
    await this.typeValue(this.customerNameInput, customer.name)
    await this.typeValue(this.customerEmailInput, customer.email)
    await this.typeValue(this.customerPhoneInput, customer.phone)
  }

  async submitCheckout() {
    await this.click(this.checkoutSubmitButton)
  }

  async confirmMockPayment() {
    await this.click(this.mockPayButton)
  }
}
