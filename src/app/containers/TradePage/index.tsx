/**
 *
 * TradePage
 *
 */

import React from 'react';
import { Container } from 'react-bootstrap';
import CurrencyContainer from '../LendBorrowSovryn/components/CurrencyContainer';
import BTCLendForm from '../LendBorrowSovryn/components/BTCLendForm';
import Header from '../LendBorrowSovryn/components/Header';

export function TradePage() {
  return (
    <div className="main-container">
      <Header />
      <Container fluid className="d-flex w-100">
        <BTCLendForm />
      </Container>
    </div>
  );
  // return (
  //   <>
  //     <Header />
  //     <main>
  //       <div className="container">
  //         <div className="row">
  //           <div
  //             className="col-md-12 col-lg-5 mb-2 mr-0 d-flex flex-column justify-content-between"
  //             style={{ minHeight: 400 }}
  //           >
  //             <TradingToken marketToken={Asset.BTC} />
  //           </div>
  //           <div
  //             className="col-md-12 col-lg-7 order-first order-lg-last mb-2"
  //             style={{ minHeight: 300 }}
  //           >
  //             <TradingViewChart asset={Asset.BTC} />
  //           </div>
  //         </div>
  //         <TradingActivity />
  //       </div>
  //     </main>
  //     <Footer />
  //   </>
  // );
}
