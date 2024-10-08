import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useFocusVisibleClassName } from '../../hooks/useFocusVisibleClassName';
import { canUseDocElement } from '../../shared/utilities';
import { OcFormProvider } from '../Form/Internal';
import { ValidateMessages } from '../Form/Internal/OcForm.types';
import defaultLocale from '../Locale/Default';
import LocaleProvider from '../LocaleProvider';
import LocaleReceiver from '../LocaleProvider/LocaleReceiver';
import { ConfigProviderProps, IConfigContext } from './ConfigProvider.types';
import { DisabledContextProvider } from './DisabledContext';
import { FeatureFlagContextProvider } from './FeatureFlagProvider';
import { GradientContextProvider } from './GradientContext';
import { ParentComponentsContextProvider } from './ParentComponentsContext';
import { ShapeContextProvider } from './ShapeContext';
import { SizeContextProvider } from './SizeContext';
import {
  FontOptions,
  IRegisterFont,
  IRegisterTheme,
  ThemeOptions,
} from './Theming';
import { registerFont, registerTheme } from './Theming/styleGenerator';

('use client');

const ConfigContext: React.Context<Partial<IConfigContext>> = createContext<
  Partial<IConfigContext>
>({});

const DEFAULT_THEME: string = 'blue';

const DEFAULT_FOCUS_VISIBLE: boolean = true;
const DEFAULT_FOCUS_VISIBLE_ELEMENT: HTMLElement = canUseDocElement()
  ? document.documentElement
  : null;

const ConfigProvider: FC<ConfigProviderProps> = ({
  children,
  componentName,
  disabled = false,
  focusVisibleOptions = {
    focusVisible: DEFAULT_FOCUS_VISIBLE,
    focusVisibleElement: DEFAULT_FOCUS_VISIBLE_ELEMENT,
  },
  fontOptions: defaultFontOptions,
  form,
  gradient = false,
  icomoonIconSet = {},
  locale,
  shape,
  size,
  featureFlags,
  themeOptions: defaultThemeOptions,
}) => {
  const [fontOptions, setFontOptions] =
    useState<FontOptions>(defaultFontOptions);

  const [registeredFont, setRegisteredFont] = useState<IRegisterFont>(
    {} as IRegisterFont
  );

  const [themeOptions, setThemeOptions] =
    useState<ThemeOptions>(defaultThemeOptions);

  const [registeredTheme, setRegisteredTheme] = useState<IRegisterTheme>(
    {} as IRegisterTheme
  );

  if (focusVisibleOptions?.focusVisible) {
    useFocusVisibleClassName(
      focusVisibleOptions?.focusVisible,
      focusVisibleOptions?.focusVisibleElement
    );
  }

  useEffect(() => {
    if (themeOptions) {
      setRegisteredTheme(
        registerTheme({
          name: DEFAULT_THEME,
          ...themeOptions,
        })
      );
    }
  }, [themeOptions]);

  useEffect(() => {
    if (fontOptions) {
      setRegisteredFont(
        registerFont({
          ...fontOptions,
        })
      );
    }
  }, [fontOptions]);

  let childNode = children;
  let validateMessages: ValidateMessages = {};

  if (locale) {
    validateMessages =
      locale.Form?.defaultValidateMessages ||
      defaultLocale.Form?.defaultValidateMessages ||
      {};
  }

  if (form?.validateMessages) {
    validateMessages = { ...validateMessages, ...form.validateMessages };
  }

  if (Object.keys(validateMessages).length > 0) {
    childNode = (
      <OcFormProvider validateMessages={validateMessages}>
        {children}
      </OcFormProvider>
    );
  }

  if (locale) {
    childNode = <LocaleProvider locale={locale}>{childNode}</LocaleProvider>;
  }

  if (shape) {
    childNode = (
      <ShapeContextProvider shape={shape}>{childNode}</ShapeContextProvider>
    );
  }

  if (size) {
    childNode = (
      <SizeContextProvider size={size}>{childNode}</SizeContextProvider>
    );
  }

  if (gradient !== undefined) {
    childNode = (
      <GradientContextProvider gradient={gradient}>
        {childNode}
      </GradientContextProvider>
    );
  }

  if (disabled !== undefined) {
    childNode = (
      <DisabledContextProvider disabled={disabled}>
        {childNode}
      </DisabledContextProvider>
    );
  }

  if (componentName !== undefined) {
    childNode = (
      <ParentComponentsContextProvider componentName={componentName}>
        {childNode}
      </ParentComponentsContextProvider>
    );
  }

  childNode = (
    <FeatureFlagContextProvider featureFlags={featureFlags}>
      {childNode}
    </FeatureFlagContextProvider>
  );

  return (
    <LocaleReceiver>
      {(_, __) => (
        <ConfigContext.Provider
          value={{
            fontOptions,
            themeOptions,
            setFontOptions,
            setThemeOptions,
            disabled,
            focusVisibleOptions,
            form,
            icomoonIconSet,
            locale,
            registeredFont,
            registeredTheme,
            shape,
            size,
          }}
        >
          {childNode}
        </ConfigContext.Provider>
      )}
    </LocaleReceiver>
  );
};

const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig hook must be used within config provider');
  }
  return context;
};

export { ConfigProvider, useConfig };
