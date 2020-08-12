import { ABI } from '@drizzle/store/types/IContract';
import LoanTokenABI from 'utils/blockchain/abi/abiLoanToken.json';
import TestTokenABI from 'utils/blockchain/abi/abiTestToken.json';

interface ContractData {
  LoanContractSUSD: Contract;
  LoadContractRBTC: Contract;
  TestTokenSUSD: Contract;
  TestTokenRBTC: Contract;
}

interface Contract {
  address: string;
  abi: ABI[] | any;
}

export const contracts: ContractData = {
  LoanContractSUSD: {
    address: '0xC6Aa9E9C18021Db79eDa87a8E58dD3c146A6b1E5',
    abi: LoanTokenABI,
  },
  LoadContractRBTC: {
    address: '0xc4F9857B4bb568C10aD68C092D058Fc8d36Ce4b0',
    abi: LoanTokenABI,
  },
  TestTokenSUSD: {
    address: '0xE631653c4Dc6Fb98192b950BA0b598f90FA18B3E',
    abi: TestTokenABI,
  },
  TestTokenRBTC: {
    address: '0xE53d858A78D884659BF6955Ea43CBA67c0Ae293F',
    abi: TestTokenABI,
  },
};

export const getContract = (contractName: ContractName) => {
  if (!contracts.hasOwnProperty(contractName)) {
    throw new Error(
      `Contract ${contractName} is not configured in contracts.ts`,
    );
  }
  const contract = contracts[contractName];
  return {
    contractName: contractName,
    address: contract.address,
    abi: contract.abi,
  };
};

export const getContractsByName = (contractNames: ContractNames) =>
  contractNames.map(name => getContract(name));

export type ContractName = keyof ContractData;
export type ContractNames = Array<ContractName>;
