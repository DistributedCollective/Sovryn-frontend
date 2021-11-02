Feature:  Trade End to End Test

  Background: As a I user I should be able to connect with metamask
    Given User setup the metamask plugin


Scenario Outline: As a user I want to Swap rBTC for SOV
   When I select the trade and Swap tabs
   When User enter the rBTC amount "<amount>"
    # When I click the SWAP button
   # Then I should see the Metamask pop
  #  When I click the confirm button
   # Then I should see a success message
   Examples:
     | amount   |
     | 0.000001 |