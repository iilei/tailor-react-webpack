import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';

const MESSAGES_PATTERN = './build/messages/**/*.json';
const LANG_DIR = './build/i18n/';
const INDEX_OF_BEGINNING_STRING = 0;
const INDENT_SPACES = 2;

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
const defaultMessages = globSync(MESSAGES_PATTERN)
  .map(filename => fs.readFileSync(filename, 'utf8'))
  .map(file => JSON.parse(file))
  .reduce((collection, descriptors) => {
    const retVal = collection;
    descriptors.forEach(({ id, defaultMessage, description }) => {
      if (Object.prototype.hasOwnProperty.call(retVal, id)) {
        throw new Error(`Duplicate message id: ${id}`);
      }

      if (!description || description.trim() === '') {
        throw new Error(`Missing description for message id: ${id}`);
      }

      if (id.indexOf('api.') === INDEX_OF_BEGINNING_STRING) {
        throw new Error(`Intl key violates protected namespace: ${id}`);
      }

      retVal[id] = { message: defaultMessage, description };
    });
    return retVal;
  }, {});

mkdirpSync(LANG_DIR);
fs.writeFileSync(`${LANG_DIR}__authoring__.json`, JSON.stringify(defaultMessages, null, INDENT_SPACES));
