import LoginPage from '../pages/login.page.js'
import PremiumPage from '../pages/premium.page.js'

const loginPage = new LoginPage()
const premiumPage = new PremiumPage()

describe('Premium commerce (web)', () => {
  beforeEach(async () => {
    await browser.url('/')
    await browser.deleteCookies()
    await browser.execute(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  it('completes checkout and confirms mock payment', async () => {
    await loginPage.openLogin()
    await loginPage.login('qa.user@vatra.test', 'bread123')

    await browser.waitUntil(async () => (await browser.getUrl()).includes('/account'), {
      timeout: 10000,
      timeoutMsg: 'Expected to be redirected to /account after login',
    })

    await premiumPage.openPremium()
    await premiumPage.waitForPageReady()

    await premiumPage.addFirstCourseToCart()
    await expect(premiumPage.firstCourseQuantity).toHaveText('1')
    await expect(premiumPage.checkoutTotal).toHaveText(expect.stringContaining('349'))

    await premiumPage.fillCustomer({
      name: 'QA Customer',
      email: 'qa.customer@vatra.test',
      phone: '0712345678',
    })

    await premiumPage.submitCheckout()
    await premiumPage.orderResult.waitForDisplayed({ timeout: 10000 })
    await expect(premiumPage.orderResult).toBeDisplayed()

    await premiumPage.confirmMockPayment()
    await premiumPage.paymentMessage.waitForDisplayed({ timeout: 10000 })
    await expect(premiumPage.paymentMessage).toBeDisplayed()
  })
})