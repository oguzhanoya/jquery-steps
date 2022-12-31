export default {
  startAt: 0,
  showBackButton: true,
  showFooterButtons: true,
  onInit: $.noop,
  onDestroy: $.noop,
  onFinish: $.noop,
  onChange() {
    return true;
  },
  stepSelector: '.step-steps',
  contentSelector: '.step-content',
  footerSelector: '.step-footer',
  activeClass: 'active',
  doneClass: 'done',
  errorClass: 'error',
};
