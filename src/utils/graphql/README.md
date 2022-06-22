# GraphQL Usage

## Updating schemas

1. run `yarn generate:graphql:fetch:testnet` or `yarn generate:graphql:fetch:mainnet`
2. run `yarn generate:graphql`

## Adding queries

1. Find or create a file in `./subgraph/operations/` with the topic as filename, and `.graphql` as extension. Whatever name is defined here will be used as the basis for any generated hooks, so choose wisely! e.g. `getBorrowHistory.graphql` will generate a hook with name `useGetBorrowHistory()`.
2. Write your qraphql query/subscription/mutation
   1. make sure to include all required query variables - see https://graphql.org/learn/queries/#variables for reference
   2. make sure to split any entity fields out into a separate fragment which will be used to type returned data - e.g:

```gql
fragment BorrowFields on Borrow {
  loanId {
    id
  }
  loanToken
  collateralToken
  newPrincipal
  newCollateral
  interestRate
  interestDuration
  collateralToLoanRate
  timestamp
  transaction {
    id
  }
}
```

3. run `yarn generate:graphql` or `yarn generate:graphql --watch` to watch files for further changes.

## Using generated hooks

As described in generated docs from graphql-codegen tool, using the example hook `useGetBorrowHistory()`:

- To run a query within a React component, call `useGetBorrowHistoryQuery` and pass it any options that fit your needs. supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
- When your component renders, `useGetBorrowHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties you can use to render your UI.

```javascript
const { data, loading, error } = useGetBorrowHistoryQuery({
  variables: {
    user: '0x0000000000000000000000000000',
  },
});
```

- Custom data types from the entities in Graph schema will be exported and applied automatically to the returned data from this hook call.

# Examples

For more info see live example here: https://www.graphql-code-generator.com/ (Choose "React-Apollo Hooks" from Live Example list)
