#!/bin/bash -eu

if [ $# == 0 ]; then
        echo "$0 need parameter"
        exit 1
fi

SHELLDIR=$(cd $(dirname $BASH_SOURCE); pwd)
source ${SHELLDIR}/env.sh $1

PORTS=(55551 55552 55553 55554)
PORT=${PORTS[$1]}

PASSWORD=`cat ${ROOTDIR}/password.txt`
MACAROON_HEADER="Grpc-Metadata-macaroon: "
if [ -f ${DATADIR}/admin.macaroon ]; then
  MACAROON_HEADER="Grpc-Metadata-macaroon: `xxd -ps -u -c 10000 ${DATADIR}/admin.macaroon`"
fi
URL=https://localhost:${PORT}
CACERT="--cacert $ROOTDIR/../tls.cert"

function state() {
	curl --silent -X GET ${CACERT} --header "$MACAROON_HEADER" ${URL}/v1/state
}

function unlock() {
        PASS=`echo -n ${PASSWORD} | base64`
        curl --silent -X POST ${CACERT} --header "$MACAROON_HEADER" ${URL}/v1/unlockwallet -d {\"wallet_password\":\"$PASS\"}
}

function getinfo() {
	curl --silent -X GET ${CACERT} --header "$MACAROON_HEADER" ${URL}/v1/getinfo
}

function genseed() {
	curl --silent -X GET ${CACERT} --header "$MACAROON_HEADER" ${URL}/v1/genseed -d {}
}

function initwallet() {
        SEED=$1
        PASS=`echo -n ${PASSWORD} | base64`
        curl --silent -X POST ${CACERT} --header "$MACAROON_HEADER" ${URL}/v1/initwallet -d @- <<EOS
{"wallet_password":"$PASS", "cipher_seed_mnemonic": $SEED, "stateless_init": true}
EOS
}
