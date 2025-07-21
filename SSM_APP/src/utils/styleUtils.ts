/**
 * Utilități pentru stiluri - ajută la compatibilitatea între platforme
 */

import { Platform } from 'react-native';

/**
 * Convertește stilurile de umbră Android (elevation) în stiluri de umbră compatibile cu web
 * @param elevation - Valoarea elevației pentru Android
 * @returns Stiluri de umbră pentru web sau elevation pentru Android
 */
export const getShadowStyle = (elevation: number) => {
  if (Platform.OS === 'web') {
    // Convertește elevation în stiluri de umbră pentru web
    return {
      boxShadow: `0px ${elevation * 0.5}px ${elevation * 2}px rgba(0, 0, 0, 0.2)`,
    };
  }
  
  // Pe Android, folosește elevation
  return { elevation };
};

/**
 * Convertește pointerEvents în stiluri compatibile cu web
 * @param pointerEvents - Valoarea pentru pointerEvents
 * @returns Stiluri compatibile pentru web sau pointerEvents pentru mobile
 */
export const getPointerEventsStyle = (pointerEvents: 'auto' | 'none' | 'box-none' | 'box-only' | undefined) => {
  if (Platform.OS === 'web') {
    // Pe web, folosește style.pointerEvents
    return { style: { pointerEvents } };
  }
  
  // Pe mobile, folosește props.pointerEvents
  return { pointerEvents };
}; 