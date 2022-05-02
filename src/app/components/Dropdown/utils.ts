import { DropdownCoords, DropdownMode } from './types';

export const getDropdownPositionStyles = (
  coords: DropdownCoords,
  mode: DropdownMode,
) => {
  const { top, left, right, buttonWidth, windowWidth, dropdownWidth } = coords;

  //getting the max width for the dropdown according to the button width
  // and to prevent it from going out of the screen
  const rightButtonOffset = windowWidth - (left + buttonWidth);
  let maxCenterWidthDropdown: number;

  if (rightButtonOffset > left) {
    maxCenterWidthDropdown = left * 2 + buttonWidth;
  } else if (rightButtonOffset < left) {
    maxCenterWidthDropdown = right * 2 + buttonWidth;
  } else {
    maxCenterWidthDropdown = windowWidth;
  }

  const centerWidthDropdown =
    dropdownWidth > maxCenterWidthDropdown
      ? maxCenterWidthDropdown
      : dropdownWidth;

  const DropdownPosition = {
    left: {
      left: `${left}px`,
      maxWidth: `${windowWidth - left}px`,
    },
    right: {
      left: `${left + buttonWidth}px`,
      maxWidth: `${left + buttonWidth}px`,
      transform: 'translateX(-100%)',
    },
    center: {
      left: `${left - (centerWidthDropdown - buttonWidth) / 2}px`,
      maxWidth: `${maxCenterWidthDropdown}px`,
    },
    sameWidth: {
      left: `${left}px`,
      width: `${buttonWidth}px`,
    },
  };

  const DropdownPositionTop = {
    top: `${top}px`,
  };

  const DropdownPositionStyles = {
    ...DropdownPosition[mode],
    ...DropdownPositionTop,
  };
  return DropdownPositionStyles;
};
