/* global describe, it */

import chai, {expect} from 'chai';
import spies from 'chai-spies';

import {FormStore} from '../src/FormStore';

chai.use(spies);

describe('FormStore', function() {
  it('should initialize', () => {
    const store = new FormStore();
    expect(store).to.be.an('object');
  });

  it('should have a lifecycle', () => {
    const storeWillInitializeSpy = chai.spy();
    const storeDidInitializeSpy = chai.spy();

    class TestStore extends FormStore {
      storeWillInitialize() {
        storeWillInitializeSpy();
      }

      storeDidInitialize() {
        storeDidInitializeSpy();
      }
    }

    new TestStore(); // eslint-disable-line no-new
    expect(storeWillInitializeSpy).to.have.been.called();
    expect(storeDidInitializeSpy).to.have.been.called();
  });

  it('should be able to specify and call a processRequest method', () => {
    const processRequestSpy = chai.spy();

    class TestStore extends FormStore {
      processRequest(formData) {
        return new Promise((resolve) => {
          expect(formData).to.not.eq('undefined');
          processRequestSpy();
          resolve(formData);
        });
      }
    }

    const store = new TestStore();
    const loader = store.submit();
    const secondLoader = store.submit();

    loader.then(() => {
      expect(store.submitted).to.not.eq('undefined');
    });

    expect(loader).to.eq(secondLoader);
    expect(loader).to.not.eq('undefined');
    expect(processRequestSpy).to.have.been.called();
  });

  it('should be able to handle errors in processRequest', () => {
    const errors = [{message: 'error'}];
    class TestStore extends FormStore {
      processRequest() {
        return new Promise((resolve, reject) => {
          reject(errors);
        });
      }
    }

    const store = new TestStore();
    store.submit().then(() => {
      expect(store.apiErrors[0].message).to.eq(errors[0].message);
    });
  });
});
