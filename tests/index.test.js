/* global describe, it */

import chai, {expect} from 'chai';
import spies from 'chai-spies';

import {FormStore} from '../src/index';
import {noop} from '../src/utils/helpers';

chai.use(spies);

describe('FormStore', function() {
  it('should initialize', () => {
    const store = new FormStore({
      submitAction: noop
    });
    expect(store).to.be.an('object');
  });

  it('should be able to specify and call a submitAction method', () => {
    const submitActionSpy = chai.spy();
    const store = new FormStore({
      submitAction(formData) {
        return new Promise((resolve) => {
          expect(formData).to.not.eq('undefined');
          submitActionSpy();
          resolve(formData);
        });
      }
    });
    const loader = store.submit();
    const secondLoader = store.submit();

    expect(loader).to.eq(secondLoader);
    expect(loader).to.not.eq('undefined');
    expect(submitActionSpy).to.have.been.called();

    return loader.then(() => {
      expect(store.submitted).to.not.eq('undefined');
    });
  });

  it('should be able to handle errors in submitAction', () => {
    const errors = [{message: 'error'}];
    const store = new FormStore({
      submitAction(formData) {
        return new Promise((resolve, reject) => {
          expect(formData).to.not.equal(undefined); // eslint-disable-line no-undefined
          reject(errors);
        });
      }
    });

    return store.submit().then(() => {
      expect(store.actionErrors[0].message).to.eq(errors[0].message);
    });
  });

  it('should be able to specify validators', () => {
    const store = new FormStore({
      fields: {
        firstName: {
          validators: {
            required: true,
            email: false,
            isSame: {name: 'Dave'},
            minLength: 4,
            maxLength: 4
          }
        }
      },
      submitAction: noop,
      validators: {
        isSame: (field, opt) => field.value === opt.name
      }
    });

    // with empty value and defaultValue
    expect(store.valid).not.to.equal(true);
    expect(store.errors.firstName).not.to.have.lengthOf(0);

    // set value to a valid entry
    store.fields.firstName.value = 'Dave';

    expect(store.valid).to.equal(true);
    expect(store.errors.firstName).to.have.lengthOf(0);

    // set value to an invalid entry
    store.fields.firstName.value = 'Krešimir';

    expect(store.valid).not.to.equal(true);
    expect(store.errors.firstName).not.to.have.lengthOf(0);
  });

  it('should handle dirty state', () => {
    const store = new FormStore({
      fields: {
        firstName: {
          value: 'Dave'
        }
      },
      submitAction() {
        return Promise.resolve();
      }
    });

    expect(store.fields.firstName.dirty).to.equal(false);

    store.fields.firstName.value = 'Mark';
    expect(store.fields.firstName.dirty).to.equal(true);

    store.reset();
    expect(store.fields.firstName.dirty).to.equal(false);
    expect(store.fields.firstName.value).to.equal('Dave');

    store.fields.firstName.value = 'John';
    expect(store.fields.firstName.dirty).to.equal(true);
    return store.submit().then(() => {
      expect(store.fields.firstName.dirty).to.equal(false);
    });
  });

  it('should handle action errors on fields and form', () => {
    const errors = [{message: 'error'}, {field: 'firstName', message: 'error'}];
    const store = new FormStore({
      fields: {
        firstName: {
          value: 'Dave'
        }
      },
      submitAction(formData) {
        return new Promise((resolve, reject) => {
          expect(formData).to.not.equal(undefined); // eslint-disable-line no-undefined
          reject(errors);
        });
      }
    });

    return store.submit().then(() => {
      expect(store.actionErrors).to.have.lengthOf(1);
      expect(store.fields.firstName.actionErrors).to.have.lengthOf(1);
    });
  });

  it('should create the same store with initial state from another', () => {
    const errors = [{message: 'error'}, {field: 'firstName', message: 'error'}];
    const store = new FormStore({
      fields: {
        firstName: {
          value: 'Dave'
        },
        lastName: {
          value: 'McDonald'
        }
      },
      submitAction(formData) {
        return new Promise((resolve, reject) => {
          expect(formData).to.not.equal(undefined); // eslint-disable-line no-undefined
          reject(errors);
        });
      }
    });

    return store.submit().then(() => {
      store.fields.lastName.value = 'McDonalds';
      const serializedStore = store.toJS();
      const newStore = new FormStore(Object.assign({
        submitAction() {
          return Promise.resolve();
        }
      }, serializedStore));

      expect(newStore.actionErrors).to.have.lengthOf(1);
      expect(newStore.fields.firstName.dirty).to.equal(false);
      expect(newStore.fields.firstName.initialValue).to.equal('Dave');
      expect(newStore.fields.lastName.value).to.equal('McDonalds');
      expect(newStore.fields.lastName.initialValue).to.equal('McDonald');
      expect(newStore.fields.firstName.actionErrors).to.have.lengthOf(1);
      expect(newStore.fields.firstName.value).to.equal('Dave');
    });
  });

  it('should return correct form data', () => {
    const data = {age: 21};
    const store = new FormStore({
      submitAction: noop,
      fields: {
        age: {
        }
      }
    });

    expect(store.formData.age).not.to.equal(data.age);

    store.fields.age.value = 21;
    expect(store.formData.age).to.equal(data.age);
  });

  it('should validate correctly', () => {
    const store = new FormStore({
      submitAction: noop,
      validators: {
        notAdmin: (field) => field.value !== 'Admin'
      },
      fields: {
        username: {
          validators: {
            required: true,
            notAdmin: true
          }
        },
        password: {
          validators: {
            required: true,
            minLength: 6
          }
        }
      }
    });

    // first try
    store.fields.username.value = 'my_username';
    store.fields.password.value = '12345';
    expect(store.valid).to.equal(false);
    expect(store.errors.username).to.have.lengthOf(0);
    expect(store.errors.password).to.have.lengthOf(1);

    // second try
    store.fields.password.value = '123456';
    expect(store.valid).to.equal(true);
    expect(store.errors.password).to.have.lengthOf(0);
  });
});
