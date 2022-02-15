type IntercomData = {
  'Wallet address': string;
  'Wallet type': string;
  'Wallet network': string;
  Environment: string;
};

export const intercomUpdate = (data: Partial<IntercomData>) => {
  try {
    (window as any).Intercom('update', data);
  } catch (_) {}
};
