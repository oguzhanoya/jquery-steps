import $ from 'jquery';
import DEFAULTS from './Defaults';

class Steps {
  constructor(element, options) {
    // Extend defaults with the init options.
    this.options = $.extend({}, DEFAULTS, options);

    // Store main DOM element.
    this.el = $(element);

    this.stepSelector = `${this.options.stepSelector} [data-step-target]`;
    this.footerSelector = `${this.options.footerSelector} [data-step-action]`;
    this.contentSelector = `${this.options.contentSelector} [data-step]`;

    // Initialize
    this.init();
  }

  stepClick(e) {
    e.preventDefault();
    const { self } = e.data;
    const all = self.el.find(self.stepSelector);
    const next = $(this).closest('[data-step-target]');
    const nextStep = all.index(next);
    const stepIndex = e.data.self.getStepIndex();
    e.data.self.setActiveStep(stepIndex, nextStep);
  }

  btnClick(e) {
    e.preventDefault();
    const statusAction = $(this).data('step-action');
    e.data.self.setAction(statusAction);
  }

  init() {
    this.hook('onInit');
    const self = this;

    // step click event
    $(this.el).find(this.stepSelector).on('click', { self }, this.stepClick);

    // button click event
    $(this.el).find(this.footerSelector).on('click', { self }, this.btnClick);

    // set default step
    this.setActiveStep(0, this.options.startAt, true);

    this.setFooterButtons();

    // show footer buttons
    if (!this.options.showFooterButtons) {
      this.hideFooterButtons();
      this.setFooterButtons = $.noop;
    }
  }

  hook(hookName) {
    if (this.options[hookName] !== undefined) {
      this.options[hookName].call(this.el);
    }
  }

  destroy() {
    this.hook('onDestroy');
    $(this.el).find(this.stepSelector).off('click');
    $(this.el).find(this.footerSelector).off('click');
    this.el.removeData('plugin_Steps');
    this.el.remove();
  }

  getStepIndex() {
    const all = this.el.find(this.stepSelector);
    const stepIndex = all.index(all.filter(`.${this.options.activeClass.split(' ').join('.')}`));
    return stepIndex;
  }

  getMaxStepIndex() {
    return this.el.find(this.stepSelector).length - 1;
  }

  getStepDirection(stepIndex, newIndex) {
    let direction = 'none';
    if (newIndex < stepIndex) {
      direction = 'backward';
    } else if (newIndex > stepIndex) {
      direction = 'forward';
    }
    return direction;
  }

  setShowStep(idx, removeClass, addClass = '') {
    const $targetStep = this.el.find(this.stepSelector).eq(idx);
    $targetStep.removeClass(removeClass).addClass(addClass);
    const $tabContent = this.el.find(this.contentSelector);
    $tabContent.removeClass(this.options.activeClass).eq(idx).addClass(this.options.activeClass);
  }

  setActiveStep(currentIndex, newIndex, init = false) {
    if (newIndex !== currentIndex || init) {
      const conditionDirection = (newIndex > currentIndex)
        ? (start) => start <= newIndex
        : (start) => start >= newIndex;

      const conditionIncrementOrDecrement = (newIndex > currentIndex)
        ? (start) => { let s = start; s += 1; return s; }
        : (start) => { let s = start; s -= 1; return s; };

      let i = currentIndex;
      while (conditionDirection(i)) {
        const stepDirection = this.getStepDirection(i, newIndex);
        if (i === newIndex) {
          this.setShowStep(i, this.options.doneClass, this.options.activeClass);
        } else {
          const checkDone = stepDirection === 'forward' && this.options.doneClass;
          this.setShowStep(i, `${this.options.activeClass} ${this.options.errorClass} ${this.options.doneClass}`, checkDone);
        }
        const validStep = this.options.onChange(i, newIndex, stepDirection);
        if (!validStep) {
          this.setShowStep(i, this.options.doneClass, `${this.options.activeClass} ${this.options.errorClass}`);
          i = newIndex;
        }
        i = conditionIncrementOrDecrement(i);
      }
      this.setFooterButtons();
    }
  }

  setFooterButtons() {
    const stepIndex = this.getStepIndex();
    const maxIndex = this.getMaxStepIndex();
    const $footer = this.el.find(this.options.footerSelector);

    if (stepIndex === 0) {
      $footer.find('[data-step-action="prev"]').hide();
    }

    if (stepIndex > 0 && this.options.showBackButton) {
      $footer.find('[data-step-action="prev"]').show();
    }

    if (maxIndex === stepIndex) {
      $footer.find('[data-step-action="prev"]').show();
      $footer.find('[data-step-action="next"]').hide();
      $footer.find('[data-step-action="finish"]').show();
    } else {
      $footer.find('[data-step-action="next"]').show();
      $footer.find('[data-step-action="finish"]').hide();
    }

    if (!this.options.showBackButton) {
      $footer.find('[data-step-action="prev"]').hide();
    }
  }

  setAction(action) {
    const stepIndex = this.getStepIndex();
    let nextStep = stepIndex;
    if (action === 'prev') { nextStep -= 1; }
    if (action === 'next') { nextStep += 1; }
    if (action === 'finish') {
      const validStep = this.options.onChange(stepIndex, nextStep, 'forward');
      if (validStep) {
        this.hook('onFinish');
      } else {
        this.setShowStep(stepIndex, '', this.options.errorClass);
      }
    } else {
      this.setActiveStep(stepIndex, nextStep);
    }
  }

  setStepIndex(idx) {
    const maxIndex = this.getMaxStepIndex();
    if (idx <= maxIndex) {
      const stepIndex = this.getStepIndex();
      this.setActiveStep(stepIndex, idx);
    }
  }

  next() {
    const stepIndex = this.getStepIndex();
    const maxIndex = this.getMaxStepIndex();
    return maxIndex === stepIndex ? this.setAction('finish') : this.setAction('next');
  }

  prev() {
    const stepIndex = this.getStepIndex();
    return stepIndex !== 0 && this.setAction('prev');
  }

  finish() {
    this.hook('onFinish');
  }

  hideFooterButtons() {
    this.el.find(this.options.footerSelector).hide();
  }

  static setDefaults(options) {
    $.extend(DEFAULTS, $.isPlainObject(options) && options);
  }
}

export default Steps;
