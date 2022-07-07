const fs = require('fs');
const os = require('os');
const videoToken = require('./generateVideoToken');

const pathEnvFile = '.env'

// @see: https://stackoverflow.com/a/65001580
function setEnvValue(key, value) {
  // read file from hdd & split if from a linebreak to a array
  const ENV_VARS = fs.readFileSync(pathEnvFile, 'utf8').split(os.EOL);

  // find the env we want based on the key
  const target = ENV_VARS.indexOf(
    ENV_VARS.find((line) => {
      return line.match(new RegExp(key));
    })
  );

  // replace the key/value with the new value
  ENV_VARS.splice(target, 1, `${key}=${value}`);

  // write everything back to the file system
  fs.writeFileSync(pathEnvFile, ENV_VARS.join(os.EOL));
}

setEnvValue('TWILIO_ACCESS_TOKEN', videoToken);
