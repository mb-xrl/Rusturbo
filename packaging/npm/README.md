# rusturbo (npm)

npm distribution of **RustTurbo** — an extreme Rust compilation accelerator.

```bash
npx rusturbo --help
# or
npm install -g rusturbo
rusturbo run
```

The package installs a thin JavaScript shim and, in its `postinstall` step, downloads the
native `rusturbo` binary for your platform from the matching GitHub Release
(`v<version>`). Supported: Linux/macOS/Windows on x64 and arm64.

If no prebuilt binary exists for your platform, or the download is blocked, the installer
falls back to `cargo install --git …` and, if that fails too, exits successfully with
instructions — an optional accelerator must never break `npm install`.

### Install overrides

| Variable | Effect |
|---|---|
| `RUSTURBO_BINARY_PATH` | use an already-downloaded binary (air-gapped / CI) |
| `RUSTURBO_BINARY_URL` | fetch from an internal mirror instead of GitHub Releases |
| `RUSTURBO_SKIP_DOWNLOAD=1` | install the shim only, no binary |

Canonical install for Rust users:

```bash
cargo install --git https://github.com/the-golden-army/Rusturbo
```

Source, docs and benchmarks: https://github.com/the-golden-army/Rusturbo
