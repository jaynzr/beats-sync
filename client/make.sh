#!/bin/sh

npm install --production

meteor build ../beats-build/ --architecture os.linux.x86_64

cd ../editor
npm install --production

meteor build ../beats-build/ --architecture os.linux.x86_64

cd ../client
