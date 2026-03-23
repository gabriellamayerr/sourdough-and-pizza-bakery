import {
  calculatorExpected,
  calculatorMobileExpected,
  calculatorMobileInput,
} from '../data/calculator.data.js'
import calculatorMobilePage from '../pages/mobile/calculator.mobile.page.js'

describe('Bakery calculator (mobile - Appium)', () => {
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
})
