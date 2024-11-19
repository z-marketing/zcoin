import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { CryptoData } from '../types/crypto';
import { fetchCryptoData } from '../services/api';

interface WidgetProps {
  coinId: string;
  theme?: 'light' | 'dark' | 'custom';
  accentColor?: string;
  backgroundColor?: string;
  padding?: number;
  responsive?: boolean;
}

const formatPrice = (price: number): string => {
  if (typeof price !== 'number' || isNaN(price)) return '$0';
  
  if (price < 0.00001) {
    return price.toExponential(2).replace('e-', '×10⁻');
  }
  
  if (price < 1) {
    const priceStr = price.toFixed(8);
    return `$${priceStr}`;
  }
  
  return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const formatLargeNumber = (num: number): string => {
  if (!num) return '$0';
  
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(3)}T`;
  }
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(3)}B`;
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(3)}M`;
  }
  return `$${num.toLocaleString()}`;
};

export default function Widget({ 
  coinId, 
  theme = 'light',
  accentColor = '#4F46E5',
  backgroundColor = '#FFFFFF',
  padding = 16,
  responsive = false
}: WidgetProps) {
  const [data, setData] = useState<CryptoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const cryptoData = await fetchCryptoData(coinId);
        setData(cryptoData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [coinId]);

  const getThemeStyles = () => {
    if (theme === 'custom') {
      return {
        backgroundColor,
        color: '#000000',
        accentColor
      };
    }
    return theme === 'dark' 
      ? { backgroundColor: '#1F2937', color: '#FFFFFF', accentColor: '#60A5FA' }
      : { backgroundColor: '#FFFFFF', color: '#000000', accentColor: '#4F46E5' };
  };

  const themeStyles = getThemeStyles();

  if (loading) {
    return (
      <div 
        className="animate-pulse rounded-lg"
        style={{ 
          backgroundColor: themeStyles.backgroundColor,
          padding: `${padding}px`,
          width: responsive ? '100%' : 'auto'
        }}
      >
        <div className="h-16 bg-gray-300 rounded mb-4"></div>
        <div className="h-8 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div 
        className="rounded-lg flex items-center justify-center p-4"
        style={{ 
          backgroundColor: themeStyles.backgroundColor,
          color: themeStyles.color,
          padding: `${padding}px`,
          width: responsive ? '100%' : 'auto'
        }}
      >
        <p>Failed to load data. Please try again later.</p>
      </div>
    );
  }

  const isPositive = data.price_change_percentage_24h > 0;

  return (
    <div 
      className="rounded-lg"
      style={{ 
        backgroundColor: themeStyles.backgroundColor,
        color: themeStyles.color,
        padding: `${padding}px`,
        width: responsive ? '100%' : 'auto'
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <img src={data.image} alt={data.name} className="w-8 h-8" />
          <div>
            <h2 className="font-bold">{data.name}</h2>
            <p className="text-sm opacity-70">{data.symbol?.toUpperCase() || ''}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold">{formatPrice(data.current_price)}</p>
          <div 
            className="flex items-center justify-end text-xs"
            style={{ color: isPositive ? '#10B981' : '#EF4444' }}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="ml-1">24h: {Math.abs(data.price_change_percentage_24h).toFixed(2)}%</span>
          </div>
        </div>

        <div>
          <p className="text-sm opacity-70">Market Cap</p>
          <p className="font-semibold">{formatLargeNumber(data.market_cap)}</p>
        </div>

        <div className="text-right">
          <p className="text-sm opacity-70">Volume 24h</p>
          <p className="font-semibold">{formatLargeNumber(data.total_volume)}</p>
        </div>
      </div>
    </div>
  );
}