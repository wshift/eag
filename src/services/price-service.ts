import { getPricePage, parsePriceFromText } from '../external-api/oree';
import moment from 'moment';

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

const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY';

const addDaysToDate = (date: string | string[], daysToIncrease: number) => {
  return moment(date, DEFAULT_DATE_FORMAT)
    .add(daysToIncrease, 'days')
    .format(DEFAULT_DATE_FORMAT);
};

export const getPrices = async ({ date, dateTo, type }: PriceRequestType) => {
  try {
    const datesAndType = { date, dateTo, type };
    // getPricePage returns html page as a string
    const rdnPageText = await getPricePage({
      ...datesAndType,
      date: addDaysToDate(date, 2),
      dateTo: addDaysToDate(dateTo, 2),
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
