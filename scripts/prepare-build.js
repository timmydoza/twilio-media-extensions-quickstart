const fse = require('fs-extra');

const buildDir = process.argv[2];

(() => {
  // Copy root asset for serverless toolkit convention https://www.twilio.com/docs/runtime/assets#hosting-a-root-asset
  try {
    fse.ensureDirSync(`${buildDir}/assets`);
    fse.copySync(`${buildDir}/index.html`, `${buildDir}/assets/index.html`);
    console.log(`Root asset copied.`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
