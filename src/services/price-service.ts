import { getPricePage, parsePriceFromText } from '../external-api/oree';

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

export const getPrices = async ({ date, dateTo, type }: PriceRequestType) => {
  try {
    const datesAndType = { date, dateTo, type };
    // getPricePage returns html page as a string
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
