export function leverageFromMargin(startMargin: string) {
  const leverage: { [key: string]: number } = {
    1: 2,
    5: 3,
    3: 4,
    2: 5,
  };
  return leverage[startMargin[0]] || 2;
}
