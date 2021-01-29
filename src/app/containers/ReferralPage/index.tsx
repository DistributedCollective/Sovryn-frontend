/**
 *
 * EmailOptInSuccessPage
 *
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Checkbox, Icon } from '@blueprintjs/core';
import axios from 'axios';
import styled from 'styled-components/macro';
import { toaster } from 'utils/toaster';
import { useIsConnected } from 'app/hooks/useAccount';
// import { Sovryn } from 'utils/sovryn';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { validateEmail } from 'utils/helpers';
import { useAccount } from '../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import SalesButton from '../../components/SalesButton';

const s = translations.tradingPage;

const StyledContent = styled.div`
  max-width: 1235px;
  min-height: 620px;
  margin: 40px auto;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  padding: 30px 15px;
  form {
    border: 1px solid;
    border-radius: 8px;
    padding: 20px;
    width: 50%;
    margin-bottom: 2rem;
  }
  .content-header {
    font-size: 28px;
    text-align: center;
    margin-bottom: 40px;
  }
  a {
    color: var(--gold);
    font-weight: normal;
  }
  .referral-wrap {
    border: 1px solid;
    border-radius: 8px;
    padding: 20px;
    width: 50%;
    text-align: center;
    .text-cetner.referral-count {
      font-size: 3rem;
      color: var(--gold);
    }
    .referral-invite {
      border-top: 1px solid;
      padding-top: 2rem;
      margin-block: 2rem;
    }
    .referral-link {
      background: #383838;
      height: 40px;
      padding: 0 0 0 2rem;
      border-radius: 8px;
      font-weight: 100;
      font-size: 18px;
      font-family: 'Work Sans', sans-serif;
      min-width: 165px;
      letter-spacing: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .bp3-icon {
        margin-left: 1rem;
      }
    }
  }
`;

const StyledInput = styled.input.attrs(_ => ({ type: 'text' }))`
  background: #f4f4f4;
  border-radius: 8px;
  height: 50px;
  width: 100%;
  text-align: center;
  color: black;
  font-size: 18px;
  line-height: 20px;
  font-family: 'Work Sans';
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  outline-style: none;
  box-shadow: none;
  &:focus {
    box-shadow: none;
    border-radius: 8px;
  }
`;

export function ReferralPage() {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [clicks, setClicks] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [referralLink, setReferralLink] = useState('');
  const [username, setUsername] = useState('');
  const emailValid = validateEmail(email);
  const valid = !!email && emailValid;
  const address = useAccount();
  const connected = useIsConnected();
  const referralSrv = backendUrl[currentChainId];
  const activeRefferal = reactLocalStorage.get('referralCode');

  const createInviteLink = useCallback(() => {
    setLoading(true);
    axios
      .post(referralSrv + '/referral', {
        email: email,
        address: address,
      })
      .then(res => {
        setLoading(false);
        setReferralLink(res.data.url);
        setUsersCount(res.data.users);
        setClicks(res.data.clicks);
        setStatus(false);
        reactLocalStorage.set('referralCode', true);
      })
      .catch(e => {
        if (e.response) {
          toaster.show({ message: e.response.data.error, intent: 'danger' });
        }
        setLoading(false);
        reactLocalStorage.set('referralCode', false);
      });
  }, [referralSrv, email, address]);

  const getLinkData = useCallback(() => {
    setLoading(true);
    axios
      .get(referralSrv + '/referral?address=' + address)
      .then(res => {
        reactLocalStorage.set('referralCode', true);
        setLoading(false);
        setReferralLink(res.data.url);
        setUsersCount(res.data.users);
        setClicks(res.data.clicks);
        setStatus(false);
      })
      .catch(e => {
        if (e.response) {
          toaster.show({ message: e.response.data.error, intent: 'danger' });
        }
        setLoading(false);
        reactLocalStorage.set('referralCode', false);
      });
  }, [referralSrv, address]);

  useEffect(() => {
    setLoading(false);
    if (connected) {
      getLinkData();
    } else {
      reactLocalStorage.set('referralCode', false);
    }
  }, [referralSrv, getLinkData, address, connected, activeRefferal]);

  return (
    <>
      <Helmet>
        <title>{t(s.meta.title)}</title>
        <meta name="description" content={t(s.meta.description)} />
      </Helmet>
      <Header />
      <StyledContent>
        {loading && <p>Loading</p>}
        <p className="content-header">
          Tell your friends about Sovryn and get a coin!
        </p>

        {/* show referral info */}
        {activeRefferal === 'true' && connected && (
          <div className="referral-wrap">
            <div className="d-flex justify-content-center">
              <div className="ml-3 mr-3">
                <div className="text-cetner referral-count">{usersCount}</div>
                <p>Your referrals</p>
              </div>
              <div className="ml-3 mr-3">
                <div className="text-cetner referral-count">{clicks}</div>
                <p>Link Clicks</p>
              </div>
            </div>

            <p className="referral-invite">
              Invite you friends with your unique referral link
            </p>
            <CopyToClipboard
              text={referralLink}
              onCopy={() => toaster.show({ message: 'Link address copied.' })}
            >
              <div className="cursor-pointer referral-link">
                {referralLink}
                <Icon icon="duplicate" color="#FEC004" />
              </div>
            </CopyToClipboard>
          </div>
        )}

        {/* check refferal status */}
        {status && (
          <form method="GET" action="#">
            <div>
              <div className="mb-3">
                <label htmlFor="email">Enter Email</label>
                <StyledInput
                  name="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                {!!email && !emailValid && (
                  <small className="text-muted">
                    Enter valid email address.
                  </small>
                )}
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center mt-5">
                <div className="mt-4">
                  <SalesButton
                    text={'Check status'}
                    disabled={!valid}
                    onClick={getLinkData}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-center mt-4">
              <a
                href="#!"
                onClick={() => {
                  setStatus(false);
                  setEmail('');
                }}
                className="fererrer-link-status"
              >
                Back
              </a>
            </div>
          </form>
        )}

        {/* become a refferal */}
        {!status && activeRefferal === 'false' && (
          <form method="POST" action="#">
            <div>
              <div className="mb-3">
                <label htmlFor="name">Enter Username</label>
                <StyledInput
                  name="name"
                  id="name"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email">Enter Email</label>
                <StyledInput
                  name="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                {!!email && !emailValid && (
                  <small className="text-muted">
                    Enter valid email address.
                  </small>
                )}
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center mt-5">
                <Checkbox
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  label="I accept the Terms & Conditions"
                />
                <div className="mt-4">
                  <SalesButton
                    text={'Sing Up'}
                    disabled={!checked || !valid}
                    onClick={createInviteLink}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-center mt-4">
              <a
                href="#!"
                onClick={() => {
                  setStatus(true);
                  setEmail('');
                }}
                className="fererrer-link-status"
              >
                Check my status
              </a>
            </div>
          </form>
        )}
      </StyledContent>
      <Footer />
    </>
  );
}
