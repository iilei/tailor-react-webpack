#!/usr/bin/env bash

function ex() {
  echo " * Fail * $1"
  exit $2
}

rm -rf static && yarn run build -- --env.locale de-DE --env.locale ja-JP
  grep -Ril '先月' './static'           && echo ' * Success: japanese Locale Data built' || \
    ex "No japanese Locale Data built" 12
  grep -Ril 'letzten Monat' './static'  && echo ' * Success: german Locale Data built' || \
    ex "No german Locale Data built" 13
! grep -Ril 'mois dernier' './static'   && echo ' * Success: excluded french Locale Data from built' || \
    ex "didn't exclude french Locale Data" 14


rm -rf static && yarn run build -- --env.locale fr-FR
  grep -Ril 'mois dernier' './static'   && echo ' * Success: french Locale Data built' || \
    ex "No french Locale Data built" 22
! grep -Ril 'letzten Monat' './static'  && echo ' * Success: excluded german Locale Data from built' || \
    ex "didn't exclude german Locale Data" 23
! grep -Ril '先月' './static'           && echo ' * Success: excluded japanese Locale Data from built' || \
    ex "didn't exclude japanese Locale Data" 24
