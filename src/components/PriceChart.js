import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { formatTimestamp, formatTokenPrice } from '../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

const TIME_PERIODS = {
  '24H': 1,
  '7D': 7,
  '30D': 30,
  '90D': 90,
  'ALL': 'all'
};

const PriceChart = ({ priceData, onZoom, themeColors }) => {
  const [timePeriod, setTimePeriod] = useState('30D');
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isZooming, setIsZooming] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!priceData || priceData.length === 0) {
      setIsLoading(true);
      return;
    }

    // Filter data based on selected time period
    let filteredData = priceData;
    if (timePeriod !== 'ALL') {
      const daysToShow = TIME_PERIODS[timePeriod];
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToShow);
      filteredData = priceData.filter(point => 
        new Date(point.timestamp) >= cutoffDate
      );
    }

    // Format the data for Chart.js
    const chartData = {
      labels: filteredData.map(point => new Date(point.timestamp)),
      datasets: [
        {
          label: 'Price',
          data: filteredData.map(point => point.price),
          borderColor: themeColors.priceLineColor,
          backgroundColor: themeColors.priceAreaColor,
          borderWidth: 2,
          pointRadius: filteredData.length > 60 ? 0 : 2,
          pointHoverRadius: 4,
          tension: 0.2,
          fill: true
        }
      ]
    };

    setChartData(chartData);
    setIsLoading(false);
  }, [priceData, timePeriod, themeColors]);

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
          unit: timePeriod === '24H' ? 'hour' : 'day',
          tooltipFormat: 'MMM d, yyyy',
          displayFormats: {
            hour: 'ha',
            day: 'MMM d'
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
    },
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        // Get the clicked data point
        const chart = chartRef.current;
        const dataIndex = elements[0].index;
        const timestamp = chart.data.labels[dataIndex];
        const price = chart.data.datasets[0].data[dataIndex];
        
        // Trigger zoom animation
        setIsZooming(true);
        setTimeout(() => {
          // Call parent callback with selected point data
          onZoom({
            timestamp,
            price,
            timePeriod
          });
          setIsZooming(false);
        }, 500);
      }
    }
  };

  return (
    <motion.div 
      className="chart-container"
      style={{ 
        position: 'relative', 
        height: '400px',
        background: themeColors.cardBackground,
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: themeColors.cardShadow,
        transition: 'background-color 0.3s, box-shadow 0.3s'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: themeColors.textPrimary, fontSize: '18px' }}>Price Chart</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {Object.keys(TIME_PERIODS).map(period => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              style={{
                background: timePeriod === period ? themeColors.primaryLight : 'transparent',
                color: timePeriod === period ? themeColors.primary : themeColors.textSecondary,
                border: timePeriod === period 
                  ? `1px solid ${themeColors.primary}` 
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
          height: '300px',
          color: themeColors.textPrimary
        }}>
          Loading chart...
        </div>
      ) : (
        <motion.div 
          style={{ height: '300px' }}
          animate={{
            scale: isZooming ? [1, 1.05, 1] : 1,
            opacity: isZooming ? [1, 0.8, 1] : 1
          }}
          transition={{ duration: 0.5 }}
        >
          {chartData && <Line ref={chartRef} data={chartData} options={chartOptions} />}
        </motion.div>
      )}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '10px', 
        color: themeColors.textSecondary,
        fontSize: '14px'
      }}>
        Click on any point to view detailed data
      </div>
    </motion.div>
  );
};

export default PriceChart;