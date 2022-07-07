# 🎥 Video Composer

A media extension that composes a [Programmable Video](https://www.twilio.com/video) Room's participants in an adaptive grid layout. This extension closely matches the functionality of the Twilio hosted [Video Composer](https://www.twilio.com/docs/live/video-composer) and is written in ReactJS. You can use this as your starting point and customize the Video Composer to your needs. We recommend using [Storybook](https://storybook.js.org/) as a way to quickly iterate and test your changes, see below for additional details. 

## Getting Started 

To use a Video Composer in a Twilio Live application, specify the video composer extension name and extension context parameters when creating a [MediaProcessor](https://www.twilio.com/docs/live/api/mediaprocessors). The table and snippet below describe the available Video Composer extension names and the extension context parameters.


### Extension Context

The snippet below describes the Video Composer extension context parameters.

```json5
{
  // Room Parameters (required)
  "room": {
      "name": "RM123", // required
  },

  // Extension Identity (optional, video-composer-v1 by default)
  "identity": "my-video-composer",

  // Media destinations (required)
  "outputs": ["VJXXX"],

  // Audio bitrate (optional)
  "audioBitrate": 128,

    // Resolution (optional)
  "resolution": "1280x720"
}
```

#### Creating a Media Processor with Video Composer

The snippet below demonstrates an example curl request for creating a MediaProcessor with a Video Composer media extension.

```shell
curl -X POST 'https://media.twilio.com/v1/MediaProcessors' \
  -u 'SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:your_api_key_secret' \
  -d 'Extension="https://video-composer-quickstart-6647-dev.twil.io"' \
  -d 'ExtensionContext={"room": {"name": "RM123"}, "outputs": ["VJXXX"]}'
```

## 🖼️ Presentation Mode

The Video Composer supports Presentation Mode. This allows participants to "present" content of their choice to the other participants and viewers. To present a video track in your application, enable a user to publish a video track with the name `video-composer-presentation`. The Video Composer will show the presented video as the main view, and the list of speakers will move to the right of the presentation. Please note that this list will only show 5 speakers at a time, and they will update as the active speaker changes.

## 👩‍💻 Development

Before running any scripts, you must first run `npm install` to install all dependencies.

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run storybook`

Runs [Storybook](https://storybook.js.org/) for the video composer. This allows developers to view the video composer's UI while it is connected to a mock video room. Any changes made to the app will update storybook in real-time.
