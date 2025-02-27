import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatNumber, formatTokenPrice, formatPercent } from '../utils/formatters';

const StatCard = ({ title, value, change, changeLabel = '24h', themeColors }) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div 
      style={{
        background: themeColors.cardBackgroundSecondary,
        borderRadius: '12px',
        padding: '16px',
        flex: 1,
        minWidth: '180px',
        boxShadow: themeColors.cardShadow,
        transition: 'background-color 0.3s, box-shadow 0.3s'
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ 
        color: themeColors.textSecondary, 
        fontSize: '14px', 
        marginBottom: '8px',
        transition: 'color 0.3s'
      }}>
        {title}
      </div>
      <div style={{ 
        color: themeColors.textPrimary, 
        fontSize: '24px', 
        fontWeight: 'bold', 
        marginBottom: '8px',
        transition: 'color 0.3s'
      }}>
        {value}
      </div>
      {change !== undefined && (
        <div 
          style={{ 
            display: 'inline-block',
            background: isPositive ? themeColors.positiveLight : themeColors.negativeLight,
            color: isPositive ? themeColors.positive : themeColors.negative,
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s, color 0.3s'
          }}
        >
          {formatPercent(change)} {changeLabel}
        </div>
      )}
    </motion.div>
  );
};

const TokenStats = ({ tokenData, themeColors }) => {
  const { price, markets, community, metrics } = tokenData;
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <motion.div 
      style={{ marginBottom: '32px' }}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <h2 style={{ 
        color: themeColors.textPrimary, 
        marginBottom: '16px', 
        fontSize: '20px',
        transition: 'color 0.3s'
      }}>Overview</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
        <StatCard 
          title="Price"
          value={formatTokenPrice(price.current)}
          change={price.change24h}
          themeColors={themeColors}
        />
        <StatCard 
          title="24h Volume"
          value={formatCurrency(markets.dexVolume24h)}
          change={markets.dexVolumeChange24h}
          themeColors={themeColors}
        />
        <StatCard 
          title="Total Liquidity"
          value={formatCurrency(markets.totalLiquidity)}
          change={markets.liquidityChange24h}
          themeColors={themeColors}
        />
        <StatCard 
          title="Market Cap"
          value={formatCurrency(metrics.marketCap)}
          change={price.change24h}
          themeColors={themeColors}
        />
      </div>
      
      <h2 style={{ 
        color: themeColors.textPrimary, 
        marginBottom: '16px', 
        fontSize: '20px',
        transition: 'color 0.3s'
      }}>Key Metrics</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <StatCard 
          title="Holders"
          value={formatNumber(community.holders)}
          change={undefined}
          themeColors={themeColors}
        />
        <StatCard 
          title="Daily Transactions"
          value={formatNumber(community.transactions24h)}
          change={undefined}
          themeColors={themeColors}
        />
        <StatCard 
          title="Fully Diluted Value"
          value={formatCurrency(metrics.fullyDilutedValuation)}
          change={undefined}
          themeColors={themeColors}
        />
        <StatCard 
          title="Circulating Supply"
          value={formatNumber(metrics.circulatingSupply)}
          change={undefined}
          themeColors={themeColors}
        />
      </div>
    </motion.div>
  );
};

export default TokenStats;