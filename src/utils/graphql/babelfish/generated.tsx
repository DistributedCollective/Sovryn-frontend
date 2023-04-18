import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: string;
  BigInt: string;
  Bytes: string;
};

export type BAsset = {
  __typename?: 'BAsset';
  decimals: Scalars['Int'];
  global: Global;
  id: Scalars['ID'];
  name: Scalars['String'];
  paused: Scalars['Boolean'];
  symbol: Scalars['String'];
};

export type BAsset_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  global?: InputMaybe<Scalars['String']>;
  global_?: InputMaybe<Global_Filter>;
  global_contains?: InputMaybe<Scalars['String']>;
  global_contains_nocase?: InputMaybe<Scalars['String']>;
  global_ends_with?: InputMaybe<Scalars['String']>;
  global_ends_with_nocase?: InputMaybe<Scalars['String']>;
  global_gt?: InputMaybe<Scalars['String']>;
  global_gte?: InputMaybe<Scalars['String']>;
  global_in?: InputMaybe<Array<Scalars['String']>>;
  global_lt?: InputMaybe<Scalars['String']>;
  global_lte?: InputMaybe<Scalars['String']>;
  global_not?: InputMaybe<Scalars['String']>;
  global_not_contains?: InputMaybe<Scalars['String']>;
  global_not_contains_nocase?: InputMaybe<Scalars['String']>;
  global_not_ends_with?: InputMaybe<Scalars['String']>;
  global_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  global_not_in?: InputMaybe<Array<Scalars['String']>>;
  global_not_starts_with?: InputMaybe<Scalars['String']>;
  global_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  global_starts_with?: InputMaybe<Scalars['String']>;
  global_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  paused?: InputMaybe<Scalars['Boolean']>;
  paused_in?: InputMaybe<Array<Scalars['Boolean']>>;
  paused_not?: InputMaybe<Scalars['Boolean']>;
  paused_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum BAsset_OrderBy {
  Decimals = 'decimals',
  Global = 'global',
  Id = 'id',
  Name = 'name',
  Paused = 'paused',
  Symbol = 'symbol',
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export enum Event {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
}

export type Global = {
  __typename?: 'Global';
  assets?: Maybe<Array<BAsset>>;
  id: Scalars['ID'];
};

export type GlobalAssetsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BAsset_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<BAsset_Filter>;
};

export type Global_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  assets_?: InputMaybe<BAsset_Filter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum Global_OrderBy {
  Assets = 'assets',
  Id = 'id',
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type Proposal = {
  __typename?: 'Proposal';
  actions: Array<ProposalAction>;
  againstVotesAmount: Scalars['BigInt'];
  contractAddress: Scalars['Bytes'];
  createdAt: Scalars['BigInt'];
  description: Scalars['String'];
  endBlock: Scalars['BigInt'];
  eta?: Maybe<Scalars['BigInt']>;
  forVotesAmount: Scalars['BigInt'];
  id: Scalars['ID'];
  proposalId: Scalars['BigInt'];
  proposer: Scalars['Bytes'];
  startBlock: Scalars['BigInt'];
  startDate: Scalars['BigInt'];
  votes: Array<Vote>;
};

export type ProposalActionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProposalAction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ProposalAction_Filter>;
};

export type ProposalVotesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Vote_Filter>;
};

export type ProposalAction = {
  __typename?: 'ProposalAction';
  calldata: Scalars['Bytes'];
  contract: Scalars['Bytes'];
  id: Scalars['ID'];
  proposal: Proposal;
  signature: Scalars['String'];
};

export type ProposalAction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  calldata?: InputMaybe<Scalars['Bytes']>;
  calldata_contains?: InputMaybe<Scalars['Bytes']>;
  calldata_in?: InputMaybe<Array<Scalars['Bytes']>>;
  calldata_not?: InputMaybe<Scalars['Bytes']>;
  calldata_not_contains?: InputMaybe<Scalars['Bytes']>;
  calldata_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  contract?: InputMaybe<Scalars['Bytes']>;
  contract_contains?: InputMaybe<Scalars['Bytes']>;
  contract_in?: InputMaybe<Array<Scalars['Bytes']>>;
  contract_not?: InputMaybe<Scalars['Bytes']>;
  contract_not_contains?: InputMaybe<Scalars['Bytes']>;
  contract_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  proposal?: InputMaybe<Scalars['String']>;
  proposal_?: InputMaybe<Proposal_Filter>;
  proposal_contains?: InputMaybe<Scalars['String']>;
  proposal_contains_nocase?: InputMaybe<Scalars['String']>;
  proposal_ends_with?: InputMaybe<Scalars['String']>;
  proposal_ends_with_nocase?: InputMaybe<Scalars['String']>;
  proposal_gt?: InputMaybe<Scalars['String']>;
  proposal_gte?: InputMaybe<Scalars['String']>;
  proposal_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_lt?: InputMaybe<Scalars['String']>;
  proposal_lte?: InputMaybe<Scalars['String']>;
  proposal_not?: InputMaybe<Scalars['String']>;
  proposal_not_contains?: InputMaybe<Scalars['String']>;
  proposal_not_contains_nocase?: InputMaybe<Scalars['String']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  proposal_starts_with?: InputMaybe<Scalars['String']>;
  proposal_starts_with_nocase?: InputMaybe<Scalars['String']>;
  signature?: InputMaybe<Scalars['String']>;
  signature_contains?: InputMaybe<Scalars['String']>;
  signature_contains_nocase?: InputMaybe<Scalars['String']>;
  signature_ends_with?: InputMaybe<Scalars['String']>;
  signature_ends_with_nocase?: InputMaybe<Scalars['String']>;
  signature_gt?: InputMaybe<Scalars['String']>;
  signature_gte?: InputMaybe<Scalars['String']>;
  signature_in?: InputMaybe<Array<Scalars['String']>>;
  signature_lt?: InputMaybe<Scalars['String']>;
  signature_lte?: InputMaybe<Scalars['String']>;
  signature_not?: InputMaybe<Scalars['String']>;
  signature_not_contains?: InputMaybe<Scalars['String']>;
  signature_not_contains_nocase?: InputMaybe<Scalars['String']>;
  signature_not_ends_with?: InputMaybe<Scalars['String']>;
  signature_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  signature_not_in?: InputMaybe<Array<Scalars['String']>>;
  signature_not_starts_with?: InputMaybe<Scalars['String']>;
  signature_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  signature_starts_with?: InputMaybe<Scalars['String']>;
  signature_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum ProposalAction_OrderBy {
  Calldata = 'calldata',
  Contract = 'contract',
  Id = 'id',
  Proposal = 'proposal',
  Signature = 'signature',
}

export type Proposal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  actions_?: InputMaybe<ProposalAction_Filter>;
  againstVotesAmount?: InputMaybe<Scalars['BigInt']>;
  againstVotesAmount_gt?: InputMaybe<Scalars['BigInt']>;
  againstVotesAmount_gte?: InputMaybe<Scalars['BigInt']>;
  againstVotesAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  againstVotesAmount_lt?: InputMaybe<Scalars['BigInt']>;
  againstVotesAmount_lte?: InputMaybe<Scalars['BigInt']>;
  againstVotesAmount_not?: InputMaybe<Scalars['BigInt']>;
  againstVotesAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  contractAddress?: InputMaybe<Scalars['Bytes']>;
  contractAddress_contains?: InputMaybe<Scalars['Bytes']>;
  contractAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  contractAddress_not?: InputMaybe<Scalars['Bytes']>;
  contractAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  contractAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  createdAt?: InputMaybe<Scalars['BigInt']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_contains_nocase?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']>;
  endBlock?: InputMaybe<Scalars['BigInt']>;
  endBlock_gt?: InputMaybe<Scalars['BigInt']>;
  endBlock_gte?: InputMaybe<Scalars['BigInt']>;
  endBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  endBlock_lt?: InputMaybe<Scalars['BigInt']>;
  endBlock_lte?: InputMaybe<Scalars['BigInt']>;
  endBlock_not?: InputMaybe<Scalars['BigInt']>;
  endBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eta?: InputMaybe<Scalars['BigInt']>;
  eta_gt?: InputMaybe<Scalars['BigInt']>;
  eta_gte?: InputMaybe<Scalars['BigInt']>;
  eta_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eta_lt?: InputMaybe<Scalars['BigInt']>;
  eta_lte?: InputMaybe<Scalars['BigInt']>;
  eta_not?: InputMaybe<Scalars['BigInt']>;
  eta_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  forVotesAmount?: InputMaybe<Scalars['BigInt']>;
  forVotesAmount_gt?: InputMaybe<Scalars['BigInt']>;
  forVotesAmount_gte?: InputMaybe<Scalars['BigInt']>;
  forVotesAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  forVotesAmount_lt?: InputMaybe<Scalars['BigInt']>;
  forVotesAmount_lte?: InputMaybe<Scalars['BigInt']>;
  forVotesAmount_not?: InputMaybe<Scalars['BigInt']>;
  forVotesAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  proposalId?: InputMaybe<Scalars['BigInt']>;
  proposalId_gt?: InputMaybe<Scalars['BigInt']>;
  proposalId_gte?: InputMaybe<Scalars['BigInt']>;
  proposalId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  proposalId_lt?: InputMaybe<Scalars['BigInt']>;
  proposalId_lte?: InputMaybe<Scalars['BigInt']>;
  proposalId_not?: InputMaybe<Scalars['BigInt']>;
  proposalId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  proposer?: InputMaybe<Scalars['Bytes']>;
  proposer_contains?: InputMaybe<Scalars['Bytes']>;
  proposer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  proposer_not?: InputMaybe<Scalars['Bytes']>;
  proposer_not_contains?: InputMaybe<Scalars['Bytes']>;
  proposer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  startBlock?: InputMaybe<Scalars['BigInt']>;
  startBlock_gt?: InputMaybe<Scalars['BigInt']>;
  startBlock_gte?: InputMaybe<Scalars['BigInt']>;
  startBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startBlock_lt?: InputMaybe<Scalars['BigInt']>;
  startBlock_lte?: InputMaybe<Scalars['BigInt']>;
  startBlock_not?: InputMaybe<Scalars['BigInt']>;
  startBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startDate?: InputMaybe<Scalars['BigInt']>;
  startDate_gt?: InputMaybe<Scalars['BigInt']>;
  startDate_gte?: InputMaybe<Scalars['BigInt']>;
  startDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startDate_lt?: InputMaybe<Scalars['BigInt']>;
  startDate_lte?: InputMaybe<Scalars['BigInt']>;
  startDate_not?: InputMaybe<Scalars['BigInt']>;
  startDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  votes_?: InputMaybe<Vote_Filter>;
};

export enum Proposal_OrderBy {
  Actions = 'actions',
  AgainstVotesAmount = 'againstVotesAmount',
  ContractAddress = 'contractAddress',
  CreatedAt = 'createdAt',
  Description = 'description',
  EndBlock = 'endBlock',
  Eta = 'eta',
  ForVotesAmount = 'forVotesAmount',
  Id = 'id',
  ProposalId = 'proposalId',
  Proposer = 'proposer',
  StartBlock = 'startBlock',
  StartDate = 'startDate',
  Votes = 'votes',
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  basset?: Maybe<BAsset>;
  bassets: Array<BAsset>;
  global?: Maybe<Global>;
  globals: Array<Global>;
  proposal?: Maybe<Proposal>;
  proposalAction?: Maybe<ProposalAction>;
  proposalActions: Array<ProposalAction>;
  proposals: Array<Proposal>;
  stakeEvent?: Maybe<StakeEvent>;
  stakeEvents: Array<StakeEvent>;
  user?: Maybe<User>;
  users: Array<User>;
  vestingContract?: Maybe<VestingContract>;
  vestingContracts: Array<VestingContract>;
  vote?: Maybe<Vote>;
  votes: Array<Vote>;
  xusdTransaction?: Maybe<XusdTransaction>;
  xusdTransactions: Array<XusdTransaction>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryBassetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBassetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BAsset_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BAsset_Filter>;
};

export type QueryGlobalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryGlobalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Global_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Global_Filter>;
};

export type QueryProposalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProposalActionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProposalActionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProposalAction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProposalAction_Filter>;
};

export type QueryProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Proposal_Filter>;
};

export type QueryStakeEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryStakeEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakeEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakeEvent_Filter>;
};

export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type QueryVestingContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVestingContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VestingContract_Filter>;
};

export type QueryVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vote_Filter>;
};

export type QueryXusdTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryXusdTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<XusdTransaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<XusdTransaction_Filter>;
};

export type StakeEvent = {
  __typename?: 'StakeEvent';
  amount: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  lockedUntil: Scalars['BigInt'];
  staker: Scalars['Bytes'];
  totalStaked: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type StakeEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lockedUntil?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_gt?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_gte?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lockedUntil_lt?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_lte?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_not?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  staker?: InputMaybe<Scalars['Bytes']>;
  staker_contains?: InputMaybe<Scalars['Bytes']>;
  staker_in?: InputMaybe<Array<Scalars['Bytes']>>;
  staker_not?: InputMaybe<Scalars['Bytes']>;
  staker_not_contains?: InputMaybe<Scalars['Bytes']>;
  staker_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  totalStaked?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_lte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum StakeEvent_OrderBy {
  Amount = 'amount',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  LockedUntil = 'lockedUntil',
  Staker = 'staker',
  TotalStaked = 'totalStaked',
  TransactionHash = 'transactionHash',
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  basset?: Maybe<BAsset>;
  bassets: Array<BAsset>;
  global?: Maybe<Global>;
  globals: Array<Global>;
  proposal?: Maybe<Proposal>;
  proposalAction?: Maybe<ProposalAction>;
  proposalActions: Array<ProposalAction>;
  proposals: Array<Proposal>;
  stakeEvent?: Maybe<StakeEvent>;
  stakeEvents: Array<StakeEvent>;
  user?: Maybe<User>;
  users: Array<User>;
  vestingContract?: Maybe<VestingContract>;
  vestingContracts: Array<VestingContract>;
  vote?: Maybe<Vote>;
  votes: Array<Vote>;
  xusdTransaction?: Maybe<XusdTransaction>;
  xusdTransactions: Array<XusdTransaction>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionBassetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBassetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BAsset_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BAsset_Filter>;
};

export type SubscriptionGlobalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionGlobalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Global_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Global_Filter>;
};

export type SubscriptionProposalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProposalActionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProposalActionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProposalAction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProposalAction_Filter>;
};

export type SubscriptionProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Proposal_Filter>;
};

export type SubscriptionStakeEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionStakeEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakeEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakeEvent_Filter>;
};

export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type SubscriptionVestingContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVestingContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VestingContract_Filter>;
};

export type SubscriptionVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vote_Filter>;
};

export type SubscriptionXusdTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionXusdTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<XusdTransaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<XusdTransaction_Filter>;
};

export type User = {
  __typename?: 'User';
  address: Scalars['Bytes'];
  allStakes: Array<StakeEvent>;
  id: Scalars['ID'];
  stakes: Array<StakeEvent>;
  vests: Array<VestingContract>;
};

export type UserAllStakesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakeEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<StakeEvent_Filter>;
};

export type UserStakesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakeEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<StakeEvent_Filter>;
};

export type UserVestsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<VestingContract_Filter>;
};

export type User_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  allStakes?: InputMaybe<Array<Scalars['String']>>;
  allStakes_?: InputMaybe<StakeEvent_Filter>;
  allStakes_contains?: InputMaybe<Array<Scalars['String']>>;
  allStakes_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  allStakes_not?: InputMaybe<Array<Scalars['String']>>;
  allStakes_not_contains?: InputMaybe<Array<Scalars['String']>>;
  allStakes_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  stakes?: InputMaybe<Array<Scalars['String']>>;
  stakes_?: InputMaybe<StakeEvent_Filter>;
  stakes_contains?: InputMaybe<Array<Scalars['String']>>;
  stakes_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  stakes_not?: InputMaybe<Array<Scalars['String']>>;
  stakes_not_contains?: InputMaybe<Array<Scalars['String']>>;
  stakes_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  vests?: InputMaybe<Array<Scalars['String']>>;
  vests_?: InputMaybe<VestingContract_Filter>;
  vests_contains?: InputMaybe<Array<Scalars['String']>>;
  vests_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  vests_not?: InputMaybe<Array<Scalars['String']>>;
  vests_not_contains?: InputMaybe<Array<Scalars['String']>>;
  vests_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
};

export enum User_OrderBy {
  Address = 'address',
  AllStakes = 'allStakes',
  Id = 'id',
  Stakes = 'stakes',
  Vests = 'vests',
}

export type VestingContract = {
  __typename?: 'VestingContract';
  address: Scalars['Bytes'];
  id: Scalars['ID'];
  owner: Scalars['Bytes'];
  stakes: Array<StakeEvent>;
  type: Scalars['String'];
};

export type VestingContractStakesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakeEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<StakeEvent_Filter>;
};

export type VestingContract_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  stakes?: InputMaybe<Array<Scalars['String']>>;
  stakes_?: InputMaybe<StakeEvent_Filter>;
  stakes_contains?: InputMaybe<Array<Scalars['String']>>;
  stakes_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  stakes_not?: InputMaybe<Array<Scalars['String']>>;
  stakes_not_contains?: InputMaybe<Array<Scalars['String']>>;
  stakes_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  type?: InputMaybe<Scalars['String']>;
  type_contains?: InputMaybe<Scalars['String']>;
  type_contains_nocase?: InputMaybe<Scalars['String']>;
  type_ends_with?: InputMaybe<Scalars['String']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']>;
  type_gt?: InputMaybe<Scalars['String']>;
  type_gte?: InputMaybe<Scalars['String']>;
  type_in?: InputMaybe<Array<Scalars['String']>>;
  type_lt?: InputMaybe<Scalars['String']>;
  type_lte?: InputMaybe<Scalars['String']>;
  type_not?: InputMaybe<Scalars['String']>;
  type_not_contains?: InputMaybe<Scalars['String']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']>;
  type_not_ends_with?: InputMaybe<Scalars['String']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  type_not_in?: InputMaybe<Array<Scalars['String']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type_starts_with?: InputMaybe<Scalars['String']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum VestingContract_OrderBy {
  Address = 'address',
  Id = 'id',
  Owner = 'owner',
  Stakes = 'stakes',
  Type = 'type',
}

export type Vote = {
  __typename?: 'Vote';
  id: Scalars['ID'];
  isPro: Scalars['Boolean'];
  proposal: Proposal;
  txHash: Scalars['Bytes'];
  voter: Scalars['Bytes'];
  votes: Scalars['BigInt'];
};

export type Vote_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isPro?: InputMaybe<Scalars['Boolean']>;
  isPro_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isPro_not?: InputMaybe<Scalars['Boolean']>;
  isPro_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  proposal?: InputMaybe<Scalars['String']>;
  proposal_?: InputMaybe<Proposal_Filter>;
  proposal_contains?: InputMaybe<Scalars['String']>;
  proposal_contains_nocase?: InputMaybe<Scalars['String']>;
  proposal_ends_with?: InputMaybe<Scalars['String']>;
  proposal_ends_with_nocase?: InputMaybe<Scalars['String']>;
  proposal_gt?: InputMaybe<Scalars['String']>;
  proposal_gte?: InputMaybe<Scalars['String']>;
  proposal_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_lt?: InputMaybe<Scalars['String']>;
  proposal_lte?: InputMaybe<Scalars['String']>;
  proposal_not?: InputMaybe<Scalars['String']>;
  proposal_not_contains?: InputMaybe<Scalars['String']>;
  proposal_not_contains_nocase?: InputMaybe<Scalars['String']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  proposal_starts_with?: InputMaybe<Scalars['String']>;
  proposal_starts_with_nocase?: InputMaybe<Scalars['String']>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  voter?: InputMaybe<Scalars['Bytes']>;
  voter_contains?: InputMaybe<Scalars['Bytes']>;
  voter_in?: InputMaybe<Array<Scalars['Bytes']>>;
  voter_not?: InputMaybe<Scalars['Bytes']>;
  voter_not_contains?: InputMaybe<Scalars['Bytes']>;
  voter_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  votes?: InputMaybe<Scalars['BigInt']>;
  votes_gt?: InputMaybe<Scalars['BigInt']>;
  votes_gte?: InputMaybe<Scalars['BigInt']>;
  votes_in?: InputMaybe<Array<Scalars['BigInt']>>;
  votes_lt?: InputMaybe<Scalars['BigInt']>;
  votes_lte?: InputMaybe<Scalars['BigInt']>;
  votes_not?: InputMaybe<Scalars['BigInt']>;
  votes_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Vote_OrderBy {
  Id = 'id',
  IsPro = 'isPro',
  Proposal = 'proposal',
  TxHash = 'txHash',
  Voter = 'voter',
  Votes = 'votes',
}

export type XusdTransaction = {
  __typename?: 'XusdTransaction';
  amount: Scalars['BigInt'];
  asset: Scalars['String'];
  date: Scalars['BigInt'];
  event: Event;
  id: Scalars['ID'];
  receiver: Scalars['Bytes'];
  txHash: Scalars['Bytes'];
  user: Scalars['Bytes'];
};

export type XusdTransaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  asset?: InputMaybe<Scalars['String']>;
  asset_contains?: InputMaybe<Scalars['String']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_ends_with?: InputMaybe<Scalars['String']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_gt?: InputMaybe<Scalars['String']>;
  asset_gte?: InputMaybe<Scalars['String']>;
  asset_in?: InputMaybe<Array<Scalars['String']>>;
  asset_lt?: InputMaybe<Scalars['String']>;
  asset_lte?: InputMaybe<Scalars['String']>;
  asset_not?: InputMaybe<Scalars['String']>;
  asset_not_contains?: InputMaybe<Scalars['String']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  asset_starts_with?: InputMaybe<Scalars['String']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['BigInt']>;
  date_gt?: InputMaybe<Scalars['BigInt']>;
  date_gte?: InputMaybe<Scalars['BigInt']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']>>;
  date_lt?: InputMaybe<Scalars['BigInt']>;
  date_lte?: InputMaybe<Scalars['BigInt']>;
  date_not?: InputMaybe<Scalars['BigInt']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  event?: InputMaybe<Event>;
  event_in?: InputMaybe<Array<Event>>;
  event_not?: InputMaybe<Event>;
  event_not_in?: InputMaybe<Array<Event>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  receiver?: InputMaybe<Scalars['Bytes']>;
  receiver_contains?: InputMaybe<Scalars['Bytes']>;
  receiver_in?: InputMaybe<Array<Scalars['Bytes']>>;
  receiver_not?: InputMaybe<Scalars['Bytes']>;
  receiver_not_contains?: InputMaybe<Scalars['Bytes']>;
  receiver_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum XusdTransaction_OrderBy {
  Amount = 'amount',
  Asset = 'asset',
  Date = 'date',
  Event = 'event',
  Id = 'id',
  Receiver = 'receiver',
  TxHash = 'txHash',
  User = 'user',
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny',
}

export type GetPausedBassetListQueryVariables = Exact<{ [key: string]: never }>;

export type GetPausedBassetListQuery = {
  __typename?: 'Query';
  bassets: Array<{ __typename?: 'BAsset'; id: string; symbol: string }>;
};

export const GetPausedBassetListDocument = gql`
  query getPausedBassetList {
    bassets(where: { paused: true }) {
      id
      symbol
    }
  }
`;

/**
 * __useGetPausedBassetListQuery__
 *
 * To run a query within a React component, call `useGetPausedBassetListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPausedBassetListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPausedBassetListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPausedBassetListQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetPausedBassetListQuery,
    GetPausedBassetListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetPausedBassetListQuery,
    GetPausedBassetListQueryVariables
  >(GetPausedBassetListDocument, options);
}
export function useGetPausedBassetListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPausedBassetListQuery,
    GetPausedBassetListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetPausedBassetListQuery,
    GetPausedBassetListQueryVariables
  >(GetPausedBassetListDocument, options);
}
export type GetPausedBassetListQueryHookResult = ReturnType<
  typeof useGetPausedBassetListQuery
>;
export type GetPausedBassetListLazyQueryHookResult = ReturnType<
  typeof useGetPausedBassetListLazyQuery
>;
export type GetPausedBassetListQueryResult = Apollo.QueryResult<
  GetPausedBassetListQuery,
  GetPausedBassetListQueryVariables
>;
