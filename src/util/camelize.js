/**
 * Created by iilei on 22.01.17.
 */

// humps.camelizeKeys considers `_id` and `id` as equal.
// see https://github.com/domchristie/humps/issues/22
// therefor this little wrapper

import {
  camelizeKeys as humpsCamelizeKeys,
  camelize as humpsCamelize,
} from 'humps';


const PROTECTED_KEY = /(?:^_)|(?:^[A-Z,0-9_]+)$/;

function customCamelizeKeys(key, convert) {
  return (PROTECTED_KEY.test(key) ? key : convert(key));
}

const camelizeKeys = json => humpsCamelizeKeys(json, customCamelizeKeys);
const camelize = string => (PROTECTED_KEY.test(string) ? string : humpsCamelize(string));

export {
  camelizeKeys,
  camelize,
};
