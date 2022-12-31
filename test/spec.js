describe('jquery steps', function () {
  var steps_api;
  beforeEach(function () {
    var data = {
      stepsCount: 3,
    };
    var html = template('tpl-demo', data);
    document.body.insertAdjacentHTML('afterbegin', html);
    var steps = $('#demo').steps();
    steps_api = steps.data('plugin_Steps');
  });

  afterEach(function () {
    steps_api.destroy();
  });

  it('version', function () {
    var ver = $.fn.steps.version;
    expect(ver).toEqual('1.1.4');
  });

  it('next', function () {
    steps_api.next();
    steps_api.next();
    var idx = steps_api.getStepIndex();
    expect(idx).toEqual(2);
  });

  it('prev', function () {
    steps_api.next();
    steps_api.next();
    steps_api.prev();
    var idx = steps_api.getStepIndex();
    expect(idx).toEqual(1);
  });
});
