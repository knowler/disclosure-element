export class DisclosureElement extends HTMLElement {
	static styles = new CSSStyleSheet();
	static disclosureButtonStyles = new CSSStyleSheet();
	static {
		this.styles.replaceSync(`
			:host { display: block; }

			:host::part(contents) { display: block; }
		`);
		this.disclosureButtonStyles.replaceSync(`
			button {
				appearance: none;
				background: none;
				border: 0;
				font: inherit;
				text-align: start;
				padding: 0;
				display: inline-block

				user-select: text;
				cursor: text;
				overflow: visible;

				/* We need to do this instead of display: list-item + ::marker because Blink and WebKit have special handling for `<button>` elements which overrides the `list-item` display. */

				&::before {
					display: inline;
					content: "▶ ";
					font-family: system-ui;
					cursor: auto;
				}

				&[aria-expanded="true"]::before {
						content: "▼ ";
				}
			}

		`);
	}

	#summarySlot;
	#contents;

	#internals = this.attachInternals();

	constructor() {
		super();

		this.attachShadow({ mode: "open" });

		this.shadowRoot.adoptedStyleSheets = [
			DisclosureElement.styles,
			DisclosureElement.disclosureButtonStyles
		];
		this.shadowRoot.innerHTML = `
			<slot name=summary><button aria-expanded=false aria-controls=contents>Details</button></slot>
			<slot id=contents part=contents aria-hidden=true hidden=until-found></slot>
		`;

		const [summary, contents] = this.shadowRoot.querySelectorAll("slot");

		this.#summarySlot = summary;
		this.#contents = contents;

		this.#internals.role = "group";

		this.#summarySlot.addEventListener("slotchange", this);
		this.#summarySlot.addEventListener("click", this);
		this.#contents.addEventListener("beforematch", this);
	}

	get #button() {
		const [summary] = this.#summarySlot.assignedElements({ flatten: true });
		return summary.matches("button") ? summary : summary.shadowRoot.querySelector("button");
	}

	handleEvent(event) {
		switch (event.type) {
			case "slotchange":
				const [summary] = this.#summarySlot.assignedElements({ flatten: true });
				if (!summary.matches("button")) {
					summary.attachShadow({ mode: "open" });
					summary.shadowRoot.innerHTML = `
						<button part=disclosure-button aria-expanded=false><slot></slot></button>
					`;
					summary.shadowRoot.adoptedStyleSheets = [DisclosureElement.disclosureButtonStyles];
				}
				this.#button.ariaControlsElements = [this];
				this.#button.ariaExpanded = !this.#contents.hidden;
				break;
			case "click":
				this.#contents.hidden = this.#contents.hidden ? false : "until-found";
				// This is just here to overcome a Safari bug
				this.#contents.ariaHidden = !!this.#contents.hidden;
				this.#internals.states[this.#contents.hidden ? "delete" : "add"]("open");
				this.#button.ariaExpanded = !this.#contents.hidden;
				break;
			case "beforematch":
				this.#contents.ariaHidden = "true";
				this.#button.ariaExpanded = "true";
				this.#internals.states.add("open");
				break;
		}
	}
}
