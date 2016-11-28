/* global describe, it */

import chai, {expect} from 'chai';
import spies from 'chai-spies';

import {FormStore} from '../src/index';

chai.use(spies);

describe('FormStore', function() {
  it('should initialize', () => {
    const store = new FormStore();
    expect(store).to.be.an('object');
  });
});
