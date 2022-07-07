import { action } from '@storybook/addon-actions';

const axios = {
  request: (...params) => action('Sent timed metadata')(...params),
};

export default axios;
