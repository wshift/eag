import fetch from 'node-fetch';
import * as FormData from 'form-data';
import * as jsdom from 'jsdom';

interface PriceList {
  oes: EntityPrice[];
  buos: EntityPrice[];
}

interface EntityPrice {
  title: string;
  price: string;
}

enum Selectors {
  nodesList = 'div.mpage-prices.mpage-prices-data.v2.active',
  title = 'span.mpage-prices-type-name',
  price = 'span.mpage-prices-type-value',
}

const removeLinebreaks = (str: string) => {
  return str.replace(/[\t\n]+/gm, '');
};

// eslint-disable-next-line import/prefer-default-export
export const getPrices = async () => {
  try {
    const formData = new FormData();
    formData.append('day', '01.01.2022');
    formData.append('month', '01.2022');
    formData.append('type', 'day');
    const response = await fetch(
      'https://www.oree.com.ua/index.php/main/get_uah_prices',
      { method: 'POST', body: formData }
    );
    const htmlPage = await response.text();
    // convert string result to an document to parse data
    const { JSDOM } = jsdom;
    const dom = new JSDOM(htmlPage);
    const nodes = dom.window.document.querySelectorAll(Selectors.nodesList);
    const priceList: PriceList = {
      oes: [],
      buos: [],
    };
    nodes.forEach((node, i) => {
      const type = i % 2 === 0 ? 'oes' : 'buos';
      priceList[type].push({
        title: removeLinebreaks(
          node.querySelector(Selectors.price).textContent
        ),
        price: removeLinebreaks(
          node.querySelector(Selectors.title).textContent
        ),
      });
    });
    return priceList;
  } catch (err) {
    return new Error('Original service unavailable');
  }
};
