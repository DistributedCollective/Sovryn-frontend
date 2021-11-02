Feature: Spot feature

  Background:
    Given User setup the metamask plugin


  Scenario: As a user I should be able to make a SPOT trade
    When I navigate to the trade page
    When I navigate to the Spot page
    And I select the BUY button
    And I select Pairs from the available dropdown
      | desiredPairs | amount   |
      | SOV - XUSD   | 0.000001 |
    When I click the Place Buy button
    When I click the confirm button
    Then I should see a spot success message
    And I select Pairs from the available dropdown
      | desiredPairs | amount   |
      | SOV - XUSD   | 0.000001 |
    When I click the Place Buy button
    When I click the confirm button
    Then I should see a spot success message
    And I select Pairs from the available dropdown
      | desiredPairs | amount   |
      | SOV - RUSDT  | 0.000001 |
    When I click the Place Buy button
    When I click the confirm button
    Then I should see a spot success message
    And I select Pairs from the available dropdown
      | desiredPairs | amount   |
      | SOV - DOC    | 0.000001 |
    When I click the Place Buy button
    When I click the confirm button
    Then I should see a spot success message
    And I select Pairs from the available dropdown
      | desiredPairs | amount   |
      | SOV - BPRO   | 0.000001 |
    When I click the Place Buy button
    When I click the confirm button
    Then I should see a spot success message
    And I select Pairs from the available dropdown
      | desiredPairs | amount   |
      | SOV - ETHs   | 0.000001 |
    When I click the Place Buy button
    When I click the confirm button
    Then I should see a spot success message
    And I select Pairs from the available dropdown
      | desiredPairs | amount   |
      | SOV - MOC    | 0.000001 |
    When I click the Place Buy button
    When I click the confirm button
    Then I should see a spot success message
