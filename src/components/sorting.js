import { sortMap } from '../lib/sort.js';

export function initSorting(columns) {
  let field;
  let order;

  return (query, state, action) => {
    // #3.1 — обработать нажатие на кнопку сортировки
    if (action && action.dataset && action.dataset.field) {
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      // #3.2 — сбросить остальные кнопки
      columns.forEach((column) => {
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = 'none';
        }
      });
    }

    // #3.3 — восстановить выбранное состояние при последующих перерисовках
    columns.forEach((column) => {
      if (column.dataset.value !== 'none') {
        field = column.dataset.field;
        order = column.dataset.value;
      }
    });

    // формируем строку сортировки для сервера
    const sort = field && order !== 'none' ? `${field}:${order}` : null;

    // добавляем в query только если сортировка выбрана
    return sort ? Object.assign({}, query, { sort }) : query;
  };
}
