import $ from 'jquery'
import Tooltip from 'bootstrap/js/dist/tooltip'

const elements = $('.content-teaser__competence, .information-area__icon');
if (elements) {
  elements.map((idx, ele) => {
    new Tooltip(ele, {
      trigger: 'hover'
    })
  })
}



