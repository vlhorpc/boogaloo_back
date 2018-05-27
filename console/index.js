const program = require('commander');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const basename = path.basename(__filename);

class ConsoleRunner {
  constructor() {
    this.commandsList = [];
  }

  getCommandsList() {
    fs
      .readdirSync(__dirname)
      .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
      .forEach((file) => {
        const fileClass = require(`./${file}`);
        const fileObject = new fileClass();

        this.commandsList.push(fileObject);
      });
  }

  generateCommandsList() {
    this.getCommandsList();
    this.commandsList.forEach((command) => {
      program
        .command(`${command.command}`)
        .description(chalk.green(command.description))
        .action(command.run);
    });

    program.parse(process.argv);
  }
}

const runner = new ConsoleRunner();
runner.generateCommandsList();
