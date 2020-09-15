import bzxAbi from './abi/bzxAbi.json';

export const appContracts = {
  bzxContract: {
    address: '0x74808B7a84327c66bA6C3013d06Ed3DD7664b0D4',
    abi: bzxAbi,
    watchEvents: ['Borrow', 'Burn', 'Mint', 'Transfer', 'Approval'],
  },
};
