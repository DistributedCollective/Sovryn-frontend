export enum DropdownMode {
  left = 'left',
  right = 'right',
  center = 'center',
  sameWidth = 'sameWidth',
}

export enum DropdownColor {
  gray2 = 'tw-bg-gray-2',
  gray3 = 'tw-bg-gray-3',
  gray4 = 'tw-bg-gray-4',
}

export type DropdownCoords = {
  top: number;
  left: number;
  right: number;
  buttonWidth: number;
  windowWidth: number;
  dropdownWidth: number;
};
