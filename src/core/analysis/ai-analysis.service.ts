import "dotenv/config";
import OpenAI from "openai";
import { PackageJsonParserService } from "../services/package-json-parser.service";
import { DockerfileParserService } from "../services/dockerfile-parser.service";
import { GithubActionsParserService } from "../services/github-actions-parser.service";
import { RedactionService } from "../services/redaction.service";

export class AIAnalysisService {
  private openai: OpenAI;

  constructor(
    private readonly packageJsonParserService: PackageJsonParserService,
    private readonly dockerfileParserService: DockerfileParserService,
    private readonly githubActionsParserService: GithubActionsParserService,
    private readonly redactionService: RedactionService
  ) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY is not set in the environment variables."
      );
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyze(projectPath: string): Promise<string> {
    const packageJson = this.packageJsonParserService.parse(
      `${projectPath}/package.json`
    );
    const dockerfile = this.dockerfileParserService.parse(projectPath);
    const githubActions = this.githubActionsParserService.parse(projectPath);

    const keywordsToRedact: string[] = [];
    if (packageJson.name) {
      keywordsToRedact.push(packageJson.name);
    }

    const redactedDockerfile = dockerfile
      ? this.redactionService.redact(dockerfile.toString(), keywordsToRedact)
      : undefined;

    const redactedGithubActions = this.redactionService.redact(
      JSON.stringify(githubActions, null, 2),
      keywordsToRedact
    );

    const prompt = this.buildPrompt(
      packageJson,
      redactedDockerfile,
      redactedGithubActions
    );

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0]?.message?.content || "No analysis available.";
  }

  private buildPrompt(
    packageJson: any,
    dockerfile: string | undefined,
    githubActions: string
  ): string {
    return `
      Act as a senior security engineer. Analyze the following project information and provide a step-by-step plan to improve its security.
      Format your response in Markdown. For each step, provide a clear title, a description of the recommendation, and, if applicable, a code snippet for implementation.

      When providing recommendations, please be as specific as possible:
      - For CI/CD pipeline changes, specify where to add the new job or step. For example, should it run before or after the build and test steps? Can it run in parallel?
      - Consider the project's performance and execution time. Recommend solutions that provide the best security benefit with the minimum performance impact.
      - For Dockerfile changes, indicate exactly where the new lines should be added.

      Project Context:
      - **package.json:**
      \`\`\`json
      ${JSON.stringify(packageJson, null, 2)}
      \`\`\`

      - **Dockerfile:**
      \`\`\`dockerfile
      ${dockerfile || "Not found"}
      \`\`\`

      - **GitHub Actions Workflows:**
      \`\`\`json
      ${githubActions}
      \`\`\`

      Please provide your step-by-step security improvement plan below.
    `;
  }
}
