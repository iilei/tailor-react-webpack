/**
 * Created by iilei on 22.01.17.
 */

const DASH_REGEX = /-/;

const unifyLocaleCode = string => string.replace(DASH_REGEX, '_').toLowerCase();

export default unifyLocaleCode;
