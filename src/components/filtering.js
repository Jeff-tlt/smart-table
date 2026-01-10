export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const el = document.createElement('option');
          el.textContent = name;
          el.value = name;
          return el;
        })
      );
    });
  };

  const applyFiltering = (query, state, action) => {
    // (это твой шаг 4.2 из прошлой работы — очистка)
    if (action && action.name === 'clear') {
      const wrapper = action.parentElement; // родитель кнопки clear
      const input = wrapper.querySelector('input, select'); // ищем поле рядом

      if (input) {
        input.value = '';
        state[action.dataset.field] = ''; // синхронизируем state
      }
    }

    const filter = {};

    Object.keys(elements).forEach((key) => {
      const el = elements[key];
      if (!el) return;

      if (['INPUT', 'SELECT'].includes(el.tagName) && el.value) {
        filter[`filter[${el.name}]`] = el.value;
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
