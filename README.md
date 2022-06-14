
# time-ghc-modules

Figure out why your builds are slow. This tool analyzes how long it takes GHC to compile your Haskell modules, broken down by phase.

# Quick start

``` shell
cd <my-project>

stack clean
stack build --ghc-options "-ddump-to-file -ddump-timings"
# ----- OR -----
cabal clean
cabal build --ghc-options "-ddump-to-file -ddump-timings"
```

If you have Nix, you can simply run the version in Nixpkgs!

``` bash
nix run nixpkgs#time-ghc-modules
```

To run it from the repo:

``` haskell
git clone git@github.com:codedownio/time-ghc-modules.git /path/to/time-ghc-modules

# If you have Nix, you can use the fully reproducible version
/path/to/time-ghc-modules/time-ghc-modules-nix

# Otherwise, your system needs to have SQLite >= 3.33.0, Python 3, and sed
/path/to/time-ghc-modules/time-ghc-modules
```

The script will search for all your `*.dump-timings` files and analyze them. It will finish by printing out the path to an HTML file:

``` shell
...
--> Wrote report at file:///tmp/tmp.pvnp4FYmLa/report.html
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

# Tips

The script will output its log messages to `stderr` and print the final report path to `stdout` (assuming it didn't exit with a failure). This makes it easy to use the output in scripts. For example:

``` shell
# Build the report and open it in your browser
> firefox $(/path/to/time-ghc-modules/time-ghc-modules)
```

``` shell
# Build the report in CI and stash it somewhere
> cp $(/path/to/time-ghc-modules/time-ghc-modules) $MY_CI_ARTIFACTS_DIR/
```

# Compatibility

The flag `-ddump-timings` is available for `GHC >= 8.4.1`.
