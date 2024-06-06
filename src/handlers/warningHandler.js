import chalk from 'chalk';

const log = console.log;

export function warningHandler(warningMessage) {
    log(`[${chalk.yellow('WARN')}] ${warningMessage}`);
}