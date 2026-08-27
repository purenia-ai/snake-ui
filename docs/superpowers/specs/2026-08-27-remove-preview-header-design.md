# Remove desktop preview header

## Goal

Remove the desktop preview panel header that displays `LIVE PREVIEW` and the `新窗口` link, without changing the embedded phone preview or the mobile-only preview link.

## Design

- Delete the complete `preview-panel__header` element from `PreviewFrame.vue` so no empty header space remains.
- Remove the now-unused `.preview-panel__header` CSS rules and its live-dot animation styling.
- Keep the preview URL computation because the iframe and mobile preview link still depend on it.
- Update the focused preview-structure test so it no longer requires the removed live-dot animation and instead verifies that the desktop header is absent.

## Verification

- Run `npm run test:preview-structure`.
- Run the docs production build if the focused test passes.

## Scope

No changes to the phone mockup, iframe behavior, timeout states, mobile link, or preview routing.
