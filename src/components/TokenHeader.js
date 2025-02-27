import React from 'react';
import { motion } from 'framer-motion';
import { formatTokenPrice, formatPercent, shortenAddress } from '../utils/formatters';

const TokenHeader = ({ tokenData, themeColors }) => {
  const { token, price } = tokenData;
  
  return (
    <motion.div 
      className="token-header"
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 0',
        borderBottom: `1px solid ${themeColors.border}`,
        marginBottom: '24px',
        transition: 'border-color 0.3s'
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div 
          style={{ 
            fontSize: '32px', 
            marginRight: '16px',
            background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.3s'
          }}
        >
          {token.logo}
        </div>
        <div>
          <h1 style={{ 
            margin: '0 0 4px 0', 
            color: themeColors.textPrimary,
            fontSize: '24px',
            fontWeight: 'bold',
            transition: 'color 0.3s'
          }}>
            {token.name} <span style={{ 
              color: themeColors.textSecondary, 
              fontWeight: 'normal',
              transition: 'color 0.3s'
            }}>{token.symbol}</span>
          </h1>
          <div style={{ 
            color: themeColors.textSecondary, 
            fontSize: '14px',
            transition: 'color 0.3s'
          }}>
            Contract: <a 
              href={token.explorers[0]} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: themeColors.primary, 
                textDecoration: 'none',
                transition: 'color 0.3s'
              }}
            >
              {shortenAddress(token.contractAddress)}
            </a>
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'right' }}>
        <div style={{ 
          color: themeColors.textPrimary,
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '4px',
          transition: 'color 0.3s'
        }}>
          {formatTokenPrice(price.current)}
        </div>
        <div 
          style={{ 
            display: 'inline-block',
            background: price.change24h >= 0 ? themeColors.positiveLight : themeColors.negativeLight,
            color: price.change24h >= 0 ? themeColors.positive : themeColors.negative,
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background 0.3s, color 0.3s'
          }}
        >
          {formatPercent(price.change24h)} (24h)
        </div>
      </div>
    </motion.div>
  );
};

export default TokenHeader;