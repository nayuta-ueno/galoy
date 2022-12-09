#!/bin/sh

PASSWORD=`cat ../../../../password.txt`
MACAROON_HEADER="Grpc-Metadata-macaroon: `cat grpc-metadata`"
URL=https://localhost:8080
CACERT="--cacert ../../../../tls.cert"

function unlock() {
        PASS=`echo -n ${PASSWORD} | base64`
        curl -X POST ${CACERT} --header "$MACAROON_HEADER" ${URL}/v1/unlockwallet -d {\"wallet_password\":\"$PASS\"}
}

function getinfo() {
	curl -X GET ${CACERT} --header "$MACAROON_HEADER" ${URL}/v1/getinfo
}

function initwallet() {
        PASS=`echo -n ${PASSWORD} | base64`
        curl -X POST ${CACERT} --header "$MACAROON_HEADER" ${URL}/v1/initwallet -d @- <<EOS
{"wallet_password":\"$PASS\"}
EOS
}

getinfo
