import $ from 'jquery'
import Vue from 'vue'
import Tooltip from 'bootstrap/js/dist/tooltip'

const elements = $('.content-teaser__competence, .information-area__icon');
if (elements) {
  elements.map((idx, ele) => {
    new Tooltip(ele, {
      trigger: 'hover'
    })
  })
}


export const tooltipDirective = Vue.directive('tooltip', function(el, binding){
  if (!el) return;
  new Tooltip($(el), {
    title: binding.value,
    trigger: 'hover'
  })
})
