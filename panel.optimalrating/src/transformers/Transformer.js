/* ============
 * Transformer
 * ============
 *
 * The base transformer.
 *
 * Transformers are used to transform the fetched data
 * to a more suitable format.
 * For instance, when the fetched data contains snake_cased values,
 * they will be camelCased.
 */

import store from '../store';
import lodash from  'lodash'

export default class Transformer {
  /**
   * Method used to transform a fetched collection.
   *
   * @param items The items to be transformed.
   *
   * @returns {Array} The transformed items.
   */
  static fetchCollection(items) {
    return items.map(item => this.fetch(item));
  }

  /**
   * Method used to transform a collection to be send.
   *
   * @param items The items to be transformed.
   *
   * @returns {Array} The transformed items.
   */
  static sendCollection(items) {
    return items.map(item => this.send(item));
  }

  static fetchLanguages(item){

    let languages = store.state.account.settings.languages;

    return item.localizations.map((localization) => {
      localization.language = languages.find((language) => language.id == localization.language);
      return localization;
    });
  }

  /**
   * Method used to transform a collection of localizations.
   *
   * @param item The item to be transformed.
   *
   * @returns {Array} The transformed localizations.
   */
  static mapLanguages(item) {
    return item.localizations.map(localization =>{
      localization.language = localization.language.id;
      return localization;
    })
  }
}
