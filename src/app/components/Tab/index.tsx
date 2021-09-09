import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';

type ITabContainerProps = {
  defaultTab: number | string;
  children: ReactElement<ITabProps> | ReactElement<ITabProps>[];
  className?: string;
  useRoutes?: boolean;
  onChange?: (selected: number | string) => void;
};

export const TabContainer: React.FC<ITabContainerProps> = ({
  defaultTab,
  className,
  children,
  onChange,
}) => {
  const [selected, setSelected] = useState(defaultTab);

  const updateSelected = useCallback(
    (selected: number | string) => {
      setSelected(selected);
      if (onChange) {
        onChange(selected);
      }
      console.log(selected);
    },
    [onChange],
  );

  const tabs = useMemo(() => {
    const tabs: ReactElement<ITabProps>[] = [];
    if (Array.isArray(children)) {
      // for each, because typescript can't detect result type for .filter(…)
      for (let child of children) {
        if (isTabReactElement(child)) {
          tabs.push(child);
        }
      }
    } else if (isTabReactElement(children)) {
      tabs.push(children);
    }

    // add onClick wrapper to update state
    return tabs.map(tab => {
      const previousOnClick = tab.props.onClick;
      const onClick = event => {
        if (previousOnClick) {
          previousOnClick(event);
        }
        updateSelected(tab.props.id);
      };

      const active = selected === tab.props.id;

      return React.cloneElement(tab, { onClick, active });
    });
  }, [children, selected, updateSelected]);

  const selectedTabComponent = useMemo(
    () => tabs.find(child => child?.props.id === selected)?.props.component,
    [selected, tabs],
  );

  return (
    <div className={classNames('tw-mt-4 tw-mb-8', className)}>
      <nav className="tw-flex tw-flex-row tw-items-center tw-justify-start tw-mb-4">
        {tabs}
      </nav>
      {selectedTabComponent}
    </div>
  );
};

type ITabProps = {
  id: number | string;
  text: React.ReactNode;
  component: React.ReactNode;
  active?: boolean;
  onClick?: React.MouseEventHandler;
};

export const Tab: React.FC<ITabProps> = ({ text, active, onClick }) => {
  return (
    <button
      className={classNames(
        'tw-px-3 tw-py-2 tw-text-sov-white tw-text-base tw-font-semibold tw-transition-opacity tw-duration-300 hover:tw-no-underline',
        active ? 'tw-opacity-100' : 'tw-opacity-25',
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const isTabReactElement = (element: any): element is ReactElement<ITabProps> =>
  typeof element === 'object' &&
  React.isValidElement(element) &&
  element.type === Tab;
