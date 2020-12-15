import Web3 from 'web3';
import createLedgerSubprovider from '@ledgerhq/web3-subprovider';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import ProviderEngine from 'web3-provider-engine';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc';
import { currentChainId, rpcNodes } from '../classifiers';

export async function startLedger() {
  try {
    const engine = new ProviderEngine();
    const getTransport = () => TransportWebUSB.create();
    // transport.setDebugMode(true);
    console.log(getTransport);
    const ledger = createLedgerSubprovider(getTransport, {
      networkId: currentChainId,
      paths: ["44'/137'/0'/0", "44'/37310'/0'/0"], // ledger live derivation path
      // paths: ["44'/60'/x'/0/0", "44'/60'/0'/x"], // ledger live derivation path
      askConfirm: false,
      accountsLength: 5,
      accountsOffset: 0,
    });
    console.log(ledger);
    engine.addProvider(ledger);
    engine.addProvider(
      new RpcSubprovider({ rpcUrl: rpcNodes[31], chainId: 31 }),
    );
    engine.start();

    console.log(engine);

    const web3 = new Web3(engine);

    const accounts = await web3.eth.getAccounts();
    console.log('accounts: ', accounts);

    const signed = await web3.eth.sign('0x0000', accounts[3], (e, o) => {
      console.log(e, o);
    });
    console.log('signed?', signed);
    return web3;
  } catch (e) {
    console.error(e);
  }
}
