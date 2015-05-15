'use strict';

describe('Service: star', function () {

  // load the service's module
  beforeEach(module('gitStarsApp'));

  // instantiate service
  var star;
  beforeEach(inject(function (_star_) {
    star = _star_;
  }));

  it('should do something', function () {
    expect(!!star).toBe(true);
  });

});
