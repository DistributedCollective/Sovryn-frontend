import React from 'react';
import { TransitionStep } from '../../../../../containers/TransitionSteps';

// export const ReviewStep: TransitionStep = ({ changeTo }) => {
//   return (
//     <>
//       <h1 className="tw-font-semibold">{origin && t(titleMap[origin])}</h1>
//       <div className={styles.contentWrapper}>
//         <TradeSummary
//           origin={origin}
//           trade={trade}
//           amountChange={amountChange}
//           amountTarget={amountTarget}
//           entryPrice={entryPrice}
//           leverageTarget={leverageTarget}
//           liquidationPrice={liquidationPrice}
//           marginChange={marginChange}
//           marginChangePnL={marginChangePnL}
//           marginTarget={marginTarget}
//           pair={pair}
//           tradingFee={tradingFee}
//         />
//         <ResultPosition
//           amountChange={amountChange}
//           amountTarget={amountTarget}
//           entryPrice={entryPrice}
//           leverageTarget={leverageTarget}
//           liquidationPrice={liquidationPrice}
//           marginTarget={marginTarget}
//           pair={pair}
//         />
//         <div className="tw-flex tw-justify-center">
//           <button className={styles.confirmButton} onClick={onSubmit}>
//             {t(translations.perpetualPage.reviewTrade.confirm)}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };
