# Releasing RustTurbo

Two release surfaces, one version number:

| Surface | Artefact | Published how |
|---|---|---|
| GitHub Releases | `rusturbo-<target>` binaries + `.sha256` | `release.yml` on tag push |
| crates.io | `rusturbo` crate | `cargo publish` |
| npm | `rusturbo` package (downloads the GitHub binary) | `npm publish` from `packaging/npm` |

## 1. Cut the release (GitHub)

```bash
# On the branch that holds the release commit:
cargo set-version 0.2.0        # or edit Cargo.toml + packaging/npm/package.json
git commit -am "release: v0.2.0"
git tag v0.2.0
git push origin <branch> --tags
```

Pushing the tag triggers `.github/workflows/release.yml`, which builds five targets
(linux x64/arm64, macOS x64/arm64, Windows x64), writes SHA-256 sums, and creates the
GitHub Release with generated notes.

Verify:

```bash
gh release view v0.2.0
```

## 2. Publish to crates.io

```bash
cargo login                      # once, stores a token in ~/.cargo/credentials
cargo publish --dry-run          # catches missing metadata/files
cargo publish
```

Notes specific to this crate:

- The workspace includes `demo/actix-hello`; only `rusturbo` itself is published. The demo
  is `publish = false` and excluded from the crate via the default workspace behaviour
  (only the root package is uploaded).
- `rust-version = "1.74"` is enforced by Cargo; keep it in sync with the README.
- crates.io versions are **immutable**. If you need a re-publish, bump the patch version.

## 3. Publish to npm

```bash
cd packaging/npm
npm version <same-version> --no-git-tag-version
npm login                        # or set NPM_TOKEN
npm publish --dry-run            # shows exactly which files ship
npm publish --access public
```

Order matters: the npm installer downloads
`https://github.com/the-golden-army/Rusturbo/releases/download/v<version>/rusturbo-<target>`,
so the GitHub Release must exist **before** the npm package is useful. Asset names carry no
version, only the tag does — the installer resolves them from `package.json`.

Then confirm the binary resolution works against the new tag:

```bash
npx rusturbo@<version> --version
```

Offline/mirror testing without waiting for the release:

```bash
RUSTURBO_BINARY_PATH=./rusturbo-x86_64-unknown-linux-gnu node install.js
RUSTURBO_BINARY_URL=https://internal.example/rusturbo node install.js
```

Note on `postinstall`: it always exits 0 so a failed binary fetch can never break a
consumer's `npm install`. The shim reports the problem at run time instead.

If the release assets are not up yet, `postinstall` falls back to a source build, so wait
for the GitHub Release to finish before smoke-testing npm.

## Version checklist

- [ ] `Cargo.toml` version
- [ ] `packaging/npm/package.json` version
- [ ] README "Install" instructions still accurate
- [ ] `docs/BENCHMARKS.md` regenerated on the release machine (numbers are machine-specific)
- [ ] CI green on the release commit
- [ ] `rusturbo --version` matches the tag
