{
  pkgs ? import (import ./pinned-nixpkgs.nix) {}
}:

let
  script = ./time-ghc-modules;
  process = ./scripts/process;
  index = ./dist/index.html;

in

with pkgs;

runCommand "time-ghc-modules" {
  propagatedBuildInputs = [makeWrapper];
  inherit script process index;
} ''
  mkdir -p $out/bin
  cp $script $out/bin/time-ghc-modules
  wrapProgram $out/bin/time-ghc-modules --prefix PATH : ${lib.makeBinPath [ sqlite python3 coreutils findutils gnused ]}

  mkdir -p $out/bin/scripts
  ln -s $process $out/bin/scripts/process

  mkdir -p $out/bin/dist
  ln -s $index $out/bin/dist/index.html
''
