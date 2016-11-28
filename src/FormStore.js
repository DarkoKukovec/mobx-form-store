import {action, computed, extendObservable, runInAction} from 'mobx';

import ObservableStore from './ObservableStore';
import FormFieldStore from './FormFieldStore';
import * as messages from './messages';
import progressEnum from './progressEnum';
import {required, minLength, maxLength, email, equals} from './validators.js';

class FormStore extends ObservableStore {

  /**
   * Method for setting the initial state of the form
   *
   * @private
   * @param {Object} [initialState={}] - Initial state that should be set
   * @return {undefined}
   */
  @action _initData(initialState = {}) {
    const fieldModels = {};
    this._initValidators();

    this.fields = this.fields || {};

    // Merge the custom validators with the built-in validators
    Object.assign(this._validators, this.validators || {});

    // Initialize the fields
    for (const field of Object.keys(this.fields)) {
      const fieldState = initialState.fields && initialState.fields[field];
      const initialFieldState = Object.assign({
        value: (fieldState && fieldState.value)
          ? initialState.fields[field].value
          : this.fields[field].defaultValue,
        _dirty: (fieldState && fieldState.dirty) || false,
        apiErrors: (fieldState && fieldState.apiErrors) || false,
        _validators: this._validators,
        name: field
      }, this.fields[field]);
      fieldModels[field] = new FormFieldStore(initialFieldState);
    }

    extendObservable(this, {
      progress: progressEnum.NONE,
      loading: false,
      submitted: false,
      _apiErrors: initialState.apiErrors || [],
      fields: fieldModels
    });
  }

  /**
   * Validate the form fields
   *
   * @return {Boolean} Is the form valid
   */
  @computed get valid() {
    return this.fieldList.every((field) => field.valid);
  }

  /**
   * Check if the form fields are dirty
   *
   * @return {Boolean} Is the form dirty
   */
  @computed get dirty() {
    return this.fieldList.some((field) => field.dirty);
  }

  /**
   * Get the form fields errors
   *
   * @return {Object} Object where the keys are field names and the values are arrays of error names
   */
  @computed get errors() {
    const errors = {};
    this.fieldList.forEach((field) => {
      errors[field.name] = field.errors;
    });
    return errors;
  }

  /**
   * Get the API errors on the form or on wrong fields
   *
   * @return {Object[]} List of errors
   */
  @computed get apiErrors() {
    return this._apiErrors;
  }

  /**
   * Initialize the built-in validator functions
   *
   * @return {undefined}
   */
  _initValidators() {
    this._validators = {
      required,
      minLength,
      maxLength,
      email,
      equals
    };
  }

  /**
   * Reset the fields to initial values
   *
   * @return {undefined}
   */
  @action reset() {
    this.fieldList.map((field) => field.reset());
    this.submitted = false;
    this.loading = false;
    this._apiErrors = [];
  }

  /**
   * Sets the API errors from fields.
   *
   * @param {Object[]} errors - List of JSON API errors
   * @return {undefined}
   */
  @action _setApiErrors(errors) {
    errors.forEach((error) => {
      const field = this.fieldList.find((item) => item.name === error.name);
      if (field) {
        field.addApiError(error);
      } else {
        this._apiErrors.push(error);
      }
    });

    if (!errors || errors.length === 0) {
      this.progress = progressEnum.NONE;
    }
  }

  /**
   * Get list of field models
   *
   * @return {Object[]} List of fields
   */
  get fieldList() {
    return Object.values(this.fields);
  }

  /**
   * Get the form data
   *
   * @return {Object} Object with the form data
   */
  get formData() {
    const map = {};
    this.fieldList.forEach((field) => {
      map[field.name] = field.value;
    });
    return map;
  }

  /**
   * Method to serialize the store data
   *
   * @return {Object} Serialized store data
   */
  toJS() {
    return {
      apiErrors: this._apiErrors,
      fields: this.fieldList.map((field) => field.toJS())
    };
  }

  /**
   * Handle the form submit
   *
   * @throws {Error|Object[]} Throws an error from API
   * @return {Promise} Promise for submit end
   */
  @action submit() {
    this.fieldList.map((field) => field.resumeValidation());
    if (this.loading) {
      return this.loading;
    } else if (!this.valid) {
      this.fieldList.map((field) => field.setDirty());
      throw this.errors;
    }

    if (!this.processRequest) {
      console.warn(messages.missingProcessRequest); // eslint-disable-line no-console
      return null;
    }

    const processRequestLoader = this.processRequest(this.formData);

    if (!processRequestLoader instanceof Promise) {
      throw new Error(messages.notPromiseProcessRequest);
    }

    this.loading = processRequestLoader.then((data) => {
      runInAction(() => {
        this.submitted = data;
      });
    }).catch((e) => {
      if (e instanceof Error) {
        throw e;
      }

      if (e instanceof Array) {
        this._setApiErrors(e);
      } else {
        throw new Error(messages.notArrayApiErrors);
      }
    });

    return this.loading;
  }
}

module.exports = {
  FormFieldStore,
  FormStore
};
