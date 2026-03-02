# Inspiration Processing Scripts

Run from the `scripts/` folder. These scripts generate thumbnails, extract color palettes and create posters for videos.

Quick start

1. Install dependencies for the scripts (inside `scripts/`):

```bash
cd scripts
npm install
```

2. Dry run to see actions:

```bash
npm run dry
```

3. Full run (default paths):

```bash
npm run process
```

Options

- `--input` input directory (defaults to agents/worship+/frontend-developer-agent/inspiration-images)
- `--thumb-dir` output dir for thumbnails
- `--poster-dir` output dir for video posters
- `--palettes` output palettes JSON
- `--dry-run` simulate only

Notes

- Requires Node 18+.
- `sharp` and `ffmpeg-static` are included as dependencies; `ffmpeg-static` bundles a binary but on some systems you may prefer to install `ffmpeg` system-wide.
- The process will merge palettes into the `palettes.json`, keeping previous entry under `previous`.
