import $ from 'jquery'
import Tooltip from 'bootstrap/js/dist/tooltip'

export const tooltipDirective = {
  mounted() {
    if (!el) return;
    new Tooltip($(el), {
      title: binding.value,
      trigger: 'hover'
    })
  }
};