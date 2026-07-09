# Disclosure element

_Work in progress_

A disclosure element for cases where `<details>` doesn’t cut it.

## Usage

First import and define a custom element with the `DisclosureElement` class:

```javascript
import { DisclosureElement } from "./disclosure-element.js";

customElements.define("dis-closure", DisclosureElement);
```

Create your sectioned content how you normally would, except wrap with the custom element:

```html
<dis-closure>
    <h2 slot=summary>The Dillinger Escape Plan</h2>
    <p><em>One of Us Is the Killer</em>
</dis-closure>
```

This is no different than using a `<section>` since, when unnamed, a `<section>` has an implicit ARIA role of `generic`.

When there’s no JS, it just acts normally. When there is JS, the structure upgrades without modifying the contents directly.

## Styling

- `:state(open)` can be used for styling when the element is open.
    - Similar to `:open`.
- `::part(contents)` can be used to style the disclosed contents.
    - Similar to `::details-contents`.
- `::part(disclosure-button)` of the first element in the `summary` slot.
