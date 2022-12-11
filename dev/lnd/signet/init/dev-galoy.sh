#!/bin/bash -eu

NAME=$1
NETWORK=signet
DATADIR=./data/chain/bitcoin/$NETWORK

cp $DATADIR/admin.macaroon ./$NAME.admin.macaroon
cp $DATADIR/macaroons.db ./$NAME.macaroons.db
cp $DATADIR/wallet.db ./$NAME.wallet.db
base64 ./$NAME.admin.macaroon | tr -d '\n' > ./$NAME.admin.macaroon.base64
touch ./$NAME.pubkey

