/**
 * Created by iilei on 25.01.17.
 */

import * as fs from 'fs';
import * as p from 'path';

function writeFile(filename, contents) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, contents, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(p.resolve(filename));
      }
    });
  });
}

export default writeFile;
