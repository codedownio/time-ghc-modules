
# time-ghc-modules

Analyze how long it takes GHC to compile Haskell modules.

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
