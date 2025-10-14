import { dark } from '@shared/config/theme/dark';
import { light } from '@shared/config/theme/light';
import { createTheme, createThemeContract } from '@vanilla-extract/css';

export const themeContract = createThemeContract({
  seed: '',
  foundation: {
    primary: {
      base: '',
      hover: '',
      pressed: '',
      disabled: '',
      subtle: '',
    },
    secondary: {
      base: '',
      hover: '',
      pressed: '',
      disabled: '',
      subtle: '',
    },
    tertiary: {
      base: '',
      hover: '',
      pressed: '',
      disabled: '',
      subtle: '',
    },
    gray: {
      '900': '',
      '800': '',
      '700': '',
      '600': '',
      '500': '',
      '400': '',
      '300': '',
      '200': '',
      '100': '',
      '50': '',
    },
    primaryShades: {
      '900': '',
      '800': '',
      '700': '',
      '600': '',
      '500': '',
      '400': '',
      '300': '',
      '200': '',
      '100': '',
      '50': '',
    },
  },
  button: {
    seed: {
      base: '',
      hover: '',
      pressed: '',
      disabled: '',
    },
    primary: {
      base: '',
      hover: '',
      pressed: '',
      disabled: '',
    },
  },
  text: {
    onPrimary: {
      base: '',
      secondary: '',
      disabled: '',
    },
    default: {
      primary: '',
      secondary: '',
      tertiary: '',
      disabled: '',
    },
    onColor: {
      onPrimary: '',
      onSuccess: '',
      onWarning: '',
      onError: '',
    },
  },
  border: {
    base: '',
    hover: '',
    pressed: '',
    disabled: '',
    variant: {
      base: '',
      hover: '',
      pressed: '',
      divider: '',
      disabled: '',
    },
  },
  semantic: {
    success: {
      base: '',
      hover: '',
      pressed: '',
      background: '',
    },
    warning: {
      base: '',
      hover: '',
      pressed: '',
      background: '',
    },
    error: {
      base: '',
      hover: '',
      pressed: '',
      background: '',
    },
    info: {
      base: '',
      hover: '',
      pressed: '',
      background: '',
    },
  },
  background: {
    base: '',
    secondary: '',
    tertiary: '',
    overlay: '',
    section: '',
    card: '',
    slot: {
      active: '',
      disabled: '',
    },
    overlayScrim: '',
    overlaySheet: '',
    overlayHover: '',
    overlayPressed: '',
    surface: {
      seed: '',
      primary: '',
      hover: '',
      pressed: '',
      disabled: '',
    },
  },
  titlebar: {
    background: {
      base: '',
      disabled: '',
      control: {
        hover: '',
        hoverClose: '',
        pressed: '',
        pressedClose: '',
        disabled: '',
      },
    },
    icon: {
      base: '',
      hover: '',
      pressed: '',
      disabled: '',
    },
    text: {
      base: '',
      disabled: '',
    },
  },
  loader: {
    gray: {
      active: '',
      inactive: '',
      step1: '',
      step2: '',
      step3: '',
      step4: '',
    },
    primary: {
      active: '',
      inactive: '',
      step1: '',
      step2: '',
      step3: '',
      step4: '',
    },
  },
  colors: {
    primary: '',
    success: '',
    warning: '',
    danger: '',
    info: '',
    bgPrimary: '',
    bgSecondary: '',
    bgLight: '',
    text: '',
    textPrimary: '',
    textSecondary: '',
    textMuted: '',
    border: '',
    borderLight: '',
  },
  spacing: {
    xs: '',
    sm: '',
    md: '',
    lg: '',
    xl: '',
    xxl: '',
  },
  radius: {
    sm: '',
    default: '',
  },
  shadows: {
    default: '',
    hover: '',
  },
});

export const lightTheme = createTheme(themeContract, light);

export const darkTheme = createTheme(themeContract, dark);
