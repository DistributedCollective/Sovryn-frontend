import React, { useState } from 'react';
import { Position, Popover, PopoverInteractionKind } from '@blueprintjs/core';
import { AssetList } from './AssetList';
import { AssetRenderer } from '../AssetRenderer';
import { ArrowDown, ArrowUp } from './Arrows';
import { Asset } from 'types/asset';

type AssetOptionalType = Asset | string | undefined;

interface AssetSelectProps {
  selected: AssetOptionalType;
  onChange?: (asset: Asset) => void;
}

export const AssetSelect: React.FC<AssetSelectProps> = ({
  selected,
  onChange,
}) => {
  const [selectedAsset] = useState<Asset>(selected || Asset[0]);
  const [isOpen, setOpen] = useState<boolean>(false);
  const handleOnSelect = (asset: Asset): void => {
    if (onChange && typeof onChange === 'function') onChange(asset);
    setOpen(false);
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
        content={
          <AssetList selected={selectedAsset} onSelect={handleOnSelect} />
        }
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
              asset={selectedAsset}
            />
          </div>
          {isOpen ? <ArrowUp /> : <ArrowDown />}
        </div>
      </Popover>
    </div>
  );
};
