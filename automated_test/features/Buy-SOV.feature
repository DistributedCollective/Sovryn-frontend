Feature: Buy SOV

    Background: As a user, I setup the metamask plugin
        Given User setup the metamask plugin

    Scenario Outline: As a connected user I should be able to buy SOV
        When I navigate to the trade page
        And I navigate to the buy SOV page
        When I click the buy Sov button
        When User enter the rBTC amount "<amount>"
        When I click the buy Sov button to make finalised transactions
        And I confirm transaction on metamask button
        Then I should see a success message
        Examples:
            | amount   |
            | 0.000001 |