import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { PerpetualPairDictionary } from 'utils/dictionaries/perpetual-pair-dictionary';
import { selectPerpetualPage } from '../selectors';

export const usePerpetual_getCurrentPairId = () => {
  const { pairType } = useSelector(selectPerpetualPage);

  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

  return pair.id || PerpetualPairDictionary.list()[0].id;
};
