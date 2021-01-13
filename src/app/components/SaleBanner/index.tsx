import React, { useEffect } from 'react';
import './SaleBanner.scss';
import { Button } from '@blueprintjs/core';
import samurai from './assets/banner-samurai.svg';
import { Link } from 'react-router-dom';

export function SaleBanner() {
  useEffect(() => {
    var countDownDate = new Date('Jan 24, 2021 0:0:0').getTime();
    var x = setInterval(function () {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      let sdays,
        shours,
        smins,
        ssecs = '';
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      if (days <= 9) {
        sdays = `0${days}`;
      } else {
        sdays = `${days}`;
      }
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      if (hours <= 9) {
        shours = `0${hours}`;
      } else {
        shours = `${hours}`;
      }
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      if (minutes <= 9) {
        smins = `0${minutes}`;
      } else {
        smins = `${minutes}`;
      }
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (seconds <= 9) {
        ssecs = `0${seconds}`;
      } else {
        ssecs = `${seconds}`;
      }
      let daysElement = document.getElementById('days') as HTMLInputElement;
      daysElement.innerText = sdays;
      let hoursElement = document.getElementById('hours') as HTMLInputElement;
      hoursElement.innerText = shours;
      let minsElement = document.getElementById('mins') as HTMLInputElement;
      minsElement.innerText = smins;
      let secsElement = document.getElementById('secs') as HTMLInputElement;
      secsElement.innerText = ssecs;

      if (distance < 0) {
        clearInterval(x);
        let timerElement = document.getElementById(
          'timer-container',
        ) as HTMLInputElement;
        timerElement.style.display = 'none';
        let titleElement = document.getElementById(
          'title-text',
        ) as HTMLInputElement;
        titleElement.innerText = 'Token sale is live now!';
      }
    }, 1000);

    return () => {
      clearInterval(x);
    };
  }, []);

  const closeBanner = () => {
    let timerElement = document.getElementById(
      'banner-container',
    ) as HTMLInputElement;
    timerElement.style.display = 'none';
  };
  return (
    <div className="banner-container" id="banner-container">
      <div className="banner">
        <div className="info-container">
          <h2
            className="text-uppercase title-container black-font"
            id="title-text"
          >
            The Countdown has begun!
          </h2>
          <div className="sub-info-container">
            <p className="sub-info-text black-font">
              SOV Token Sale <br /> 8th January
            </p>
          </div>
          <div className="button-container">
            <Link
              className="button button-nav button-black button-white button-container"
              to="/sales"
            >
              <span className="button-text">Learn More</span>
            </Link>
          </div>

          <div className="timer-container" id="timer-container">
            <div className="date-container">
              <div>
                <p className="text-white p-remove-padding">Days</p>
                <h3 className="text-white" id="days">
                  00
                </h3>
              </div>
              <div>
                <p className="text-white p-remove-padding">Hours</p>
                <h3 className="text-white" id="hours">
                  00
                </h3>
              </div>
              <div>
                <p className="text-white p-remove-padding">Mins</p>
                <h3 className="text-white" id="mins">
                  00
                </h3>
              </div>
              <div>
                <p className="text-white p-remove-padding">Secs</p>
                <h3 className="text-white" id="secs">
                  00
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="picture-container">
          <img className="banner-samurai" src={samurai} alt="banner-samurai" />
        </div>
        <div className="close-button-container">
          <Button
            icon="cross"
            minimal
            className="float-right"
            onClick={() => {
              closeBanner();
            }}
          />
        </div>
      </div>
    </div>
  );
}
