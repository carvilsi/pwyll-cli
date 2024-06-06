/* eslint no-console: "off" */

import chalk from 'chalk';

export function warningHandler(warningMessage) {
    console.log(`[${chalk.yellow('WARN')}] ${warningMessage}`);
}
