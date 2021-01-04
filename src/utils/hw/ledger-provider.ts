import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportUSB from '@ledgerhq/hw-transport-webusb';
import LedgerEth from '@ledgerhq/hw-app-eth';
import { LedgerWallet } from './ledger';
import { getDeterministicWallets } from './hardware-deter';
import { Sovryn } from '../sovryn';
import { weiTo4 } from '../blockchain/math-helpers';

export interface ChainCodeResponse {
  chainCode: string;
  publicKey: string;
}

async function makeApp() {
  const transport = await TransportUSB.isSupported()
    .then(isSupported =>
      isSupported ? TransportUSB.create() : TransportU2F.create(),
    )
    .catch(() => TransportU2F.create());

  return new LedgerEth(transport);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getChainCode(dpath: string) {
  return makeApp()
    .then(app => app.getAddress(dpath, false, true))
    .then(res => {
      return {
        publicKey: res.publicKey,
        chainCode: res.chainCode,
      };
    })
    .catch(err => {
      throw new Error(err);
    });
}

export async function startLedger() {
  try {
    const dPathValue = "44'/137'/0'/0";
    // const dPathValue = "44'/37310'/0'/0";

    const result = await LedgerWallet.getChainCode(dPathValue);

    console.log('result', result);

    const wallets = await getDeterministicWallets({
      seed: undefined,
      dPath: dPathValue,
      publicKey: result.publicKey,
      chainCode: result.chainCode,
      limit: 10,
      offset: 0,
    });

    console.log('wallets: ', wallets);

    if (wallets?.length) {
      const wallet = new LedgerWallet(wallets[0].address, dPathValue, 0);

      const balance1 = await Sovryn.getWeb3().eth.getBalance(
        wallets[0].address,
      );
      const balance2 = await Sovryn.getWeb3().eth.getBalance(
        wallets[1].address,
      );
      console.log(
        'balance',
        weiTo4(balance1),
        weiTo4(balance2),
        wallets[1].address,
      );

      const dispaly = await wallet.displayAddress();
      console.log(dispaly);
      const eth = await wallet.signMessage('0x');
      console.log('signed', eth);
    }
  } catch (e) {
    console.error(e);
  }
}
