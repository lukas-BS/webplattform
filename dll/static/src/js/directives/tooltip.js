import { Tooltip } from 'bootstrap';

export const tooltip = {
  mounted(el, binding) {
    return new Tooltip(el, {
      title: binding.value,
      trigger: 'hover',
    });
  },
};
