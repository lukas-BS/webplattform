import $ from 'jquery';
import debounce from 'lodash/debounce';
var autocomplete = require('autocomplete.js');

var source = function (query, callback) {
  $.get({
    success: function (data, textStatus, jqXHR) {
      callback(data);
    },
    url: '/suche?q=' + query
  });
};
var debouncedSource = debounce(source, 500);
autocomplete('#autoComplete', { hint: false }, [
  {
    displayKey: 'title',
    source: debouncedSource
  }
]).on('autocomplete:selected', function (event, suggestion, dataset, context) {
  document.location = suggestion.url;
});
