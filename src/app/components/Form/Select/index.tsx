import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import classNames from 'classnames';
import { Select as BP_Select } from '@blueprintjs/select';
import { MenuItem, Text } from '@blueprintjs/core';
import { isMobile } from 'utils/helpers';
import { translations } from 'locales/i18n';
import { Option, Options } from './types';
import { areOptionsEqual, filterItem, renderItem } from './renderers';
import styles from './index.module.css';

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
}

const Selector = BP_Select.ofType<Option>();

export function Select<K = string, V = string, P = any>(props: Props<K, V, P>) {
  const { t } = useTranslation();

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
      className={classNames('tw-w-full', props.className)}
      items={props.options as any}
      inputProps={
        isMobile() && !props.inputFocus ? { autoFocus: false } : undefined
      }
      filterable={props.filterable}
      activeItem={selected as any}
      popoverProps={{
        targetTagName: 'div',
      }}
      noResults={
        <MenuItem disabled text={t(translations.form.select.noResults)} />
      }
      itemRenderer={renderItem}
      itemPredicate={filterItem}
      onItemSelect={onItemSelect}
      itemsEqual={areOptionsEqual}
    >
      <div
        className={classNames(
          'font-family-montserrat',
          styles.wrapperContainer,
          props.innerClasses,
        )}
      >
        <div className="tw-flex-grow tw-flex-shrink tw-w-full">
          {selected ? (
            <>{(props as any).valueRenderer(selected)}</>
          ) : (
            <>{props.placeholder}</>
          )}
        </div>
        <div
          className={classNames(
            'tw-flex-grow-0 tw-flex-shrink-0',
            styles.arrowDown,
          )}
        />
      </div>
    </Selector>
  );
}

Select.defaultProps = {
  placeholder: <Trans i18nKey={translations.form.select.placeholder} />,
  innerClasses: styles.wrapper,
  valueRenderer: (item: Option) => <Text ellipsize>{item.label}</Text>,
};
