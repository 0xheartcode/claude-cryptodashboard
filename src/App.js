import React, { useState, useContext } from 'react';
import tokenData from './data/tokenData';
import { ThemeContext } from './utils/ThemeContext';
import { darkTheme, lightTheme } from './utils/themes';
import PriceChart from './components/PriceChart';
import VolumeChart from './components/VolumeChart';
import TokenStats from './components/TokenStats';
import TokenHeader from './components/TokenHeader';
import DonutChart from './components/DonutChart';
import DetailedView from './components/DetailedView';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [detailedData, setDetailedData] = useState(null);
  const { theme } = useContext(ThemeContext);
  
  // Get the active theme colors based on current theme
  const themeColors = theme === 'dark' ? darkTheme : lightTheme;
  
  const handleZoom = (data) => {
    // Prepare detailed data to pass to detailed view
    setDetailedData({
      ...data,
      hourly: tokenData.detailedData.hourly
    });
  };
  
  const closeDetailedView = () => {
    setDetailedData(null);
  };

  return (
    <div 
      className="app-container"
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.textPrimary,
        transition: 'background-color 0.3s, color 0.3s'
      }}
    >
      <ThemeToggle />
      <TokenHeader tokenData={tokenData} themeColors={themeColors} />
      <TokenStats tokenData={tokenData} themeColors={themeColors} />
      
      <PriceChart 
        priceData={tokenData.historicalData.price} 
        onZoom={handleZoom}
        themeColors={themeColors}
      />
      
      <VolumeChart 
        volumeData={tokenData.historicalData.volume} 
        themeColors={themeColors}
      />
      
      <div id="donut-charts" className="charts-container" style={{ marginTop: '40px', position: 'relative', zIndex: 1 }}>
        <DonutChart 
          data={tokenData.tradeSizeDistribution} 
          title="Trade Size Distribution"
          colors={themeColors.distributionColors}
          themeColors={themeColors}
        />
        <DonutChart 
          data={tokenData.walletConcentration} 
          title="Wallet Concentration"
          colors={themeColors.walletColors}
          themeColors={themeColors}
        />
      </div>
      
      {detailedData && (
        <DetailedView 
          data={detailedData} 
          onClose={closeDetailedView}
          themeColors={themeColors}
        />
      )}
    </div>
  );
}

export default App;