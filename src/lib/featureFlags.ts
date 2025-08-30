/**
 * Feature flag utilities for controlling application features
 */

/**
 * Check if Support editor feature is enabled
 * @returns boolean indicating if Support editor should be shown in dashboard
 */
export const isSupportEditorEnabled = (): boolean => {
  return import.meta.env.VITE_FEATURE_SUPPORT_EDITOR === 'true';
};

/**
 * Get all feature flags for debugging
 */
export const getFeatureFlags = () => {
  return {
    supportEditor: isSupportEditorEnabled(),
  };
};
