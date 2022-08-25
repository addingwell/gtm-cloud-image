#!/bin/sh

set -e

docker rm gtm-cloud-image -f
docker create --name gtm-cloud-image $1

rm -rf tmp/
mkdir tmp/

docker export gtm-cloud-image > ./tmp/image.tar

tar -C ./tmp -xf ./tmp/image.tar app/
rm -rf ./tmp/app/node_modules

chmod 640 ./tmp/app/*

for i in tmp/app/*.js; do npx js-beautify "$i" -r; done

mv -v ./tmp/app/* ./app/
