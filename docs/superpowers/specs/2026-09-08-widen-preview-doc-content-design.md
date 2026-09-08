# Widen Preview Documentation Content

## Goal

Give preview documentation pages more horizontal room on desktop displays while preserving the existing sidebar, outline, and fixed phone preview layout.

## Design

- At the existing `1280px` desktop breakpoint, make the preview-page document column visibly wider, targeting about `700px` of usable content width when the viewport has enough room.
- Allocate that width on the outer `.content` flex item instead of only increasing the inner `.content-container` maximum; an inner maximum cannot enlarge a narrower parent column.
- Keep the `190px` outline column, fixed phone preview size, and all narrower breakpoints unchanged.
- Allow constrained desktop viewports to retain the current flexible behavior rather than forcing a `700px` column that would overlap adjacent columns.
- Scope every override to `.snake-preview-layout` so ordinary VitePress documentation pages are unaffected.

## Verification

- Update the preview structure test to assert the outer-column allocation and the approximately `700px` content limit.
- Run the focused preview structure test.
- Run the documentation build to catch layout stylesheet or VitePress integration regressions.
