/*!
   * Steps v1.0.1
   * https://github.com/oguzhanoya/jquery-steps
   *
   * Copyright (c) 2017 oguzhanoya
   * Released under the MIT license
   */
  
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
	typeof define === 'function' && define.amd ? define(['jquery'], factory) :
	(factory(global.$));
}(this, (function ($$1) { 'use strict';

$$1 = 'default' in $$1 ? $$1['default'] : $$1;

var DEFAULTS = {
  startAt: 0,
  showBackButton: true,
  showFooterButtons: true,
  onInit: $.noop,
  onDestroy: $.noop,
  onFinish: $.noop,
  onChange: function onChange() {
    return true;
  },

  stepSelector: '.step-steps > li',
  contentSelector: '.step-content > .step-tab-panel',
  footerSelector: '.step-footer',
  buttonSelector: 'button',
  activeClass: 'active',
  doneClass: 'done',
  errorClass: 'error'
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Steps = function () {
  function Steps(element, options) {
    classCallCheck(this, Steps);

    // Extend defaults with the init options.
    this.options = $$1.extend({}, DEFAULTS, options);

    // Store main DOM element.
    this.el = $$1(element);

    // Initialize
    this.init();
  }

  createClass(Steps, [{
    key: 'init',
    value: function init() {
      this.hook('onInit');
      var self = this;

      // step click event
      $$1(this.el).find(this.options.stepSelector).on('click', function (e) {
        e.preventDefault();
        var nextStep = $$1(this).closest('li').index();
        var stepIndex = self.getStepIndex();
        self.setActiveStep(stepIndex, nextStep);
      });

      // button click event
      $$1(this.el).find(this.options.footerSelector + ' ' + this.options.buttonSelector).on('click', function (e) {
        e.preventDefault();
        var statusAction = $$1(this).data('direction');
        self.setAction(statusAction);
      });

      // set default step
      this.setShowStep(this.options.startAt, '', this.options.activeClass);
      this.setFooterBtns();

      // show footer buttons
      if (!this.options.showFooterButtons) {
        this.hideFooterBtns();
        this.setFooterBtns = $$1.noop;
      }
    }
  }, {
    key: 'hook',
    value: function hook(hookName) {
      if (this.options[hookName] !== undefined) {
        this.options[hookName].call(this.el);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.el.empty();
      this.el.removeData('plugin_Steps');
      this.hook('onDestroy');
    }
  }, {
    key: 'getStepIndex',
    value: function getStepIndex() {
      var stepIndex = this.el.find(this.options.stepSelector).filter('.' + this.options.activeClass).index();
      return stepIndex || 0;
    }
  }, {
    key: 'getMaxStepCount',
    value: function getMaxStepCount() {
      return this.el.find(this.options.stepSelector).length - 1;
    }
  }, {
    key: 'getStepDirection',
    value: function getStepDirection(stepIndex, newIndex) {
      var direction = 'none';
      if (newIndex < stepIndex) {
        direction = 'backward';
      } else if (newIndex > stepIndex) {
        direction = 'forward';
      }
      return direction;
    }
  }, {
    key: 'setShowStep',
    value: function setShowStep(idx, removeClass) {
      var addClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      this.el.find(this.options.contentSelector).removeClass(this.options.activeClass);
      var $prevStep = this.el.find(this.options.stepSelector).eq(idx);
      $prevStep.removeClass(removeClass).addClass(addClass);
      var targetStep = $prevStep.find('a').attr('href');
      $$1(targetStep).addClass(this.options.activeClass);
    }
  }, {
    key: 'setActiveStep',
    value: function setActiveStep(currentIndex, newIndex) {
      if (newIndex !== currentIndex) {
        if (newIndex > currentIndex) {
          for (var i = 0; i <= newIndex; i += 1) {
            var lastTab = i === newIndex;
            if (lastTab) {
              this.setShowStep(i, this.options.doneClass, this.options.activeClass);
            } else {
              this.setShowStep(i, this.options.activeClass + ' ' + this.options.errorClass, this.options.doneClass);
            }
            var stepDirectionF = this.getStepDirection(i, newIndex);
            var validStep = this.options.onChange(i, newIndex, stepDirectionF);
            if (!validStep) {
              this.setShowStep(i, this.options.doneClass, this.options.activeClass + ' ' + this.options.errorClass);
              this.setFooterBtns();
              break;
            }
          }
        }

        if (currentIndex > newIndex) {
          for (var _i = currentIndex; _i >= newIndex; _i -= 1) {
            var stepDirectionB = this.getStepDirection(_i, newIndex);
            this.options.onChange(_i, newIndex, stepDirectionB);
            this.setShowStep(_i, this.options.doneClass + ' ' + this.options.activeClass + ' ' + this.options.errorClass);
            if (_i === newIndex) {
              this.setShowStep(_i, this.options.doneClass + ' ' + this.options.errorClass, this.options.activeClass);
            }
          }
        }

        this.setFooterBtns();
      }
    }
  }, {
    key: 'setFooterBtns',
    value: function setFooterBtns() {
      var stepIndex = this.getStepIndex();
      var maxIndex = this.getMaxStepCount();
      var $footer = this.el.find(this.options.footerSelector);

      if (stepIndex === 0) {
        $footer.find('button[data-direction="prev"]').hide();
      }

      if (stepIndex > 0 && this.options.showBackButton) {
        $footer.find('button[data-direction="prev"]').show();
      }

      if (maxIndex === stepIndex) {
        $footer.find('button[data-direction="prev"]').show();
        $footer.find('button[data-direction="next"]').hide();
        $footer.find('button[data-direction="finish"]').show();
      } else {
        $footer.find('button[data-direction="next"]').show();
        $footer.find('button[data-direction="finish"]').hide();
      }

      if (!this.options.showBackButton) {
        $footer.find('button[data-direction="prev"]').hide();
      }
    }
  }, {
    key: 'setAction',
    value: function setAction(action) {
      var stepIndex = this.getStepIndex();
      var nextStep = stepIndex;
      if (action === 'prev') {
        nextStep -= 1;
      }
      if (action === 'next') {
        nextStep += 1;
      }
      if (action === 'finish') {
        var validStep = this.options.onChange(stepIndex, nextStep, 'forward');
        if (validStep) {
          this.hook('onFinish');
        } else {
          this.setShowStep(stepIndex, '', 'error');
        }
      }
      if (action !== 'finish') {
        this.setActiveStep(stepIndex, nextStep);
      }
    }
  }, {
    key: 'hideFooterBtns',
    value: function hideFooterBtns() {
      this.el.find(this.options.footerSelector).hide();
    }
  }], [{
    key: 'setDefaults',
    value: function setDefaults(options) {
      $$1.extend(DEFAULTS, $$1.isPlainObject(options) && options);
    }
  }]);
  return Steps;
}();

var other = $$1.fn.steps;

$$1.fn.steps = function (options) {
  return this.each(function () {
    if (!$$1.data(this, 'plugin_Steps')) {
      $$1.data(this, 'plugin_Steps', new Steps(this, options));
    }
  });
};

$$1.fn.steps.version = '1.0.1';
$$1.fn.steps.setDefaults = Steps.setDefaults;

// No conflict
$$1.fn.steps.noConflict = function () {
  $$1.fn.steps = other;
  return this;
};

})));
//# sourceMappingURL=jquery-steps.js.map
