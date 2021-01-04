import { publicToAddress } from 'ethereumjs-util';
import HDKey from 'hdkey';
import { toChecksumAddress } from '../helpers';

interface IWallet {
  index: number;
  address: string;
}

export async function getDeterministicWallets({
  seed,
  dPath,
  publicKey,
  chainCode,
  limit,
  offset,
}) {
  let pathBase;
  let hdk;

  // if seed present, treat as mnemonic
  // if pubKey & chainCode present, treat as HW wallet

  if (seed) {
    hdk = HDKey.fromMasterSeed(new Buffer(seed, 'hex'));
    pathBase = dPath;
  } else if (publicKey && chainCode) {
    hdk = new HDKey();
    hdk.publicKey = new Buffer(publicKey, 'hex');
    hdk.chainCode = new Buffer(chainCode, 'hex');
    pathBase = 'm';
  } else {
    return;
  }
  const wallets: IWallet[] = [];

  for (let i = 0; i < limit; i++) {
    const index = i + offset;
    const dkey = hdk.derive(`${pathBase}/${index}`);
    const address = publicToAddress(dkey.publicKey, true).toString('hex');
    wallets.push({
      index,
      address: toChecksumAddress(address),
    });
  }

  return wallets;
}
