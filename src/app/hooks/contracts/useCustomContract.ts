import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { useEffect, useRef } from 'react';
import { Sovryn } from '../../../utils/sovryn';

export function useCustomContract(
  address: string,
  abi: AbiItem[] | AbiItem | any,
  canSend?: boolean,
): Contract | null {
  const contract = useRef<Contract>(null);

  useEffect(() => {
    // @ts-ignore
    contract.current = new (canSend
      ? Sovryn.getWriteWeb3()
      : Sovryn.getWeb3()
    ).eth.Contract(abi, address);
  }, [address, abi, canSend]);

  return contract.current;
}
