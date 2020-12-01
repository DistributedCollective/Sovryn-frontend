import React, { useState } from 'react';
import browserImg from 'assets/images/tutorial/browser.svg';
import connect from 'assets/images/tutorial/connect.svg';
import badger from 'assets/images/tutorial/BADGER_V2.png';
import arm from 'assets/images/tutorial/ARM.png';
import background from 'assets/images/tutorial/test.svg';

import { Dialog } from '@blueprintjs/core';

export function TutorialDialog() {
  const [show, setShow] = useState<boolean>(true);

  return (
    <div className="wallet-tutorial_container">
      <img src={background} alt="" />
      <div>
        <div className="wallet-tutorial_box-right">
          <img src={connect} alt="" />
        </div>

        <div className="wallet-tutorial_border">
          <div className="wallet-tutorial_main">
            <div className="row w-100 h-100">
              <div className="col-6 wallet-tutorial_left-col">
                <div className="step-box">
                  <p>Step: 01</p>
                </div>
                <div className="polygon">
                  <div className="polygon--inner">
                    <img src={browserImg} alt="" />
                  </div>
                </div>
              </div>
              <div className="badger">
                <div className="body">
                  <img src={badger} alt="" />
                </div>
                <div className="arm">
                  <img src={arm} alt="" />
                </div>
              </div>
              <div className="col-6 wallet-tutorial_right-col">
                <div className="polygon">
                  <div className="polygon--inner"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="wallet-tutorial_banner">
          <p>For more information, contact us on discord</p>
        </div>
      </div>
    </div>
  );
}
