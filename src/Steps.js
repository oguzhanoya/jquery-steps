import $ from 'jquery';
import DEFAULTS from './Defaults';

class Steps {
  constructor(element, options) {
    // Extend defaults with the init options.
    this.options = $.extend({}, DEFAULTS, options);

    // Store main DOM element.
    this.el = $(element);

    // Initialize
    this.init();
  }

  init() {
    this.hook('onInit');
    const self = this;

    // step click event
    $(this.el).find(this.options.stepSelector).on('click', function (e) {
      e.preventDefault();
      const nextStep = $(this).closest('li').index();
      const stepIndex = self.getStepIndex();
      self.setActiveStep(stepIndex, nextStep);
    });

    // button click event
    $(this.el).find(`${this.options.footerSelector} ${this.options.buttonSelector}`).on('click', function (e) {
      e.preventDefault();
      const statusAction = $(this).data('direction');
      self.setAction(statusAction);
    });

    // set default step
    this.setShowStep(this.options.startAt, '', this.options.activeClass);
    this.setFooterBtns();

    // show footer buttons
    if (!this.options.showFooterButtons) {
      this.hideFooterBtns();
      this.setFooterBtns = $.noop;
    }
  }

  hook(hookName) {
    if (this.options[hookName] !== undefined) {
      this.options[hookName].call(this.el);
    }
  }

  destroy() {
    this.el.empty();
    this.el.removeData('plugin_Steps');
    this.hook('onDestroy');
  }

  getStepIndex() {
    const stepIndex = this.el.find(this.options.stepSelector)
      .filter(`.${this.options.activeClass}`)
      .index();
    return stepIndex || 0;
  }

  getMaxStepCount() {
    return this.el.find(this.options.stepSelector).length - 1;
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
    this.el.find(this.options.contentSelector).removeClass(this.options.activeClass);
    const $prevStep = this.el.find(this.options.stepSelector).eq(idx);
    $prevStep.removeClass(removeClass).addClass(addClass);
    const targetStep = $prevStep.find('a').attr('href');
    $(targetStep).addClass(this.options.activeClass);
  }

  setActiveStep(currentIndex, newIndex) {
    if (newIndex !== currentIndex) {
      if (newIndex > currentIndex) {
        for (let i = 0; i <= newIndex; i += 1) {
          const lastTab = i === newIndex;
          if (lastTab) {
            this.setShowStep(i, this.options.doneClass, this.options.activeClass);
          } else {
            this.setShowStep(i, `${this.options.activeClass} ${this.options.errorClass}`, this.options.doneClass);
          }
          const stepDirectionF = this.getStepDirection(i, newIndex);
          const validStep = this.options.onChange(i, newIndex, stepDirectionF);
          if (!validStep) {
            this.setShowStep(i, this.options.doneClass, `${this.options.activeClass} ${this.options.errorClass}`);
            this.setFooterBtns();
            break;
          }
        }
      }

      if (currentIndex > newIndex) {
        for (let i = currentIndex; i >= newIndex; i -= 1) {
          const stepDirectionB = this.getStepDirection(i, newIndex);
          this.options.onChange(i, newIndex, stepDirectionB);
          this.setShowStep(i, `${this.options.doneClass} ${this.options.activeClass} ${this.options.errorClass}`);
          if (i === newIndex) {
            this.setShowStep(i, `${this.options.doneClass} ${this.options.errorClass}`, this.options.activeClass);
          }
        }
      }

      this.setFooterBtns();
    }
  }

  setFooterBtns() {
    const stepIndex = this.getStepIndex();
    const maxIndex = this.getMaxStepCount();
    const $footer = this.el.find(this.options.footerSelector);

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
        this.setShowStep(stepIndex, '', 'error');
      }
    }
    if (action !== 'finish') { this.setActiveStep(stepIndex, nextStep); }
  }

  next() {
    const stepIndex = this.getStepIndex();
    const maxIndex = this.getMaxStepCount();
    return maxIndex === stepIndex ? this.setAction('finish') : this.setAction('next');
  }

  prev() {
    const stepIndex = this.getStepIndex();
    return stepIndex !== 0 && this.setAction('prev');
  }

  finish() {
    this.hook('onFinish');
  }

  hideFooterBtns() {
    this.el.find(this.options.footerSelector).hide();
  }

  static setDefaults(options) {
    $.extend(DEFAULTS, $.isPlainObject(options) && options);
  }
}

export default Steps;
