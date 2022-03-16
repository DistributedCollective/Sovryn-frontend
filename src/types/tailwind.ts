export enum Breakpoint {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  _2xl = '2xl',
  _3xl = '3xl',
}

export const BreakpointOrder: Breakpoint[] = [
  Breakpoint.sm,
  Breakpoint.md,
  Breakpoint.lg,
  Breakpoint.xl,
  Breakpoint._2xl,
  Breakpoint._3xl,
];

export const BreakpointWidths: { [key in Breakpoint]: number } = {
  [Breakpoint.sm]: 576,
  [Breakpoint.md]: 768,
  [Breakpoint.lg]: 992,
  [Breakpoint.xl]: 1200,
  [Breakpoint._2xl]: 1536,
  [Breakpoint._3xl]: 1854,
};

export enum Align {
  left = 'left',
  center = 'center',
  right = 'right',
}

export enum Color {
  primary = 'primary',
  secondary = 'secondary',
  success = 'success',
  warning = 'warning',
  tradeShort = 'trade-short',
  tradeLong = 'trade-long',
}
