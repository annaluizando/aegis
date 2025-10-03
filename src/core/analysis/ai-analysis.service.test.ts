import { AIAnalysisService } from "./ai-analysis.service";
import { PackageJsonParserService } from "../services/package-json-parser.service";
import { DockerfileParserService } from "../services/dockerfile-parser.service";
import { GithubActionsParserService } from "../services/github-actions-parser.service";
import { RedactionService } from "../services/redaction.service";
import OpenAI from "openai";

jest.mock("openai", () => {
  const mockChat = {
    completions: {
      create: jest.fn(),
    },
  };
  return jest.fn().mockImplementation(() => ({
    chat: mockChat,
  }));
});

describe("AIAnalysisService", () => {
  let packageJsonParser: PackageJsonParserService;
  let dockerfileParser: DockerfileParserService;
  let githubActionsParser: GithubActionsParserService;
  let redactionService: RedactionService;
  let aiAnalysisService: AIAnalysisService;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    // Mock parser services
    packageJsonParser = {
      parse: jest.fn(),
    } as any;
    dockerfileParser = { parse: jest.fn() } as any;
    githubActionsParser = { parse: jest.fn() } as any;
    redactionService = {
      redact: jest.fn((content) => content), // Return original content by default
    } as any;

    aiAnalysisService = new AIAnalysisService(
      packageJsonParser,
      dockerfileParser,
      githubActionsParser,
      redactionService
    );

    const mockOpenAIInstance = new OpenAI();
    mockCreate = mockOpenAIInstance.chat.completions.create as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should build a prompt correctly when no GitHub workflows are found", async () => {
    (packageJsonParser.parse as jest.Mock).mockReturnValue({
      dependencies: { express: "4.17.1" },
    });
    (dockerfileParser.parse as jest.Mock).mockReturnValue("FROM node:14");
    (githubActionsParser.parse as jest.Mock).mockReturnValue([]);
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: "AI response" } }],
    });

    await aiAnalysisService.analyze("/fake/path");

    expect(mockCreate).toHaveBeenCalled();
    const prompt = mockCreate.mock.calls[0][0].messages[0].content;
    expect(prompt).toContain("GitHub Actions Workflows");
    expect(prompt).toContain("[]");
    expect(prompt).toContain("FROM node:14");
    expect(prompt).toContain("express");
  });

  it("should redact the project name from the prompt", async () => {
    const projectName = "my-secret-project";
    (packageJsonParser.parse as jest.Mock).mockReturnValue({
      name: projectName,
    });
    (dockerfileParser.parse as jest.Mock).mockReturnValue(
      `FROM ${projectName}:latest`
    );
    (githubActionsParser.parse as jest.Mock).mockReturnValue([]);

    // Make the mock behave like the real implementation for this test
    (redactionService.redact as jest.Mock).mockImplementation(
      (content: string, keywords: string[]) => {
        if (keywords.includes(projectName)) {
          return content.replace(new RegExp(projectName, "g"), "[REDACTED]");
        }
        return content;
      }
    );

    mockCreate.mockResolvedValue({
      choices: [{ message: { content: "AI response" } }],
    });

    await aiAnalysisService.analyze("/fake/path");

    expect(redactionService.redact).toHaveBeenCalled();
    const prompt = mockCreate.mock.calls[0][0].messages[0].content;
    expect(prompt).not.toContain(projectName);
    expect(prompt).toContain("[REDACTED]");
  });

  it("should return the AI's response", async () => {
    (packageJsonParser.parse as jest.Mock).mockReturnValue({});
    (dockerfileParser.parse as jest.Mock).mockReturnValue(null);
    (githubActionsParser.parse as jest.Mock).mockReturnValue([]);
    const expectedResponse = "This is a test AI response.";
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: expectedResponse } }],
    });

    const result = await aiAnalysisService.analyze("/fake/path");
    expect(result).toBe(expectedResponse);
  });
});
