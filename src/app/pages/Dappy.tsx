import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const DappyPage: React.FC = () => {
  return (
    <>
      <Header />
      <iframe
        title="Dappy Network"
        src="https://staging.dappy.network/#/widget/sovryn"
        width={576}
        height={830}
      >
        <p>iFrames are not supported.</p>
      </iframe>
      <Footer />
    </>
  );
};
