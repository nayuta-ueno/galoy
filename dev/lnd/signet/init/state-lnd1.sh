#!/bin/bash -eu

SHELLDIR=$(cd $(dirname $BASH_SOURCE); pwd)
source ${SHELLDIR}/lndrpc.sh 0
echo `state | jq -rc .state`
