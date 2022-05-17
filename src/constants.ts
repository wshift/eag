export interface EmailFieldType {
  name: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  pointCode: string;
  pointAddress: string;
  objType: string;
  askoe: string;
  payment: string;
  power: string;
  consume: string;
  text: string;
  subject: string;
  fullName: string;
}

export const EMAIL_FIELDS: EmailFieldType = {
  name: 'ПIБ або Найменування організації',
  fullName: 'ПIБ',
  contactName: 'Контактна особа',
  email: 'Eлектронна пошта',
  phoneNumber: 'Контактный номер телефону',
  pointCode: 'EIC - код точки (точок) обліку',
  pointAddress: 'Юридична адреса за цими точками',
  objType: "Тип об'єкту",
  askoe: 'Наявність АСКОЕ',
  payment: 'Плата за розподiл',
  power: 'Потужність установок',
  consume: 'Планове споживання місячне (в кВт * год)',
  text: 'Відгук',
  subject: 'Тип звернення',
};

export const PRICE_PAGE_URL =
  'https://www.oree.com.ua/index.php/main/get_weighted_average_prices';

export const ALLOWED_FORM_TYPES = ['connect', 'supply', 'feedback'];
