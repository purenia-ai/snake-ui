# SnakeLoading migration design

## Goal

Replace the narrowly named `snake-loading-icon` component with `snake-loading` and align its public model with the loading component in Wot UI. This is a deliberate breaking rename: no compatibility component, type alias, or legacy tag will remain.

## Public API

- Component: `SnakeLoading`, used as `<snake-loading>`.
- Props: `show`, `type`, `color`, `size`, `direction`, `text`, `inheritColor`, `duration`, and `customStyle`.
- `type` supports `circular`, `spinner`, `dots`, and `wave`; `direction` supports `horizontal` and `vertical`.
- Default slot renders loading text when supplied; `text` remains its fallback.

## Implementation

The component will use a single BEM namespace, `snake-loading`. The template selects minimal markup for each animation type. CSS owns the repeated-dot layout, rotation, pulse, and wave timing so render-time inline styling is avoided. The style remains scoped and preserves the uni-app `virtualHost` and `styleIsolation` options.

All in-repository imports, template tags, exports, declarations, demonstration pages, documentation, skill references, and contract tests will move to the new name. Internal callers that previously passed `mode` will map its old values to the corresponding `type` values (`circle` to `circular`; `spinner` to `spinner`).

## Validation

Run the affected component-contract and parity tests, then the repository type check or test command exposed by `package.json`. Confirm no source, documentation, or test references to `snake-loading-icon` remain.
