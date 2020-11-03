/**
 *
 * Announcement
 *
 */

import React from 'react';
import { InfoBox } from '../InfoBox';

export function Announcement() {
  return (
    <InfoBox
      icon="info-sign"
      content={
        <>
          As Sovryn has only recently launched, there is currently a{' '}
          <span className="font-weight-bold">$21 limit </span>
          on all transactions on the platform. We will be raising this limit to
          $210 soon. Thank you for being an early adopter!
        </>
      }
      localStorageRef="txLimitInfo"
    />
  );
}
