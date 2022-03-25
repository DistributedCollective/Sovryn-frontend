import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import Rsk3 from '@rsksmart/rsk3';
import { Tooltip } from '@blueprintjs/core';
import { bignumber } from 'mathjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { weiTo4, toWei, fromWei } from 'utils/blockchain/math-helpers';
import { numberToUSD } from 'utils/display-text/format';
import { contractReader } from 'utils/sovryn/contract-reader';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import {
  staking_allowance,
  staking_approve,
} from 'utils/blockchain/requests/staking';
import { Asset } from '../../../types';
import { Modal } from '../../components/Modal';
import { CurrentVests } from './components/CurrentVests';
import { CurrentStakes } from './components/CurrentStakes';
import { DelegateForm } from './components/DelegateForm';
import { ExtendStakeForm } from './components/ExtendStakeForm';
import { IncreaseStakeForm } from './components/IncreaseStakeForm';
import { WithdrawForm } from './components/WithdrawForm';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { HistoryEventsTable } from './components/HistoryEventsTable';
import { useStaking_getStakes } from '../../hooks/staking/useStaking_getStakes';
import { useStaking_kickoffTs } from '../../hooks/staking/useStaking_kickoffTs';
import { useStaking_balanceOf } from '../../hooks/staking/useStaking_balanceOf';
import { useStaking_WEIGHT_FACTOR } from '../../hooks/staking/useStaking_WEIGHT_FACTOR';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { useStaking_getCurrentVotes } from '../../hooks/staking/useStaking_getCurrentVotes';
import { useStaking_computeWeightByDate } from '../../hooks/staking/useStaking_computeWeightByDate';
import { StakeForm } from './components/StakeForm';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { useStakeIncrease } from '../../hooks/staking/useStakeIncrease';
import { useStakeStake } from '../../hooks/staking/useStakeStake';
import { useStakeWithdraw } from '../../hooks/staking/useStakeWithdraw';
import { useStakeExtend } from '../../hooks/staking/useStakeExtend';
import { useStakeDelegate } from '../../hooks/staking/useStakeDelegate';
import { useVestingDelegate } from '../../hooks/staking/useVestingDelegate';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { AssetDetails } from 'utils/models/asset-details';
import { getUSDSum } from '../../../utils/helpers';
import { FeeBlock } from './components/FeeBlock';
import { Spinner, SpinnerSize } from 'app/components/Spinner';

const now = new Date();

export const StakePage: React.FC = () => {
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
      <main>
        <div className="tw-bg-gray-1 tw-tracking-normal">
          <div className="tw-container tw-mx-auto tw-px-6">
            <h2 className="tw-text-sov-white tw-pt-8 tw-pb-5 tw-pl-10">
              {t(translations.stake.title)}
            </h2>
            <div className="tw-w-full tw-bg-gray-1 tw-text-center tw-rounded-b tw-shadow tw-p-3">
              <i>{t(translations.stake.connect)}</i>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

const InnerStakePage: React.FC = () => {
  const { t } = useTranslation();
  const account = useAccount();
  const [amount, setAmount] = useState('');
  const weiAmount = useWeiAmount(amount);
  const [weight, setWeight] = useState('');
  const kickoffTs = useStaking_kickoffTs();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { dates } = useStaking_getStakes(account).value;
  const balanceOf = useStaking_balanceOf(account);
  const WEIGHT_FACTOR = useStaking_WEIGHT_FACTOR();
  const [stakeAmount, setStakeAmount] = useState('0');
  const [stakeForm, setStakeForm] = useState(false);
  const [extendForm, setExtendForm] = useState(false);
  const [until, setUntil] = useState(0);
  const [delegateForm, setDelegateForm] = useState(false);
  const [isStakeDelegate, setIsStakeDelegate] = useState(true);
  const [withdrawForm, setWithdrawForm] = useState(false);
  const [increaseForm, setIncreaseForm] = useState(false);
  const voteBalance = useStaking_getCurrentVotes(account);
  const [lockDate, setLockDate] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [vestingContractAddress, setVestingContractAddress] = useState('');
  const [votingPower, setVotingPower] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('0');
  const weiWithdrawAmount = useWeiAmount(withdrawAmount);
  const [prevTimestamp, setPrevTimestamp] = useState<number | undefined>(
    undefined,
  );
  const getWeight = useStaking_computeWeightByDate(
    Number(lockDate),
    Math.round(now.getTime() / 1e3),
  );
  const [assetsUsd, setAssetsUsd] = useState<{
    [assets: string]: number;
  }>({});
  const usdTotal = useMemo(() => getUSDSum(Object.values(assetsUsd)), [
    assetsUsd,
  ]);
  const assets = AssetsDictionary.list();
  const { value: sovBalance, loading: sovBalanceLoading } = useAssetBalanceOf(
    Asset.SOV,
  );
  const { increase, ...increaseTx } = useStakeIncrease();
  const { stake, ...stakeTx } = useStakeStake();
  const { extend, ...extendTx } = useStakeExtend();
  const { withdraw, ...withdrawTx } = useStakeWithdraw();
  const { delegate, ...delegateTx } = useStakeDelegate();
  const {
    delegate: vestingDelegate,
    ...vestingDelegateTx
  } = useVestingDelegate(vestingContractAddress);

  const { checkMaintenance, States } = useMaintenance();
  const stakingLocked = checkMaintenance(States.STAKING);

  useEffect(() => {
    if (timestamp && weiAmount && (stakeForm || increaseForm || extendForm)) {
      setLockDate(timestamp);
      setWeight(getWeight.value);
      setVotingPower(
        (Number(weiAmount) * Number(weight)) / Number(WEIGHT_FACTOR.value),
      );
    } else {
      setLockDate(timestamp);
      setWeight('');
      setVotingPower(0);
    }
  }, [
    getWeight.value,
    weight,
    stakeForm,
    WEIGHT_FACTOR.value,
    weiAmount,
    timestamp,
    increaseForm,
    extendForm,
  ]);

  //Form Validations
  const validateStakeForm = useCallback(() => {
    if (loading || stakeTx.loading) return false;
    const num = toWei(amount);
    if (!num || bignumber(num).lessThanOrEqualTo(0)) return false;
    if (!timestamp || timestamp < Math.round(now.getTime() / 1e3)) return false;
    return bignumber(num).lessThanOrEqualTo(sovBalance);
  }, [loading, amount, sovBalance, timestamp, stakeTx.loading]);

  const validateDelegateForm = useCallback(() => {
    if (loading) return false;
    if (!timestamp || timestamp < Math.round(now.getTime() / 1e3)) return false;
    return Rsk3.utils.isAddress(address.toLowerCase());
  }, [loading, address, timestamp]);

  const validateIncreaseForm = useCallback(() => {
    if (loading || increaseTx.loading) return false;
    const num = toWei(amount);
    if (!num || bignumber(num).lessThanOrEqualTo(0)) return false;
    return bignumber(num).lessThanOrEqualTo(sovBalance);
  }, [loading, amount, sovBalance, increaseTx.loading]);

  const validateWithdrawForm = useCallback(
    amount => {
      if (loading) return false;
      const num = toWei(withdrawAmount);
      if (!num || bignumber(num).lessThanOrEqualTo(0)) return false;
      return bignumber(num).lessThanOrEqualTo(toWei(amount));
    },
    [withdrawAmount, loading],
  );
  const validateExtendTimeForm = useCallback(() => {
    if (loading || extendTx.loading || timestamp === prevTimestamp)
      return false;
    return timestamp >= Math.round(now.getTime() / 1e3);
  }, [loading, timestamp, extendTx.loading, prevTimestamp]);

  //Submit Forms
  const handleWithdrawSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      if (!withdrawTx.loading) {
        if (bignumber(weiWithdrawAmount).greaterThan(stakeAmount)) {
          withdraw(stakeAmount.toString(), until);
        } else {
          withdraw(weiWithdrawAmount, until);
        }
      }
      setLoading(false);
      setWithdrawForm(!withdrawForm);
    },
    [
      weiWithdrawAmount,
      until,
      withdrawForm,
      stakeAmount,
      withdrawTx.loading,
      withdraw,
    ],
  );

  const handleStakeSubmit = useCallback(
    async e => {
      e.preventDefault();
      try {
        setLoading(true);
        let nonce = await contractReader.nonce(account);
        const allowance = (await staking_allowance(account)) as string;
        if (bignumber(allowance).lessThan(weiAmount)) {
          await staking_approve(sovBalance);
          nonce += 1;
        }
        if (!stakeTx.loading) {
          stake(weiAmount, timestamp + 3600, nonce);
          setStakeForm(!stakeForm);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    },
    [
      weiAmount,
      sovBalance,
      account,
      timestamp,
      stakeForm,
      stakeTx.loading,
      stake,
    ],
  );

  const handleDelegateSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      if (!delegateTx.loading) {
        delegate(address.toLowerCase(), Number(timestamp));
        setLoading(false);
        setDelegateForm(!delegateForm);
      }
    },
    [address, timestamp, delegateForm, delegateTx.loading, delegate],
  );

  const handleVestingDelegateSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      if (!vestingDelegateTx.loading) {
        vestingDelegate(address.toLowerCase());
        setLoading(false);
        setDelegateForm(!delegateForm);
      }
    },
    [vestingDelegateTx.loading, vestingDelegate, address, delegateForm],
  );

  const handleIncreaseStakeSubmit = useCallback(
    async e => {
      try {
        e.preventDefault();
        setLoading(true);
        let nonce = await contractReader.nonce(account);
        const allowance = (await staking_allowance(account)) as string;
        if (bignumber(allowance).lessThan(weiAmount)) {
          await staking_approve(weiAmount);
          nonce += 1;
        }
        if (!increaseTx.loading) {
          increase(weiAmount, timestamp, nonce);
          setLoading(false);
          setIncreaseForm(!increaseForm);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    },
    [weiAmount, account, timestamp, increaseForm, increaseTx.loading, increase],
  );

  const handleExtendTimeSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      if (!extendTx.loading) {
        extend(Number(prevTimestamp), Number(timestamp) + 3600);
        setLoading(false);
        setExtendForm(!extendForm);
      }
    },
    [prevTimestamp, timestamp, extendForm, extendTx.loading, extend],
  );

  const updateUsdTotal = useCallback(
    (asset: AssetDetails, e: number) =>
      setAssetsUsd(assetsUsd => ({ ...assetsUsd, [asset.asset]: e })),
    [],
  );

  const onDelegate = useCallback((a, b) => {
    setTimestamp(b);
    setIsStakeDelegate(true);
    setAmount(fromWei(a));
    setDelegateForm(delegateForm => !delegateForm);
  }, []);
  const onExtend = useCallback((a, b) => {
    setPrevTimestamp(b);
    setTimestamp(b);
    setAmount(fromWei(a));
    setStakeForm(false);
    setExtendForm(true);
    setIncreaseForm(false);
    setWithdrawForm(false);
  }, []);
  const onIncrease = useCallback((a, b) => {
    setTimestamp(b);
    setAmount(fromWei(a));
    setUntil(b);
    setStakeForm(false);
    setExtendForm(false);
    setIncreaseForm(true);
    setWithdrawForm(false);
  }, []);
  const onUnstake = useCallback((a, b) => {
    setAmount(fromWei(a));
    setWithdrawAmount('0');
    setStakeAmount(a);
    setTimestamp(b);
    setUntil(b);
    setStakeForm(false);
    setExtendForm(false);
    setIncreaseForm(false);
    setWithdrawForm(true);
  }, []);

  const onDelegateVest = useCallback((timestamp, contractAddress) => {
    setTimestamp(timestamp);
    setIsStakeDelegate(false);
    setVestingContractAddress(contractAddress);
    setDelegateForm(delegateForm => !delegateForm);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t(translations.stake.title)}</title>
      </Helmet>
      <main>
        <div className="tw-bg-gray-1 tw-tracking-normal">
          <div className="tw-container tw-mx-auto tw-px-6">
            <h2 className="tw-text-sov-white tw-pt-8 tw-pb-5 tw-pl-10">
              {t(translations.stake.title)}
            </h2>
            <div className="lg:tw-flex tw-items-stretch tw-justify-around tw-mt-2">
              <div className="tw-staking-box tw-bg-gray-3 tw-p-8 tw-pb-6 tw-mb-5 tw-rounded-2xl lg:tw-w-1/3 lg:tw-mx-2 lg:tw-mb-0 2xl:tw-w-1/4">
                <p className="tw-text-lg tw--mt-1">
                  {t(translations.stake.total)}
                </p>
                <div className="xl:tw-text-4xl tw-text-3xl tw-mt-2 tw-mb-6">
                  {weiTo4(balanceOf.value)} SOV
                  {balanceOf.loading && (
                    <Spinner
                      size={SpinnerSize.SM}
                      className="tw-inline-block tw-m-2"
                    />
                  )}
                </div>
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
                        sovBalance={sovBalance}
                        isValid={validateStakeForm()}
                        kickoff={kickoffTs}
                        stakes={dates}
                        votePower={votingPower}
                        onCloseModal={() => setStakeForm(!stakeForm)}
                      />
                    </>
                  }
                />
                {sovBalance !== '0' && !stakingLocked ? (
                  <button
                    type="button"
                    className="tw-bg-primary tw-font-normal tw-bg-opacity-10 hover:tw-text-primary focus:tw-outline-none focus:tw-bg-opacity-50 hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out tw-text-lg tw-text-primary tw-py-3 tw-px-8 tw-border tw-transition-colors tw-duration-300 tw-ease-in-out tw-border-primary tw-rounded-xl"
                    onClick={() => {
                      setTimestamp(0);
                      setAmount('');
                      setStakeForm(!stakeForm);
                      setExtendForm(false);
                      setIncreaseForm(false);
                      setWithdrawForm(false);
                    }}
                  >
                    {t(translations.stake.addStake)}
                  </button>
                ) : (
                  <Tooltip
                    position="bottom"
                    hoverOpenDelay={0}
                    hoverCloseDelay={0}
                    interactionKind="hover"
                    content={
                      <>
                        {stakingLocked
                          ? t(translations.maintenance.staking)
                          : t(translations.stake.noUnlockedSov)}
                      </>
                    }
                  >
                    <button
                      type="button"
                      className="tw-bg-primary tw-font-normal tw-bg-opacity-10 hover:tw-text-primary tw-transition tw-duration-500 tw-ease-in-out tw-text-lg tw-text-primary tw-py-3 tw-px-8 tw-border tw-transition-colors tw-duration-300 tw-ease-in-out tw-border-primary tw-rounded-xl tw-bg-transparent tw-opacity-50 tw-cursor-not-allowed"
                    >
                      {t(translations.stake.addStake)}
                    </button>
                  </Tooltip>
                )}
              </div>
              <div className="tw-staking-box tw-bg-gray-3 tw-p-8 tw-pb-6 tw-mb-5 tw-rounded-2xl tw-text-sm tw-w-full lg:tw-w-1/3 lg:tw-mb-0 lg:tw-mx-2 2xl:tw-w-1/4 ">
                <p className="tw-text-lg tw--mt-1">
                  {t(translations.stake.feeTitle)}
                </p>
                <p className="tw-text-4xl tw-mt-2 tw-mb-6">
                  ≈ {numberToUSD(usdTotal)}
                </p>
                {assets.map((item, i) => {
                  if (item.asset === 'CSOV') return '';
                  return (
                    <FeeBlock
                      updateUsdTotal={updateUsdTotal}
                      key={item.asset}
                      contractToken={item}
                    />
                  );
                })}
                <FeeBlock
                  updateUsdTotal={updateUsdTotal}
                  contractToken={AssetsDictionary.get(Asset.SOV)}
                  title={t(translations.stake.vestingFees)}
                  useNewContract
                />
              </div>
              <div className="tw-staking-box tw-bg-gray-3 tw-p-8 tw-pb-6 tw-mb-5 tw-rounded-2xl lg:tw-w-1/3 lg:tw-mx-2 lg:tw-mb-0 2xl:tw-w-1/4">
                <p className="tw-text-lg tw--mt-1">
                  {t(translations.stake.votingPower)}
                </p>
                <div className="xl:tw-text-4xl tw-text-3xl tw-mt-2 tw-mb-6">
                  {weiTo4(voteBalance.value)}
                  {voteBalance.loading && (
                    <Spinner
                      size={SpinnerSize.SM}
                      className="tw-inline-block tw-m-2"
                    />
                  )}
                </div>
                <div className="tw-flex tw-flex-col tw-items-start">
                  <div className="tw-bg-primary tw-font-normal tw-bg-opacity-10 tw-hover:text-primary tw-focus:outline-none tw-focus:bg-opacity-50 hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out tw-px-8 tw-py-3 tw-text-lg tw-text-primary tw-border tw-transition-colors tw-duration-300 tw-ease-in-out tw-border-primary tw-rounded-xl hover:tw-no-underline tw-no-underline tw-inline-block">
                    <a
                      href="https://bitocracy.sovryn.app/"
                      rel="noopener noreferrer"
                      target="_blank"
                      className="hover:tw-no-underline"
                    >
                      {t(translations.stake.viewGovernance)}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              show={delegateForm}
              content={
                <>
                  <DelegateForm
                    handleSubmit={e =>
                      isStakeDelegate
                        ? handleDelegateSubmit(e)
                        : handleVestingDelegateSubmit(e)
                    }
                    address={address}
                    timestamp={Number(timestamp)}
                    weiAmount={weiAmount}
                    onChangeAddress={e => setAddress(e)}
                    isValid={validateDelegateForm()}
                    onCloseModal={() => setDelegateForm(!delegateForm)}
                  />
                </>
              }
            />
            <CurrentStakes
              onDelegate={onDelegate}
              onExtend={onExtend}
              onIncrease={onIncrease}
              onUnstake={onUnstake}
            />
            <CurrentVests onDelegate={onDelegateVest} />
            <HistoryEventsTable />
          </div>
          <TxDialog tx={increaseTx} />
          <TxDialog tx={stakeTx} />
          <TxDialog tx={extendTx} />
          <TxDialog tx={withdrawTx} />
          <TxDialog tx={delegateTx} />
          <TxDialog tx={vestingDelegateTx} />

          <>
            {balanceOf.value !== '0' && (
              <>
                {increaseForm === true && (
                  <Modal
                    show={increaseForm}
                    content={
                      <>
                        <IncreaseStakeForm
                          handleSubmit={handleIncreaseStakeSubmit}
                          amount={amount}
                          timestamp={timestamp}
                          onChangeAmount={e => setAmount(e)}
                          sovBalance={sovBalance}
                          isValid={validateIncreaseForm()}
                          balanceOf={balanceOf}
                          votePower={votingPower}
                          onCloseModal={() => setIncreaseForm(!increaseForm)}
                        />
                      </>
                    }
                  />
                )}
                {extendForm === true && (
                  <Modal
                    show={extendForm}
                    content={
                      <>
                        {kickoffTs.value !== '0' && prevTimestamp && (
                          <ExtendStakeForm
                            handleSubmit={handleExtendTimeSubmit}
                            amount={amount}
                            timestamp={0}
                            onChangeTimestamp={e => setTimestamp(e)}
                            sovBalance={sovBalance}
                            isSovBalanceLoading={sovBalanceLoading}
                            kickoff={kickoffTs}
                            isValid={validateExtendTimeForm()}
                            stakes={dates}
                            balanceOf={balanceOf}
                            votePower={votingPower}
                            prevExtend={prevTimestamp}
                            onCloseModal={() => setExtendForm(!extendForm)}
                          />
                        )}
                      </>
                    }
                  />
                )}
                {withdrawForm === true && (
                  <Modal
                    show={withdrawForm}
                    content={
                      <>
                        <WithdrawForm
                          handleSubmit={handleWithdrawSubmit}
                          withdrawAmount={withdrawAmount}
                          amount={amount}
                          until={timestamp}
                          onChangeAmount={e => setWithdrawAmount(e)}
                          balanceOf={balanceOf}
                          isValid={validateWithdrawForm(amount)}
                          onCloseModal={() => setWithdrawForm(!withdrawForm)}
                        />
                      </>
                    }
                  />
                )}
              </>
            )}
          </>
        </div>
      </main>
    </>
  );
};
