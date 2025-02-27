// Theme definitions for light and dark modes

// Dark theme colors (default theme)
export const darkTheme = {
  // Backgrounds
  background: 'rgb(10, 14, 25)', 
  cardBackground: 'rgb(15, 20, 35)',
  cardBackgroundSecondary: 'rgb(22, 28, 45)',
  modalBackground: 'rgba(0, 0, 0, 0.8)',
  
  // Text colors
  textPrimary: 'white',
  textSecondary: '#99A0B0',
  textMuted: '#677084',
  
  // UI elements
  border: 'rgba(255, 255, 255, 0.1)',
  gridLines: 'rgba(200, 200, 200, 0.1)',
  
  // Brand colors
  primary: '#5588FF',
  primaryLight: 'rgba(85, 136, 255, 0.2)',
  primaryDark: '#3366DD',
  secondary: '#65B2FF',
  accent: '#FF9F1C',
  
  // Chart colors
  positive: '#34C77B',
  positiveLight: 'rgba(52, 199, 123, 0.2)',
  negative: '#EA3943',
  negativeLight: 'rgba(234, 57, 67, 0.2)',
  
  // Chart palettes
  volumeColor: 'rgba(101, 178, 255, 0.7)',
  volumeBorder: 'rgba(101, 178, 255, 1)',
  
  priceLineColor: '#5588FF',
  priceAreaColor: 'rgba(85, 136, 255, 0.1)',
  
  detailLineColor: '#FF9F1C',
  detailAreaColor: 'rgba(255, 159, 28, 0.1)',
  
  // Donut chart colors
  distributionColors: [
    'rgba(85, 136, 255, 0.8)',
    'rgba(106, 85, 255, 0.8)',
    'rgba(136, 85, 255, 0.8)',
    'rgba(170, 85, 255, 0.8)',
    'rgba(212, 85, 255, 0.8)'
  ],
  
  walletColors: [
    'rgba(85, 221, 255, 0.8)',
    'rgba(85, 255, 213, 0.8)',
    'rgba(85, 255, 170, 0.8)',
    'rgba(85, 255, 136, 0.8)',
    'rgba(136, 255, 85, 0.8)'
  ],
  
  // UI Shadows
  shadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
  cardShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  
  // Tooltip
  tooltipBackground: 'rgba(20, 30, 50, 0.9)',
};

// Light theme colors
export const lightTheme = {
  // Backgrounds
  background: '#F5F7FA', 
  cardBackground: 'white',
  cardBackgroundSecondary: '#F0F2F5',
  modalBackground: 'rgba(0, 0, 0, 0.6)',
  
  // Text colors
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  
  // UI elements
  border: 'rgba(0, 0, 0, 0.1)',
  gridLines: 'rgba(0, 0, 0, 0.05)',
  
  // Brand colors
  primary: '#4263EB',
  primaryLight: 'rgba(66, 99, 235, 0.1)',
  primaryDark: '#2342CB',
  secondary: '#38B2AC',
  accent: '#F6AD55',
  
  // Chart colors
  positive: '#38A169',
  positiveLight: 'rgba(56, 161, 105, 0.2)',
  negative: '#E53E3E',
  negativeLight: 'rgba(229, 62, 62, 0.2)',
  
  // Chart palettes
  volumeColor: 'rgba(66, 153, 225, 0.6)',
  volumeBorder: 'rgba(66, 153, 225, 0.9)',
  
  priceLineColor: '#4263EB',
  priceAreaColor: 'rgba(66, 99, 235, 0.1)',
  
  detailLineColor: '#ED8936',
  detailAreaColor: 'rgba(237, 137, 54, 0.1)',
  
  // Donut chart colors
  distributionColors: [
    'rgba(66, 99, 235, 0.7)',
    'rgba(76, 81, 191, 0.7)',
    'rgba(136, 87, 191, 0.7)',
    'rgba(159, 122, 234, 0.7)',
    'rgba(183, 148, 244, 0.7)'
  ],
  
  walletColors: [
    'rgba(49, 151, 149, 0.7)',
    'rgba(56, 178, 172, 0.7)',
    'rgba(72, 187, 120, 0.7)',
    'rgba(104, 211, 145, 0.7)',
    'rgba(154, 230, 180, 0.7)'
  ],
  
  // UI Shadows
  shadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  cardShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  
  // Tooltip
  tooltipBackground: 'rgba(45, 55, 72, 0.9)',
};