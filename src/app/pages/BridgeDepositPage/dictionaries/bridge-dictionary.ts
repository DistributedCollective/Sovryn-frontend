import { BridgeModel } from '../types/bridge-model';
import { getBridgeChainId, unique } from '../utils/helpers';
import mainnetBridges from './bridges/mainnet';
import testnetBridges from './bridges/testnet';
import { BridgeNetworkDictionary } from './bridge-network-dictionary';
import { NetworkModel } from '../types/network-model';
import { currentNetwork } from '../../../../utils/classifiers';
import { Chain } from '../../../../types';
// import { BridgeNetworkDictionary } from './bridge-network-dictionary';
// import { NetworkModel } from '../types/network-model';

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

  //
  // public static getSideBridges(networkType: NetworkType) {
  //   const network = this.listNetworks().find(
  //     item => item.network === networkType,
  //   );
  //   if (network === undefined)
  //     throw new Error('There is no bridge for ' + networkType + ' network.');
  //   return this.bridges.filter(item => item.sideChainId === network.chainId);
  // }
  //
  // public static getMainBridges(sideNetworkType: NetworkType) {
  //   const network = this.listNetworks().find(
  //     item => item.network === sideNetworkType,
  //   );
  //   if (network === undefined)
  //     throw new Error(
  //       'There is no bridge for ' + sideNetworkType + ' network.',
  //     );
  //   return this.bridges.filter(item => item.mainChainId === network.chainId);
  // }

  // public static getSideNetworks(sideNetworkType: NetworkType) {
  //   return this.getMainBridges(sideNetworkType).map(
  //     item =>
  //       NetworkDictionary.getByChainId(item.sideChainId) as NetworkDetails,
  //   );
  // }
  //
  // public static getMainNetworks(networkType: NetworkType) {
  //   return this.getSideBridges(networkType).map(
  //     item =>
  //       NetworkDictionary.getByChainId(item.mainChainId) as NetworkDetails,
  //   );
  // }
  //
  // public static get(mainNetwork: NetworkType, sideNetwork: NetworkType) {
  //   const mainChainId = NetworkDictionary.getChainId(mainNetwork);
  //   const sideChainId = NetworkDictionary.getChainId(sideNetwork);
  //   return this.getByChainId(mainChainId, sideChainId) as BridgeDetails;
  // }
  //
  // public static getByChainId(
  //   mainChainId: NetworkChainId,
  //   sideChainId: NetworkChainId,
  // ) {
  //   return this.bridges.find(
  //     item =>
  //       item.mainChainId === mainChainId && item.sideChainId === sideChainId,
  //   );
  // }
}
