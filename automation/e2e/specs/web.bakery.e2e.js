import { calculatorExpected, calculatorInput } from '../data/calculator.data.js'
import calculatorWebPage from '../pages/web/calculator.web.page.js'

describe('Bakery calculator (web)', () => {
  it('shows title and calculates values', async () => {
    await calculatorWebPage.openCalculator()
    await calculatorWebPage.waitForPageReady()

    await expect(calculatorWebPage.title).toHaveText(calculatorExpected.title)

    await calculatorWebPage.fillDoughInputs(calculatorInput)
    await expect(calculatorWebPage.totalDoughResult).toHaveText(
      expect.stringContaining(calculatorExpected.totalDough),
    )
  })

  it('validates with backend API', async () => {
    await calculatorWebPage.openCalculator()
    await calculatorWebPage.waitForPageReady()

    await calculatorWebPage.validateWithApi()
    await expect(calculatorWebPage.apiResult).toHaveText(
      expect.stringContaining(calculatorExpected.apiPrefix),
    )
  })
})
