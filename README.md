
# time-ghc-modules

Analyze how long it takes GHC to compile Haskell modules.

## Quick start (Stack)

``` shell
git clone git@github.com:codedownio/time-ghc-modules.git

cd <my-project>

stack clean
stack build --ghc-options "-ddump-to-file -ddump-timings"
# ----- OR -----
cabal clean
cabal build --TODO: figure out options
```

### Nix

If you have Nix, in the same folder just run:

``` haskell
/path/to/time-ghc-modules/time-ghc-modules-nix
```

### Non-Nix

Otherwise, you need to have the following installed: `SQLite >= 3.33.0`, `Python 3`, and `sed`.

``` haskell
/path/to/time-ghc-modules/time-ghc-modules
```

# Example: hledger

You can generate the time report below for [hledger](https://github.com/simonmichael/hledger) by running the following commands (assuming you have Nix).

``` bash
set -e
cd $(mktemp -d)
git clone git@github.com:simonmichael/hledger.git
git clone git@github.com:codedownio/time-ghc-modules.git
cd hledger
stack build --ghc-options "-ddump-to-file -ddump-timings"
../time-ghc-modules/time-ghc-modules-nix
```

![hledger profile](./hledger.png)
