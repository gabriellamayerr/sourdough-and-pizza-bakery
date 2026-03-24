const testData = {
  login: {
    validEmail: 'qa.user@vatra.test',
    validPassword: 'bread123',
    invalidEmail: 'invalid-email',
    invalidPassword: '123456',
    shortPassword: '123',
  },
  calculator: {
    flour: '1000',
    hydration: '72',
    starter: '20',
    salt: '2',
    expectedApiTotal: '1940.0',
  },
}

module.exports = { testData }
