import { ChainId } from './../../types/chain-id';
import { ethers } from 'ethers';
import { TypedDataUtils } from 'ethers-eip712';

const MESSAGE_TYPES = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ],
  DepositAddressMapping: [
    { name: 'btcDepositAddress', type: 'string' },
    { name: 'rskTargetAddress', type: 'address' },
  ],
};

export default class AddressMappingSigner {
  async createTemplateForMapping(
    btcAddress,
    web3Address,
    chainId,
    multisigAddress,
  ) {
    return {
      types: MESSAGE_TYPES,
      primaryType: 'DepositAddressMapping',
      domain: {
        name: 'Sovryn FastBTC Bridge',
        version: '1',
        chainId: chainId,
        verifyingContract: multisigAddress.toLowerCase(),
      },
      message: {
        btcDepositAddress: btcAddress,
        rskTargetAddress: web3Address.toLowerCase(),
      },
    };
  }

  async getSigningAddress(
    btcAddress,
    web3Address,
    signature,
    chainId,
    multisigAddress,
  ) {
    signature = ethers.utils.splitSignature(signature);
    const message = await this.createTemplateForMapping(
      btcAddress,
      web3Address,
      chainId,
      multisigAddress,
    );
    const digest = TypedDataUtils.encodeDigest(message);
    return ethers.utils.recoverAddress(digest, signature).toLowerCase();
  }
}
