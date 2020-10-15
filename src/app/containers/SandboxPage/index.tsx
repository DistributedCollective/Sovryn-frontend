/**
 *
 * SandboxPage
 *
 */

import React from 'react';
import { TokenSwapContainer } from '../TokenSwapContainer/Loadable';

interface Props {}

export function SandboxPage(props: Props) {
  return (
    <>
      <div className="container">
        <TokenSwapContainer />
      </div>
    </>
  );
}
