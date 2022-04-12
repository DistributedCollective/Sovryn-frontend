# GraphQL Usage

## adding queries

1. Create a file in ./[subgraph]/operations/ with the topic it's for as filename with .graphql as extension.
2. Write your qraphql query/subscription/mutation
   a. make sure to include all required query variables. https://graphql.org/learn/queries/#variables
3. run `yarn generate:graphql` or `yarn generate:graphql --watch`

## updating the schema

1. run `yarn fetch:graphql`
2. run `yarn generate:graphql`
