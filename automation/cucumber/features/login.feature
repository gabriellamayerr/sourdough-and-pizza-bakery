Feature: Login
  As a bakery user
  I want to login into my account
  So that I can access protected sections

  Scenario: Login with valid credentials
    Given I am on the login page
    When I login with valid credentials
    Then I should be redirected to the account page

  Scenario: Login with invalid email
    Given I am on the login page
    When I login with invalid email credentials
    Then I should see a login error message

  Scenario: Login with short password
    Given I am on the login page
    When I login with short password credentials
    Then I should see a login error message

  Scenario: Authenticated user opens login page
    Given I am logged in as a valid user
    When I open the login page
    Then I should be redirected to the account page
