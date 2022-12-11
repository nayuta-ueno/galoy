#!/bin/bash -eu

WAIT_STATE=$1
SHELLDIR=$(cd $(dirname $BASH_SOURCE); pwd)

function wait_state() {
	NUM=$1
	WAIT_STATE=$2
	source ${SHELLDIR}/lndrpc.sh $NUM
	PREV_STATE=""

	while :
	do
		STATE=`state | jq -rc .state`
		if [ "$STATE" != "$PREV_STATE" ]; then
			echo "$NUM: $STATE"
			PREV_STATE=$STATE
		else
			echo -n "."
		fi
		if [ "$STATE" == "$WAIT_STATE" ]; then
			break
		fi
		sleep 10
	done
}

for ((lp=0; lp<4; lp++)); do
	wait_state ${lp} ${WAIT_STATE}
done
echo "DONE: state"
