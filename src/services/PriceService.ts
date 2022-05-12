import fetch from 'node-fetch';
import * as FormData from 'form-data';
import * as jsdom from 'jsdom';

interface PriceListType {
  vdr: PriceItemType;
  rdn: PriceItemType;
}

type PriceItemType = {
  price: string;
  percentage: string;
};

interface PriceRequestType {
  date: string | string[];
  dateTo: string | string[];
  type: string | string[];
}

interface PriceParamsType {
  date: string | string[];
  dateTo: string | string[];
  type: string | string[];
  market: string | string[];
}

enum Selectors {
  nodesList = 'div.mpage-prices.mpage-prices-data.v2.active',
  price = 'span.mpage-prices-type-value',
  percantage = 'span.index-prices-value',
}

const removeLinebreaks = (str: string) => {
  return str.replace(/[\t\n]+/gm, '').trim();
};

const getPriceByMarket = async ({
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
  const response = await fetch(
    'https://www.oree.com.ua/index.php/main/get_weighted_average_prices',
    { method: 'POST', body: formData }
  );
  return response.text();
};

export const getPrices = async ({ date, dateTo, type }: PriceRequestType) => {
  try {
    const damPage = await getPriceByMarket({
      date,
      dateTo,
      type,
      market: 'DAM',
    });
    const idmPage = await getPriceByMarket({
      date,
      dateTo,
      type,
      market: 'IDM',
    });
    // convert string html to a document and parse selected values
    const { JSDOM } = jsdom;
    const idmDom = new JSDOM(idmPage);
    const damDom = new JSDOM(damPage);
    const idmNodes = idmDom.window.document.querySelectorAll(
      Selectors.nodesList
    );
    const damNodes = damDom.window.document.querySelectorAll(
      Selectors.nodesList
    );
    const priceList: PriceListType = {
      vdr: {
        price: removeLinebreaks(
          idmNodes[0].querySelector(Selectors.price).textContent
        ),
        percentage: removeLinebreaks(
          idmNodes[0].querySelector(Selectors.percantage).textContent
        ),
      },
      rdn: {
        price: removeLinebreaks(
          damNodes[0].querySelector(Selectors.price).textContent
        ),
        percentage: removeLinebreaks(
          damNodes[0].querySelector(Selectors.percantage).textContent
        ),
      },
    };
    return priceList;
  } catch (err) {
    throw new Error('Original service unavailable');
  }
};
