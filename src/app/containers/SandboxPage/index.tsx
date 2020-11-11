/**
 *
 * SandboxPage
 *
 */

import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Sovryn } from '../../../utils/sovryn';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { sha3 } from 'web3-utils';

export function SandboxPage() {
  const address = useAccount();
  function testTx() {
    if (address) {
      Sovryn.getWriteWeb3()
        .eth.sign(sha3('test') as string, address)
        .then(res => console.log(res));
    } else {
      alert('not connected');
    }
  }

  return (
    <div>
      <button onClick={testTx}>Test sign transaction</button>
    </div>
  );
}
