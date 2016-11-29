/* global describe, it */

import chai, {expect} from 'chai';
import spies from 'chai-spies';

import {FormStore, FormFieldStore} from '../src/index';
import {noop} from '../src/utils/helpers';
import {progressEnum} from '../src/utils/progressEnum';
import {
  missingSubmitAction,
  notPromiseSubmitAction,
  notArrayActionErrors
} from '../src/utils/messages';

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
        expect(formData).to.not.eq('undefined');
        submitActionSpy();
        return Promise.resolve(formData);
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
        expect(formData).to.not.equal(undefined); // eslint-disable-line no-undefined
        return Promise.reject(errors);
      }
    });

    return store.submit().then(() => {
      expect(store.actionErrors[0].message).to.equal(errors[0].message);
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
        expect(formData).to.not.equal(undefined); // eslint-disable-line no-undefined
        return Promise.reject(errors);
      }
    });

    return store.submit().then(() => {
      expect(store.actionErrors[0].message).to.equal('error');
      expect(store.fields.firstName.actionErrors[0].message).to.equal('error');
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
        expect(formData).to.not.equal(undefined); // eslint-disable-line no-undefined
        return Promise.reject(errors);
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

      expect(newStore.actionErrors[0].message).to.equal('error');
      expect(newStore.fields.firstName.dirty).to.equal(false);
      expect(newStore.fields.firstName.initialValue).to.equal('Dave');
      expect(newStore.fields.lastName.value).to.equal('McDonalds');
      expect(newStore.fields.lastName.initialValue).to.equal('McDonald');
      expect(newStore.fields.firstName.actionErrors[0].message).to.equal('error');
      expect(newStore.fields.firstName.value).to.equal('Dave');
    });
  });

  it('should return correct form data', () => {
    const store = new FormStore({
      submitAction: noop,
      fields: {
        age: {
        }
      }
    });

    expect(store.formData.age).not.to.equal(21);

    store.fields.age.value = 21;
    expect(store.formData.age).to.equal(21);
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

  it('should handle response correctly', () => {
    const store = new FormStore({
      submitAction: () => Promise.resolve({status: 200}),
      fields: {
        firstName: {
          value: 'Dave'
        }
      }
    });

    expect(store.isSubmitted).to.equal(false);
    expect(store.response).to.equal(null);

    store.submit().then(() => {
      expect(store.isSubmitted).to.equal(true);
      expect(store.response.status).to.equal(200);
    });
  });

  it('should have states', () => {
    const store = new FormStore({
      submitAction() {
        return new Promise((resolve) => {
          setTimeout(() => {
            expect(store.progress).to.equal(progressEnum.IN_PROGRESS);
            resolve();
          }, 10);
        });
      }
    });

    expect(store.progress).to.equal(progressEnum.NONE);
    return store.submit().then(() => {
      expect(store.progress).to.equal(progressEnum.DONE);

      store.reset();
      expect(store.progress).to.equal(progressEnum.NONE);
    });
  });

  it('should have error state', () => {
    const store = new FormStore({
      submitAction() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            expect(store.progress).to.equal(progressEnum.IN_PROGRESS);
            reject([{message: 'error'}]);
          }, 10);
        });
      }
    });

    expect(store.progress).to.equal(progressEnum.NONE);
    return store.submit().then(() => {
      expect(store.progress).to.equal(progressEnum.ERROR);
    });
  });

  it('should handle undefined submitAction', () => {
    const store = new FormStore();

    return store.submit().catch((e) => {
      expect(e).to.equal(missingSubmitAction);
    });
  });

  it('should handle non promise submitAction', () => {
    const store = new FormStore({
      submitAction: noop
    });

    return store.submit().catch((e) => {
      expect(e).to.equal(notPromiseSubmitAction);
    });
  });

  it('should handle wrong error format', () => {
    const store = new FormStore({
      submitAction: () => Promise.reject({error: true})
    });

    return store.submit().catch((e) => {
      expect(e).to.equal(notArrayActionErrors);
    });
  });

  it('should validate the required built-in validator', () => {
    const store = new FormStore({
      submitAction: noop,
      fields: {
        field: {
          value: 'test',
          validators: {
            required: true
          }
        }
      }
    });

    expect(store.fields.field.valid).to.equal(true);
    expect(store.valid).to.equal(true);

    store.fields.field.value = null;

    expect(store.fields.field.valid).not.to.equal(true);
    expect(store.valid).not.to.equal(true);
  });

  it('should validate the minLength built-in validator', () => {
    const store = new FormStore({
      submitAction: noop,
      fields: {
        field: {
          value: 'test',
          validators: {
            minLength: 3
          }
        }
      }
    });

    expect(store.fields.field.valid).to.equal(true);
    expect(store.valid).to.equal(true);

    store.fields.field.value = null;

    expect(store.fields.field.valid).not.to.equal(true);
    expect(store.valid).not.to.equal(true);
  });

  it('should validate the maxLength built-in validator', () => {
    const store = new FormStore({
      submitAction: noop,
      fields: {
        field: {
          value: 'test',
          validators: {
            maxLength: 5
          }
        }
      }
    });

    expect(store.fields.field.valid).to.equal(true);
    expect(store.valid).to.equal(true);

    store.fields.field.value = null;

    expect(store.fields.field.valid).not.to.equal(true);
    expect(store.valid).not.to.equal(true);
  });

  it('should validate the email built-in validator', () => {
    const store = new FormStore({
      submitAction: noop,
      fields: {
        field: {
          value: 'test@example.org',
          validators: {
            email: true
          }
        }
      }
    });

    expect(store.fields.field.valid).to.equal(true);
    expect(store.valid).to.equal(true);

    store.fields.field.value = null;

    expect(store.fields.field.valid).not.to.equal(true);
    expect(store.valid).not.to.equal(true);
  });

  it('should validate the equals built-in validator', () => {
    const store = new FormStore({
      submitAction: noop,
      fields: {
        example: {
          value: 'test'
        },
        field: {
          value: 'test',
          validators: {
            equals: 'example'
          }
        }
      }
    });

    expect(store.fields.field.valid).to.equal(true);
    expect(store.valid).to.equal(true);

    store.fields.field.value = null;

    expect(store.fields.field.valid).not.to.equal(true);
    expect(store.valid).not.to.equal(true);
  });

  it('should supply the context, field, and params to custom validators', () => {
    const store = new FormStore({
      submitAction: noop,
      fields: {
        field: {
          value: 'test',
          validators: {
            test: 'test'
          }
        }
      },
      validators: {
        test(field, opt) {
          expect(field instanceof FormFieldStore).to.equal(true);
          expect(opt).to.equal('test');
          expect(this instanceof FormStore).to.equal(true);
          return true;
        }
      }
    });

    expect(store.fields.field.valid).to.equal(true);
    expect(store.valid).to.equal(true);
  });

  it('should be able to trun off built-in validators', () => {
    const store = new FormStore({
      submitAction: noop,
      fields: {
        field: {
          value: 'test@example.org',
          validators: {
            email: false
          }
        }
      }
    });

    expect(store.fields.field.valid).to.equal(true);
    expect(store.valid).to.equal(true);

    store.fields.field.value = null;

    expect(store.fields.field.valid).to.equal(true);
    expect(store.valid).to.equal(true);
  });

  it('should be able to turn off custom validators', () => {
    const customValidatorSpy = chai.spy();
    const store = new FormStore({
      submitAction: noop,
      fields: {
        field: {
          value: 'test',
          validators: {
            test: false
          }
        }
      },
      validators: {
        test() {
          customValidatorSpy();
          return false;
        }
      }
    });

    expect(store.fields.field.valid).to.equal(true);
    expect(store.valid).to.equal(true);

    store.fields.field.value = null;

    expect(store.fields.field.valid).to.equal(true);
    expect(store.valid).to.equal(true);

    expect(customValidatorSpy).to.not.have.been.called();
  });
});
