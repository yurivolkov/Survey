/* ============
 * Account Transformer
 * ============
 *
 * The transformer for the tag group.
 */

import Transformer from './Transformer';

export default class DefinitionTransformer extends Transformer {

  /**
   * Method used to transform a fetched account.
   *
   * @param item The fetched item.
   *
   * @returns {Object} The transformed item.
   */
  static fetch(item) {
    item.localizations = Transformer.fetchLanguages(item);
    return item;
  }
  /**
   * Method used to transform a send item.
   *
   * @param item The item to be send.
   *
   * @returns {Object} The transformed item.
   */
  static send(item) {
    item.localizations = Transformer.mapLanguages(item);
    return item;
  }
}
