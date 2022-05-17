import { getPricePage } from '../external-api/oree';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

interface PriceListType {
  // price types from original https://www.oree.com.ua/
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

enum Selectors {
  nodesList = 'div.mpage-prices.mpage-prices-data.v2.active',
  price = 'span.mpage-prices-type-value',
  percentage = 'span.index-prices-value',
}

const removeLinebreaks = (str: string) => {
  return str.replace(/[\t\n]+/gm, '').trim();
};

const parsePriceFromText = (text: string) => {
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

export const getPrices = async ({ date, dateTo, type }: PriceRequestType) => {
  try {
    const datesAndType = { date, dateTo, type };

    const rdnPageText = await getPricePage({
      ...datesAndType,
      market: 'DAM',
    });

    const vdrPageText = await getPricePage({
      ...datesAndType,
      market: 'IDM',
    });

    // convert string html to a document and parse selected values
    const priceList: PriceListType = {
      vdr: parsePriceFromText(vdrPageText),
      rdn: parsePriceFromText(rdnPageText),
    };

    return priceList;
  } catch (err) {
    throw new Error('Original service unavailable');
  }
};
