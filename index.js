
// Importing necessary functions
const tf = require("@tensorflow/tfjs-node");
const { createCatchers } = require("./src/functions/createCatchers.js");
const { sendLog, sendWebhook } = require("./src/functions/logging.js");
const { logMemoryUsage, memoryUsage } = require("./src/utils/utils.js");

// Importing necessary modules
const chalk = require("chalk");
const fs = require("fs-extra");

// Importing package.json
const package = require("./package.json");

// Main function to initialize and start the application
async function main() {
  const figlet = require("figlet");
  const gradient = await import('gradient-string').then(({default: gradient}) => gradient);

  // Displaying the Op Catcher logo
  await figlet.text(
    "Op Catcher",
    {
      font: "Standard",
      horizontalLayout: "fitted",
      verticalLayout: "default",
    },
    async function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      } 
      console.log(gradient.fruit(data));
    } 
  );  

  // Extract version
  const version = package.version;

  // Displaying the Op catcher logo and welcome message
  console.log(
    chalk.bold.yellow(`[${"WELCOME".toUpperCase()}]`) +
      ` - ` +
      chalk.yellow.bold(`Welcome to Op catcher!`)
  );

  // Log the current version with a nicer color
  console.log(
    chalk.bold.cyan(`[VERSION]`) +
      ` - ` +
      chalk.cyan(
        `Version ${chalk.bold(version)}, by ${chalk.bold(`@Pokeboy_66`)}`
      )
  );

  // Sending a welcome message via webhook
  sendWebhook(null, {
    title: "Welcome to op catcher!",
    description: `If you need any help, dm me pokeboy_66 "#fecd06",
    footer: {
      text: "op catcher by pokeboy_66, version " + version
    },

  });

  // Delayed execution to create catchers and log memory usage
  setTimeout(() => {
    createCatchers();
    logMemoryUsage();
  }, 500);
}

// Handling unhandled promise rejections
process.on("unhandledRejection", (reason, p) => {
  // Ignoring specific errors
  const ignoreErrors = [
    "MESSAGE_ID_NOT_FOUND",
    "INTERACTION_TIMEOUT",
    "BUTTON_NOT_FOUND",
  ];
  if (ignoreErrors.includes(reason.code || reason.message)) return;
  // Logging unhandled rejections
  sendLog(undefined, `Unhandled Rejection`, "error");
  console.log(reason, p);
});

// Handling uncaught exceptions
process.on("uncaughtException", (e, o) => {
  // Logging uncaught exceptions
  sendLog(undefined, `Uncaught Exception/Catch`, "error");
  console.log(e);
});

// Handling uncaught exceptions with a monitor (currently commented out)
/*process.on("uncaughtExceptionMonitor", (err, origin) => {
  sendLog(undefined, `Uncaught Exception/Catch (MONITOR)`, "error")
  console.log(err, origin);
}); */

// Handling multiple promise resolutions
process.on("multipleResolves", (type, promise, reason) => {
  // Logging multiple resolutions  sendLog(undefined, `Multiple Resolves`, "error");
  console.log(type, promise, reason);
});

// Executing the main function to start the application
main();
