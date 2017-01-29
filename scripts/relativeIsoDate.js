#!/usr/bin/env node
const YEAR_DIFF = parseInt(process.argv[2], 10) || 0;
// YEAR_DIFF = isNaN(YEAR_DIFF) ? 0 : YEAR_DIFF;

if (isNaN(YEAR_DIFF)) {
  throw new Error(`No valid argument given, parseInt(${process.argv[2]}) returns not a number`);
}

const date = new Date(new Date().setYear(new Date().getFullYear() + YEAR_DIFF));

date.setUTCHours(0);
date.setUTCMinutes(0);
date.setUTCSeconds(0);
date.setUTCMilliseconds(0);

//eslint-disable-next-line
console.log(date.toISOString());
process.exit(0);
