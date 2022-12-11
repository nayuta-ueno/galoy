#!/bin/bash -eu

ROOTDIR=$(cd $(dirname $BASH_SOURCE)/..; pwd)
SHELLDIR=$(cd $(dirname $BASH_SOURCE); pwd)

NAMES=("lnd1" "lnd2" "lnd-outside-1" "lnd-outside-2")

function create_files() {
	NUM=$1
	NAME=${NAMES[$NUM]}
	source ${SHELLDIR}/env.sh $1
	source ${SHELLDIR}/lndrpc.sh $1

	PUBKEY=`getinfo | jq -r .identity_pubkey`

	# cp ${DATADIR}/admin.macaroon ${ROOTDIR}/${NAME}.admin.macaroon
	# cat ${DATADIR}/admin.macaroon | base64 > ${ROOTDIR}/${NAME}.admin.macaroon.base64
	echo ${PUBKEY} > ${ROOTDIR}/${NAME}.pubkey
}

for ((lp=0; lp<4; lp++)); do
	create_files ${lp}
done
echo "DONE: createfiles"
