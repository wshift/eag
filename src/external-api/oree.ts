import fetch from 'node-fetch';
import { PRICE_PAGE_URL } from '../constants';
import FormData from 'form-data';

interface PriceParamsType {
  date: string | string[];
  dateTo: string | string[];
  type: string | string[];
  market: string | string[];
}

export const getPricePage = async ({
  date,
  dateTo,
  type,
  market,
}: PriceParamsType) => {
  const monthAndYear = date.toString().substr(3);
  const formData = new FormData();
  formData.append('day', date);
  formData.append('day_to', dateTo);
  formData.append('month', monthAndYear);
  formData.append('type', type);
  formData.append('market', market);
  const response = await fetch(PRICE_PAGE_URL, {
    method: 'POST',
    body: formData,
  });
  return response.text();
};
