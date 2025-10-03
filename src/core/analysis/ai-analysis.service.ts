import "dotenv/config";
import OpenAI from "openai";
import { ParserManager } from "../parsers/parser-manager.service";
import { RedactionService } from "../services/redaction.service";

export class AIAnalysisService {
  private openai: OpenAI | undefined;

  constructor(
    private readonly parserManager: ParserManager,
    private readonly redactionService: RedactionService
  ) {}

  private getOpenAIClient(): OpenAI {
    if (!this.openai) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "OPENAI_API_KEY is not set. Please use the 'Set OpenAI API Key' option to set it."
        );
      }
      this.openai = new OpenAI({ apiKey });
    }
    return this.openai;
  }

  async analyze(projectPath: string): Promise<string> {
    const openai = this.getOpenAIClient();

    const allParsedData = this.parserManager.parseAll(projectPath);
    const {
      packageJson,
      dockerfile,
      githubActions,
      requirementsTxt,
      pomXml,
      gemfile,
      goMod,
    } = allParsedData;

    const detectedLanguages: string[] = [];
    if (packageJson && Object.keys(packageJson).length > 0) {
      detectedLanguages.push("Node.js/TypeScript");
    }
    if (requirementsTxt) {
      detectedLanguages.push("Python");
    }
    if (pomXml) {
      detectedLanguages.push("Java (Maven)");
    }
    if (gemfile) {
      detectedLanguages.push("Ruby");
    }
    if (goMod) {
      detectedLanguages.push("Go");
    }

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
      detectedLanguages,
      packageJson,
      redactedDockerfile,
      redactedGithubActions,
      requirementsTxt,
      pomXml,
      gemfile,
      goMod
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0]?.message?.content || "No analysis available.";
  }

  private buildPrompt(
    detectedLanguages: string[],
    packageJson: any,
    dockerfile: string | undefined,
    githubActions: string,
    requirementsTxt: string | null,
    pomXml: string | null,
    gemfile: string | null,
    goMod: string | null
  ): string {
    const languagePreamble =
      detectedLanguages.length > 0
        ? `The project's primary language(s) appear to be: **${detectedLanguages.join(
            ", "
          )}**. Please tailor your recommendations, especially for SAST, DAST, and dependency scanning, to these languages.`
        : "";

    return `
      Act as a senior security engineer. Analyze the following project information and provide a step-by-step plan to improve its security.
      Format your response in Markdown. For each step, provide a clear title, a description of the recommendation, and, if applicable, a code snippet for implementation.

      ${languagePreamble}

      When providing recommendations, please be as specific as possible:
      - For CI/CD pipeline changes, specify where to add the new job or step. For example, should it run before or after the build and test steps? Can it run in parallel?
      - Consider the project's performance and execution time. Recommend solutions that provide the best security benefit with the minimum performance impact.
      - For Dockerfile changes, indicate exactly where the new lines should be added.
      - For Node.js/TypeScript \`package.json\`, suggest using built-in tools like \`npm audit\` or \`yarn audit\` to scan for vulnerabilities.
      - For Python \`requirements.txt\`, suggest well-regarded tools for vulnerability scanning, such as \`pip-audit\` or \`safety\`.
      - For Java \`pom.xml\`, suggest common dependency scanning tools, such as the \`dependency-check-maven\` plugin.
      - For Ruby \`Gemfile\`, suggest common vulnerability scanning tools, such as \`bundler-audit\`.
      - For Go \`go.mod\`, suggest official tools for vulnerability scanning, such as \`govulncheck\`.

      Project Context:
      - **package.json (Node.js):**
      \`\`\`json
      ${JSON.stringify(packageJson, null, 2)}
      \`\`\`

      - **requirements.txt (Python):**
      \`\`\`
      ${requirementsTxt || "Not found"}
      \`\`\`

      - **pom.xml (Java/Maven):**
      \`\`\`xml
      ${pomXml || "Not found"}
      \`\`\`

      - **Gemfile (Ruby):**
      \`\`\`ruby
      ${gemfile || "Not found"}
      \`\`\`

      - **go.mod (Go):**
      \`\`\`go
      ${goMod || "Not found"}
      \`\`\`

      - **Dockerfile:**
      \`\`\`dockerfile
      ${dockerfile || "Not found"}
      \`\`\`

      - **GitHub Actions Workflows:**
      \`\`\`json
      ${githubActions || "Not found"}
      \`\`\`

      Please provide your step-by-step security improvement plan below.
    `;
  }
}
