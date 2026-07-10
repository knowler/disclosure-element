# A disclosure custom element

*This is a work in progress. Expect gaps, bugs, and drastic change.*

A disclosure element for cases where `<details>` doesn’t cut it.

The `<details>` and `<summary>` elements are notoriously bad when paired with headings. That’s a huge problem because headings are critical accessibility infrastructure. In the worst cases, nesting a heading within a `<summary>` element can cause it to not be exposed as a part of the heading structure of a page that assistive tech users use to navigate and discover content.

## Usage

First import and define a custom element with the `DisclosureElement` class:

```javascript
import { DisclosureElement } from "@knowler/disclosure-element";

customElements.define("dis-closure", DisclosureElement);
```

Create your sectioned content how you normally would, except wrap with the custom element:

```html
<dis-closure>
	<h2 slot=summary>The Dillinger Escape Plan</h2>
	<p><em>One of Us Is the Killer</em>
</dis-closure>
```

By default, the element has an implicit `group` role similar to the `<details>` element, but is unnamed. It’s likely a good idea to leave it that way.

Generally, it’d be a good idea to bundle the custom element definition and load it in a parser/render blocking way to avoid any flash of unstyled custom element. That might go against your performance sensibilities, but consider the fact that built-in HTML elements are predefined before the body loads and there’s no flash of undefined `<details>` element. No need to hide the element and its contents until the definition — it’s semantically accessible and visually presentable without the enhancement of being a disclosure.

## Styling

- `:state(open)` can be used for styling when the element is open.
- `::part(contents)` can be used to style the disclosed contents.
	- This is very similar to the `details::details-content` pseudo-element.
- `::part(disclosure-button)` of the first slotted element in the `summary` slot.

## Roadmap

- Add an `open` attribute
- Consider non-details-like styles
	- Maybe expose a different part for the marker since we can’t really do our own for the button.
- Ensure framework compatibility
- Add tests!
