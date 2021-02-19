import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { media } from '../../../../styles/media';
import { OriginClaimDialog } from './OriginClaimDialog';

export function OriginClaimBanner() {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <Div>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <div>
            Your SOV is ready to claim, once you have claimed you will be
            automatically whitelisted for trading
          </div>
          <div>
            <Button onClick={() => setOpen(open => !open)}>Redeem SOV</Button>
          </div>
        </div>
      </Div>
      <OriginClaimDialog isOpen={isOpen} onClose={() => setOpen(false)} />
    </>
  );
}

const Div = styled.div`
  background-color: rgba(254, 192, 4, 0.25);
  padding: 31px;
  font-weight: 500;
  border: 1px solid #e9eae9;
  border-radius: 8px;
  line-height: 1;
  font-size: 16px;
  ${media.lg`
    padding-left: 100px;
    padding-right: 100px;
    font-size: 24px;
  `}
`;

const Button = styled.button`
  margin-left: 25px;
  border: 0;
  border-radius: 10px;
  white-space: nowrap;
  background-color: #fec004;
  color: #000;
  font-size: 20px;
  font-family: 900;
  padding: 13px 24px;
  line-height: 1;
  transition: opacity 300ms;
  &:hover {
    opacity: 0.75;
  }
`;
