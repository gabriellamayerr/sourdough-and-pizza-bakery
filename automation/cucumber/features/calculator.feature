Feature: Dough calculator
  As a bakery operator
  I want to calculate dough formula values
  So that I can validate totals through the API

  Scenario: Calculate dough with valid values
    Given I am on the calculator page
    When I enter a valid calculator formula
    And I trigger API calculation
    Then I should see the API total dough result
