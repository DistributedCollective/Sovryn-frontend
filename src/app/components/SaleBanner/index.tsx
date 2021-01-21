import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Countdown from 'react-countdown';
import { Button } from '@blueprintjs/core';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import moment from 'moment';

import './SaleBanner.scss';
import samurai from './assets/banner-samurai.svg';
import { useSaleEndTime } from '../../containers/SalesPage/hooks/useSaleEndTime';
import { currentNetwork } from '../../../utils/classifiers';

const startDate =
  currentNetwork === 'mainnet'
    ? moment('2021-01-19 17:00+0').utc().toDate()
    : (null as any);

export function SaleBanner() {
  const [show, setShow] = useState(true);
  const { date: endDate, now, loading } = useSaleEndTime();

  const closeBanner = () => {
    setShow(false);
  };

  const countDown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <></>;
    } else {
      return (
        <div className="timer-container">
          <div className="date-container">
            <div>
              <p className="text-white p-remove-padding">Days</p>
              <h3 className="text-white">{days}</h3>
            </div>
            <div>
              <p className="text-white p-remove-padding">Hours</p>
              <h3 className="text-white">{hours}</h3>
            </div>
            <div>
              <p className="text-white p-remove-padding">Mins</p>
              <h3 className="text-white">{minutes}</h3>
            </div>
            <div>
              <p className="text-white p-remove-padding">Secs</p>
              <h3 className="text-white">{seconds}</h3>
            </div>
          </div>
        </div>
      );
    }
  };

  if (!show) {
    return null;
  }

  //todo: temp only, until date is not decided
  if (currentNetwork === 'mainnet') {
    return (
      <div className="banner-container">
        <div className="banner py-3">
          <div className="info-container">
            <h2 className="text-uppercase title-container black-font">
              <>SOV* Genesis Sale</>
            </h2>
            <div className="sub-info-container">
              <p className="sub-info-text black-font">SOV Token Sale</p>
            </div>
            <div className="button-container">
              <Link
                className="button button-nav button-black button-white button-container"
                to="/sales"
              >
                <span className="button-text text-nowrap">Learn More</span>
              </Link>
            </div>
          </div>
          <div className="picture-container">
            <img
              className="banner-samurai"
              src={samurai}
              alt="banner-samurai"
            />
          </div>
          <div className="close-button-container">
            <Button
              minimal
              color="black"
              className="float-right"
              onClick={() => {
                closeBanner();
              }}
            >
              <Icon icon="cross" iconSize={30} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="banner-container">
      <div className="banner py-3">
        <div className="info-container">
          <h2 className="text-uppercase title-container black-font">
            {loading ? (
              <>SOV* Genesis Sale</>
            ) : (
              <>
                {endDate > now ? (
                  <>
                    {endDate >= now && <>Sale has begun!</>}
                    {endDate < now && <>Sale ended!</>}
                  </>
                ) : (
                  <>
                    {startDate > now && <>Count Down has begun</>}
                    {startDate < now && <>SOV* Genesis Sale</>}
                  </>
                )}
              </>
            )}
          </h2>
          <div className="sub-info-container">
            <p className="sub-info-text black-font">SOV Token Sale</p>
          </div>
          <div className="button-container">
            <Link
              className="button button-nav button-black button-white button-container"
              to="/sales"
            >
              <span className="button-text text-nowrap">Learn More</span>
            </Link>
          </div>
          {!loading && (
            <>
              {endDate > now && (
                <Countdown renderer={countDown} date={endDate} />
              )}
              {startDate && startDate > now && (
                <Countdown renderer={countDown} date={startDate} />
              )}
            </>
          )}
        </div>
        <div className="picture-container">
          <img className="banner-samurai" src={samurai} alt="banner-samurai" />
        </div>
        <div className="close-button-container">
          <Button
            minimal
            color="black"
            className="float-right"
            onClick={() => {
              closeBanner();
            }}
          >
            <Icon icon="cross" color="black" iconSize={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}
