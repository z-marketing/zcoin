import axios from 'axios';
import type { CryptoData } from '../types/crypto';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchCryptoData = async (coinId: string): Promise<CryptoData> => {
  try {
    const { data } = await axios.get(`${API_URL}/crypto-data`, {
      params: { slug: coinId }
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch crypto data');
    }
    throw error;
  }
};

export const fetchCoinsList = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/coins-list`);
    return data;
  } catch (error) {
    throw new Error('Failed to fetch coins list');
  }
};