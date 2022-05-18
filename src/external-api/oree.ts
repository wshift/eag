import fetch from 'node-fetch';
import { PRICE_PAGE_URL } from '../constants';
import FormData from 'form-data';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

interface PriceParamsType {
  date: string | string[];
  dateTo: string | string[];
  type: string | string[];
  market: string | string[];
}

enum Selectors {
  nodesList = 'div.mpage-prices.mpage-prices-data.v2.active',
  price = 'span.mpage-prices-type-value',
  percentage = 'span.index-prices-value',
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

const removeLinebreaks = (str: string) => {
  return str.replace(/[\t\n]+/gm, '').trim();
};

export const parsePriceFromText = (text: string) => {
  const domPage = new JSDOM(text);
  const domNodes = domPage.window.document.querySelectorAll(
    Selectors.nodesList
  );
  const price = removeLinebreaks(
    domNodes[0].querySelector(Selectors.price).textContent
  );
  const percentage = removeLinebreaks(
    domNodes[0].querySelector(Selectors.percentage).textContent
  );
  return { price, percentage };
};
