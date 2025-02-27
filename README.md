# Crypto Token Analytics Dashboard

A React-based analytics dashboard for cryptocurrency tokens with interactive charts, animations, and detailed data views.

![NebulaCoin Analytics Dashboard](https://placeholder.co/1200x800?text=NebulaCoin+Analytics)

## Features

- **Real-time Price Chart**: Interactive line chart with time period selection
- **Volume Analysis**: Bar chart visualizing trading volume
- **Token Stats**: Key metrics with attractive cards and animations
- **Distribution Charts**: Interactive donut charts for trade size and wallet concentration
- **Detailed View**: Click on any data point to see a zoomed in, detailed view with hourly data
- **Dark/Light Mode**: Toggle between dark and light themes with system preference detection
- **Animations**: Smooth transitions and interactions using Framer Motion
- **Mobile Responsive**: Adapts to different screen sizes

## Mock Data

The dashboard uses mock data for a fictional token called "NebulaCoin" (NBC). The data includes:

- Historical price and volume data
- Liquidity information
- Holder statistics
- Trade size distribution
- Wallet concentration

## Built With

- React (Hooks, Context API for state management)
- Chart.js / react-chartjs-2 for data visualization
- Framer Motion for animations
- React Spring for additional animations
- CSS for styling

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Interactive Features

- **Time Period Selection**: Change the time range for the price and volume charts
- **Click on Price Points**: Click any point on the price chart to open a detailed view
- **Interactive Charts**: Hover over charts for tooltips with detailed information
- **Animated Segments**: Click on donut chart segments for highlight animations
- **Theme Toggle**: Switch between dark and light modes with persistent preferences

## Theme System

The dashboard includes a comprehensive theme system that:
- Detects and respects user's system preference for dark/light mode
- Allows manual override with a theme toggle
- Persists theme preference using localStorage
- Provides smooth transitions between themes

## Customizing the Data

You can edit the mock data in `src/data/tokenData.js` to simulate different token behaviors:

- Adjust volatility parameters
- Change token supply metrics
- Modify distribution patterns

## License

MIT