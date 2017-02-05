#!/usr/bin/env bash

rm -rf static && yarn run build -- --env.locale de-DE --env.locale ja-JP
  grep -Ril '先月' './static'           && printf '%s\n' ' * Success: japanese Locale Data built' || exit 1
  grep -Ril 'letzten Monat' './static'  && printf '%s\n' ' * Success: german Locale Data built' || exit 1
! grep -Ril 'mois dernier' './static'   && printf '%s\n' ' * Success: excluded french Locale Data from built' || exit 1


rm -rf static && yarn run build -- --env.locale fr-FR
  grep -Ril 'mois dernier' './static'   && printf '%s\n' ' * Success: french Locale Data built' || exit 1
! grep -Ril 'letzten Monat' './static'  && printf '%s\n' 'Success: excluded german Locale Data from built' || exit 1
! grep -Ril '先月' './static'           && printf '%s\n' 'Success: excluded japanese Locale Data from built' || exit 1
