## 2.0.0

### Breaking change: The video-composer now no longer disconnects and reconnects from the Room after four hours, as the maximum Participant duration can be configured for the Room to avoid the need to disconnect after four hours

Previously, `video-composer` would disconnect and reconnect from the Room every 3h 55m, because a Participant could be connected to the Room for a maximum of 4 hours. Following recent changes to Twilio Video Rooms, a Room's owner can now set this time limit up to 24 hours.

To increase the maximum Participant duration for a Room, please visit the [Video documentation](https://www.twilio.com/docs/video/configure-maximum-participant-duration) and follow the instructions. You can configure the maximum Participant duration via the REST API or within the Twilio Console.

## 1.3.0

## Timed Metadata

The video-composer gets a Room's participants every 500 ms and inserts this information into the stream via the TimedMetadata API as a JSON object. The payload includes a "p" object that stands for participants and an "s" object that represents a sequence ID. Each key within the "p" object represents a participant’s identity and the value contains a JSON object. The JSON object contains a "v" key which represents the participant’s volume level. This option saves space via abbreviated keys but also allows for additions to the payload. Applications are encouraged to inspect a payload’s sequence ID and discard a message payload received out-of-order. The snippet below describes an example payload with two participants. This will require Twilio Player SDK 1.0.2 or above.

```json5
{
  "s": 23, // sequence id
  "p": {
    "alice" : {"v":300},
    "bob" : {"v":-1} // bob is muted
  }
}
```
## 1.2.0

### New Feature

The identities of participants can now be hidden in the Video Composer. To enable this feature, pass the following variable to the `ExtensionEnvironment` parameter when creating a MediaProcessor:

```json5
{
  // Prevents participant identities from being displayed in the Video Composer (optional, false by default)
  "hideParticipantIdentities": true
}
```

## 1.1.0

### Presentation Mode

The Video Composer now supports Presentation Mode! This allows participants to "present" content of their choice to the other participants and viewers. To present a video track in your application, enable a user to publish a video track with the name `video-composer-presentation`. The Video Composer will show the presented video as the main view, and the list of speakers will move to the right of the presentation. Please note that this list will only show 5 speakers at a time, and they will update as the active speaker changes.

#### Additional Details

- The Video Composer will only show one video track named `video-composer-presentation` at a time in the main view. If a `video-composer-presentation` track is already being shown in the main view, then subsequent tracks named `video-composer-presentation` will not be rendered. Applications should limit the publishing of a `video-composer-presentation` track to one per room to avoid potentially unexpected UI/UX states.
- The Video Composer presentation mode is only supported with video tracks named `video-composer-presentation`. Audio and data tracks published with the name `video-composer-presentation` will not result in any Video Composer UX changes.
- The Video Composer will return back to the adaptive grid view layout when an application unpublishes a video track named `video-composer-presentation` shown in the main view.

### Enhancements

- Updated the color palette of the video composer to have a neutral gray theme.

## 1.0.0

The `1.0.0-beta.1` Audio Mixer has been promoted to `1.0.0` and is now Generally Available! Thank you for all the feedback from our beta customers. For more details about the Audio Mixer, please visit [the documentation](https://www.twilio.com/docs/live/audio-mixer).

## 1.0.0-beta.1

A media extension that composes a [Programmable Video](https://www.twilio.com/video) Room's participants in an adaptive grid layout.

### Features

- Automatically connects to and disconnects from a Programmable Video Room.
- Composes a Room's participants into an adaptive grid layout with a maximum of 9 participants. When the Room contains more than 9 participants, the Video Composer shows the 9 most recent active speakers. If a speaker not shown becomes the active speaker, the Video Composer will automatically add the new speaker to the grid in place of the least recently active speaker.
- Automatically highlights the current active speaker.
- Automatically shows audio and video muted indicators.

### Getting Started

To use a Video Composer in a Twilio Live application, specify the Video Composer extension name and extension context parameters when creating a [MediaProcessor](https://www.twilio.com/docs/live/api/mediaprocessors).

```shell
curl -X POST 'https://media.twilio.com/v1/MediaProcessors' \
  -u 'SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:your_api_key_secret' \
  -d 'Extension="video-composer-v1"' \
  -d 'ExtensionContext={"room": {"name": "RM123"}, "outputs": ["VJXXX"]}'
```

### Extension Context

The snippet below describes the Video Composer extension context parameters.

```json5
{
  // Room Parameters (required)
  room: {
    name: 'RM123', // required
  },

  // Extension Identity (optional, video-composer-v1 by default)
  identity: 'video-composer-v1',

  // Media destinations (required)
  outputs: ['VJXXX'],

  // Audio bitrate (optional)
  audioBitrate: 128,

  // Resolution (optional)
  resolution: '1280x720',
}
```
