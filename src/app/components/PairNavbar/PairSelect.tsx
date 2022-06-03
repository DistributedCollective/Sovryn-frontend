import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { Input } from 'app/components/Form/Input';
import { IPairsData, ITradingPairs, TradingType } from 'types/trading-pairs';
import { selectSpotTradingPage } from 'app/pages/SpotTradingPage/selectors';
import { selectMarginTradePage } from 'app/pages/MarginTradePage/selectors';
import { Pair } from './Pair';
import { PairLabels } from './PairLabels';
import { StarButton } from 'app/components/StarButton';
import { useOnClickOutside } from 'app/hooks/useOnClickOutside';
import arrowDownIcon from 'assets/images/swap/ic_arrow_down.svg';
import searchIcon from 'assets/images/search.svg';
import { PairCryptocurrency } from './PairCryptocurrency';
import { CSSTransition } from 'react-transition-group';

const FAVORITE = 'FAVORITE';

interface IPairSelect {
  onPairChange: (value: ITradingPairs) => void;
  onPairClick: () => void;
  storageKey: string;
  pairsData: IPairsData;
  type: string;
  isOpen: boolean;
}

export const PairSelect: React.FC<IPairSelect> = ({
  storageKey,
  onPairChange,
  pairsData,
  type,
  isOpen,
  onPairClick,
}) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { pairType: pairSpotType } = useSelector(selectSpotTradingPage);
  const { pairType: pairMarginType } = useSelector(selectMarginTradePage);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const nodeRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([ref], () => isOpen && onPairClick());

  return (
    <div
      ref={ref}
      className="tw-relative lg:tw-w-64 tw-w-56 tw-self-stretch tw-mr-2"
    >
      <div
        onClick={() => onPairClick()}
        className={classNames(
          { 'tw-rounded-b-lg': !isOpen },
          'tw-flex tw-h-full tw-items-center tw-py-1 tw-bg-gray-2 lg:tw-px-8 tw-px-4 tw-rounded-t-lg tw-cursor-pointer tw-select-none tw-transition-opacity hover:tw-bg-opacity-75',
        )}
        data-action-id={`${type}-pairSelector`}
      >
        <div className="tw-flex-1">
          <Pair
            type={type}
            tradingType={
              type === TradingType.SPOT ? pairSpotType : pairMarginType
            }
          />
        </div>
        <img
          className={classNames('tw-w-5 tw-transition-transform ', {
            'tw-transform tw-rotate-180': isOpen,
          })}
          src={arrowDownIcon}
          alt="Arrow"
        />
      </div>

      <CSSTransition
        unmountOnExit
        classNames="dropdown"
        in={isOpen}
        nodeRef={nodeRef}
        timeout={200}
      >
        <div
          ref={nodeRef}
          className="tw-absolute tw-transform tw-translate-y-full tw-bottom-0 tw-left-0 tw-bg-gray-2 tw-py-7 tw-px-9 tw-rounded-b-lg tw-z-50"
        >
          <Input
            value={search}
            className="tw-rounded-lg search tw-max-w-full"
            inputClassName="tw-ml-0"
            onChange={setSearch}
            placeholder={t(translations.pairNavbar.search)}
            prependElem={
              <img className="tw-w-5" src={searchIcon} alt="Search" />
            }
            data-action-id={`${type}-pairSelector-search-input`}
          />

          <div className="tw-flex tw-items-center tw-mt-3">
            <StarButton
              className="tw-mr-4"
              active={category === FAVORITE}
              onClick={() => setCategory(FAVORITE)}
            />
            {pairsData && (
              <PairLabels
                pairs={pairsData.pairs}
                onChangeCategory={setCategory}
                category={category}
                type={type}
              />
            )}
          </div>
          {pairsData && (
            <div className="tw-mt-3">
              <PairCryptocurrency
                pairs={pairsData.pairs}
                storageKey={storageKey}
                category={category}
                search={search}
                onPairChange={onPairChange}
                type={type}
              />
            </div>
          )}
        </div>
      </CSSTransition>
    </div>
  );
};
