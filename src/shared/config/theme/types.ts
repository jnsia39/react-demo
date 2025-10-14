export type ColorScale = {
  '900': string;
  '800': string;
  '700': string;
  '600': string;
  '500': string;
  '400': string;
  '300': string;
  '200': string;
  '100': string;
  '50': string;
};

export interface ThemeTokens {
  seed: string;
  foundation: {
    primary: {
      base: string;
      hover: string;
      pressed: string;
      disabled: string;
      subtle: string;
    };
    secondary: {
      base: string;
      hover: string;
      pressed: string;
      disabled: string;
      subtle: string;
    };
    tertiary: {
      base: string;
      hover: string;
      pressed: string;
      disabled: string;
      subtle: string;
    };
    gray: ColorScale;
    primaryShades: ColorScale;
  };
  button: {
    seed: {
      base: string;
      hover: string;
      pressed: string;
      disabled: string;
    };
    primary: {
      base: string;
      hover: string;
      pressed: string;
      disabled: string;
    };
  };
  text: {
    onPrimary: {
      base: string;
      secondary: string;
      disabled: string;
    };
    default: {
      primary: string;
      secondary: string;
      tertiary: string;
      disabled: string;
    };
    onColor: {
      onPrimary: string;
      onSuccess: string;
      onWarning: string;
      onError: string;
    };
  };
  border: {
    base: string;
    hover: string;
    pressed: string;
    disabled: string;
    variant: {
      base: string;
      hover: string;
      pressed: string;
      divider: string;
      disabled: string;
    };
  };
  semantic: {
    success: {
      base: string;
      hover: string;
      pressed: string;
      background: string;
    };
    warning: {
      base: string;
      hover: string;
      pressed: string;
      background: string;
    };
    error: {
      base: string;
      hover: string;
      pressed: string;
      background: string;
    };
    info: {
      base: string;
      hover: string;
      pressed: string;
      background: string;
    };
  };
  background: {
    base: string;
    secondary: string;
    tertiary: string;
    overlay: string;
    section: string;
    card: string;
    slot: {
      active: string;
      disabled: string;
    };
    overlayScrim: string;
    overlaySheet: string;
    overlayHover: string;
    overlayPressed: string;
    surface: {
      seed: string;
      primary: string;
      hover: string;
      pressed: string;
      disabled: string;
    };
  };
  titlebar: {
    background: {
      base: string;
      disabled: string;
      control: {
        hover: string;
        hoverClose: string;
        pressed: string;
        pressedClose: string;
        disabled: string;
      };
    };
    icon: {
      base: string;
      hover: string;
      pressed: string;
      disabled: string;
    };
    text: {
      base: string;
      disabled: string;
    };
  };
  loader: {
    gray: {
      active: string;
      inactive: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
    };
    primary: {
      active: string;
      inactive: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
    };
  };
  // Legacy aliases for backward compatibility
  colors: {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    bgPrimary: string;
    bgSecondary: string;
    bgLight: string;
    text: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderLight: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  radius: {
    sm: string;
    default: string;
  };
  shadows: {
    default: string;
    hover: string;
  };
}
