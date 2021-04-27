import React, { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
import { numberFromWei } from 'utils/helpers';
import { ethGenesisAddress } from 'utils/classifiers';
import logoSvg from 'assets/images/sovryn-icon.svg';
import moment from 'moment-timezone';
// import { actions } from 'utils/blockchain/slice';
import { contractReader } from 'utils/sovryn/contract-reader';
import { useAccount } from '../../../hooks/useAccount';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { useStaking_balanceOf } from '../../../hooks/staking/useStaking_balanceOf';
import { useStaking_getStakes } from '../../../hooks/staking/useStaking_getStakes';
import { Modal } from '../../../components/Modal';
import { WithdrawVesting } from './WithdrawVesting';
import {
  vesting_getEndDate,
  vesting_getStartDate,
} from 'utils/blockchain/requests/vesting';

interface Props {
  vestingAddress: string;
  type: 'genesis' | 'origin' | 'team';
}

export function VestingContract(props: Props) {
  const account = useAccount();
  // const dispatch = useDispatch();
  const getStakes = useStaking_getStakes(props.vestingAddress);
  const lockedAmount = useStaking_balanceOf(props.vestingAddress);
  const [stakingPeriodStart, setStakingPeriodStart] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [vestLoading, setVestLoading] = useState(false);
  const [locked, setLocked] = useState(true);
  const [delegate, setDelegate] = useState<any>([]);
  const [delegateLoading, setDelegateLoading] = useState(false);

  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => {
    async function getVestsList() {
      try {
        setVestLoading(true);
        Promise.all([
          vesting_getStartDate(props.vestingAddress).then(res =>
            setStakingPeriodStart(res as any),
          ),
          vesting_getEndDate(props.vestingAddress).then(res =>
            setUnlockDate(res as any),
          ),
        ]).then(_ => setVestLoading(false));
        setVestLoading(false);
      } catch (e) {
        console.error(e);
        setVestLoading(false);
      }
    }
    setVestLoading(false);
    if (props.vestingAddress !== ethGenesisAddress) {
      getVestsList().catch(console.error);
    }
  }, [props.vestingAddress, account]);

  useEffect(() => {
    async function getDelegate() {
      setDelegateLoading(true);
      try {
        await contractReader
          .call('staking', 'delegates', [
            props.vestingAddress,
            Number(
              getStakes.value['dates'][getStakes.value['dates'].length - 2],
            ),
          ])
          .then(res => {
            setDelegateLoading(false);
            if (
              res.toString().toLowerCase() !==
              props.vestingAddress.toLowerCase()
            ) {
              setDelegate(res);
            }
            return false;
          });
      } catch (e) {
        console.error(e);
        setDelegateLoading(false);
      }
    }
    if (unlockDate !== '') {
      getDelegate();
      setLocked(Number(unlockDate) > Math.round(new Date().getTime() / 1e3));
    }
  }, [props.vestingAddress, unlockDate, delegate, getStakes.value]);

  return (
    <>
      {vestLoading ? (
        <tr>
          <td colSpan={7} className="skeleton" />
        </tr>
      ) : (
        <tr>
          <td>
            <div className="assetname tw-flex tw-items-center">
              <div>
                <img src={logoSvg} className="tw-ml-3 tw-mr-3" alt="sov" />
              </div>
              <div className="tw-text-sm tw-font-normal tw-hidden xl:tw-block tw-pl-3">
                {props.type === 'genesis' && 'CSOV Genesis'}
                {props.type === 'origin' && 'SOV Origin'}
                {props.type === 'team' && 'SOV Team'}
              </div>
            </div>
          </td>
          <td className="tw-text-left tw-font-normal">
            <p className={`${lockedAmount.loading && 'skeleton'}`}>
              {numberFromWei(lockedAmount.value)}{' '}
              {props.type === 'genesis' ? 'CSOV' : 'SOV'}
            </p>
          </td>
          <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
            <p className={`${delegateLoading && 'skeleton'}`}>
              {delegate.length > 0 && (
                <>
                  Delegated to{' '}
                  <LinkToExplorer
                    isAddress={true}
                    txHash={delegate}
                    className={`tw-text-gold hover:tw-text-gold hover:tw-underline tw-font-medium tw-font-montserrat tw-tracking-normal ${
                      delegateLoading && 'skeleton'
                    }`}
                  />
                </>
              )}
              {!delegate.length && <>No delegate</>}
            </p>
          </td>
          <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
            <p>
              {moment
                .tz(new Date(parseInt(stakingPeriodStart) * 1e3), 'GMT')
                .format('DD/MM/YYYY - h:mm:ss a z')}
            </p>
          </td>
          <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
            {locked && (
              <p className={`${!unlockDate && 'skeleton'}`}>
                {Math.abs(
                  moment().diff(
                    moment(new Date(parseInt(unlockDate) * 1e3)),
                    'days',
                  ),
                )}{' '}
                days
              </p>
            )}
          </td>
          <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
            <p className={`${!unlockDate && 'skeleton'}`}>
              {moment
                .tz(new Date(parseInt(unlockDate) * 1e3), 'GMT')
                .format('DD/MM/YYYY - h:mm:ss a z')}
            </p>
          </td>
          <td className="md:tw-text-left lg:tw-text-right tw-hidden md:tw-table-cell max-w-15 min-w-15">
            <div className="tw-flex tw-flex-nowrap tw-justify-end">
              <button
                className="tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-no-underline hover:tw-bg-gold hover:tw-bg-opacity-30 tw-mr-1 xl:tw-mr-7 tw-px-4 tw-py-2 tw-bordered tw-transition tw-duration-500 tw-ease-in-out tw-rounded-full tw-border tw-border-gold tw-text-sm tw-font-light tw-font-montserrat"
                // onClick={() => {
                //   dispatch(actions.vestingType(props.type));
                //   dispatch(actions.toggleDelagationDialog(true));
                // }}
              >
                Delegate
              </button>
              <button
                type="button"
                className="tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-no-underline hover:tw-bg-gold hover:tw-bg-opacity-30 tw-mr-1 xl:tw-mr-12 tw-px-4 tw-py-2 tw-bordered tw-transition tw-duration-500 tw-ease-in-out tw-rounded-full tw-border tw-border-gold tw-text-sm tw-font-light tw-font-montserrat"
                onClick={() => setShowWithdraw(true)}
                disabled={
                  !props.vestingAddress ||
                  props.vestingAddress === ethGenesisAddress
                }
              >
                Withdraw
              </button>
            </div>
          </td>
        </tr>
      )}
      <Modal
        show={showWithdraw}
        content={
          <>
            <WithdrawVesting
              vesting={props.vestingAddress}
              onCloseModal={() => setShowWithdraw(false)}
            />
          </>
        }
      />
    </>
  );
}
