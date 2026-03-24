const { Before, Given, Then, When } = require('@wdio/cucumber-framework')
const loginPage = require('../pageobjects/login.page.js')
const { testData } = require('../utils/data.js')

Before(async () => {
  await browser.url('/')
  await browser.deleteCookies()
  await browser.execute(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })
})

Given('I am on the login page', async () => {
  await loginPage.open()
})

When('I login with valid credentials', async () => {
  await loginPage.login(testData.login.validEmail, testData.login.validPassword)
})

When('I login with invalid email credentials', async () => {
  await loginPage.login(testData.login.invalidEmail, testData.login.invalidPassword)
})

When('I login with short password credentials', async () => {
  await loginPage.login(testData.login.validEmail, testData.login.shortPassword)
})

Given('I am logged in as a valid user', async () => {
  await loginPage.open()
  await loginPage.login(testData.login.validEmail, testData.login.validPassword)
  await browser.waitUntil(async () => (await browser.getUrl()).includes('/account'), {
    timeout: 10000,
    timeoutMsg: 'Expected to be redirected to /account after login',
  })
})

When('I open the login page', async () => {
  await loginPage.open()
})

Then('I should be redirected to the account page', async () => {
  await browser.waitUntil(async () => (await browser.getUrl()).includes('/account'), {
    timeout: 10000,
    timeoutMsg: 'Expected to be redirected to /account after login',
  })
})

Then('I should see a login error message', async () => {
  await loginPage.errorAlert.waitForDisplayed({ timeout: 10000 })
  await expect(loginPage.errorAlert).toBeDisplayed()
})
