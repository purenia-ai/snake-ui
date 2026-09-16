# Demo favicon design

## Goal

Give the Snake UI H5 demo a browser favicon that matches the existing product identity.

## Design

- Reuse the existing dark-background, green `S` Snake UI mark from `src/static/logo.png` without redesigning it.
- Export `src/static/favicon.ico` with 16, 32, and 48 pixel representations for broad browser compatibility and uni-app H5 static-asset copying.
- Add `<link rel="icon" href="./static/favicon.ico" sizes="any" />` to the root `index.html` `<head>` so deployments under a configured base path resolve correctly.
- Keep the change limited to the H5 entry page and its favicon asset. Do not alter the documentation-site marks, application logo, or runtime components.

## Validation

- Confirm the ICO contains the required sizes and can be decoded.
- Run the H5 production build and confirm the generated output contains the favicon reference and asset.
