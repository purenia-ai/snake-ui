# Form Demo Coverage Design

## Goal

Turn the `snake-form` demonstration into a concise, executable guide to the
capabilities that Snake Form already supports. The page must not imply support
for APIs such as schema adapters, picker controls, uploads, or automatic hidden
field handling that do not exist in Snake Form.

## Scope

Update only `src/pages/componentsA/form/index.vue` and focused tests when a
test can verify the documented page contract.

## Page structure

### Account details

Use meaningful fields for required, length, regular-expression, and
cross-field custom validation:

- name;
- password and confirmation;
- introduction;
- mobile number or invitation code.

Each form item with a `prop` receives a rule. The required asterisk is used
only for required fields so presentation agrees with validation.

### Preferences and contacts

Demonstrate the controls supported by the current form-item injection protocol:

- checkbox group and radio group with array / scalar validation;
- switch with an explicit rule when it affects the example's submission;
- `accounts.<index>.name` dynamic paths, including add and remove actions.

The contact array starts with one contact. Removing the final contact is
prevented so the visible example always has a target for nested validation.

### Form actions and visual configuration

Expose the existing form API through buttons:

- `validate()` for the whole form;
- `validateField('name')` and `validateField(['name', 'password'])`;
- `resetFields()`;
- `setRules()` to toggle a clearly labelled optional validation rule.

Retain the existing controls for separators, label position, required marks,
size, and error rendering. Error rendering remains a single selected visual
mode because the demo control is a select; its copy explicitly states that
Toast is emitted only by whole-form validation. This avoids pretending that a
field-change error uses Toast.

## Constraints

- Keep the existing Composition API and localized demo conventions.
- Reuse only components already available in Snake UI.
- Do not change `snake-form` or `snake-form-item` behavior.
- Treat form validation as asynchronous and report the result through the
  page's status text.

## Verification

- Run the focused form parity test after the implementation.
- Run type checking and Prettier for the changed Vue page.
- Review the final diff to confirm every visible `prop` in the demo has a
  corresponding rule unless it is a layout-only item.
