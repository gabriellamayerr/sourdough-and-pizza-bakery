const isMobile = process.env.TEST_PLATFORM === 'mobile'

export const config = {
  runner: 'local',
  specs: ['./automation/cucumber/features/**/*.feature'],
  maxInstances: 1,
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  framework: 'cucumber',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
  cucumberOpts: {
    require: [
      './automation/cucumber/step-definitions/login.steps.js',
      './automation/cucumber/step-definitions/calculator.steps.js',
    ],
    import: [],
    timeout: 90000,
    backtrace: false,
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: false,
    tagExpression: '',
    ignoreUndefinedDefinitions: false,
  },
  baseUrl: isMobile ? 'http://10.0.2.2:5173' : 'http://localhost:5173',
  services: isMobile ? ['appium'] : [],
  capabilities: isMobile
    ? [
        {
          platformName: 'Android',
          'appium:automationName': 'UiAutomator2',
          'appium:deviceName': process.env.APPIUM_DEVICE_NAME || 'Android Emulator',
          'appium:platformVersion': process.env.APPIUM_PLATFORM_VERSION || '14',
          'appium:browserName': 'Chrome',
          'appium:chromedriverAutodownload': true,
        },
      ]
    : [
        {
          browserName: 'chrome',
          acceptInsecureCerts: true,
          'goog:chromeOptions': {
            args: [
              '--window-size=1280,900',
              '--headless=new',
              '--disable-gpu',
              '--no-sandbox',
              '--disable-dev-shm-usage',
            ],
          },
        },
      ],
}
