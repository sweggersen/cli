import chalk from 'chalk';
import {logger} from '@react-native-community/cli-tools';
const KEYS = {
  FIX_ALL_ISSUES: 'f',
  FIX_ERRORS: 'e',
  FIX_WARNINGS: 'w',
  EXIT: '\r',
};

const printOption = option => logger.log(` \u203A ${option}`);
const printOptions = () => {
  logger.log();
  logger.log(chalk.bold('Usage'));
  printOption(
    `${chalk.dim('Press')} ${KEYS.FIX_ALL_ISSUES} ${chalk.dim(
      'to fix all issues.',
    )}`,
  );
  printOption(
    `${chalk.dim('Press')} ${KEYS.FIX_ERRORS} ${chalk.dim('to fix errors.')}`,
  );
  printOption(
    `${chalk.dim('Press')} ${KEYS.FIX_WARNINGS} ${chalk.dim(
      'to fix warnings.',
    )}`,
  );
  printOption(`${chalk.dim('Press')} Enter ${chalk.dim('to exit.')}`);
};

const printFixOptions = ({onKeyPress}) => {
  printOptions();

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', onKeyPress);
};

export {KEYS};
export default printFixOptions;
