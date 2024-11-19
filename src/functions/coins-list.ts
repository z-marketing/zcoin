import { Handler } from '@netlify/functions';
import axios from 'axios';

const CMC_API_KEY = 'e51a80ad-d415-4d1c-9579-77e1c81a44c2';
const CACHE_DURATION = 300; // 5 minutes

const api = axios.create({
  baseURL: 'https://pro-api.coinmarketcap.com/v1',
  headers: {
    'X-CMC_PRO_API_KEY': CMC_API_KEY,
    'Accept': 'application/json'
  }
});

let cache: { data: any; timestamp: number } | null = null;

const getCachedData = () => {
  if (!cache) return null;
  
  const now = Date.now();
  if (now - cache.timestamp > CACHE_DURATION * 1000) {
    cache = null;
    return null;
  }
  
  return cache.data;
};

const setCachedData = (data: any) => {
  cache = {
    data,
    timestamp: Date.now()
  };
};

export const handler: Handler = async () => {
  try {
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(cachedData)
      };
    }

    const { data } = await api.get('/cryptocurrency/listings/latest', {
      params: {
        limit: 100,
        sort: 'market_cap',
        sort_dir: 'desc'
      }
    });

    const coins = data.data.map((coin: any) => ({
      id: coin.slug,
      name: coin.name,
      symbol: coin.symbol
    }));

    // Add RichQuack at the beginning
    coins.unshift({
      id: 'richquack',
      name: 'RichQuack',
      symbol: 'QUACK'
    });

    // Store in cache
    setCachedData(coins);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(coins)
    };
  } catch (error) {
    console.error('Error fetching coins:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch coins list' })
    };
  }
};