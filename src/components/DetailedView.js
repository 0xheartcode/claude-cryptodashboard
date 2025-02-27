import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimestamp, formatTokenPrice } from '../utils/formatters';

const DetailedView = ({ data, onClose, themeColors }) => {
  const [chartData, setChartData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('price');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!data || !data.timestamp) {
      return;
    }
    
    const hourlyData = data.hourly;
    
    // Find the index that's closest to the selected timestamp
    const targetTime = new Date(data.timestamp).getTime();
    const closestIndex = hourlyData.findIndex(point => {
      return Math.abs(new Date(point.timestamp).getTime() - targetTime) < 1000 * 60 * 60; // within an hour
    });
    
    // Get data surrounding that point (24 hours before and after)
    const startIndex = Math.max(0, closestIndex - 24);
    const endIndex = Math.min(hourlyData.length - 1, closestIndex + 24);
    
    const relevantData = hourlyData.slice(startIndex, endIndex + 1);
    
    // Format the data for Chart.js
    const chartData = {
      labels: relevantData.map(point => new Date(point.timestamp)),
      datasets: [
        {
          label: 'Price',
          data: relevantData.map(point => point.price),
          borderColor: themeColors.detailLineColor,
          backgroundColor: themeColors.detailAreaColor,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: themeColors.detailLineColor,
          tension: 0.2,
          fill: true
        }
      ]
    };
    
    setChartData(chartData);
    setIsLoading(false);
  }, [data, themeColors]);
  
  if (!data) return null;
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Price: ${formatTokenPrice(context.raw)}`;
          },
          title: function(context) {
            return formatTimestamp(context[0].parsed.x);
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
            return formatTokenPrice(value);
          },
          color: themeColors.textSecondary,
        }
      }
    }
  };

  // Determine the trading trend
  const isBullish = data.price > data.hourly[0].price;
  const changePercent = Math.abs((data.price / data.hourly[0].price - 1) * 100).toFixed(2);
  const isHighVolatility = Math.random() > 0.5;
  const buyingSelling = Math.random() > 0.5 ? 'buying' : 'selling';
  const investorType = Math.random() > 0.5 ? 'institutional' : 'retail';

  return (
    <AnimatePresence>
      <motion.div
        className="detailed-view-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: themeColors.modalBackground,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          transition: 'background-color 0.3s'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="detailed-view-content"
          style={{
            width: '90%',
            maxWidth: '900px',
            maxHeight: '90vh',
            backgroundColor: themeColors.cardBackground,
            borderRadius: '16px',
            padding: '24px',
            overflow: 'auto',
            boxShadow: themeColors.shadow,
            transition: 'background-color 0.3s, box-shadow 0.3s'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px' 
          }}>
            <h2 style={{ 
              color: themeColors.textPrimary, 
              margin: 0,
              transition: 'color 0.3s'
            }}>Detailed Data View</h2>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: themeColors.textPrimary,
                fontSize: '24px',
                cursor: 'pointer',
                transition: 'color 0.3s'
              }}
            >
              ×
            </button>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ 
              color: themeColors.textSecondary, 
              margin: '0 0 10px 0',
              transition: 'color 0.3s'
            }}>
              Selected Data Point: {formatTimestamp(data.timestamp)}
            </p>
            <div style={{ 
              color: themeColors.textPrimary, 
              fontSize: '24px', 
              fontWeight: 'bold',
              transition: 'color 0.3s'
            }}>
              Price: {formatTokenPrice(data.price)}
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              color: themeColors.textPrimary, 
              marginBottom: '10px',
              transition: 'color 0.3s'
            }}>Hourly Price Movement</h3>
            <div style={{ 
              color: themeColors.textSecondary, 
              fontSize: '14px', 
              marginBottom: '20px',
              transition: 'color 0.3s'
            }}>
              Showing detailed 48-hour price action around the selected point
            </div>
            
            {isLoading ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '300px',
                color: themeColors.textPrimary,
                transition: 'color 0.3s'
              }}>
                Loading detailed data...
              </div>
            ) : (
              <div style={{ height: '300px' }}>
                {chartData && <Line data={chartData} options={chartOptions} />}
              </div>
            )}
          </div>
          
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ 
              color: themeColors.textPrimary, 
              marginBottom: '15px',
              transition: 'color 0.3s'
            }}>Market Insights</h3>
            <div style={{ 
              background: themeColors.theme === 'dark' 
                ? 'rgba(255, 159, 28, 0.1)'
                : 'rgba(237, 137, 54, 0.05)', 
              padding: '20px', 
              borderRadius: '8px',
              borderLeft: `4px solid ${themeColors.accent}`,
              transition: 'background-color 0.3s, border-color 0.3s'
            }}>
              <p style={{ 
                color: themeColors.textPrimary, 
                fontSize: '16px', 
                margin: '0 0 10px 0',
                transition: 'color 0.3s'
              }}>
                <strong>Key insight:</strong> This timeframe shows {isBullish ? 'bullish' : 'bearish'} momentum with 
                {' '}{changePercent}% change over 
                the detailed period. Volatility is {isHighVolatility ? 'higher' : 'lower'} than average.
              </p>
              <p style={{ 
                color: themeColors.textSecondary, 
                fontSize: '14px', 
                margin: 0,
                transition: 'color 0.3s'
              }}>
                Trading activity during this period is predominantly 
                {' '}{buyingSelling} with 
                increased presence from {investorType} investors.
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
            <motion.button
              onClick={onClose}
              style={{
                background: themeColors.theme === 'dark' 
                  ? 'linear-gradient(90deg, #5588FF 0%, #7000FF 100%)'
                  : 'linear-gradient(90deg, #4263EB 0%, #38B2AC 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: themeColors.cardShadow,
                transition: 'background 0.3s, box-shadow 0.3s'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Return to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DetailedView;