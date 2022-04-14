# GraphQL Usage

## updating schemas

1. run `yarn generate:graphql:fetch:testnet` or `yarn generate:graphql:fetch:mainnet`
2. run `yarn generate:graphql`

## adding queries

1. Find or create a file in ./[subgraph]/operations/ with the topic as filename with .graphql as extension.
2. Write your qraphql query/subscription/mutation
   a. make sure to include all required query variables. https://graphql.org/learn/queries/#variables
3. run `yarn generate:graphql` or `yarn generate:graphql --watch`
