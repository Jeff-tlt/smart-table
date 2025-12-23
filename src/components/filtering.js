import { createComparison, defaultRules } from '../lib/compare.js';

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями

  Object.keys(indexes).forEach((elementName) => {
    const selectEl = elements[elementName];
    if (!selectEl) return;

    const options = Object.values(indexes[elementName]).map((name) => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      return option;
    });

    selectEl.append(...options);
  });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === 'clear') {
      const field = action.dataset.field; // например 'date' или 'customer'

      // ищем input/select рядом с кнопкой (внутри того же label)
      const wrapper = action.parentElement;
      const input = wrapper?.querySelector(`[name="${field}"]`);

      if (input) input.value = '';
      state[field] = '';
    }

    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter(row => compare(row, state));
    //return data;
  };
}
