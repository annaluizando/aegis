import inquirer from "inquirer";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

export class ConfigService {
  async promptAndSetApiKey(): Promise<void> {
    const { apiKey } = await inquirer.prompt([
      {
        type: "password",
        name: "apiKey",
        message: "Please enter your OpenAI API Key:",
        mask: "*",
      },
    ]);

    if (apiKey) {
      const envPath = path.resolve(process.cwd(), ".env");
      fs.writeFileSync(envPath, `OPENAI_API_KEY=${apiKey}\n`);
      console.log(chalk.green("✅ OpenAI API Key saved to .env file."));
      // Reload dotenv to use the new key in the current session
      require("dotenv").config({ override: true });
      console.log(chalk.cyan("API Key has been set for the current session."));
    }
  }
}
