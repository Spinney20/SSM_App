/**
 * Utilități pentru animații - ajută la compatibilitatea între platforme
 */

import { Platform } from 'react-native';

/**
 * Returnează configurația potrivită pentru useNativeDriver în funcție de platformă
 * @returns boolean - true pentru platformele mobile, false pentru web
 */
export const shouldUseNativeDriver = (): boolean => {
  return Platform.OS !== 'web';
};

/**
 * Configurație pentru animații compatibilă cu toate platformele
 * @param options - Opțiuni suplimentare pentru animație
 * @returns Configurație completă pentru animații
 */
export const getAnimationConfig = (options = {}) => {
  return {
    useNativeDriver: shouldUseNativeDriver(),
    ...options,
  };
}; 