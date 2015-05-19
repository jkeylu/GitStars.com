'use strict';

describe('Service: tag', function () {

  // load the service's module
  beforeEach(module('gitStarsApp'));

  // instantiate service
  var tag;
  beforeEach(inject(function (_tag_) {
    tag = _tag_;
  }));

  it('should do something', function () {
    expect(!!tag).toBe(true);
  });

});
