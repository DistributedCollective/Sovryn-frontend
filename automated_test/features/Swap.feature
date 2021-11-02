Feature:Swap Test

  Background:Swap Trading Test
    Given User setup the metamask plugin

  Scenario: As a user I should be able to make a successful SWAP
    When I navigate to the trade page
    When I navigate to the swap page
    And I select my desired pair and enter amount
      | sendPair | receiveedPair | amount   |
      | SOV      | RBTC           | 0.000001 |
    When I click the SWAP button
    When I click the confirm button
    Then I should see a success message
    And I select my desired pair and enter amount
      | sendPair | receiveedPair | amount   |
      |   RBTC   |      SOV      | 0.000001 |
    When I click the SWAP button
    When I click the confirm button
    Then I should see a success message