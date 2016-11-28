/** @module mobx-from-store/FormFieldStore */

import {action, computed, extendObservable, toJS} from 'mobx';

/**
 * Class representing a Field for From store
 *
 * @class
 * @exports Form field store
 */
export class FormFieldStore {

  /**
   * Creates an instance of FormFieldStore with an initial state
   *
   * @constructor
   * @param {Object} opt.name - Name of the form field
   * @param {Object} opt.value - Value of the field
   * @param {Object} [opt.initialValue=opt.value] - Initial value of the field (used for serialization)
   * @param {Object} opt.actionErrors - Action errors (used for serialization)
   * @param {Object} opt.validators - Active validators and options
   * @param {Object} opt.validatorFunctions - All available validators
   */
  constructor({name, value, initialValue = value, actionErrors, validators, validatorFunctions}) {
    this._validatorFunctions = validatorFunctions;

    const initialState = {
      name,
      validators,
      initialValue: initialValue || null,
      value: value || null,
      _actionErrors: actionErrors
    };

    extendObservable(this, initialState);
  }

  /**
   * Gets if the field is valid
   *
   * @public
   * @method
   * @returns {Boolean} If there are no errors
   */
  @computed get valid() {
    return this.errors.length <= 0 && this._actionErrors.length <= 0;
  }

  /**
   * Gets all the current errors from validators
   *
   * @public
   * @method
   * @returns {Object[]} List of all failing validators
   */
  @computed get errors() {
    return Object.keys(this.validators).filter((validator) => {
      const opt = this.validators[validator];

      if (typeof opt === 'boolean') {
        return opt && !this._validatorFunctions[validator](this);
      }

      return !this._validatorFunctions[validator](this, opt);
    });
  }

  /**
   * Gets all the action errors for the field
   *
   * @public
   * @method
   * @returns {Object[]} List of all action errors
   */
  @computed get actionErrors() {
    return this._actionErrors;
  }

  /**
   * Gets if the field is dirty
   *
   * @public
   * @method
   * @returns {Boolean} If the field is dirty
   */
  @computed get dirty() {
    return this.initialValue !== this.value;
  }

  /**
   * Resets the field to initial values
   *
   * @public
   * @method
   * @returns {undefined}
   */
  @action reset() {
    this.resetActionErrors();
    this.value = this.initialValue;
  }

  /**
   * Removes all action errors
   *
   * @public
   * @method
   * @returns {undefined}
   */
  @action resetActionErrors() {
    this._actionErrors = [];
  }

  /**
   * Resets initial value
   *
   * @public
   * @method
   * @returns {undefined}
   */
  @action resetInitialValue() {
    this.initialValue = this.value;
  }

  /**
   * Adds an action error to the field
   *
   * @public
   * @method
   * @returns {undefined}
   */
  @action addAactionError(error) {
    this._actionErrors.push(error);
  }

  /**
   * Serializes the field to a JS object (Mobx free)
   *
   * @public
   * @method
   * @returns {Object} Serialized store data
   */
  toJS() {
    return {
      actionErrors: toJS(this.actionErrors),
      initialValue: this.dirty ? this.initialValue : undefined, // eslint-disable-line no-undefined
      name: this.name,
      value: this.value,
      validators: toJS(this.validators)
    };
  }
}
