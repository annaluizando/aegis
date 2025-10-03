#!/usr/bin/env node
import "dotenv/config";
import { aiAnalysisService } from "./core/services/service-container";
import chalk from "chalk";

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
  console.log(chalk.blue(aegisAsciiArt));
  console.log(
    chalk.bold("Starting Aegis: AI-Powered Pipeline Security Scanner...")
  );

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(chalk.red("Usage: aegis <path-to-project-directory>"));
    process.exit(1);
  }

  const projectPath = args[0]!;

  try {
    console.log(chalk.cyan(`\nScanning project at: ${projectPath}`));
    const analysis = await aiAnalysisService.analyze(projectPath);

    console.log(chalk.bold.blue("\n--- AI Security Analysis ---"));
    console.log(analysis);
    console.log(chalk.green("\nScan complete."));
  } catch (error) {
    console.error(chalk.red("\nAn error occurred during the scan:"), error);
    process.exit(1);
  }
}

main();
