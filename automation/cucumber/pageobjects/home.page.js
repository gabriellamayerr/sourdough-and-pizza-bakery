class HomePage {
  async open(path = '/') {
    await browser.url(path)
  }
}

module.exports = new HomePage()
