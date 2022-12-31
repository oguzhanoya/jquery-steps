import $ from 'jquery';
import DEFAULTS from './Defaults';

class Steps {
  constructor(element, options) {
    // Extend defaults with the init options.
    this.options = $.extend({}, DEFAULTS, options);

    // Store main DOM element.
    this.el = $(element);

    this.selectors = {
      step: `${this.options.stepSelector} [data-step-target]`,
      footer: `${this.options.footerSelector} [data-step-action]`,
      content: `${this.options.contentSelector} [data-step]`,
    };

    // Initialize
    this.init();
  }

  stepClick(e) {
    e.preventDefault();
    const { self } = e.data;
    const all = self.el.find(self.selectors.step);
    const next = e.currentTarget;
    const nextStepIndex = all.index(next);
    const currentStepIndex = e.data.self.getStepIndex();
    e.data.self.setActiveStep(currentStepIndex, nextStepIndex);
  }

  btnClick(e) {
    e.preventDefault();
    const statusAction = $(this).data('step-action');
    e.data.self.setAction(statusAction);
  }

  init() {
    this.hook('onInit');

    this.initEventListeners();

    // set default step
    this.setActiveStep(0, this.options.startAt, true);

    // show footer buttons
    if (!this.options.showFooterButtons) {
      this.hideFooterButtons();
      this.updateFooterButtons = $.noop;
    }
  }

  initEventListeners() {
    // step click event
    $(this.el)
      .find(this.selectors.step)
      .on('click', { self: this }, this.stepClick);

    // button click event
    $(this.el)
      .find(this.selectors.footer)
      .on('click', { self: this }, this.btnClick);
  }

  hook(hookName) {
    if (this.options[hookName] !== undefined) {
      this.options[hookName].call(this.el);
    }
  }

  destroy() {
    this.hook('onDestroy');
    $(this.el).find(this.selectors.step).off('click');
    $(this.el).find(this.selectors.footer).off('click');
    this.el.removeData('plugin_Steps');
    this.el.remove();
  }

  getStepIndex() {
    const all = this.el.find(this.selectors.step);
    const activeClass = this.options.activeClass.split(' ').join('.');
    const stepIndex = all.index(all.filter(`.${activeClass}`));
    return stepIndex;
  }

  getMaxStepIndex() {
    return this.el.find(this.selectors.step).length - 1;
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
    const $targetStep = this.el.find(this.selectors.step).eq(idx);
    $targetStep.removeClass(removeClass).addClass(addClass);

    const $tabContent = this.el.find(this.selectors.content);
    $tabContent
      .removeClass(this.options.activeClass)
      .eq(idx)
      .addClass(this.options.activeClass);
  }

  setActiveStep(currentIndex, newIndex, init = false) {
    if (newIndex !== currentIndex || init) {
      const conditionDirection =
        newIndex > currentIndex
          ? (start) => start <= newIndex
          : (start) => start >= newIndex;

      // prettier-ignore
      const conditionIncrementOrDecrement = (newIndex > currentIndex)
        ? (start) => start + 1
        : (start) => start - 1;

      let i = currentIndex;
      while (conditionDirection(i)) {
        const stepDirection = this.getStepDirection(i, newIndex);
        this.updateStep(i, newIndex, stepDirection);
        const validStep = this.isValidStep(i, newIndex, stepDirection);
        if (!validStep) {
          this.updateStep(i, newIndex, stepDirection, validStep);
          i = newIndex;
        }
        i = conditionIncrementOrDecrement(i);
      }
      this.updateFooterButtons();
    }
  }

  updateStep(currentIndex, newIndex, direction, isValidStep = true) {
    if (currentIndex === newIndex) {
      this.setShowStep(
        currentIndex,
        this.options.doneClass,
        this.options.activeClass,
      );
    } else if (isValidStep) {
      const checkDone = direction === 'forward' && this.options.doneClass;
      this.setShowStep(
        currentIndex,
        `${this.options.activeClass} ${this.options.errorClass} ${this.options.doneClass}`,
        checkDone,
      );
    } else {
      this.setShowStep(
        currentIndex,
        this.options.doneClass,
        `${this.options.activeClass} ${this.options.errorClass}`,
      );
    }
  }

  isValidStep(currentIndex, newIndex, direction) {
    return this.options.onChange(currentIndex, newIndex, direction);
  }

  updateFooterButtons() {
    const currentStepIndex = this.getStepIndex();
    const maxStepIndex = this.getMaxStepIndex();

    const $footer = this.el.find(this.selectors.footer);

    const $prevButton = $footer.filter('[data-step-action="prev"]');
    const $nextButton = $footer.filter('[data-step-action="next"]');
    const $finishButton = $footer.filter('[data-step-action="finish"]');

    // hide prev button if current step is the first step
    if (currentStepIndex === 0) {
      $prevButton.hide();
    } else {
      $prevButton.show();
    }

    // hide forward button and show finish button if current step is the last step
    if (currentStepIndex === maxStepIndex) {
      $nextButton.hide();
      $finishButton.show();
    } else {
      $nextButton.show();
      $finishButton.hide();
    }

    // hide back button if showBackButton option is false
    if (!this.options.showBackButton) {
      $prevButton.hide();
    }
  }

  setAction(action) {
    const currentStepIndex = this.getStepIndex();
    let nextStep = currentStepIndex;
    if (action === 'prev') {
      nextStep -= 1;
    }
    if (action === 'next') {
      nextStep += 1;
    }
    if (action === 'finish') {
      const validStep = this.isValidStep(currentStepIndex, nextStep, 'forward');
      if (validStep) {
        this.hook('onFinish');
      } else {
        this.setShowStep(currentStepIndex, '', this.options.errorClass);
      }
    } else {
      this.setActiveStep(currentStepIndex, nextStep);
    }
  }

  setStepIndex(idx) {
    const maxIndex = this.getMaxStepIndex();
    if (idx <= maxIndex) {
      const currentStepIndex = this.getStepIndex();
      this.setActiveStep(currentStepIndex, idx);
    }
  }

  next() {
    const currentStepIndex = this.getStepIndex();
    const maxIndex = this.getMaxStepIndex();
    return maxIndex === currentStepIndex
      ? this.setAction('finish')
      : this.setAction('next');
  }

  prev() {
    const currentStepIndex = this.getStepIndex();
    return currentStepIndex !== 0 && this.setAction('prev');
  }

  finish() {
    this.hook('onFinish');
  }

  hideFooterButtons() {
    this.el.find(this.selectors.footer).hide();
  }

  static setDefaults(options) {
    $.extend(DEFAULTS, $.isPlainObject(options) && options);
  }
}

export default Steps;
