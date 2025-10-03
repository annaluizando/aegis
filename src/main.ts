#!/usr/bin/env node
import "dotenv/config";
import { aiAnalysisService } from "./core/services/service-container";
import chalk from "chalk";
import inquirer from "inquirer";
import * as fs from "fs";
import * as path from "path";

const aegisAsciiArt = `
           :::     :::::::::: :::::::: ::::::::::: :::::::: 
        :+: :+:   :+:       :+:    :+:    :+:    :+:    :+: 
      +:+   +:+  +:+       +:+           +:+    +:+         
    +#++:++#++: +#++:++#  :#:           +#+    +#++:++#++   
   +#+     +#+ +#+       +#+   +#+#    +#+           +#+    
  #+#     #+# #+#       #+#    #+#    #+#    #+#    #+#     
 ###     ### ########## ######## ########### ########       
`;

async function main() {
  const args = process.argv.slice(2);

  if (args.length > 0) {
    // Direct execution
    const projectPath = args[0]!;
    await runScan(projectPath);
  } else {
    // Interactive mode
    await interactiveMode();
  }
}

async function runScan(projectPath: string) {
  console.log(chalk.blue(aegisAsciiArt));
  console.log(
    chalk.bold("Starting Aegis: AI-Powered Pipeline Security Scanner...")
  );

  try {
    if (!fs.existsSync(projectPath)) {
      console.error(
        chalk.red(`\nError: The path "${projectPath}" does not exist.`)
      );
      process.exit(1);
    }

    console.log(chalk.cyan(`\nScanning project at: ${projectPath}`));
    const analysis = await aiAnalysisService.analyze(projectPath);

    console.log(chalk.bold.blue("\n--- AI Security Analysis ---"));
    console.log(analysis);
    console.log(chalk.green("\nScan complete."));
  } catch (error) {
    if (error instanceof Error && error.message.includes("OPENAI_API_KEY")) {
      console.error(chalk.yellow(`\n⚠️  ${error.message}`));
    } else {
      console.error(chalk.red("\nAn error occurred during the scan:"), error);
    }
    process.exit(1);
  }
}

async function interactiveMode() {
  console.log(chalk.blue(aegisAsciiArt));

  while (true) {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["Start Scan", "Set OpenAI API Key", "Exit"],
      },
    ]);

    switch (choice) {
      case "Start Scan":
        await runScan(process.cwd());
        process.exit(0);
      case "Set OpenAI API Key":
        await setApiKeyPrompt();
        break;
      case "Exit":
        console.log(chalk.bold("Goodbye!"));
        process.exit(0);
    }
  }
}

async function setApiKeyPrompt() {
  const { apiKey } = await inquirer.prompt([
    {
      type: "password",
      name: "apiKey",
      message: "Please enter your OpenAI API Key:",
      mask: "*",
    },
  ]);

  const envPath = path.resolve(process.cwd(), ".env");
  fs.writeFileSync(envPath, `OPENAI_API_KEY=${apiKey}\n`);
  console.log(chalk.green("✅ OpenAI API Key saved to .env file."));
  // Reload dotenv to use the new key in the current session
  require("dotenv").config({ override: true });
  console.log(chalk.cyan("API Key has been set for the current session."));
}

main();
