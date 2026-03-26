import {
  calculatorExpected,
  calculatorMobileExpected,
  calculatorMobileInput,
} from '../data/calculator.data.js'
import calculatorMobilePage from '../pages/mobile/calculator.mobile.page.js'
import loginMobilePage from '../pages/mobile/login.mobile.page.js'
import premiumMobilePage from '../pages/mobile/premium.mobile.page.js'

describe('Bakery mobile smoke (Appium)', () => {
  describe('Home page', () => {
    it('loads the home page', async () => {
      await browser.url('/')
      const body = await $('body')
      await body.waitForDisplayed({ timeout: 15000 })
      const title = await browser.getTitle()
      expect(title).toBeTruthy()
    })

    it('displays the hero section', async () => {
      await browser.url('/')
      const heroHeading = await $('h2')
      await heroHeading.waitForDisplayed({ timeout: 15000 })
      await expect(heroHeading).toBeDisplayed()
    })
  })

  describe('Calculator page', () => {
    it('renders calculator on Android Chrome', async () => {
      await calculatorMobilePage.openCalculator()
      await calculatorMobilePage.waitForPageReady()

      await expect(calculatorMobilePage.title).toBeDisplayed()
      await expect(calculatorMobilePage.title).toHaveText(calculatorExpected.title)
    })

    it('updates mobile inputs and recalculates total dough', async () => {
      await calculatorMobilePage.openCalculator()
      await calculatorMobilePage.waitForPageReady()

      await calculatorMobilePage.fillDoughInputs(calculatorMobileInput)

      await expect(calculatorMobilePage.totalDoughResult).toHaveText(
        expect.stringContaining(calculatorMobileExpected.totalDough),
      )
    })

    it('validates calculation with backend API', async () => {
      await calculatorMobilePage.openCalculator()
      await calculatorMobilePage.waitForPageReady()

      await calculatorMobilePage.fillDoughInputs(calculatorMobileInput)
      await calculatorMobilePage.validateWithApi()

      await expect(calculatorMobilePage.apiResult).toHaveText(
        expect.stringContaining(calculatorExpected.apiPrefix),
      )
    })
  })

  describe('Login page', () => {
    beforeEach(async () => {
      await browser.url('/')
      await browser.deleteCookies()
      await browser.execute(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    })

    it('loads the login form', async () => {
      await loginMobilePage.openLogin()
      await loginMobilePage.waitUntilVisible(loginMobilePage.emailInput)

      await expect(loginMobilePage.emailInput).toBeDisplayed()
      await expect(loginMobilePage.passwordInput).toBeDisplayed()
      await expect(loginMobilePage.submitButton).toBeDisplayed()
    })

    it('shows error for invalid email format', async () => {
      await loginMobilePage.openLogin()
      await loginMobilePage.login('invalidemail', 'password123')

      await loginMobilePage.errorAlert.waitForDisplayed({ timeout: 10000 })
      await expect(loginMobilePage.errorAlert).toBeDisplayed()
    })

    it('shows error for short password', async () => {
      await loginMobilePage.openLogin()
      await loginMobilePage.login('test@test.com', 'ab')

      await loginMobilePage.errorAlert.waitForDisplayed({ timeout: 10000 })
      await expect(loginMobilePage.errorAlert).toBeDisplayed()
    })

    it('logs in with valid credentials and redirects to account', async () => {
      await loginMobilePage.openLogin()
      await loginMobilePage.login('qa.user@vatra.test', 'bread123')

      await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/account'),
        { timeout: 15000, timeoutMsg: 'Expected redirect to /account after login' },
      )
    })
  })

  describe('Premium page', () => {
    before(async () => {
      await browser.url('/')
      await browser.deleteCookies()
      await browser.execute(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
      await loginMobilePage.openLogin()
      await loginMobilePage.login('qa.user@vatra.test', 'bread123')
      await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/account'),
        { timeout: 15000 },
      )
    })

    it('loads the premium catalog', async () => {
      await premiumMobilePage.openPremium()
      await premiumMobilePage.waitForPageReady()

      await expect(premiumMobilePage.premiumPage).toBeDisplayed()
    })

    it('adds a course to the cart and shows total', async () => {
      await premiumMobilePage.openPremium()
      await premiumMobilePage.waitForPageReady()

      await premiumMobilePage.addFirstCourseToCart()
      await expect(premiumMobilePage.firstCourseQuantity).toHaveText('1')
      await expect(premiumMobilePage.checkoutTotal).toHaveText(
        expect.stringContaining('349'),
      )
    })

    it('completes checkout and confirms mock payment', async () => {
      await premiumMobilePage.openPremium()
      await premiumMobilePage.waitForPageReady()

      await premiumMobilePage.addFirstCourseToCart()

      await premiumMobilePage.fillCustomer({
        name: 'QA Mobile Customer',
        email: 'qa.mobile@vatra.test',
        phone: '0712345678',
      })

      await premiumMobilePage.submitCheckout()
      await premiumMobilePage.orderResult.waitForDisplayed({ timeout: 10000 })
      await expect(premiumMobilePage.orderResult).toBeDisplayed()

      await premiumMobilePage.confirmMockPayment()
      await premiumMobilePage.paymentMessage.waitForDisplayed({ timeout: 10000 })
      await expect(premiumMobilePage.paymentMessage).toBeDisplayed()
    })
  })

  describe('Navigation', () => {
    it('navigates to About page', async () => {
      await browser.url('/about')
      const heading = await $('h2')
      await heading.waitForDisplayed({ timeout: 15000 })
      await expect(heading).toBeDisplayed()
    })

    it('navigates to Shop page', async () => {
      await browser.url('/shop')
      const heading = await $('h2')
      await heading.waitForDisplayed({ timeout: 15000 })
      await expect(heading).toBeDisplayed()
    })

    it('navigates to Contact page', async () => {
      await browser.url('/contact')
      const heading = await $('h2')
      await heading.waitForDisplayed({ timeout: 15000 })
      await expect(heading).toBeDisplayed()
    })
  })
})
