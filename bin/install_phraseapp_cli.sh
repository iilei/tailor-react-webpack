#!/usr/bin/env bash

mkdir phraseapp_cli
cd phraseapp_cli
wget https://github.com/phrase/phraseapp-client/releases/download/1.1.8/phraseapp_linux_amd64
mv phraseapp_linux_amd64 phraseapp
chmod +x phraseapp
PATH=$PATH:$(pwd)
cd ..
