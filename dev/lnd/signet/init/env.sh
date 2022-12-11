if [ $# == 0 ]; then
        echo "$0 need parameter"
        exit 1
fi

ROOTDIR=$(cd $(dirname $BASH_SOURCE)/..; pwd)

NETWORK=signet
DATADIRS=("datadir-lnd1" "datadir-lnd2" "datadir-lnd-outside-1" "datadir-lnd-outside-2")

DATADIR=${ROOTDIR}/${DATADIRS[$1]}/data/chain/bitcoin/${NETWORK}
