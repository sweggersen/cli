import chalk from 'chalk';
import ora from 'ora';
import logger from '../../tools/logger';
import {HEALTHCHECK_TYPES} from './healthchecks';

const AUTOMATIC_FIX_LEVELS = {
  ALL_ISSUES: 'ALL_ISSUES',
  ERRORS: 'ERRORS',
  WARNINGS: 'WARNINGS',
};

const runAutomaticFix = async ({
  healthchecks,
  automaticFixLevel,
  stats,
  loader,
  environmentInfo,
}) => {
  // Remove the fix options from screen
  process.stdout.moveCursor(0, -6);
  process.stdout.clearScreenDown();

  const totalIssuesBasedOnFixLevel = {
    [AUTOMATIC_FIX_LEVELS.ALL_ISSUES]: stats.errors + stats.warnings,
    [AUTOMATIC_FIX_LEVELS.ERRORS]: stats.errors,
    [AUTOMATIC_FIX_LEVELS.WARNINGS]: stats.warnings,
  };
  const issuesCount = totalIssuesBasedOnFixLevel[automaticFixLevel];

  logger.log(
    `\nAttempting to fix ${chalk.bold(issuesCount)} issue${
      issuesCount > 1 ? 's' : ''
    }...`,
  );

  for (const category of healthchecks) {
    const healthchecksToRun = category.healthchecks.filter(healthcheck => {
      if (automaticFixLevel === AUTOMATIC_FIX_LEVELS.ALL_ISSUES) {
        return healthcheck.needsToBeFixed;
      }

      if (automaticFixLevel === AUTOMATIC_FIX_LEVELS.ERRORS) {
        return (
          healthcheck.needsToBeFixed &&
          healthcheck.type === HEALTHCHECK_TYPES.ERROR
        );
      }

      if (automaticFixLevel === AUTOMATIC_FIX_LEVELS.WARNINGS) {
        return (
          healthcheck.needsToBeFixed &&
          healthcheck.type === HEALTHCHECK_TYPES.WARNING
        );
      }
    });

    if (!healthchecksToRun.length) {
      continue;
    }

    logger.log(`\n${chalk.dim(category.label)}`);

    for (const healthcheckToRun of healthchecksToRun) {
      const spinner = ora({
        prefixText: '',
        text: healthcheckToRun.label,
      }).start();

      try {
        await healthcheckToRun.runAutomaticFix({
          loader: spinner,
          environmentInfo,
        });
      } catch (error) {
        // TODO: log the error in a meaningful way
      }
    }
  }
};

export {AUTOMATIC_FIX_LEVELS};
export default runAutomaticFix;
