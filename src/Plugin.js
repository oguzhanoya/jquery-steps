import $ from 'jquery';
import Steps from './Steps';

const other = $.fn.steps;

$.fn.steps = function (options) {
  return this.each(function () {
    if (!$.data(this, 'plugin_Steps')) {
      $.data(this, 'plugin_Steps', new Steps(this, options));
    }
  });
};

$.fn.steps.version = '1.0.2';
$.fn.steps.setDefaults = Steps.setDefaults;

// No conflict
$.fn.steps.noConflict = function () {
  $.fn.steps = other;
  return this;
};
