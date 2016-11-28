export default class ObservableStore {

  /**
   * Observable store
   *
   * @param {Object} initialState - Initial state that should be set
   * @param {stores} stores - Application store
   * @return {undefined}
   */
  constructor(initialState) {
    this.storeWillInitialize(initialState);
    this._initData(initialState);
    this.storeDidInitialize();
  }

  /**
   * Do some work before store is initialized
   *
   * @private
   * @return {undefined}
   */
  storeWillInitialize(/* stores */) {
    return;
  }

  /**
   * Do some work after all stores are ready
   *
   * @private
   * @return {undefined}
   */
  storeDidInitialize(/* stores */) {
    return;
  }
}
