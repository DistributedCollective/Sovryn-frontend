// import { END, eventChannel } from 'redux-saga';
// import {
//   call,
//   put,
//   select,
//   takeLatest,
//   take,
//   takeEvery,
// } from 'redux-saga/effects';
// import { actions } from './slice';
// import { Sovryn } from '../../../utils/sovryn';
// import { selectLendBorrowSovryn } from './selectors';

// function createBlockChannels({ web3 }) {
//   return eventChannel(emit => {
//     const blockEvents = web3.eth
//       .subscribe('newBlockHeaders', (error, result) => {
//         if (error) {
//           emit(actions.blockFailed(error.message));
//
//           console.error('Error in block header subscription:');
//           console.error(error);
//
//           emit(END);
//         }
//       })
//       .on('data', blockHeader => {
//         emit(actions.blockReceived(blockHeader));
//         // emit({
//         //   type: 'BLOCK_RECEIVED',
//         //   blockHeader,
//         //   web3,
//         //   syncAlways,
//         // });
//       })
//       .on('error', error => {
//         emit(actions.blockFailed(error.message));
//         // emit({ type: 'BLOCKS_FAILED', error });
//         emit(END);
//       });
//
//     return () => {
//       blockEvents.off();
//     };
//   });
// }
//
// function* callCreateBlockChannels() {
//   const web3 = Sovryn.getWeb3();
//   const blockChannel = yield call(createBlockChannels, { web3 });
//
//   try {
//     while (true) {
//       const event = yield take(blockChannel);
//       yield put(event);
//     }
//   } finally {
//     blockChannel.close();
//   }
// }
//
// function* processBlockHeader(event) {
//   const { address } = yield select(selectLendBorrowSovryn);
//   const blockNumber = event.payload.number;
//   const web3 = Sovryn.getWeb3();
//
//   try {
//     const block = yield call(web3.eth.getBlock, blockNumber, true);
//     yield call(processBlock, { block, address });
//   } catch (error) {
//     console.error('Error in block processing:');
//     console.error(error);
//
//     // yield put({ type: 'BLOCK_FAILED', error });
//   }
// }
//
// function* processBlock({ block, address }) {
//   try {
//     // Emit block for addition to store.
//     // Regardless of syncing success/failure, this is still the latest block.
//     // yield put({ type: 'BLOCK_PROCESSING', block });
//
//     const txs = block.transactions;
//     let hasChanges = false;
//
//     if (txs.length > 0) {
//       for (let i = 0; i < txs.length; i++) {
//         const from = (txs[i].from || '').toLowerCase();
//         const to = (txs[i].to || '').toLowerCase();
//
//         const hasContract = Sovryn.contractList.find(contract => {
//           const address = contract.options.address.toLowerCase();
//           return address === from || address === to;
//         });
//
//         if (hasContract) {
//           hasChanges = true;
//           break;
//         }
//
//         if (
//           address &&
//           (address.toLowerCase() === from || address.toLowerCase() === from)
//         ) {
//           hasChanges = true;
//           break;
//         }
//       }
//     }
//
//     if (hasChanges) {
//       yield put(actions.reSync(block.number));
//     }
//   } catch (error) {
//     console.error('Error in block processing:');
//     console.error(error);
//     // yield put({ type: 'BLOCK_FAILED', error });
//   }
// }

export function* lendBorrowSovrynSaga() {
  // yield takeLatest(actions.chainChanged.type, callCreateBlockChannels);
  // yield takeEvery(actions.blockReceived.type, processBlockHeader);
}
