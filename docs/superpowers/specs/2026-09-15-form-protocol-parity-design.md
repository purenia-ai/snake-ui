# Snake Form Protocol Parity Design

## Goal

Align `snake-form` and `snake-form-item` with uView Pro's observable form
behaviour while retaining Snake's typed Vue `provide` / `inject` boundaries.
Wot UI is a reference for a narrow parent/child context protocol; do not add a
component-instance or VNode traversal layer.

## Reference findings

### uView Pro

`u-form` owns the model, current rules reference, and an ordered list of
registered items. It validates every registered item or an exact `prop` subset,
collects errors in registration order, and may toast the first error. Its
default `errorType` is `['message', 'toast']`.

`u-form-item` owns field validation state and presentation. It resolves local
configuration before inherited form configuration; renders label, icons, slots
and message; filters rules by trigger; and registers on mount when `prop` is
present. It tells descendant inputs about an error only when `errorType`
contains `border`. Message, form-item bottom-border, and input border are
independent presentation channels.

uView's historical relation API and delayed notification in some mini-program
paths are implementation details, not public API requirements.

### Wot UI

Wot exposes typed keys for form and form-item contexts. Form items consume form
context and provide a narrow validation context to controls. It validates after
reactive model changes and maps nested paths to registered items. Its
`useParent` / `useChildren` helpers add ordered component registration through
Vue internals; Snake does not need that because form-item registration is
already explicit and ordered by mounting.

## Chosen design

### Context and lifecycle

- Keep `formKey` and `formItemKey` as typed injection keys.
- `snake-form` remains the source of truth for model, rules, inherited visual
  options, and registered fields.
- `snake-form-item` remains the source of truth for one field's validation
  state, message, initial value, and reset action.
- A field registers after mount only with a non-empty `prop`, unregisters on
  unmount, and is never registered when used outside a form.
- Do not introduce VNode inspection, private Vue instance access, or a global
  event bus.

### Validation and event ordering

- Full validation uses every registered field. `validateField` retains uView's
  exact prop matching and returns `true` for an empty target set.
- Trigger validation uses only rules whose `trigger` includes the requested
  event. Full and explicit-field validation use all rules.
- Controls continue to call `notify('change')` and `notify('blur')`; `notify`
  waits for Vue's update queue before the item reads the form model. This avoids
  validating a pre-emit value on asynchronous mini-program renderers without a
  magic timeout.
- Retain the validation generation counter: stale async results cannot replace
  state from a newer validation or reset.

### Error presentation

- `message`, `toast`, `border`, and `border-bottom` remain independently
  composable channels; `none` suppresses all channels.
- The item renders a message only for `message`; its bottom border turns red
  only for `border-bottom`; descendant controls receive a border error only for
  `border`.
- Retain the existing uView-compatible default `['message', 'toast']`.
- `errorVisible` in form-item control context means input-border error, not
  merely field validation error.

### Paths and reset state

- All model reads and mutations use `toPath`, `getPathValue`, and
  `setPathValue`. Support both `items.0.name` and `items[0].name`.
- Rule lookup normalizes bracket indexes before applying the uView-compatible
  `defaultField.fields` transformation, allowing either path spelling.
- Clone initial values at capture and restoration. Resetting object/array
  fields restores mount-time state, not a subsequently mutated reference.
- Reset clears displayed messages and invalidates outstanding validation.

### Layout and public API

- Keep uView-compatible label layout, icon slots, required marker, field-size
  inheritance, label override precedence, and border classes.
- Preserve `setRules`, `resetFields`, `validate`, `validateField`, `addField`,
  and `removeField` APIs and their boolean Promise results.
- Do not add Wot schema APIs, Wot cell layout APIs, or public-contract changes.

## Verification

Add regression coverage for: default `message + toast`; every error channel;
no input-border propagation without `border`; model synchronization before
trigger validation; dot/bracket array paths; array default-field rules; nested
scalar reset; object/array clone reset; lifecycle registration; stale async
validation; and existing layout, slot, size and API contracts. Run focused
tests, then type-check and the complete suite if they pass.

## Scope boundaries

Do not copy uView's relation API, magic delay, or known path/reset limitations.
Do not redesign unrelated control styling or behaviour.
