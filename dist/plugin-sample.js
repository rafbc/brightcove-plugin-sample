var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;

(function () {
	'use strict';

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var VERSION = '1.0';

	var Plugin = videojs.getPlugin('plugin');

	var defaults = {
		debug: false,
		breakingPointToTrack: [10, 25, 35, 50, 80, 75] // Percentages to track


		/*
  * SamplePlugin Plugin
  *
  * The plugin show some simple functionality on how it should be developed
  *
  * @extends {VideojsPlugin}
  */
	};
	var SamplePlugin = function (_Plugin) {
		_inherits(SamplePlugin, _Plugin);

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

		function SamplePlugin(player, options) {
			_classCallCheck(this, SamplePlugin);

			var _this = _possibleConstructorReturn(this, (SamplePlugin.__proto__ || Object.getPrototypeOf(SamplePlugin)).call(this, player, options));

			options = _this._options = videojs.mergeOptions(defaults, options);

			// Initialise the text area element
			_this.textarea = null;

			// Create a logging box
			_this.createLoggingBox();

			// Add event listeners
			_this.addEventListeners();

			_this.log('Sample Plugin initialised.', options);
			return _this;
		}

		/*
  * @method createLoggingBox
  * Create the box below the player to display the events
  */


		_createClass(SamplePlugin, [{
			key: 'createLoggingBox',
			value: function createLoggingBox() {
				this.textarea = document.createElement('textarea');
				this.textarea.setAttribute('disabled', 'disabled');
				document.body.appendChild(this.textarea);
			}
		}, {
			key: 'addEventListeners',
			value: function addEventListeners() {
				var _this2 = this;

				var player = this.player;


				player.on(['percent_played', 'playing', 'play', 'load', 'pause', 'stop', 'error', 'loadeddata', 'loadedmetadata', 'volumechange', 'seeking', 'seek_start', 'seek_end', 'fullscreen_exit', 'fullscreen_enter', 'resize', 'end'], function (e) {
					_this2.log('** EVENT ** ' + e.type);
				});

				player.on('timeupdate', function (e) {
					var player = _this2.player;


					/*
      * Calculate the percentage played
      */
					var currentTime = Math.round(player.currentTime()),
					    duration = Math.round(player.duration()),
					    percentPlayed = Math.round(currentTime / duration * 100);

					_this2.percentsAlreadyTracked = _this2.percentsAlreadyTracked || {};
					_this2.trackingPoint = _this2.trackingPoint || 0;

					var breakingPointToTrack = _this2._options.breakingPointToTrack,
					    trackingPointPercentage = breakingPointToTrack[_this2.trackingPoint]; // The tracking point 10%, 25%, 35%, ...

					// Check what tracking point to log
					if (percentPlayed > trackingPointPercentage && !_this2.percentsAlreadyTracked[trackingPointPercentage]) {

						_this2.log('Played: ' + trackingPointPercentage + '%');

						_this2.percentsAlreadyTracked[trackingPointPercentage] = true;
						_this2.trackingPoint++;
					}
				});

				// Load Player metadata
				if (player.readyState() < 1) {
					// do not have metadata yet so loadedmetadata event not fired yet (I presume)
					// wait for loadedmetdata event
					player.one("loadedmetadata", this.onLoadedMetadata.bind(this));
				} else {
					// metadata already loaded
					this.onLoadedMetadata();
				}
			}
		}, {
			key: 'onLoadedMetadata',
			value: function onLoadedMetadata() {
				var _this3 = this;

				var player = this.player;


				this.log('\nPlayer Metadata:');

				var displayMetadata = ['id', 'autoplay', 'data-account', 'data-video-id', 'data-player'],
				    playerOptions = player.options();

				// Display the metadata from the array below
				displayMetadata.forEach(function (key) {
					return _this3.log(key + ': ' + playerOptions[key]);
				});

				// Duration of the video
				var duration = player.duration();
				this.log('duration: ' + Math.round(duration) + ' seconds\n');
			}
		}, {
			key: 'log',
			value: function log(message) {
				this._options.debug && console.log.apply(null, ['[Sample Plugin]'].concat([].slice.call(arguments)));
				this.textarea.value = message + '\n' + this.textarea.value;
			}
		}]);

		return SamplePlugin;
	}(Plugin);

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
})();