module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', {
    name: '@storybook/addon-essentials',
    options: {
      backgrounds: false,
      docs: false
    }
  }, '@storybook/preset-create-react-app'],
  webpackFinal: config => {
    config.resolve.alias['twilio-video'] = require.resolve('../src/stories/mocks/twilio-video.js');
    config.resolve.alias['axios'] = require.resolve('../src/stories/mocks/axios.js');
    return config;
  },
  core: {
    builder: 'webpack5'
  }
};