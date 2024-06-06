import chalk from 'chalk';

const log = console.log;

export function infoHandler(infoMessage) {
    log(`[${chalk.green('INFO')}] ${infoMessage}`);
}
