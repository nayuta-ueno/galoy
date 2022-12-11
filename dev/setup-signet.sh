#!/bin/bash -eu

NETWORK=signet

SHELLDIR=$(cd $(dirname $BASH_SOURCE); pwd)
LNDSHELLDIR=${SHELLDIR}/lnd/${NETWORK}/init

LND1=`sudo bash ${LNDSHELLDIR}/state-lnd1.sh`
echo $LND1
if [ "$LND1" == "" ]; then
    echo "not started"
    exit 1
fi
if [ "$LND1" == "SERVER_ACTIVE" ]; then
    echo "already started."
    exit 0
fi

if [ "$LND1" == "NON_EXISTING" ]; then
    echo "LND: create wallets"
    sudo ${LNDSHELLDIR}/createwallet.sh
    sleep 5
fi

sudo ${LNDSHELLDIR}/state-wait.sh "RPC_ACTIVE"
sudo ${LNDSHELLDIR}/createfiles.sh

BTCWALLETS=`npm run --silent bitcoin-cli listwallets | jq '. | length'`
if [ $BTCWALLETS -eq 0 ]; then
    echo "BITCOIND: create wallets"
    npm run bitcoin-cli --silent createwallet specter/coldstorage
    npm run bitcoin-cli --silent createwallet outside
fi
BTCOUTSIDE=`npm run --silent bitcoin-cli -- -rpcwallet=outside getbalance`
if [ "$BTCOUTSIDE" == "0.00000000" ]; then
    echo "BITCOIND: address: outside"
    npm run bitcoin-cli --silent -- -rpcwallet=outside getnewaddress
    sleep 10
fi

echo "LND: wait starting..."
sudo ${LNDSHELLDIR}/state-wait.sh "SERVER_ACTIVE"

echo "done."
