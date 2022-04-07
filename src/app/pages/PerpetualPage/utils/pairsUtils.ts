import { PerpetualPairDictionary } from 'utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualPair } from 'utils/models/perpetual-pair';

export const perpIds = PerpetualPairDictionary.list().map(pair => pair.id);

export const getPairByPerpId = (perpId): PerpetualPair | undefined =>
  PerpetualPairDictionary.list().find(
    pair => pair.id.toLowerCase() === perpId.toLowerCase(),
  );
