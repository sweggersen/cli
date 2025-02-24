import versionRanges from '../versionRanges';
import {doesSoftwareNeedToBeFixed} from '../checkInstallation';
import {logManualInstallation} from './common';

const issue = {
  label: 'Node.js',
  getDiagnostics: ({Binaries}) => ({
    version: Binaries.Node.version,
    needsToBeFixed: doesSoftwareNeedToBeFixed({
      version: Binaries.Node.version,
      versionRange: versionRanges.NODE_JS,
    }),
  }),
  runAutomaticFix: async ({loader}) => {
    loader.fail();

    logManualInstallation({
      healthcheck: 'Node.js',
      url: 'https://nodejs.org/en/download/',
    });
  },
};

export default issue;
