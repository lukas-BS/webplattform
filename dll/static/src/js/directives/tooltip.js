import $ from 'jquery'
import Vue from 'vue'
import Tooltip from 'bootstrap/js/dist/tooltip'

export const tooltipDirective = Vue.directive('tooltip', function(el, binding){
    if (!el) return;
    new Tooltip($(el), {
      title: binding.value,
      trigger: 'hover'
    })
  })