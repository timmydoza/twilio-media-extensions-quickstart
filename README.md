# Twilio Media Extensions

A [Media Extension](https://www.twilio.com/docs/live/api/media-extensions-overview) is a web-compliant JavaScript application executed within a Twilio Live [MediaProcessor](https://www.twilio.com/docs/live/api/mediaprocessors). Media Extensions perform specific actions commonly used in a Twilio Live streaming solution such as composing a [Twilio Video Room's](https://www.twilio.com/docs/video/api/rooms-resource) Participants.

Twilio hosts two Media Extensions: a [Video Composer](https://www.twilio.com/docs/live/video-composer) and an [Audio Mixer](https://www.twilio.com/docs/live/audio-mixer).

You can also create your own [Custom Composer](https://www.twilio.com/docs/live/custom-composer) Media Extension to customize the look of your livestream. This repository contains examples of Media Extension code.

## Getting Started

### 📓 Requirements

- [Node.js v16+](https://nodejs.org/en/download/)
- NPM v7+ (upgrade from NPM 6 with `npm install --global npm`)

### 🚀 Usage 

To use a Twilio Media Extension, specify the Media Extension name your application would like to use when creating a [MediaProcessor](https://www.twilio.com/docs/live/api/mediaprocessors) and any additional extension context. The following snippet demonstrates how to use a custom Video Composer to compose a Room's Participants.

```shell
curl -X POST 'https://media.twilio.com/v1/MediaProcessors' \
  -u 'SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:your_api_key_secret' \
  -d 'Extension="https://video-composer-5226-dev.twil.io"' \
  -d 'ExtensionContext={"room": {"name": "RM123"}, "outputs": ["VJXXX"]}'
```

### ⚙️ Selecting and Configuring an Extension

Twilio Media Extensions are selected and configured via the MediaProcessor `ExtensionContext` parameter with a JSON object. The snippet below expands on the previous example by describing the object's structure.

```json5
{
  /**
    * This object contains any extension parameters required to perform
    * a media processing action. Reference each Twilio Media Extension's
    * documentation to understand what parameters are required or optional.
    */

  // Room Parameters (required)
  "room": {
      "name": "RM123", // required
  },

  // Extension Identity (optional)
  "identity": "my-video-composer",

  // Media destinations (required)
  "outputs": ["VJXXX"]
}
```

## 📚 Project Structure

This project contains examples of Twilio Media Extensions. While each Extension performs specific media actions, the project is structured as a monorepo to enable the following:

* Sharing code between Extensions (ex. Connecting to a Room)
* Providing unified documentation

This repository contains the following sample Media Extension applications:

* [Interview Layout](apps/interview-layout): A sample application written in pure JavaScript. Displays up to three Participants' video in a grid.
* [Video Composer](apps/video-composer): Code for [Twilio's Video Composer Media Extension](https://www.twilio.com/docs/live/video-composer).

## 👷‍♀️ Development

The project uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to build each project. To get started, run `npm install` at the top-level project directory and reference each Extension's respective documentation for more details.
