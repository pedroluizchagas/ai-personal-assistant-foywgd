
import { useState, useEffect } from 'react';
import { lightColors, darkColors } from '../styles/commonStyles';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const colors = isDark ? darkColors : lightColors;

  return {
    isDark,
    colors,
    toggleTheme,
  };
};
