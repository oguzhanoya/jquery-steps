export default {
  startAt: 0,
  showBackButton: true,
  showFooterButtons: true,
  onInit: $.noop,
  onDestroy: $.noop,
  onFinish: $.noop,
  onChange() { return true; },
  stepSelector: '.step-steps > li',
  contentSelector: '.step-content > .step-tab-panel',
  footerSelector: '.step-footer',
  buttonSelector: 'button',
  activeClass: 'active',
};
