import { LitElement, css, html } from 'lit'
import { getKeyByValue } from './lib/utils.js'

// Install built-in polyfills to patch browser incompatibilities.
shaka.polyfill.installAll()

/**
 * WebComponent - Wrapper of Shaka Player
 * 
 * <shaka-player-lit
 * 	autoplay
 * 	controls
 * 	dash-manifest="https://......">
 * </shaka-player-lit>
 * 
 * @element shaka-player-lit 
 * @cssprop [--shaka] - 
 * @fires 'shaka-player-error' - fired with in it shaka.util.Error
 */

export class ShakaPlayerLit extends LitElement {
	static get styles () {
		return css`
			:host {
				display: block;
				position: relative;
			}

			video {
				width: 100%;
				height: 100%;
			}
		`
	}

	constructor () {
		super()
		// init the property
		this.autoplay = false
		this.loading = false
		this.muted = false
		/**
     * Video preload attribute.
     * see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
     * @type {'none'|'metadata'|'auto'|''}
     */
		this.preload = 'metadata'
	} 

	connectedCallback () {
		super.connectedCallback()
		console.log('@CONNECTED')
	}

	firstUpdated () {
		this._initPlayer()
	}

	get video () {
		return this.shadowRoot.querySelector('video')
	}

	async _initPlayer () {
		// Check if browser supports the basic APIs Shaka needs
		this.isBrowserSupported = shaka.Player.isBrowserSupported()
		if (!this.isBrowserSupported) {
			console.error('@ERROR >> Browser NOT Supported by Shaka Player!')
			return
		}

		this.player = new shaka.Player(this.video)

		// init listeners on player
		this.player.addEventListener('error', this.#onError)

		console.log(this.player.getNetworkingEngine())

		// try to load a manifest
		const manifestUri =
    'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd'

		try {
			await this.player.load(manifestUri)
			// DEBUG
			console.log('@VIDEO >> Loaded')
		} catch (e) {
			this.#onError(e)
		}
	}

	#onError (e) {
		const Severity = shaka.util.Error.Severity
		const Category = shaka.util.Error.Category
		const Code = shaka.util.Error.Code
		console.error(
			`@PLAYER-ERROR >> ${e}\n` +
			`@SEVERITY >> ${getKeyByValue(Severity, e.severity)}\n` +
			`@CATEGORY >> ${getKeyByValue(Category, e.category)}\n` +
			`@CODE >> ${getKeyByValue(Code, e.code)}\n`
		)
		// fire the shaka-player-error event
		const ce = new CustomEvent('shaka-player-error', {
			detail: e
		})
		this.dispatchEvent(ce)
	}

	render () {
		return html`
			<video
				.autoplay=${this.autoplay}
				.controls=${this.controls}
				.muted=${this.muted}
			></video>
		`
	}
}

customElements.define('shaka-player-lit', ShakaPlayerLit)
