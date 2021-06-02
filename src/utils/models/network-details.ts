import type { Chain, ChainId } from 'types';

export class NetworkDetails {
  constructor(
    public readonly chain: Chain,
    public readonly chainId: ChainId,
    public readonly name: string,
    public readonly nodes: string[],
    public readonly isTestnet: boolean = false,
  ) {}
}
