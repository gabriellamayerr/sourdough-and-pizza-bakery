const { Given, Then, When } = require('@wdio/cucumber-framework')
const calculatorPage = require('../pageobjects/calculator.page.js')
const { testData } = require('../utils/data.js')

Given('I am on the calculator page', async () => {
  await calculatorPage.open()
})

When('I enter a valid calculator formula', async () => {
  await calculatorPage.enterFormula(testData.calculator)
})

When('I trigger API calculation', async () => {
  await calculatorPage.requestApiCalculation()
})

Then('I should see the API total dough result', async () => {
  await calculatorPage.apiResult.waitForDisplayed({ timeout: 10000 })
  await expect(calculatorPage.apiResult).toHaveText(
    new RegExp(testData.calculator.expectedApiTotal.replace('.', '\\.')),
  )
})
