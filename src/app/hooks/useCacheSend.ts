import { useState } from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import { useDrizzle } from './useDrizzle';

// export function useCacheSend(
//   contractName: ContractName,
//   methodName: string
// ) {
//   const { useCacheSend } = drizzleReactHooks.useDrizzle();
//   const { send, TXObjects } = useCacheSend(contractName, methodName);
//   return { send, TXObjects };
// }

export function useCacheSend(contractName: string, methodName: string) {
  const drizzle = useDrizzle();
  const { transactionStack, transactions } = drizzleReactHooks.useDrizzleState(
    drizzleState => ({
      transactionStack: drizzleState.transactionStack,
      transactions: drizzleState.transactions,
    }),
  );
  const [stackIDs, setStackIDs] = useState<any>([]);
  const TXObjects = stackIDs.map(
    stackID => transactions[transactionStack[stackID] || 'undefined'],
  );
  const contractMethod = drizzle.contracts[contractName].methods[methodName];
  return {
    TXObjects,
    send: (...args) =>
      setStackIDs(stackIDs => [...stackIDs, contractMethod.cacheSend(...args)]),
    status:
      TXObjects[TXObjects.length - 1] && TXObjects[TXObjects.length - 1].status,
  };
}
