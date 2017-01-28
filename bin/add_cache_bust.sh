#!/usr/bin/env bash

# http://stackoverflow.com/questions/8996820/how-to-create-md5-hash-in-bash-in-mac-os-x
__md5_for()
{
  if builtin command -v md5 > /dev/null; then
    cat "$1" | md5
  else
    cat "$1" | md5sum | awk '{print $1}'
  fi

  return 0
}


mkdir -p build/i18n/remote

# remove hashed files
rm -rf ./build/i18n/remote/*.*.json

for fullPath in `find ./build/i18n/remote -type f -name '*.json'`; do
    md5=`__md5_for $fullPath | cut -c -8`
    filename=`echo $fullPath | sed "s/^\(.*\)\..*$/\1/"`
    moveTo="$filename.$md5.json"

    cmd="mv $fullPath $moveTo"

    echo "$cmd"
    `$cmd`
done

