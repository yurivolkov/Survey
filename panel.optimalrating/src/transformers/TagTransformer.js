/* ============
 * Account Transformer
 * ============
 *
 * The transformer for the tag group.
 */

import Transformer from './Transformer';

export default class TagTransformer extends Transformer {

  static fetch(items) {
    return  Transformer.fetchLanguages(items);
  }

  /**
   * Method used to transform a send account.
   *
   * @param tagGroup The account to be send.
   *
   * @returns {Object} The transformed account.
   */
  static send(tag) {
    tag.localizations = Transformer.mapLanguages(tag);
    return tag;
  }
}
