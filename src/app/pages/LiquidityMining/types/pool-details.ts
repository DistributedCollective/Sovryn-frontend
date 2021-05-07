import type { Asset, ChainId } from 'types';

export class PoolDetails {
  constructor(
    public readonly pool: Asset,
    public readonly token: Asset,
    public readonly contracts: Map<ChainId, string>,
    public readonly version: number = 2,
  ) {}
}
