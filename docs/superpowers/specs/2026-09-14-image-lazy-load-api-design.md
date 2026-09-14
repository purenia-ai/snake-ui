# Snake Image `lazy-load` API

## Goal

Expose one image lazy-loading API named `lazy-load`, consistent with uni-app's native image property and Wot UI's `wd-img` documentation.

## Public API

- Remove the public `lazy` property from `snake-image`.
- `lazy-load` enables viewport-based lazy loading: the component waits until it is within `lazy-threshold` of the viewport before assigning the actual image source.
- `lazy-threshold` remains the preload distance and defaults to `100`.

## Implementation

When `lazy-load` is enabled, `snake-image` observes itself with `uni.createIntersectionObserver`; after intersection it sets the source and disconnects the observer. The internal native `image` also receives `lazy-load` once it exists, allowing platform-native optimisation without exposing another flag.

If intersection observation is unavailable or errors, the component loads immediately. A changing `src` resets the observation and state.

## Migration

Consumers replace `lazy` (or the former `snake-lazy-image`) with `lazy-load`. They must not provide both flags because `lazy` is removed.

## Verification

Update API and contract tests to assert that `lazy-load` is the only public lazy-loading switch, then run the relevant Node tests, type check, mini-program build, and documentation build.
