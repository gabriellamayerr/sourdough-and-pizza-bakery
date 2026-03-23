exports.config = {
  runner: 'local',
  specs: ['./automation/e2e/specs/web*.e2e.js'],
  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
      browserVersion: '145',
      acceptInsecureCerts: true,
      'goog:chromeOptions': {
        args: ['--window-size=1280,900'],
      },
    },
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost:5173',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  framework: 'mocha',
  reporters: ['spec'],
  services: [],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
}
