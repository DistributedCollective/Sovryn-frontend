import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Slider from 'react-slick';
import dayjs from 'dayjs';
import { Icon } from '@blueprintjs/core';
import { Text } from '@blueprintjs/core/lib/esm/components/text/text';
import { MenuItem } from '@blueprintjs/core/lib/esm/components/menu/menuItem';
import { ItemRenderer } from '@blueprintjs/select/lib/esm/common/itemRenderer';
import { ItemPredicate } from '@blueprintjs/select/lib/esm/common/predicate';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

const maxPeriods = 78;

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

export function StakingDateSelector(props: Props) {
  const { t } = useTranslation();
  const onItemSelect = (item: { key: number }) => props.onClick(item.key / 1e3);
  const [dates, setDates] = useState<Date[]>([]);
  const [currentYearDates, setCurrenYearDates] = useState<DateItem[]>([]);
  const [filteredDates, setFilteredDates] = useState<DateItem[]>([]);
  const [itemDisabled, setItemDisabled] = useState<DateItem[]>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const [dateWithoutStake, availableYears, availableMonth] = useMemo(() => {
    const dateWithoutStake = filteredDates.reduce(
      (uniqueItems: DateItem[], item: DateItem) => {
        const isDisabled = itemDisabled.some((b: DateItem) => {
          return b.key === item.key;
        });
        if (!isDisabled) {
          uniqueItems.push(item);
        }
        return uniqueItems;
      },
      [],
    );

    const availableYears = dateWithoutStake
      .map(yearDate => dayjs(yearDate.date).format('YYYY'))
      .filter((year, index, arr) => arr.indexOf(year) === index);

    const availableMonth = currentYearDates
      .map(yearDate => dayjs(yearDate.date).format('MMM'))
      .filter((month, index, arr) => arr.indexOf(month) === index);
    return [dateWithoutStake, availableYears, availableMonth];
  }, [currentYearDates, filteredDates, itemDisabled]);

  const getDatesByYear = useCallback(
    year => {
      let theBigDay = new Date();
      theBigDay.setFullYear(year);
      return setCurrenYearDates(
        dateWithoutStake.filter(
          item => new Date(item.date).getFullYear() === theBigDay.getFullYear(),
        ),
      );
    },
    [dateWithoutStake],
  );

  useEffect(() => {
    let filtered: Date[] = [];
    if (!!props.startTs) {
      filtered = dates.filter(
        item => item.getTime() > ((props.startTs as unknown) as number),
      );
    } else {
      const closestAllowed = dayjs().add(14, 'days').valueOf();
      filtered = dates.filter(item => {
        return item.getTime() > closestAllowed;
      });
    }

    setFilteredDates(
      filtered.map(item => ({
        key: item.getTime(),
        label: item.toLocaleDateString(),
        date: item,
      })),
    );

    if (props.stakes) {
      const mappedStakes = props.stakes.map(item => ({
        key: Number(item) * 1e3,
        label: dayjs(new Date(Number(item) * 1e3)).format('L'),
        date: new Date(Number(item) * 1e3),
      }));

      props.delegate
        ? setFilteredDates(mappedStakes)
        : setItemDisabled(mappedStakes);
    }
  }, [dates, props.startTs, props.stakes, props.delegate]);

  useEffect(() => {
    if (props.kickoffTs) {
      const dates: Date[] = [];
      const datesFutured: Date[] = [];
      let contractDateDeployed = dayjs(props.kickoffTs * 1e3); // date when contract has been deployed ~ 1613220308
      let currentDate = Math.round(new Date().getTime() / 1e3);
      //getting the last posible date in the contract that low then current date
      for (let i = 1; contractDateDeployed.unix() <= currentDate; i++) {
        const intervalDate = contractDateDeployed.add(2, 'weeks');
        contractDateDeployed = intervalDate;
      }
      for (let i = 1; i < maxPeriods; i++) {
        if (contractDateDeployed.unix() >= currentDate) {
          const date = contractDateDeployed.add(2, 'weeks');
          contractDateDeployed = date;
          if (!props.prevExtend) dates.push(date.toDate());
          if (props.prevExtend && props.prevExtend <= date.unix()) {
            datesFutured.push(date.clone().toDate());
          }
        }
      }

      if (datesFutured.length) {
        setDates(datesFutured);
      } else {
        setDates(dates);
      }
    }
  }, [props.kickoffTs, props.value, props.prevExtend]);

  const SampleNextArrow = props => {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <Icon icon="chevron-right" iconSize={25} color="white" />
      </div>
    );
  };

  const SamplePrevArrow = props => {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <Icon icon="chevron-left" iconSize={25} color="white" />
      </div>
    );
  };

  const settingsSliderMonth = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      {availableYears.length > 0 && (
        <label className="tw-block tw-mt-8 tw-text-theme-white tw-text-md tw-font-medium tw-mb-2">
          {props.delegate
            ? t(translations.stake.dateSelector.selectDelegate)
            : t(translations.stake.dateSelector.selectYear)}
        </label>
      )}
      <div className="tw-flex tw-flex-row">
        {availableYears.map((year, i) => {
          return (
            <div className="tw-mr-5" key={i}>
              <button
                type="button"
                onClick={() => {
                  getDatesByYear(year);
                  setSelectedYear(year);
                }}
                className={`tw-leading-7 tw-font-normal tw-rounded tw-border tw-border-theme-blue tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 md:tw-px-4 tw-px-2 tw-py-0 tw-text-center tw-border-r tw-text-md tw-text-theme-blue tw-tracking-tighter ${
                  selectedYear === year && 'tw-bg-opacity-30 tw-bg-theme-blue'
                }`}
              >
                {year}
              </button>
            </div>
          );
        })}
      </div>
      <div className="sliderMonth tw-mt-5 tw-pr-0">
        <Slider {...settingsSliderMonth}>
          {availableMonth.map((monthName: React.ReactNode, i) => {
            return (
              <div key={i}>
                <div className="tw-mb-1 tw-font-light tw-text-sm tw-text-center tw-text-gray-300">
                  {monthName}
                  {currentYearDates.map((item, i) => {
                    if (dayjs(item.date).format('MMM') === monthName) {
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            onItemSelect(item);
                            setSelectedDay(dayjs(item.date).format('D'));
                            setSelectedMonth(dayjs(item.date).format('MMM'));
                          }}
                          className={`tw-flex tw-items-center tw-justify-center tw-mr-1 tw-mb-1 tw-h-10 tw-leading-10 tw-rounded-lg tw-border tw-border-theme-blue tw-cursor-pointer tw-transition tw-duration-300 tw-ease-in-out hover:tw-bg-theme-blue hover:tw-bg-opacity-30 tw-px-5 tw-py-0 tw-text-center tw-border-r tw-text-md tw-text-theme-blue tw-tracking-tighter ${
                            selectedDay === dayjs(item.date).format('D') &&
                            selectedMonth === dayjs(item.date).format('MMM') &&
                            'tw-bg-opacity-30 tw-bg-theme-blue'
                          }`}
                        >
                          {dayjs(item.date).format('D')}
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
        </Slider>
      </div>
      {availableYears.length <= 0 && (
        <p className="tw-block tw-mt-4 tw-text-red tw-text-sm tw-font-medium tw-mb-2">
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
