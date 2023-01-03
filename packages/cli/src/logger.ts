import chalk from 'chalk'

export class Logger {
  private scope: string

  constructor(scope = '') {
    this.scope = scope
  }

  private genMessageWithScope(message: string) {
    return `${this.scope !== '' ? `[${this.scope}] ` : ''}${message}`
  }

  log(message: string) {
    console.log(chalk.cyanBright(this.genMessageWithScope(message)))
  }

  warn(message: string) {
    console.warn(chalk.yellowBright(this.genMessageWithScope(message)))
  }

  error(message: string) {
    console.error(chalk.redBright(this.genMessageWithScope(message)))
  }
}
