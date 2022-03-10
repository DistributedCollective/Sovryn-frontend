export {};
// NOTE!! This test fails to pass due to some misconfiguration in jest.
// import { assert } from 'console';
// import { __validateSignatures } from './signatureValidation';

// test('sucessful validate signatures', () => {
//   const signatures = [
//     {
//       signer: '0x0b3be9435610aac0e1c6f7a26c77e2213738cb48',
//       signature:
//         '0x580d4368501ac7af9d765a430d2b3b7d6c8e9a1566aed20d2d6e064cbc068efe5cd3de394d6c4b576d933eca74e120dddb3a7635f08386f3450c80c3a73969d01c',
//     },
//     {
//       signer: '0x61224e0378441828e3bca7ec72d973066bfb264c',
//       signature:
//         '0x738c69fd6573b111eb075352a07614ac7a43bbc2b3a53de36bfb36f2f522ac865a96c3eade676a158947a18cafc27203ffe83c1d79005e1a4a3e8164802b9f151b',
//     },
//     {
//       signer: '0x986c65fc1783a445ceccade74234dc8627d429d8',
//       signature:
//         '0xd5a698d651ec6de59ee31e3b5463047c6d7f94032e96b80f33bc86be360967f1032f97efb4a029d704762a3366eb9d81d9e9672370807f80c907c25a871d28351b',
//     },
//     {
//       signer: '0xb66fb8937aecdb12210b384120e2b4ba506b3140',
//       signature:
//         '0xf43d7d22cdc3d005768797eeaea6deb6dd780c5e76286039b9a3b1f312bcaf7b4bd304e3672b4b0fbeee9c7710d2f40a8b630195c677ebf71993bf736095047d1b',
//     },
//   ];

//   const btcAddress =
//     'bc1qc4l5ham55z4z08rkdpztm4ngeputncxxusc9qfdfcyhu2ft5k5lsdtz3uv';
//   const web3TargetAddress = '0x050926a6f8c0bdAc81bf339Cd8De4a112E612396';
//   const chainId = 30;
//   const multisigAddress = '0x0f279e810B95E0d425622b9b40D7bCD0B5C4B19d';
//   const currentFederators = [
//     '0x986C65fc1783a445CecCadE74234dC8627d429d8',
//     '0x0B3bE9435610aAC0e1c6F7a26C77e2213738cB48',
//     '0xc39Ef4a81C57D5866924e6cC6C260c617ef7287D',
//     '0xB66Fb8937AecDb12210B384120e2b4Ba506b3140',
//     '0x61224E0378441828E3BcA7ec72D973066Bfb264c',
//   ];
//   const requiredValidSignatures = 3;

//   __validateSignatures(
//     signatures,
//     btcAddress,
//     web3TargetAddress,
//     chainId,
//     multisigAddress,
//     currentFederators,
//     requiredValidSignatures,
//   ).then(valid => {
//     assert(valid);
//   });
// });
