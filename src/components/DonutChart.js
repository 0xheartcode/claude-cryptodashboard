import React, { useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Generate additional random data for segment details
const generateSegmentDetail = (label, percentage, isTradeSize = false) => {
  // Use deterministic values based on the label and percentage to ensure consistency
  const labelHash = label.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = (labelHash + percentage) / 100;
  
  if (isTradeSize) {
    // For trade size segments
    const transactions = Math.floor(1000 + seed * 4000);
    const avgTradeValue = parseFloat((50 + seed * 1000).toFixed(2));
    const changeFromLastWeek = parseFloat((-15 + seed * 30).toFixed(2));
    
    return {
      transactions,
      avgTradeValue,
      changeFromLastWeek,
      topTraders: Math.floor(5 + seed * 45),
      popularPairings: [
        { pair: "NBC-ETH", volume: Math.floor(40 + seed * 50) },
        { pair: "NBC-USDC", volume: Math.floor(30 + seed * 40) }
      ]
    };
  } else {
    // For wallet concentration segments
    const numWallets = Math.floor(10 + seed * 2000);
    const totalHoldings = parseFloat((percentage * 10000000).toFixed(2));
    const avgHolding = parseFloat((totalHoldings / numWallets).toFixed(2));
    const activity = ["Very High", "High", "Medium", "Low", "Very Low"][Math.floor(seed * 5)];
    
    return {
      numWallets,
      totalHoldings,
      avgHolding,
      activity,
      holdingPeriod: Math.floor(10 + seed * 200) + " days",
      topAssets: [
        { asset: "Ethereum", percentage: Math.floor(20 + seed * 60) },
        { asset: "Stablecoins", percentage: Math.floor(10 + seed * 40) }
      ]
    };
  }
};

const DonutChart = ({ data, title, colors, themeColors }) => {
  const chartRef = useRef(null);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  
  // Determine if this is a trade size chart based on the first data item
  const isTradeSize = data[0].size !== undefined;
  
  // Default colors if not provided
  const defaultColors = themeColors ? themeColors.distributionColors : [
    'rgba(87, 121, 234, 0.8)',
    'rgba(87, 187, 234, 0.8)',
    'rgba(87, 234, 208, 0.8)',
    'rgba(140, 234, 87, 0.8)',
    'rgba(226, 234, 87, 0.8)'
  ];
  
  const chartColors = colors || defaultColors;
  
  const chartData = {
    labels: data.map(item => item.type || item.size),
    datasets: [
      {
        data: data.map(item => item.percentage),
        backgroundColor: chartColors,
        borderColor: chartColors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
        hoverOffset: 15
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: themeColors.textSecondary,
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const backgroundColor = dataset.backgroundColor[i];
                
                return {
                  text: `${label} (${value}%)`,
                  fillStyle: backgroundColor,
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: 1,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        },
        onClick: () => {} // Disable default behavior
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.formattedValue || '';
            return `${label}: ${value}%`;
          }
        },
        backgroundColor: themeColors.tooltipBackground,
        padding: 12,
        cornerRadius: 8,
        titleColor: themeColors.textPrimary,
        bodyColor: themeColors.textPrimary,
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    },
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        const chart = chartRef.current;
        if (chart) {
          // Get the clicked segment
          const index = elements[0].index;
          const label = chart.data.labels[index];
          const percentage = chart.data.datasets[0].data[index];
          
          // Generate detailed data for this segment
          const details = generateSegmentDetail(label, percentage, isTradeSize);
          
          // Set the selected segment data
          setSelectedSegment({
            label,
            percentage,
            color: chartColors[index],
            details
          });
          
          // Show the details panel
          setDetailsVisible(true);
          
          // Animate the segment
          const dataset = chart.data.datasets[0];
          const originalBackgroundColor = [...dataset.backgroundColor];
          
          // Pulse the selected segment with a color appropriate for the theme
          const highlightColor = themeColors.theme === 'dark' 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'rgba(30, 30, 30, 0.9)';
          
          dataset.backgroundColor = dataset.backgroundColor.map((color, i) => 
            i === index ? highlightColor : color
          );
          
          chart.update();
          
          // Return to original color after animation
          setTimeout(() => {
            dataset.backgroundColor = originalBackgroundColor;
            chart.update();
          }, 500);
        }
      }
    }
  };
  
  return (
    <motion.div 
      className="donut-chart-container"
      style={{ 
        position: 'relative', 
        height: detailsVisible ? '450px' : '300px',
        background: themeColors.cardBackground,
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: themeColors.cardShadow,
        transition: 'background-color 0.3s, box-shadow 0.3s, height 0.3s'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ 
          margin: 0, 
          color: themeColors.textPrimary, 
          fontSize: '18px',
          transition: 'color 0.3s'
        }}>{title}</h2>
        
        {detailsVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
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
            onClick={() => setDetailsVisible(false)}
          >
            ×
          </motion.button>
        )}
      </div>
      
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        height: '220px'
      }}>
        <Doughnut ref={chartRef} data={chartData} options={chartOptions} />
      </div>
      
      <AnimatePresence>
        {detailsVisible && selectedSegment ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginTop: '15px',
              overflow: 'hidden',
              borderTop: `1px solid ${themeColors.border}`,
              paddingTop: '15px'
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: selectedSegment.color,
                marginRight: '8px'
              }}></div>
              <h3 style={{ 
                margin: 0, 
                color: themeColors.textPrimary,
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {selectedSegment.label}: {selectedSegment.percentage}%
              </h3>
            </div>
            
            {isTradeSize ? (
              <div style={{ color: themeColors.textSecondary, fontSize: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
                  <div>Transactions: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>{selectedSegment.details.transactions.toLocaleString()}</span></div>
                  <div>Avg Value: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>${selectedSegment.details.avgTradeValue.toLocaleString()}</span></div>
                  <div>Weekly Change: <span style={{ 
                    color: selectedSegment.details.changeFromLastWeek >= 0 ? themeColors.positive : themeColors.negative,
                    fontWeight: '500'
                  }}>{selectedSegment.details.changeFromLastWeek >= 0 ? '+' : ''}{selectedSegment.details.changeFromLastWeek}%</span></div>
                  <div>Top Traders: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>{selectedSegment.details.topTraders}</span></div>
                </div>
                <div>
                  <div style={{ marginBottom: '8px', fontWeight: '500', color: themeColors.textPrimary }}>Popular Pairings:</div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {selectedSegment.details.popularPairings.map((pair, index) => (
                      <div key={index} style={{ 
                        padding: '6px 10px', 
                        backgroundColor: themeColors.primaryLight,
                        borderRadius: '4px',
                        color: themeColors.primary,
                        fontSize: '13px'
                      }}>
                        {pair.pair} ({pair.volume}%)
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: themeColors.textSecondary, fontSize: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
                  <div>Number of Wallets: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>{selectedSegment.details.numWallets.toLocaleString()}</span></div>
                  <div>Avg Holding: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>${selectedSegment.details.avgHolding.toLocaleString()}</span></div>
                  <div>Total Holdings: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>${(selectedSegment.details.totalHoldings / 1000000).toFixed(2)}M</span></div>
                  <div>Holding Period: <span style={{ color: themeColors.textPrimary, fontWeight: '500' }}>{selectedSegment.details.holdingPeriod}</span></div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: '500', color: themeColors.textPrimary }}>Trading Activity:</span> 
                  <span style={{ 
                    marginLeft: '4px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: selectedSegment.details.activity === 'Very High' || selectedSegment.details.activity === 'High' ? themeColors.positiveLight : themeColors.primaryLight,
                    color: selectedSegment.details.activity === 'Very High' || selectedSegment.details.activity === 'High' ? themeColors.positive : themeColors.primary,
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {selectedSegment.details.activity}
                  </span>
                </div>
                <div>
                  <div style={{ marginBottom: '8px', fontWeight: '500', color: themeColors.textPrimary }}>Other Top Assets:</div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {selectedSegment.details.topAssets.map((asset, index) => (
                      <div key={index} style={{ 
                        padding: '6px 10px', 
                        backgroundColor: themeColors.primaryLight,
                        borderRadius: '4px',
                        color: themeColors.primary,
                        fontSize: '13px'
                      }}>
                        {asset.asset} ({asset.percentage}%)
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '10px', 
            color: themeColors.textSecondary,
            fontSize: '14px',
            transition: 'color 0.3s'
          }}>
            Click on segments for details
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DonutChart;