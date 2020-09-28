import bzxAbi from './abi/bzxAbi.json';

export const appContracts = {
  sovrynProtocol: {
    address: '0x217d65Efe40e2d396519C9d094a6Cc87F5B8670b',
    abi: bzxAbi,
    watchEvents: ['Borrow', 'Burn', 'Mint', 'Transfer', 'Approval'],
  },
};
