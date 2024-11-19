import { Handler } from '@netlify/functions';
import axios from 'axios';

const CMC_API_KEY = 'e51a80ad-d415-4d1c-9579-77e1c81a44c2';
const CACHE_DURATION = 30; // seconds

const api = axios.create({
  baseURL: 'https://pro-api.coinmarketcap.com/v1',
  headers: {
    'X-CMC_PRO_API_KEY': CMC_API_KEY,
    'Accept': 'application/json'
  }
});

// In-memory cache
let cache: { [key: string]: { data: any; timestamp: number } } = {};

const getCachedData = (key: string) => {
  const cached = cache[key];
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION * 1000) {
    delete cache[key];
    return null;
  }
  
  return cached.data;
};

const setCachedData = (key: string, data: any) => {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
};

export const handler: Handler = async (event) => {
  if (!event.queryStringParameters?.slug) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing slug parameter' })
    };
  }

  const { slug } = event.queryStringParameters;
  
  try {
    // Check cache first
    const cachedData = getCachedData(slug);
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

    const { data } = await api.get('/cryptocurrency/quotes/latest', {
      params: { slug }
    });

    const coinData = Object.values(data.data)[0] as any;
    const formattedData = {
      id: coinData.slug,
      symbol: coinData.symbol,
      name: coinData.name,
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coinData.id}.png`,
      current_price: coinData.quote.USD.price,
      market_cap: coinData.quote.USD.market_cap,
      total_volume: coinData.quote.USD.volume_24h,
      price_change_percentage_24h: coinData.quote.USD.percent_change_24h
    };

    // Store in cache
    setCachedData(slug, formattedData);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(formattedData)
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch crypto data' })
    };
  }
};