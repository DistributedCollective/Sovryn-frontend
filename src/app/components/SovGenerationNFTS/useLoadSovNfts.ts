import { useEffect, useState } from 'react';
import { useAccount } from '../../hooks/useAccount';
import { contractReader } from '../../../utils/sovryn/contract-reader';

export function useLoadSovNfts() {
  const account = useAccount();

  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function run() {
      let items: string[] = [];
      const balance = await contractReader
        .call('sovrynNFT', 'balanceOf', [account], account)
        .then(response => Number(response));
      for (let i = balance; i > 0; i--) {
        const item = await contractReader.call<string>(
          'sovrynNFT',
          'tokenOfOwnerByIndex',
          [account, i - 1],
        );
        items.push(item);
      }
      return items;
    }
    if (account) {
      run()
        .then(result => {
          setItems(result);
          setLoading(false);
        })
        .catch(() => {
          setItems([]);
          setLoading(false);
        });
    }
  }, [account]);

  return { loading, items };
}
