// Generate random price data that resembles crypto price movements
const generatePriceData = (days, startPrice, volatility) => {
  const data = [];
  let currentPrice = startPrice;
  
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    // Create a date object for this data point (days ago)
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * volatility;
    currentPrice = Math.max(0.01, currentPrice * (1 + change));
    
    // Add some realistic patterns
    // Weekend dip
    if (date.getDay() === 0 || date.getDay() === 6) {
      currentPrice *= 0.995;
    }
    
    // Add data point
    data.push({
      timestamp: date.getTime(),
      price: currentPrice,
    });
  }
  
  return data;
};

// Generate volume data with some correlation to price changes
const generateVolumeData = (priceData, baseVolume) => {
  return priceData.map((point, index) => {
    const previousPrice = index > 0 ? priceData[index - 1].price : point.price;
    const priceChange = Math.abs(point.price - previousPrice) / previousPrice;
    
    // Volume tends to increase with volatility
    const volumeMultiplier = 1 + priceChange * 10;
    // Random component
    const randomFactor = 0.5 + Math.random();
    
    const volume = baseVolume * volumeMultiplier * randomFactor;
    
    return {
      timestamp: point.timestamp,
      volume: volume,
    };
  });
};

// Generate liquidity data
const generateLiquidityData = (days, baseAmount) => {
  const data = [];
  let currentLiquidity = baseAmount;
  
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Gradually increase liquidity with some fluctuations
    const change = (Math.random() - 0.45) * 0.03;
    currentLiquidity = currentLiquidity * (1 + change);
    
    // Occasional liquidity events (big additions)
    if (Math.random() < 0.03) {
      currentLiquidity += baseAmount * 0.2 * Math.random();
    }
    
    data.push({
      timestamp: date.getTime(),
      liquidity: currentLiquidity,
    });
  }
  
  return data;
};

// Generate holder data
const generateHolderData = (days) => {
  const data = [];
  let holders = 500; // Start with 500 holders
  
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Growth is faster early on, then slows
    const growthRate = 1 + (0.05 * (days - i) / days) * (Math.random() * 0.5 + 0.5);
    holders = Math.floor(holders * growthRate);
    
    data.push({
      timestamp: date.getTime(),
      holders: holders,
    });
  }
  
  return data;
};

// Generate transactions data
const generateTransactionsData = (days) => {
  const data = [];
  let dailyTx = 80; // Start with 80 transactions
  
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Growth is faster early on, then slows with randomness
    const growthRate = 1 + (0.03 * (days - i) / days) * (Math.random() * 0.5 + 0.75);
    dailyTx = Math.floor(dailyTx * growthRate);
    
    // Weekend dip in activity
    if (date.getDay() === 0 || date.getDay() === 6) {
      dailyTx = Math.floor(dailyTx * 0.85);
    }
    
    data.push({
      timestamp: date.getTime(),
      transactions: dailyTx,
    });
  }
  
  return data;
};

// Generate trade size distribution
const generateTradeSizeDistribution = () => {
  return [
    { size: "$0-$100", percentage: 45 },
    { size: "$100-$500", percentage: 32 },
    { size: "$500-$1k", percentage: 12 },
    { size: "$1k-$10k", percentage: 8 },
    { size: "$10k+", percentage: 3 }
  ];
};

// Generate wallet concentration data
const generateWalletConcentration = () => {
  return [
    { type: "Top 10 wallets", percentage: 28 },
    { type: "Next 40 wallets", percentage: 22 },
    { type: "Next 100 wallets", percentage: 18 },
    { type: "Next 1000 wallets", percentage: 22 },
    { type: "All others", percentage: 10 }
  ];
};

// Generate hourly price data for detailed view
const generateHourlyPriceData = (hours, currentPrice) => {
  const data = [];
  let price = currentPrice;
  
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const date = new Date();
    date.setHours(now.getHours() - i);
    
    // Random walk
    const change = (Math.random() - 0.5) * 0.008; // Lower volatility for hourly
    price = Math.max(0.01, price * (1 + change));
    
    // Add time of day patterns - higher during active trading hours
    const hour = date.getHours();
    if (hour >= 9 && hour <= 17) {
      price *= 1.0005; // Slight increase during trading hours
    }
    
    data.push({
      timestamp: date.getTime(),
      price: price,
    });
  }
  
  return data;
};

// Create dataset for NebulaCoin (NBC)
const days = 180;

const priceData = generatePriceData(days, 0.75, 0.03); // Starting at $0.75 with moderate volatility
const volumeData = generateVolumeData(priceData, 500000); // Base volume 500k
const liquidityData = generateLiquidityData(days, 2000000); // Start with $2M in liquidity
const holderData = generateHolderData(days);
const transactionsData = generateTransactionsData(days);

// Current values (latest data)
const currentPrice = priceData[priceData.length - 1].price;
const currentVolume = volumeData[volumeData.length - 1].volume;
const currentLiquidity = liquidityData[liquidityData.length - 1].liquidity;
const currentHolders = holderData[holderData.length - 1].holders;
const currentTransactions = transactionsData[transactionsData.length - 1].transactions;

// Calculate 24hr change
const oneDayAgoIndex = priceData.length - 25; // Roughly 24 hours ago
const priceChange = ((currentPrice - priceData[oneDayAgoIndex].price) / priceData[oneDayAgoIndex].price) * 100;
const volumeChange = ((currentVolume - volumeData[oneDayAgoIndex].volume) / volumeData[oneDayAgoIndex].volume) * 100;
const liquidityChange = ((currentLiquidity - liquidityData[oneDayAgoIndex].liquidity) / liquidityData[oneDayAgoIndex].liquidity) * 100;

// Calculate 7d change
const sevenDayAgoIndex = priceData.length - 8; // 7 days ago
const priceChange7d = ((currentPrice - priceData[sevenDayAgoIndex].price) / priceData[sevenDayAgoIndex].price) * 100;

// Generate detailed hourly data for when user clicks for more detail
const hourlyData = generateHourlyPriceData(72, currentPrice); // 72 hours of detailed data

const tokenData = {
  token: {
    name: "NebulaCoin",
    symbol: "NBC",
    logo: "🌌", // Using emoji as placeholder for logo
    contractAddress: "0x7e57f3F336156196ed873F3A7A11E948BcaB73C5",
    decimals: 18,
    createdAt: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
    description: "NebulaCoin (NBC) is a decentralized digital asset focused on interstellar commerce solutions and space-themed NFT ecosystems.",
    website: "https://nebulacoin.io",
    explorers: ["https://etherscan.io/token/0x7e57f3F336156196ed873F3A7A11E948BcaB73C5"]
  },
  markets: {
    dexVolume24h: currentVolume,
    dexVolumeChange24h: volumeChange,
    totalLiquidity: currentLiquidity,
    liquidityChange24h: liquidityChange,
    pairs: [
      { pair: "NBC-ETH", liquidity: currentLiquidity * 0.75, volume24h: currentVolume * 0.65 },
      { pair: "NBC-USDC", liquidity: currentLiquidity * 0.25, volume24h: currentVolume * 0.35 }
    ]
  },
  price: {
    current: currentPrice,
    change24h: priceChange,
    change7d: priceChange7d,
    ath: Math.max(...priceData.map(d => d.price)),
    athDate: new Date(priceData.find(d => d.price === Math.max(...priceData.map(d => d.price))).timestamp).toISOString(),
    atl: Math.min(...priceData.map(d => d.price)),
    atlDate: new Date(priceData.find(d => d.price === Math.min(...priceData.map(d => d.price))).timestamp).toISOString(),
  },
  community: {
    holders: currentHolders,
    transactions24h: currentTransactions,
    twitterFollowers: Math.floor(currentHolders * 0.8),
    discordMembers: Math.floor(currentHolders * 0.6),
    telegramMembers: Math.floor(currentHolders * 0.4)
  },
  metrics: {
    marketCap: currentPrice * 1000000000, // 1B token supply
    fullyDilutedValuation: currentPrice * 10000000000, // 10B max supply
    circulatingSupply: 1000000000,
    totalSupply: 5000000000,
    maxSupply: 10000000000
  },
  tradeSizeDistribution: generateTradeSizeDistribution(),
  walletConcentration: generateWalletConcentration(),
  historicalData: {
    price: priceData,
    volume: volumeData,
    liquidity: liquidityData,
    holders: holderData,
    transactions: transactionsData
  },
  detailedData: {
    hourly: hourlyData
  }
};

export default tokenData;