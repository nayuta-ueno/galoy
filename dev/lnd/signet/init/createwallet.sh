#!/bin/bash -eu

ROOTDIR=$(cd $(dirname $BASH_SOURCE)/..; pwd)
SHELLDIR=$(cd $(dirname $BASH_SOURCE); pwd)

NAMES=("lnd1" "lnd2" "lnd-outside-1" "lnd-outside-2")

function create_wallet() {
	NUM=$1
	NAME=${NAMES[$NUM]}
	source ${SHELLDIR}/env.sh $1
	source ${SHELLDIR}/lndrpc.sh $1

	SEED=`genseed | jq -rc .cipher_seed_mnemonic`
	echo $SEED > ${DATADIR}/seed.txt
	MACAROON=`initwallet $SEED | jq -r .admin_macaroon`
	echo $MACAROON > ${ROOTDIR}/${NAME}.admin.macaroon.base64
	echo $MACAROON | base64 -d > ${DATADIR}/admin.macaroon
	cp ${DATADIR}/admin.macaroon ${ROOTDIR}/${NAME}.admin.macaroon

	echo "  createwallet: created:$NUM"
}

for ((lp=0; lp<4; lp++)); do
	create_wallet ${lp}
done
echo "DONE: createwallet"
