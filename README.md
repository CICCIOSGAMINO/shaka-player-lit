# shaka-player-lit

v0.0.1 - 01-02-2022

Lit WebComponent wrapper around Shaka Player. Actually the Shaka Player is not a dependency (not a module) and only the js script is linked. The Shaka version used in the imported script is:

Shaka Player > v3.0.0

```bash
Project Structure
	|__ 📂 Video - DASH & HSL files
	|__ 📂 Examples - use case examples
	|__ 📂 lib\n
			|__ shaka-player.compiled.js, *.map, utils.js
	|
	|__ 📜 shaka-player-lit.js	- Lit WebComponent
	|__ 📜 README.md	
	|__ 📜 CHANGELOG.md
```


# Providing \<source\> for auto load
It's also possible to provide the \<source\> tag inside the \<video\> element to enable auto loading of the specified content.
```html
<shaka-player-lit
  autoplay
  manifest-uri='https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd'>
		<!-- Providing sources for auto load - Try this first -->
		<source src='https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd'/>
		<!-- Try this if the first one has failed -->
		<source src='https://storage.googleapis.com/shaka-demo-assets/angel-one-hls-apple/master.m3u8'/>
<shaka-player-lit>
```

# configurations
The shaka-player-lit component can be configure as the native Shaka Player. Shaka's Player object has a hierarchical configuration. The overall player config contains sub-configs for various parts of the system, such as manifests, streaming, and DRM.

Check the official [docs](https://shaka-player-demo.appspot.com/docs/api/tutorial-config.html)

```javascript
const s = document.querySelector('shaka-player-lit')

// eg. setting the shaka's player configuration object
s.configure({
	abr: {
		bandwidthDowngradeTarget: 0.95,
    bandwidthUpgradeTarget: 0.85,
    defaultBandwidthEstimate: 500000,
		...
	}
})
// eg. setting a single field
s.configure('streaming.bufferingGoal', 120)

// check audio language preference, which is still Canadian French:
s.getConfiguration().preferredAudioLanguage // fr-CA
```

# TODO
Nothing to do? Don't worry ... here the list:

- [ ] Test with  ../lib/shaka-player.ui.js


