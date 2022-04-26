import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Text } from '@blueprintjs/core/lib/esm/components/text/text';
import { MenuItem } from '@blueprintjs/core/lib/esm/components/menu/menuItem';
import { ItemRenderer } from '@blueprintjs/select/lib/esm/common/itemRenderer';
import { ItemPredicate } from '@blueprintjs/select/lib/esm/common/predicate';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import Carousel from 'react-multi-carousel';
import { CustomDot } from 'app/pages/LandingPage/components/Promotions/components/PromotionsCarousel/CustomDot';
import classNames from 'classnames';
import 'react-multi-carousel/lib/styles.css';
import { CustomButtonGroup } from './CustomButtonGroup';

interface DateItem {
  key: number;
  label: string;
  date: Date;
}
interface Props {
  title: string;
  kickoffTs: number;
  onClick: (value: number) => void;
  value?: number;
  startTs?: number;
  stakes?: string[];
  prevExtend?: number;
  autoselect?: boolean;
  delegate?: boolean;
}

const MAX_PERIODS = 78;
const ms = 1e3;

export function StakingDateSelector(props: Props) {
  const { t } = useTranslation();
  const [dates, setDates] = useState<Date[]>([]);
  const currentDate = useMemo(() => {
    return new Date();
  }, []);

  const currentUserOffset = currentDate.getTimezoneOffset() / 60;
  const onItemSelect = (item: { key: number }) =>
    props.onClick(
      Number(dayjs(item.key).subtract(currentUserOffset, 'hour')) / ms,
    );
  const [currentYearDates, setCurrenYearDates] = useState<DateItem[]>([]);
  const [filteredDates, setFilteredDates] = useState<DateItem[]>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [availableYears, availableMonth] = useMemo(() => {
    const availableYears = filteredDates
      .map(yearDate => dayjs(yearDate.date).format('YYYY'))
      .filter((year, index, arr) => arr.indexOf(year) === index);

    const availableMonth = currentYearDates
      .map(yearDate => dayjs(yearDate.date).format('MMM'))
      .filter((month, index, arr) => arr.indexOf(month) === index);
    return [availableYears, availableMonth];
  }, [currentYearDates, filteredDates]);

  const getDatesByYear = useCallback(
    year => {
      let theBigDay = new Date();
      theBigDay.setFullYear(year);
      return setCurrenYearDates(
        filteredDates.filter(
          item => new Date(item.date).getFullYear() === theBigDay.getFullYear(),
        ),
      );
    },
    [filteredDates],
  );

  useEffect(() => {
    setFilteredDates(
      dates.map(item => ({
        key: item.getTime(),
        label: item.toLocaleDateString(),
        date: item,
      })),
    );

    if (props.stakes) {
      const mappedStakes = props.stakes.map(item => ({
        key: Number(item) * ms,
        label: dayjs(new Date(Number(item) * ms)).format('L'),
        date: new Date(Number(item) * ms),
      }));
      props.delegate && setFilteredDates(mappedStakes);
    }
  }, [dates, props.startTs, props.stakes, props.delegate]);

  useEffect(() => {
    if (props.kickoffTs) {
      const contractDate = dayjs(props.kickoffTs * ms).toDate();
      const contractOffset = contractDate.getTimezoneOffset() / 60;
      const currentUserOffset = currentDate.getTimezoneOffset() / 60;

      let contractDateDeployed = dayjs(props.kickoffTs * ms).add(
        contractOffset,
        'hour',
      ); // get contract date in UTC-0
      let userDateUTC = dayjs(currentDate).add(currentUserOffset, 'hour'); // get user offset

      const dates: Date[] = [];
      const datesFutured: Date[] = [];
      // getting the last possible date in the contract that low then current date
      for (let i = 1; contractDateDeployed.unix() < userDateUTC.unix(); i++) {
        const intervalDate = contractDateDeployed.add(2, 'week');
        contractDateDeployed = intervalDate;
      }

      for (let i = 1; i < MAX_PERIODS; i++) {
        if (contractDateDeployed.unix() > userDateUTC.unix()) {
          const date = contractDateDeployed.add(2, 'week');
          contractDateDeployed = date;
          if (!props.prevExtend) dates.push(date.toDate());
          if (
            props.prevExtend &&
            dayjs(props.prevExtend * ms)
              .add(contractOffset, 'hour')
              .toDate()
              .getTime() /
              ms <
              date.unix()
          ) {
            datesFutured.push(date.toDate());
          }
        }
      }
      if (datesFutured.length) {
        setDates(datesFutured);
      } else {
        setDates(dates);
      }
    }
  }, [props.kickoffTs, props.value, props.prevExtend, currentDate]);

  return (
    <>
      {availableYears.length > 0 && (
        <label className="tw-block tw-mt-8 tw-text-sov-white tw-text-md tw-font-medium tw-mb-2">
          {props.delegate
            ? t(translations.stake.dateSelector.selectDelegate)
            : t(translations.stake.dateSelector.selectYear)}
        </label>
      )}
      <div className="tw-flex tw-flex-row">
        {availableYears.map((year, i) => {
          return (
            <div className="tw-mr-3" key={i}>
              <button
                type="button"
                onClick={() => {
                  getDatesByYear(year);
                  setSelectedYear(year);
                }}
                className={`tw-leading-7 tw-font-normal tw-rounded tw-border tw-border-secondary tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-secondary hover:tw-bg-opacity-30 md:tw-px-3 tw-px-2 tw-py-0 tw-text-center tw-border-r tw-text-md tw-text-secondary tw-tracking-tighter ${
                  selectedYear === year && 'tw-bg-opacity-30 tw-bg-secondary'
                }`}
              >
                {year}
              </button>
            </div>
          );
        })}
      </div>
      <div className="tw-mt-5 tw-pr-0 tw-relative">
        <Carousel
          key={selectedYear}
          arrows={false}
          responsive={{
            desktop: {
              breakpoint: { max: 4800, min: 0 },
              items: 6,
              slidesToSlide: 6,
            },
          }}
          draggable
          focusOnSelect={false}
          minimumTouchDrag={80}
          customDot={<CustomDot />}
          showDots
          customButtonGroup={<CustomButtonGroup />}
          renderButtonGroupOutside
          swipeable
        >
          {availableMonth.map((monthName: React.ReactNode, i) => {
            return (
              <div key={i}>
                <div className="tw-mb-1 tw-font-normal tw-text-sm tw-text-center tw-text-sov-white">
                  {monthName}
                  {currentYearDates.map((item, i) => {
                    if (dayjs(item.date).format('MMM') === monthName) {
                      const isDateSelected =
                        selectedDay === dayjs(item.date).format('D') &&
                        selectedMonth === dayjs(item.date).format('MMM');

                      return (
                        <div
                          key={i}
                          onClick={() => {
                            onItemSelect(item);
                            setSelectedDay(dayjs(item.date).format('D'));
                            setSelectedMonth(dayjs(item.date).format('MMM'));
                          }}
                          className={classNames(
                            'tw-flex tw-flex-col tw-items-center tw-justify-center tw-mr-1 tw-mb-1 tw-h-10 tw-leading-10 tw-rounded-lg tw-border tw-border-secondary tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-secondary hover:tw-bg-opacity-30 tw-px-5 tw-py-0 tw-text-center tw-border-r tw-text-md tw-text-secondary tw-tracking-tighter',
                            {
                              'tw-bg-opacity-30 tw-bg-secondary': isDateSelected,
                            },
                          )}
                        >
                          {dayjs(item.date)
                            .subtract(currentUserOffset, 'hour')
                            .format('D')}
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>
      {availableYears.length <= 0 && (
        <p className="tw-block tw-mt-4 tw-text-warning tw-text-sm tw-font-medium tw-mb-2">
          {t(translations.stake.dateSelector.noneAvailable)}
        </p>
      )}
    </>
  );
}

export const renderItem: ItemRenderer<DateItem> = (
  item,
  { handleClick, modifiers, query },
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={item.key}
      onClick={handleClick}
      text={<Text ellipsize>{highlightText(item.label, query)}</Text>}
    />
  );
};

export const filterItem: ItemPredicate<DateItem> = (
  query,
  item,
  _index,
  exactMatch,
) => {
  const normalizedTitle = item.label.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return normalizedTitle.indexOf(normalizedQuery) >= 0;
  }
};

export function highlightText(text: string, query: string) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join('|'), 'gi');
  const tokens: React.ReactNode[] = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}

export function escapeRegExpChars(text: string) {
  // eslint-disable-next-line no-useless-escape
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
