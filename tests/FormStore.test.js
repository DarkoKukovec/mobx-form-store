/* global describe, it */

import {expect} from 'chai';

import {FormStore} from '../src/FormStore';

describe('FormStore', function() {
  it('should initialize', function() {
    const store = new FormStore({processRequest: () => {}});
    expect(store).to.be.an('object');
  });
});
