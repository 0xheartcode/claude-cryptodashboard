import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, addHours, startOfDay, setHours } from 'date-fns';
import { formatTimestamp, formatCurrency } from '../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  TimeScale
);

const TIME_PERIODS = {
  '7D': 7,
  '30D': 30,
  '90D': 90,
  'ALL': 'all'
};

// Generate intraday volume data for detailed view
const generateIntradayData = (timestamp, totalVolume) => {
  const date = new Date(timestamp);
  const dayStart = startOfDay(date);
  const hourlyData = [];
  
  // Generate pseudo-random but deterministic distribution
  // Use timestamp to seed the randomness for consistent results
  const seed = timestamp % 10000;
  
  // Create a distribution with higher volumes during market hours
  let volumeSum = 0;
  
  for (let hour = 0; hour < 24; hour++) {
    const hourTimestamp = addHours(dayStart, hour).getTime();
    
    // Time-based factors to create realistic patterns
    // More volume during 9am-5pm market hours (UTC adjusted)
    let hourFactor = 0.5;
    if (hour >= 9 && hour <= 17) {
      hourFactor = 1.5; // Higher during market hours
    } else if (hour >= 1 && hour <= 7) {
      hourFactor = 0.3; // Lower during night
    }
    
    // Add some pseudo-randomness based on the timestamp and hour
    const randomFactor = (Math.sin(seed + hour * 13) + 1) * 0.5 + 0.5;
    
    // Calculate this hour's volume
    const volume = totalVolume * hourFactor * randomFactor / 15; // Divide by ~15 to distribute across day
    
    hourlyData.push({
      timestamp: hourTimestamp,
      volume: volume,
      hour: hour
    });
    
    volumeSum += volume;
  }
  
  // Normalize to match the total volume
  const scaleFactor = totalVolume / volumeSum;
  return hourlyData.map(point => ({
    ...point,
    volume: point.volume * scaleFactor
  }));
};

// Generate metrics for the detailed view
const generateVolumeMetrics = (timestamp, volume) => {
  // Seed using the timestamp for consistent pseudo-random values
  const seed = timestamp % 10000;
  const rand = (min, max) => min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min);
  
  // Calculate some interesting metrics with pseudo-random variations
  const tradeCount = Math.floor(volume / rand(200, 500));
  const avgTradeSize = volume / tradeCount;
  const largestTrade = avgTradeSize * rand(5, 15);
  const uniqueWallets = Math.floor(tradeCount * rand(0.4, 0.7));
  const newWallets = Math.floor(uniqueWallets * rand(0.05, 0.15));
  
  // Generate top pairs
  const topPairs = [
    { pair: "NBC-ETH", percentage: 50 + rand(-10, 10) },
    { pair: "NBC-USDC", percentage: 30 + rand(-8, 8) },
    { pair: "NBC-USDT", percentage: 20 + rand(-6, 6) }
  ];
  
  // Normalize percentages to sum to 100
  const pairSum = topPairs.reduce((sum, pair) => sum + pair.percentage, 0);
  topPairs.forEach(pair => {
    pair.percentage = Math.round(pair.percentage * 100 / pairSum);
  });
  
  return {
    tradeCount: Math.round(tradeCount),
    avgTradeSize: avgTradeSize,
    largestTrade: largestTrade,
    uniqueWallets: uniqueWallets,
    newWallets: newWallets,
    topPairs: topPairs
  };
};

const VolumeChart = ({ volumeData, themeColors }) => {
  const [timePeriod, setTimePeriod] = useState('30D');
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBar, setSelectedBar] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [intradayData, setIntradayData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!volumeData || volumeData.length === 0) {
      setIsLoading(true);
      return;
    }

    // Filter data based on selected time period
    let filteredData = volumeData;
    if (timePeriod !== 'ALL') {
      const daysToShow = TIME_PERIODS[timePeriod];
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToShow);
      filteredData = volumeData.filter(point => 
        new Date(point.timestamp) >= cutoffDate
      );
    }

    // For longer time periods, aggregate data by weeks to avoid overcrowding
    let aggregatedData = filteredData;
    if (timePeriod === 'ALL' || timePeriod === '90D') {
      const aggregationMap = new Map();
      
      filteredData.forEach(point => {
        const date = new Date(point.timestamp);
        // Get the start of the week for this date
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const weekKey = startOfWeek.getTime();
        
        if (aggregationMap.has(weekKey)) {
          aggregationMap.set(weekKey, {
            timestamp: weekKey,
            volume: aggregationMap.get(weekKey).volume + point.volume
          });
        } else {
          aggregationMap.set(weekKey, {
            timestamp: weekKey,
            volume: point.volume
          });
        }
      });
      
      aggregatedData = Array.from(aggregationMap.values());
    }

    // Format the data for Chart.js
    const chartData = {
      labels: aggregatedData.map(point => new Date(point.timestamp)),
      datasets: [
        {
          label: 'Volume',
          data: aggregatedData.map(point => point.volume),
          backgroundColor: themeColors.volumeColor,
          borderColor: themeColors.volumeBorder,
          borderWidth: 1,
          borderRadius: 4,
          barThickness: timePeriod === '7D' ? 12 : 'flex',
          // Add original data as hidden property for reference
          originalData: aggregatedData
        }
      ]
    };

    setChartData(chartData);
    setIsLoading(false);
    
    // Clear detail view when changing time period
    setDetailsVisible(false);
    setSelectedBar(null);
  }, [volumeData, timePeriod, themeColors]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Volume: ${formatCurrency(context.raw)}`;
          },
          title: function(context) {
            return formatTimestamp(context[0].parsed.x);
          },
          afterLabel: function() {
            return 'Click for hourly breakdown';
          }
        },
        backgroundColor: themeColors.tooltipBackground,
        padding: 12,
        cornerRadius: 8,
        titleColor: themeColors.textPrimary,
        bodyColor: themeColors.textPrimary,
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timePeriod === '7D' ? 'day' : timePeriod === '30D' ? 'week' : 'month',
          tooltipFormat: 'MMM d, yyyy',
          displayFormats: {
            day: 'MMM d',
            week: 'MMM d',
            month: 'MMM yyyy'
          }
        },
        grid: {
          display: false,
        },
        ticks: {
          color: themeColors.textSecondary,
        }
      },
      y: {
        grid: {
          color: themeColors.gridLines,
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          },
          color: themeColors.textSecondary,
        }
      }
    },
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        const chart = chartRef.current;
        if (chart) {
          // Get the clicked bar data
          const dataIndex = elements[0].index;
          const timestamp = chart.data.labels[dataIndex];
          const volume = chart.data.datasets[0].data[dataIndex];
          const originalDataPoint = chart.data.datasets[0].originalData[dataIndex];
          
          // Generate intraday data for the selected bar
          const hourlyData = generateIntradayData(timestamp, volume);
          
          // Generate metrics for the selected bar
          const volumeMetrics = generateVolumeMetrics(timestamp, volume);
          
          setSelectedBar({
            timestamp,
            volume,
            dataIndex,
            originalData: originalDataPoint
          });
          
          setIntradayData({
            labels: hourlyData.map(point => new Date(point.timestamp)),
            datasets: [
              {
                label: 'Hourly Volume',
                data: hourlyData.map(point => point.volume),
                backgroundColor: themeColors.volumeColor.replace('0.7', '0.9'),
                borderColor: themeColors.volumeBorder,
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 8
              }
            ]
          });
          
          setMetrics(volumeMetrics);
          setDetailsVisible(true);
          
          // Highlight the selected bar
          const dataset = chart.data.datasets[0];
          
          // Save the original background color (could be an array or a single string)
          const originalBackgroundColor = dataset.backgroundColor;
          
          // Create an array of colors for all bars
          const newColors = [];
          for (let i = 0; i < dataset.data.length; i++) {
            if (i === dataIndex) {
              // Highlight the selected bar
              newColors.push(themeColors.theme === 'dark' 
                ? 'rgba(255, 159, 28, 0.8)'
                : 'rgba(237, 137, 54, 0.8)');
            } else {
              // Dim other bars
              newColors.push('rgba(100, 100, 100, 0.15)');
            }
          }
          
          // Set the background color to the new array
          dataset.backgroundColor = newColors;
          chart.update();
          
          // Register a click handler to restore the original colors when clicking away
          const clickHandler = (e) => {
            // Check if the elements exist before checking if they contain the target
            const detailSection = document.querySelector('.detail-section');
            const chartContainer = document.querySelector('.chart-canvas-container');
            
            if ((!detailSection || !detailSection.contains(e.target)) && 
                (!chartContainer || !chartContainer.contains(e.target))) {
              // Create a new array of colors for resetting
              const resetColors = [];
              for (let i = 0; i < dataset.data.length; i++) {
                resetColors.push(themeColors.volumeColor);
              }
              dataset.backgroundColor = resetColors;
              chart.update();
              setDetailsVisible(false);
              document.removeEventListener('click', clickHandler);
            }
          };
          
          // Delay adding the event listener to avoid immediate triggering
          setTimeout(() => {
            document.addEventListener('click', clickHandler);
          }, 100);
        }
      }
    }
  };

  const intradayChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Volume: ${formatCurrency(context.raw)}`;
          },
          title: function(context) {
            return format(context[0].parsed.x, 'MMM d, h aaa');
          }
        },
        backgroundColor: themeColors.tooltipBackground,
        padding: 12,
        cornerRadius: 8,
        titleColor: themeColors.textPrimary,
        bodyColor: themeColors.textPrimary,
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'ha'
          }
        },
        grid: {
          display: false,
        },
        ticks: {
          color: themeColors.textSecondary,
        }
      },
      y: {
        grid: {
          color: themeColors.gridLines,
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          },
          color: themeColors.textSecondary,
        }
      }
    }
  };

  return (
    <motion.div 
      className="chart-container"
      style={{ 
        position: 'relative', 
        height: detailsVisible ? '830px' : '350px',
        background: themeColors.cardBackground,
        padding: '20px',
        borderRadius: '12px',
        marginBottom: detailsVisible ? '120px' : '24px',
        boxShadow: themeColors.cardShadow,
        zIndex: detailsVisible ? 5 : 1,
        transition: 'background-color 0.3s, box-shadow 0.3s, height 0.5s, margin-bottom 0.5s, z-index 0.1s'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ 
          margin: 0, 
          color: themeColors.textPrimary, 
          fontSize: '18px',
          transition: 'color 0.3s'
        }}>Trading Volume</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {Object.keys(TIME_PERIODS).map(period => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              style={{
                background: timePeriod === period ? themeColors.primaryLight : 'transparent',
                color: timePeriod === period ? themeColors.secondary : themeColors.textSecondary,
                border: timePeriod === period 
                  ? `1px solid ${themeColors.secondary}` 
                  : `1px solid ${themeColors.border}`,
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background-color 0.2s, color 0.2s, border-color 0.2s'
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '250px',
          color: themeColors.textPrimary,
          transition: 'color 0.3s'
        }}>
          Loading chart...
        </div>
      ) : (
        <div className="chart-canvas-container" style={{ height: '250px' }}>
          {chartData && <Bar ref={chartRef} data={chartData} options={chartOptions} />}
        </div>
      )}
      
      {!detailsVisible && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '10px', 
          color: themeColors.textSecondary,
          fontSize: '14px',
          transition: 'color 0.3s'
        }}>
          Click on any bar to see hourly breakdown
        </div>
      )}
      
      <AnimatePresence>
        {detailsVisible && selectedBar && intradayData && metrics && (
          <motion.div 
            className="detail-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            style={{ 
              marginTop: '20px',
              borderTop: `1px solid ${themeColors.border}`,
              paddingTop: '20px',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ 
                margin: 0, 
                color: themeColors.textPrimary, 
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'color 0.3s'
              }}>
                Hourly Breakdown: {format(new Date(selectedBar.timestamp), 'MMMM d, yyyy')}
              </h3>
              <button
                onClick={() => {
                  setDetailsVisible(false);
                  // Reset chart colors
                  if (chartRef.current) {
                    const dataset = chartRef.current.data.datasets[0];
                    // Create a new array filled with the theme color
                    const newColors = [];
                    for (let i = 0; i < dataset.data.length; i++) {
                      newColors.push(themeColors.volumeColor);
                    }
                    dataset.backgroundColor = newColors;
                    chartRef.current.update();
                  }
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: themeColors.textSecondary,
                  fontSize: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  padding: 0
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ 
              color: themeColors.textSecondary, 
              fontSize: '14px',
              marginBottom: '10px'
            }}>
              Total Volume: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>{formatCurrency(selectedBar.volume)}</span>
            </div>
            
            <div style={{ height: '200px', marginBottom: '20px' }}>
              <Bar data={intradayData} options={intradayChartOptions} />
            </div>
            
            <div style={{ 
              background: themeColors.cardBackgroundSecondary, 
              padding: '16px',
              borderRadius: '8px',
              marginTop: '15px'
            }}>
              <h4 style={{ 
                margin: '0 0 12px 0', 
                color: themeColors.textPrimary,
                fontSize: '15px',
                fontWeight: '600'
              }}>
                Trading Metrics
              </h4>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                color: themeColors.textSecondary,
                fontSize: '14px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px',
                  background: 'rgba(0, 0, 0, 0.05)',
                  padding: '10px',
                  borderRadius: '6px'
                }}>
                  <div>
                    Trade Count: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>
                      {metrics.tradeCount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    Unique Wallets: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>
                      {metrics.uniqueWallets.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px',
                  background: 'rgba(0, 0, 0, 0.05)',
                  padding: '10px',
                  borderRadius: '6px'
                }}>
                  <div>
                    Avg Trade Size: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>
                      {formatCurrency(metrics.avgTradeSize)}
                    </span>
                  </div>
                  <div>
                    Largest Trade: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>
                      {formatCurrency(metrics.largestTrade)}
                    </span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px',
                  background: 'rgba(0, 0, 0, 0.05)',
                  padding: '10px',
                  borderRadius: '6px'
                }}>
                  <div>
                    New Wallets: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>
                      {metrics.newWallets.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    Peak Hour: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>
                      {format(new Date(selectedBar.timestamp).setHours(12), 'ha')} - {format(new Date(selectedBar.timestamp).setHours(13), 'ha')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                marginTop: '24px',
                background: 'rgba(0, 0, 0, 0.05)',
                padding: '16px',
                borderRadius: '6px'
              }}>
                <div style={{ 
                  marginBottom: '12px', 
                  fontWeight: '600', 
                  color: themeColors.textPrimary,
                  fontSize: '15px'
                }}>
                  Top Trading Pairs
                </div>
                
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px'
                }}>
                  {metrics.topPairs.map((pair, index) => (
                    <div key={index} style={{ 
                      padding: '10px', 
                      backgroundColor: themeColors.primaryLight,
                      borderRadius: '6px',
                      color: themeColors.primary,
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '6px'
                    }}>
                      <div style={{ fontWeight: '500' }}>{pair.pair}</div>
                      <div style={{
                        backgroundColor: themeColors.primary,
                        color: 'white',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {pair.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VolumeChart;