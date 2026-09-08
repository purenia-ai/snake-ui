# Simplify Button Preview

## Goal

Make the Button component preview concise by showing one interactive button instead of a long collection of static variants.

## Design

- Keep the existing live `snake-button` as the only rendered button in the preview section.
- Keep the existing parameter panel so users can switch the button theme, size, shape, plain, loading, disabled, and ripple states.
- Remove the static theme, plain, size, shape, state, and ripple showcase groups and their now-unused layout styles.
- Keep the Button Markdown documentation and component API unchanged; they remain the comprehensive reference.
- Preserve the existing bilingual title, description, and control labels.

## Verification

- Update the preview structure test to assert the single interactive button and retained controls instead of static showcase variants.
- Run the focused preview structure test.
- Run the documentation preview build to catch Vue template and integration regressions.
