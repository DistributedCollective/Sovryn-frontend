import React, { useCallback, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import classNames from 'classnames';
import { Select as BP_Select } from '@blueprintjs/select';
import { Text } from '@blueprintjs/core';
import { isMobile } from 'utils/helpers';
import { translations } from 'locales/i18n';
import { Option, Options } from './types';
import { areOptionsEqual, renderItem } from './renderers';
import { ItemRenderer } from '@blueprintjs/select/lib/cjs';

interface Props<K = string, V = string, P = any> {
  value: K;
  options: Options<K, V, P>;
  onChange: (value: K, item: Option<K, V, P>) => void;

  placeholder?: React.ReactNode;
  filterable?: boolean;
  inputFocus?: boolean;
  className?: string;
  innerClasses?: string;
  valueRenderer?: (item: Option<K, V, P>) => JSX.Element;
  itemRenderer: ItemRenderer<Option<K, V, P>>;
}

const Selector = BP_Select.ofType<Option>();

export function Select<K = string, V = string, P = any>(props: Props<K, V, P>) {
  const onItemSelect = useCallback(item => props.onChange(item.key, item), [
    props,
  ]);

  const getSelected = useCallback(() => {
    return props.options.find(item => String(item.key) === String(props.value));
  }, [props.options, props.value]);

  const [selected, setSelected] = useState<Option<K, V, P> | undefined>(
    getSelected(),
  );

  useEffect(() => {
    setSelected(getSelected());
  }, [getSelected, props.value, props.options]);

  return (
    <Selector
      className={classNames('tw-select-container', props.className)}
      items={props.options as any}
      filterable={props.filterable}
      inputProps={
        isMobile() && !props.inputFocus ? { autoFocus: false } : undefined
      }
      // filterable={props.filterable}
      activeItem={selected as any}
      popoverProps={{
        // targetTagName: 'div',
        // isOpen: true,
        fill: true,
        usePortal: false,
        minimal: true,
      }}
      // noResults={
      //   <MenuItem disabled text={t(translations.form.select.noResults)} />
      // }
      itemRenderer={props.itemRenderer as any}
      // itemPredicate={filterItem}
      onItemSelect={onItemSelect}
      itemsEqual={areOptionsEqual as any}
    >
      <div className={classNames('tw-select-origin', props.innerClasses)}>
        <div
          className={classNames(
            'tw-select-origin-content, tw-flex-grow tw-flex-shrink tw-w-full',
            {
              'tw-text-center': !selected,
            },
          )}
        >
          {selected ? (
            <>{(props as any).valueRenderer(selected)}</>
          ) : (
            <>{props.placeholder}</>
          )}
        </div>
        <div
          className={classNames(
            'tw-select-origin-caret',
            'tw-flex-grow-0 tw-flex-shrink-0',
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21.5"
            height="13.276"
            viewBox="0 0 21.5 13.276"
          >
            <path
              id="Path_2912"
              data-name="Path 2912"
              d="M24.974,8.59,16.75,16.8,8.526,8.59,6,11.116l10.75,10.75L27.5,11.116Z"
              transform="translate(-6 -8.59)"
              fill="#e9eae9"
            />
          </svg>
        </div>
      </div>
    </Selector>
  );
}

Select.defaultProps = {
  placeholder: <Trans i18nKey={translations.form.select.placeholder} />,
  innerClasses: 'tw-select-origin',
  valueRenderer: (item: Option) => <Text ellipsize>{item.label}</Text>,
  itemRenderer: renderItem,
};
