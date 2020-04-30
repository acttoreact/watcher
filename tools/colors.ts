import chalk from 'chalk';

export const fullPath = (src: string): string => chalk.cyan(src);
export const fileName = (src: string): string => chalk.blue(src);
export const method = (src: string): string => chalk.magenta(src);
