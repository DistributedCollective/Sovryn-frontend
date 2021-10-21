import React, { useState } from 'react';
import { Position, Popover, PopoverInteractionKind } from '@blueprintjs/core';
import { AssetList } from './AssetList';
import { AssetRenderer } from '../AssetRenderer';
import { ArrowDown, ArrowUp } from './Arrows';
import { Asset } from 'types/asset';

interface AssetSelectProps {
  selected: Asset;
  onChange?: (asset: Asset) => void;
}

export const AssetSelect: React.FC<AssetSelectProps> = ({
  selected,
  onChange,
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const handleOnSelect = (asset: Asset): void => {
    setOpen(false);
    if (onChange && typeof onChange === 'function') onChange(asset);
  };
  return (
    <div className="tw-cursor-pointer">
      <Popover
        interactionKind={PopoverInteractionKind.CLICK}
        openOnTargetFocus={false}
        minimal={true}
        isOpen={isOpen}
        captureDismiss={true}
        fill={true}
        targetClassName="tw-text-left"
        content={<AssetList selected={selected} onSelect={handleOnSelect} />}
        hoverOpenDelay={0}
        hoverCloseDelay={0}
        position={Position.BOTTOM_RIGHT}
      >
        <div
          className="tw-flex tw-justify-between tw-pr-3 tw-items-center"
          onClick={() => setOpen(true)}
        >
          <div className="tw-pr-6">
            <AssetRenderer
              assetClassName="tw-text-left tw-font-rowdies tw-text-base"
              asset={selected}
            />
          </div>
          {isOpen ? <ArrowUp /> : <ArrowDown />}
        </div>
      </Popover>
    </div>
  );
};
