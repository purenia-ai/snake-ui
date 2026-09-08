# Widen Preview Documentation Content

## Goal

Give preview documentation pages more horizontal room on desktop displays while preserving the existing sidebar, outline, and fixed phone preview layout.

## Design

- At the existing `1280px` desktop breakpoint, increase `.snake-preview-layout .VPDoc.has-aside .content-container` from `680px` to `760px`.
- Keep the `190px` outline column, reserved phone-preview space, and all narrower breakpoints unchanged.
- Scope the rule to preview pages so ordinary VitePress documentation pages are unaffected.

## Verification

- Update the preview structure test to assert the `760px` content width.
- Run the focused preview structure test.
- Run the documentation build to catch layout stylesheet or VitePress integration regressions.

