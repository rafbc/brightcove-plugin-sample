# Sample Plugin

This plugin contains a sample script for a quick start development as well as a few events to be tracked.

Use `src` for development, and when you are done, then build the deployment version using the commands below.


## Build

```
$ npm install
```

To compile the script into a ES2015 version, run the following command:

```
$ npm run build
```

To watch:

```
$ npm run watch
```


## options

*debug*
Enable logging

*breakingPointToTrack*
Choose the breaking points to track progress


## Example
```
{
	debug: false,
	breakingPointToTrack: [25, 50, 75, 10]
}
```

