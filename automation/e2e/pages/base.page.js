export default class BasePage {
  async open(pathname) {
    await browser.url(pathname)
  }

  async waitUntilVisible(element, timeout = 10000) {
    await element.waitForDisplayed({ timeout })
  }

  async typeValue(element, value) {
    await element.setValue(value)
  }

  async click(element) {
    await element.click()
  }
}
