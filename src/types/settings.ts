export type secondaryColorMain = "#651fff" | "#009688" | "#ff9800" | "#f5bd1f";
export type secondaryColorDark = "#4615b2" | "#00695f" | "#b26a00" | "#ffc100";
export type secondaryColor = {
  main: secondaryColorMain;
  dark: secondaryColorDark;
};
export type settings = {
  votebar?: boolean;
  secondaryColor?: secondaryColor;
};
