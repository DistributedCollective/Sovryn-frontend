import React, { useState, useMemo, useCallback } from 'react';
import { Tab } from '../Tab';

interface ITabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

type TabsProps = {
  className?: string;
  contentClassName?: string;
  initial: string;
  items: ITabItem[];
  onChange?: (id: string) => void;
};

export const Tabs: React.FC<TabsProps> = ({
  items,
  initial,
  onChange,
  className,
  contentClassName,
}) => {
  const [activeTab, setActiveTab] = useState(initial);

  const selectTab = useCallback(
    (item: ITabItem) => {
      if (item.disabled) {
        return;
      }
      setActiveTab(item.id);
      onChange?.(item.id);
    },
    [onChange],
  );

  const content = useMemo(
    () => items.find(item => item.id === activeTab)?.content,
    [activeTab, items],
  );

  return (
    <div className={className}>
      <div className="tw-flex tw-items-center tw-flex-nowrap tw-overflow-auto">
        {items.map(item => (
          <Tab
            key={item.id}
            active={item.id === activeTab}
            disabled={item.disabled}
            onClick={() => selectTab(item)}
            text={item.label}
            className="tw-mr-2"
          />
        ))}
      </div>
      <div className={contentClassName}>{content}</div>
    </div>
  );
};
