import { makeIndex } from './lib/utils.js';

export function initData() {
  const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

  // кеш
  let sellers;
  let customers;
  let lastResult;
  let lastQuery;

  // приводим записи сервера к формату таблицы
  const mapRecords = (items) =>
    items.map((item) => ({
      id: item.receipt_id,
      date: item.date,
      seller: sellers[item.seller_id],
      customer: customers[item.customer_id],
      total: item.total_amount,
    }));

  // индексы
  const getIndexes = async () => {
    if (!sellers || !customers) {
      const [sellersResponse, customersResponse] = await Promise.all([
        fetch(`${BASE_URL}/sellers`).then((res) => res.json()),
        fetch(`${BASE_URL}/customers`).then((res) => res.json()),
      ]);

      sellers = sellersResponse;
      customers = customersResponse;
    }

    return { sellers, customers };
  };

  // записи продаж
  const getRecords = async (query = {}, isUpdated = false) => {
    // query -> строка
    const qs = new URLSearchParams(query);
    const nextQuery = qs.toString();

    // кеш
    if (lastQuery === nextQuery && !isUpdated) {
      return lastResult;
    }

    // убедимся, что индексы загружены (иначе mapRecords не сможет подставить имена)
    await getIndexes();

    const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
    const records = await response.json();

    lastQuery = nextQuery;
    lastResult = {
      total: records.total,
      items: mapRecords(records.items),
    };

    return lastResult;
  };

  return {
    getIndexes,
    getRecords,
  };
}
