/**
 *
 * SwapPage
 *
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import moment from 'moment-timezone';
import { bignumber } from 'mathjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { numberFromWei } from 'utils/helpers';
import { Modal } from '../../components/Modal';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Sovryn } from 'utils/sovryn';
import { SovrynNetwork } from 'utils/sovryn/sovryn-network';
import { contractReader } from 'utils/sovryn/contract-reader';
import {
  staking_allowance,
  staking_approve,
  staking_extendStakingDuration,
  staking_stake,
  staking_withdraw,
  staking_delegate,
} from 'utils/blockchain/requests/staking';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { LinkToExplorer } from '../../components/LinkToExplorer';
import { useSoV_balanceOf } from '../../hooks/staking/useSoV_balanceOf';
import { useStaking_getStakes } from '../../hooks/staking/useStaking_getStakes';
import { useStaking_kickoffTs } from '../../hooks/staking/useStaking_kickoffTs';
import { useStaking_balanceOf } from '../../hooks/staking/useStaking_balanceOf';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { useStaking_getCurrentVotes } from '../../hooks/staking/useStaking_getCurrentVotes';
import logoSvg from 'assets/images/sovryn-icon.svg';
import { StakeForm } from './components/StakeForm';
import { StyledTable } from './components/StyledTable';


const now = new Date();

export function StakePage() {
  const { t } = useTranslation();

  const isConnected = useIsConnected();
  if (isConnected) {
    return <InnerStakePage />;
  }
  return (
    <>
      <Helmet>
        <title>{t(translations.stake.title)}</title>
        <meta name="description" content={t(translations.stake.meta)} />
      </Helmet>
      <Header />
      <main>
        <div className="bg-gray-700 tracking-normal">
          <div className="container">
            <h2 className="text-white pt-8 pb-5 pl-10">Staking/Vesting</h2>
            <div className="w-full bg-gray-light text-center rounded-b shadow p-3">
              <i>Please connect with your wallet to use staking.</i>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InnerStakePage() {
  const { t } = useTranslation();
  const account = useAccount();
  const [address, setAddress] = useState('');
  const sovBalanceOf = useSoV_balanceOf(account);
  const [amount, setAmount] = useState('');
  const weiAmount = useWeiAmount(amount);
  const kickoffTs = useStaking_kickoffTs();
  const getStakes = useStaking_getStakes(account);
  const [timestamp, setTimestamp] = useState<number>(0 as any);
  const [loading, setLoading] = useState(false);
  const balanceOf = useStaking_balanceOf(account);
  const voteBalance = useStaking_getCurrentVotes(account);
  const [until, setUntil] = useState<number>(0 as any);
  const [prevTimestamp, setPrevTimestamp] = useState<number>(undefined as any);
  const [stakeForm, setStakeForm] = useState(false);
  const [delegateForm, setDelegateForm] = useState(false);
  const [extendForm, setExtendForm] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState(false);
  const [increaseForm, setIncreaseForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [lockDate, setLockDate] = useState<number>(0 as any);
  const [votingPower, setVotingPower] = useState<number>(0 as any);

  const dates = getStakes.value['dates'];
  const stakes = getStakes.value['stakes'];

  //Form Validations
  const validateStakeForm = useCallback(() => {
    if (loading) return false;
    const num = Number(amount);

    if (!num || isNaN(num) || num <= 0) return false;
    if (!timestamp || timestamp < Math.round(now.getTime() / 1e3)) return false;
    return num * 1e18 <= Number(sovBalanceOf.value);
  }, [loading, amount, sovBalanceOf, timestamp]);

  //Submit Forms
  const handleStakeSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      try {
        let nonce = await contractReader.nonce(account);
        const allowance = (await staking_allowance(account)) as string;
        console.log(nonce);
        console.log(allowance);
        console.log(bignumber(allowance).lessThan(weiAmount));

        if (bignumber(allowance).lessThan(weiAmount)) {
          await staking_approve(sovBalanceOf.value, account.toLowerCase(), nonce);
          nonce += 1;
        }
        await staking_stake(weiAmount, timestamp, account.toLowerCase(), nonce);
        setLoading(false);
        setStakeForm(!stakeForm);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    },
    [weiAmount, sovBalanceOf.value, account, timestamp, stakeForm],
  );

  return (
    <>
      <Helmet>
        <title>{t(translations.stake.title)}</title>
      </Helmet>
      <Header />
      <main>
        <div className="tw-bg-gray-700 tw-tracking-normal">
          <div className="tw-container tw-m-auto">
            <h2 className="tw-text-white tw-pt-8 tw-pb-5 tw-pl-10">Staking/Vesting</h2>
            <div className="xl:tw-flex tw-items-stretch tw-justify-around tw-mt-2">
              <div className="tw-mx-2 tw-bg-gray-800 tw-staking-box tw-p-8 tw-pb-6 tw-rounded-2xl xl:tw-w-1/4 tw-mb-5 xl:tw-mb-0">
                <p className="tw-text-lg tw--mt-1">Total staked SOV</p>
                <p
                  className={`xl:tw-text-4-5xl tw-text-3xl tw-mt-2 tw-mb-6 ${
                    balanceOf.loading && 'skeleton'
                  }`}
                >
                  {numberFromWei(balanceOf.value).toLocaleString()} SOV
                </p>
                <Modal
                  show={stakeForm}
                  content={
                    <>
                      <StakeForm
                        handleSubmit={handleStakeSubmit}
                        amount={amount}
                        timestamp={timestamp}
                        onChangeAmount={e => setAmount(e)}
                        onChangeTimestamp={e => setTimestamp(e)}
                        sovBalanceOf={sovBalanceOf}
                        isValid={validateStakeForm()}
                        kickoff={kickoffTs}
                        stakes={getStakes.value['dates']}
                        votePower={votingPower}
                        onCloseModal={() => setStakeForm(!stakeForm)}
                      />
                    </>
                  }
                />
                {sovBalanceOf.value !== '0' && (
                  <button
                    type="button"
                    className="tw-bg-gold tw-font-normal tw-bg-opacity-10 hover:tw-text-gold focus:tw-outline-none focus:tw-bg-opacity-50 hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out tw-text-lg tw-text-gold hover:tw-text-gray-light tw-py-3 tw-px-8 tw-border tw-transition-colors tw-duration-300 tw-ease-in-out tw-border-gold tw-rounded-xl"
                    onClick={() => {
                      setTimestamp(0);
                      setAmount('');
                      setStakeForm(!stakeForm);
                      setExtendForm(false);
                      setIncreaseForm(false);
                      setWithdrawForm(false);
                    }}
                  >
                    Add New Stake
                  </button>
                )}
              </div>

              <div className="tw-mx-2 tw-bg-gray-800 tw-staking-box tw-p-8 tw-pb-6 tw-rounded-2xl tw-w-full xl:tw-w-1/4 tw-mb-5 xl:tw-mb-0">
                <p className="tw-text-lg tw--mt-1">Combined Voting Power</p>
                <p
                  className={`xl:tw-text-4-5xl tw-text-3xl tw-mt-2 tw-mb-6 ${
                    voteBalance.loading && 'skeleton'
                  }`}
                >
                  {numberFromWei(voteBalance.value).toLocaleString()}
                </p>
                <div className="tw-flex tw-flex-col tw-items-start">
                  <Link
                    to={'/'}
                    className="tw-bg-gold tw-font-normal tw-bg-opacity-10 tw-hover:text-gold tw-focus:outline-none tw-focus:bg-opacity-50 hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out tw-px-8 tw-py-3 tw-text-lg tw-text-gold tw-border tw-transition-colors tw-duration-300 tw-ease-in-out tw-border-gold tw-rounded-xl hover:tw-no-underline tw-no-underline tw-inline-block"
                  >
                    View Governance
                  </Link>
                </div>
              </div>
            </div>
            <p className="tw-font-semibold tw-text-lg tw-ml-6 tw-mb-4 tw-mt-6">
              Current Stakes
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

interface Stakes {
  stakes: any[] | any;
  loading: boolean;
  onIncrease: (a: number, b: number) => void;
  onExtend: (a: number, b: number) => void;
  onUnstake: (a: number, b: number) => void;
  onDelegate: (a: number) => void;
}

const StakesOverview: React.FC<Stakes> = ({
  stakes,
  loading,
  onIncrease,
  onExtend,
  onUnstake,
  onDelegate,
}) => {
  return (
    <>
      {loading && !stakes.length && (
        <tr>
          <td colSpan={99} className="text-center font-normal">
            Loading, please wait...
          </td>
        </tr>
      )}
      {!loading && !stakes.length && (
        <tr>
          <td colSpan={99} className="text-center font-normal">
            No stakes yet.
          </td>
        </tr>
      )}
      {stakes.map((item, i: string) => {
        const locked = Number(item[1]) > Math.round(now.getTime() / 1e3); //check if date is locked
        return (
          <tr key={i}>
            <td>
              <div className="assetname flex items-center">
                <div>
                  <img src={logoSvg} className="ml-3 mr-3" alt="sov" />
                </div>
                <div className="text-sm font-normal hidden xl:block pl-3">
                  SOV
                </div>
              </div>
            </td>
            <td className="text-left font-normal">
              {numberFromWei(item[0])} SOV
            </td>
            <td className="text-left hidden lg:table-cell font-normal">
              {item[2].length && (
                <>
                  Delegated to{' '}
                  <LinkToExplorer
                    isAddress={true}
                    txHash={item[2]}
                    className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                  />
                </>
              )}
              {!item[2].length && <p>No delegate</p>}
            </td>
            <td className="text-left hidden lg:table-cell font-normal">
              {locked && (
                <>
                  <br />
                  {Math.abs(
                    moment().diff(
                      moment(new Date(parseInt(item[1]) * 1e3)),
                      'days',
                    ),
                  )}{' '}
                  days
                </>
              )}
            </td>
            <td className="text-left hidden lg:table-cell font-normal">
              <p>
                {moment
                  .tz(new Date(parseInt(item[1]) * 1e3), 'GMT')
                  .format('DD/MM/YYYY - h:mm:ss a z')}
              </p>
            </td>
            <td className="md:text-left lg:text-right hidden md:table-cell max-w-15 min-w-15">
              <div className="flex flex-nowrap">
                <button
                  type="button"
                  className={`text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-7 px-4 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat ${
                    !locked &&
                    'bg-transparent hover:bg-opacity-0 opacity-50 cursor-not-allowed hover:bg-transparent'
                  }`}
                  onClick={() => onIncrease(item[0], item[1])}
                  disabled={!locked}
                >
                  Increase
                </button>
                <button
                  type="button"
                  className="text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-8 px-5 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat"
                  onClick={() => onExtend(item[0], item[1])}
                >
                  Extend
                </button>
                <button
                  type="button"
                  className="text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-8 px-5 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat"
                  onClick={() => onUnstake(item[0], item[1])}
                >
                  Unstake
                </button>
                <button
                  className={`text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-7 px-4 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat ${
                    !locked &&
                    'bg-transparent hover:bg-opacity-0 opacity-50 cursor-not-allowed hover:bg-transparent'
                  }`}
                  onClick={() => onDelegate(item[1])}
                  disabled={!locked}
                >
                  Delegate
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
};