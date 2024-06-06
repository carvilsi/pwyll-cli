/* eslint no-console: "off" */
import chalk from 'chalk';

export function infoHandler(infoMessage) {
    console.log(`[${chalk.green('INFO')}] ${infoMessage}`);
}
