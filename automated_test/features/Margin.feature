Feature: Margin Trade

  Background: As a user, I setup the metamask plugin
    Given User setup the metamask plugin

  Scenario: As a connected user I should be able to Make a Margin Trade/Long
    When I navigate to the trade page
    And I navigate to the Margin trade page
    When I select selectRbtcXusd and amount
      | pair      | amount   |
      | RBTC-XUSD | 0.000001 |
    When I click on the Long button
    And I click the review transaction confirm button
    When I click the confirm button
    Then I should see a success message
    When I select selectRbtcDoc and amount
      | pair      | amount   |
      | RBTC-DOC | 0.000001 |
    When I click on the Long button
    And I click the review transaction confirm button
    When I click the confirm button
    Then I should see a success message
    When I select selectBproXusd and amount
      | pair      | amount   |
      | BPRO-XUSD | 0.00000001 |
    When I click on the Long button
    And I click the review transaction confirm button
    When I click the confirm button
    Then I should see a success message
    When I select selectBproDoc and amount
      | pair      | amount   |
      | BPRO-DOC | 0.00000001 |
    When I click on the Long button
    And I click the review transaction confirm button
    When I click the confirm button
    Then I should see a success message


  Scenario: As a connected user I should be able to Make a Margin Trade/Short
    When I navigate to the trade page
    And I navigate to the Margin trade page
    When I select selectRbtcXusd and amount
      | pair      | amount   |
      | RBTC-XUSD | 0.00000001 |
    When I click on the Short button
    And I click the review transaction confirm button
    When I click the confirm button
    Then I should see a success message
    When I select selectRbtcDoc and amount
      | pair      | amount   |
      | RBTC-DOC | 0.00000001 |
    When I click on the Short button
    And I click the review transaction confirm button
    When I click the confirm button
    Then I should see a success message
    When I select selectBproXusd and amount
      | pair      | amount   |
      | BPRO-XUSD | 0.0000000001 |
    When I click on the Short button
    And I click the review transaction confirm button
    When I click the confirm button
    Then I should see a success message
    When I select selectBproDoc and amount
      | pair      | amount   |
      | BPRO-DOC | 0.0000000001 |
    When I click on the Short button
    And I click the review transaction confirm button
    When I click the confirm button
    Then I should see a success message