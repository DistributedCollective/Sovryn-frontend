import { BridgeModel } from '../types/bridge-model';
import { getBridgeChainId, unique } from '../utils/helpers';
import mainnetBridges from './bridges/mainnet';
import testnetBridges from './bridges/testnet';
import { BridgeNetworkDictionary } from './bridge-network-dictionary';
import { NetworkModel } from '../types/network-model';
import { currentNetwork } from '../../../../utils/classifiers';
import { Chain } from '../../../../types';

export class BridgeDictionary {
  public static bridges: BridgeModel[] = [...mainnetBridges, ...testnetBridges];

  public static listNetworks() {
    return this.bridges
      .map(item => item.mainChainId)
      .filter(unique)
      .map(item => BridgeNetworkDictionary.getByChainId(item) as NetworkModel)
      .filter(item => item.mode === currentNetwork);
  }

  public static get(source: Chain, target: Chain = Chain.RSK) {
    return this.bridges.find(
      item =>
        item.mainChainId === getBridgeChainId(source) &&
        item.sideChainId === getBridgeChainId(target),
    );
  }
}
