import { Signature } from 'app/pages/FastBtcPage/contexts/deposit-context';
import { contractReader } from '../sovryn/contract-reader';
import AddressMappingSigner from '../signature/addressMappingSIgnature';

export const validateSignatures = async (
  signatures: Signature[],
  btcAddress: String,
  web3TargetAddress: String,
  chainId: number | undefined,
  multisigAddress: String,
) => {
  const required: number = await contractReader.call(
    'fastBtcMultisig',
    'required',
    [],
  );
  //at least required + 1 valid signatures
  const currentFederators: string[] = await contractReader.call(
    'fastBtcMultisig',
    'getOwners',
    [],
  );

  return __validateSignatures(
    signatures,
    btcAddress,
    web3TargetAddress,
    chainId,
    multisigAddress,
    currentFederators,
    required,
  );
};

// The purpose of this extracted method is for testing without mocking the contract calls
export const __validateSignatures = async (
  signatures,
  btcAddress,
  web3TargetAddress,
  chainId,
  multisigAddress,
  currentFederators,
  requiredValidSignatures,
) => {
  const addressMappingSigner = new AddressMappingSigner();
  let verified: number = 0;
  for (let i = 0; i < signatures.length; i++) {
    let signature = signatures[i];
    const signingAddress = await addressMappingSigner.getSigningAddress(
      btcAddress,
      web3TargetAddress,
      signature.signature,
      chainId,
      multisigAddress,
    );

    if (signature.signer === signingAddress) {
      for (let i = 0; i < currentFederators.length; i++) {
        if (currentFederators[i].toLowerCase() === signingAddress) {
          verified++;
        }
      }
    }
  }
  return verified >= requiredValidSignatures;
};
