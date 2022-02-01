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

	static get properties () {
		return {
			controls: { type: Boolean },
			autoplay: { type: Boolean },
			muted: { type: Boolean },
			playing: { type: Boolean },
			loading: { type: Boolean },
			manifestUri: { 
				type : String,
				attribute: 'manifest-uri',
				reflect: true
			}
		}
	}

	constructor () {
		super()
		// init the property
		this.controls = false
		this.autoplay = false
		this.loading = false
		this.playing = false
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
		// fullscreen
		document.addEventListener('fullscreenchange',
			this.onFullscreenChange)
	}

	onFullscreenChange () {
		this.fullscreen = document.fullscreenElement
		console.log(`@FULLSCREEN >> ${this.fullscreen}`)
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
		this.player.addEventListener('error', this.#onShakaError)

		// TODO
		console.log(this.player.GetPlayerVersion)
		// console.log(this.player.getNetworkingEngine())

		// try to load a manifest
		try {
			await this.player.load(this.manifestUri)
			// DEBUG
			console.log('@VIDEO >> Loaded')
		} catch (e) {
			this.#onShakaError(e)
		}
	}

	/**
	 * 
	 * @param {object} shaka player error
	 */
	#onShakaError (error) {
		const Severity = shaka.util.Error.Severity
		const Category = shaka.util.Error.Category
		const Code = shaka.util.Error.Code

		const msg =
			`@PLAYER-ERROR >> ${error}\n` +
			`@SEVERITY >> ${getKeyByValue(Severity, error.severity)}\n` +
			`@CATEGORY >> ${getKeyByValue(Category, error.category)}\n` +
			`@CODE >> ${getKeyByValue(Code, error.code)}\n`

		// fire the shaka-player-error event
		const ce = new CustomEvent('shaka-player-error', {
			detail: {
				error,
				msg
			}
		})
		this.dispatchEvent(ce)
	}

	/**
	 * public method used to configure the shaka player as in official docs
	 * https://shaka-player-demo.appspot.com/docs/api/tutorial-config.html
	 * @param { object | string } configurationObj
	 * @param { any } value of single field if configurationObject is a string
	 */
	configure (configurationObj = {}, value = null) {
		this.player.configure(configurationObj, value)
	}

	getConfiguration () {
		return this.player.getConfiguration()
	}

	onloadstart (event) {
		console.log(`@FULLSCREEN >> ${event}`)
	}

	onVolumeChange (event) {
		console.log(event)
	}

	render () {
		return html`
		<figure>
			<video
				?autoplay=${this.autoplay}
				?controls=${this.controls}
				?muted=${this.muted}
				.preload=${this.preload}
				@fullscreenchange=${this.onLoadstart}
				@volumechange=${this.onVolumeChange}>
			<slot></slot>
		</video>
		</figure>

		<!-- @DEBUG stuff -->
		`
	}
}

customElements.define('shaka-player-lit', ShakaPlayerLit)
