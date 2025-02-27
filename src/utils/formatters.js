// Format currency values
export const formatCurrency = (value, decimals = 2) => {
  if (value === null || value === undefined) return '-';
  
  // Handle different magnitudes
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(decimals)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(decimals)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(decimals)}K`;
  } else {
    return `$${value.toFixed(decimals)}`;
  }
};

// Format large numbers
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return '-';
  
  // Handle different magnitudes
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(decimals)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(decimals)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(decimals)}K`;
  } else {
    return value.toFixed(decimals);
  }
};

// Format token price based on magnitude
export const formatTokenPrice = (price) => {
  if (price === null || price === undefined) return '-';
  
  if (price < 0.00001) {
    return `$${price.toExponential(2)}`;
  } else if (price < 0.001) {
    return `$${price.toFixed(6)}`;
  } else if (price < 0.01) {
    return `$${price.toFixed(5)}`;
  } else if (price < 0.1) {
    return `$${price.toFixed(4)}`;
  } else if (price < 1) {
    return `$${price.toFixed(3)}`;
  } else if (price < 10) {
    return `$${price.toFixed(2)}`;
  } else if (price < 1000) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price.toFixed(0)}`;
  }
};

// Format percentage values
export const formatPercent = (value, decimals = 2) => {
  if (value === null || value === undefined) return '-';
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

// Format date objects
export const formatDate = (date) => {
  if (!date) return '-';
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format timestamp for tooltips
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format token amount with appropriate decimals and suffix
export const formatTokenAmount = (amount, symbol = '', decimals = 2) => {
  if (amount === null || amount === undefined) return '-';
  
  let formattedAmount;
  
  if (amount >= 1000000000) {
    formattedAmount = `${(amount / 1000000000).toFixed(decimals)}B`;
  } else if (amount >= 1000000) {
    formattedAmount = `${(amount / 1000000).toFixed(decimals)}M`;
  } else if (amount >= 1000) {
    formattedAmount = `${(amount / 1000).toFixed(decimals)}K`;
  } else {
    formattedAmount = amount.toFixed(decimals);
  }
  
  return symbol ? `${formattedAmount} ${symbol}` : formattedAmount;
};

// Shorten wallet address
export const shortenAddress = (address, chars = 4) => {
  if (!address) return '-';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};