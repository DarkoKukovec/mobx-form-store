export default class ObservableStore {

  /**
   * Observable store
   *
   * @param {Object} initialState - Initial state that should be set
   * @param {stores} stores - Application store
   * @return {undefined}
   */
  constructor(initialState, stores) {
  }

  /**
   * Do some work before store is initialized
   *
   * @private
   * @return {undefined}
   */
  storeWillInitialize(/* stores */) {
  }

  /**
   * Do some work after all stores are ready
   *
   * @private
   * @return {undefined}
   */
  storeDidInitialize(/* stores */) {
  }
}
