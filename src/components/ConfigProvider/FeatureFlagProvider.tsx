'use client';

import React, { createContext, FC, useContext, useMemo } from 'react';

export interface FeatureFlags {
  panelLazyLoadContent?: boolean;
}

export interface FeatureFlagContextProps {
  featureFlags?: FeatureFlags;
  children?: React.ReactNode;
}

const FeatureFlagContext = createContext<FeatureFlags>(undefined);

const defaultFeatureFlagValues: FeatureFlags = {
  /**
   * This feature flag configures panels to only render their content if they are currently visible. This feature deprecates the
   * `renderContentAlways` option and completely overrides its value when it is enabled.
   * it overrides the behvavior of `renderContentAlways`
   */
  panelLazyLoadContent: false,
};

export const FeatureFlagContextProvider: FC<FeatureFlagContextProps> = ({
  children,
  featureFlags,
}) => {
  const ancestorFeatureFlags = useContext(FeatureFlagContext);

  const currentContext = useMemo(
    () => ({
      ...defaultFeatureFlagValues,
      ...ancestorFeatureFlags,
      ...featureFlags,
    }),
    [featureFlags, ancestorFeatureFlags]
  );

  return (
    <FeatureFlagContext.Provider value={currentContext}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

/**
 * Hook to retreive a set of currently configured features flags
 * @returns The currently set feature flags.
 */
export const useFeatureFlags = () =>
  useContext(FeatureFlagContext) || { ...defaultFeatureFlagValues };

export default FeatureFlagContext;
