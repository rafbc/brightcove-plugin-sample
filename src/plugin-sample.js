const VERSION = '1.0';

let Plugin = videojs.getPlugin('plugin');

let defaults = {
	debug: false,
	breakingPointToTrack: [10, 25, 35, 50, 80, 75] // Percentages to track
}

/*
* SamplePlugin Plugin
*
* The plugin show some simple functionality on how it should be developed
*
* @extends {VideojsPlugin}
*/
class SamplePlugin extends Plugin {
	/**
	 * Creates an instance of the SSAI plugin.
	 *
	 * @param {VideojsPlayer} player
	 *        A Video.js player instance.
	 *
	 * @param {Object} [options]
	 *        Options for the SSAI plugin.
	 *
	 * @param {boolean} [options.debug]
	 *        If true, enables debug messages.
	 *
	 * @param {boolean} [options.breakingPointToTrack]
	 *        Logs the percentage every N percent
	 */

	constructor(player, options) {
		super(player, options);

		options = this._options = videojs.mergeOptions(defaults, options);

		// Initialise the text area element
		this.textarea = null;

		// Create a logging box
		this.createLoggingBox();

		// Add event listeners
		this.addEventListeners();

		this.log('Sample Plugin initialised.', options);
	}

	/*
	* @method createLoggingBox
	* Create the box below the player to display the events
	*/
	createLoggingBox() {
		this.textarea = document.createElement('textarea');
		this.textarea.setAttribute('disabled', 'disabled');
		document.body.appendChild(this.textarea);
	}

	/*
	* @method addEventListeners
	* Add event listeners for varies player events
	*/
	addEventListeners() {
		let { player } = this;

		player.on(['percent_played', 'playing', 'play', 'load','pause', 'stop', 'error', 'loadeddata', 'loadedmetadata', 'volumechange', 'seeking', 'seek_start', 'seek_end', 'fullscreen_exit', 'fullscreen_enter', 'resize', 'end'], (e) => {
			this.log(`** EVENT ** ${e.type}`);
		});

		player.on('timeupdate', (e) => {
			let { player } = this;

			/*
			 * Calculate the percentage played
			 */
			let currentTime = Math.round(player.currentTime()),
				duration = Math.round(player.duration()),
				percentPlayed = Math.round(currentTime / duration * 100);

			this.percentsAlreadyTracked = this.percentsAlreadyTracked || {};
			this.trackingPoint = this.trackingPoint || 0;

			let { breakingPointToTrack } = this._options, // all the tracking configuration defined by the default or the plugin
				trackingPointPercentage = breakingPointToTrack[this.trackingPoint]; // The tracking point 10%, 25%, 35%, ...

			// Check what tracking point to log
			if (percentPlayed > trackingPointPercentage && !this.percentsAlreadyTracked[trackingPointPercentage]) {

				this.log(`Played: ${trackingPointPercentage}%`);

				this.percentsAlreadyTracked[trackingPointPercentage] = true;
				this.trackingPoint++;
			}

		});

		// Load Player metadata
		if (player.readyState() < 1) {
			// do not have metadata yet so loadedmetadata event not fired yet (I presume)
			// wait for loadedmetdata event
			player.one("loadedmetadata", this.onLoadedMetadata.bind(this));
		}
		else {
			// metadata already loaded
			this.onLoadedMetadata();
		}
	}

	onLoadedMetadata() {
		let { player } = this;

		this.log('\nPlayer Metadata:');

		let displayMetadata = ['id', 'autoplay', 'data-account', 'data-video-id', 'data-player'],
			playerOptions = player.options();

		// Display the metadata from the array below
		displayMetadata.forEach((key) => this.log(`${key}: ${playerOptions[key]}`));

		// Duration of the video
		let duration = player.duration();
		this.log(`duration: ${Math.round(duration)} seconds\n`);
	}

	/*
	* @method log
	* @params message {string} - Message to be logged
	* If debug is on, then log all the events and messages and add a [Ad Holiday] prefix to the message
	*/
	log(message) {
		this._options.debug && console.log.apply(null, ['[Sample Plugin]'].concat([].slice.call(arguments)));
		this.textarea.value = `${message}\n` + this.textarea.value;
	}
}

/**
 * The version of the AdHoliday plugin being used.
 *
 * @static
 * @type {string}
 */
SamplePlugin.VERSION = VERSION;

/**
 * Register the plugin with videojs
 */
videojs.registerPlugin('samplePlugin', SamplePlugin);