# Dev environment (signet)

## Setup

[Dev.md]

`.envrc`

```sh
...
export NETWORK=signet
...
```

### To start

#### Dependencies:

```bash
make start-deps-volume
```

#### First time!

```bash
TEST="03" make integration
```

#### The GraphQL server:

```bash
make start-volume
```

### Login / Commands

```
npm run login-[lnd1 | lnd2 | bitcoind]
```

```
npm run [lncli1 | lncli2] <lnd command...>
```

```
npm run bitcoin-cli <bitcoin command...>
```

### To stop

Show process ID and kill it:

```bash
npm run proc
```

Stop docker containers:

```bash
make clean-deps
```