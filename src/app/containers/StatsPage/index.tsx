/**
 *
 * StatsPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {}

export function StatsPage(props: Props) {
  return (
    <>
      <Helmet>
        <title>StatsPage</title>
        <meta name="description" content="Description of StatsPage" />
      </Helmet>
      <div>Stats Page</div>
    </>
  );
}
