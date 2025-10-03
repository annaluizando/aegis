import "dotenv/config";
import { AIAnalysisService } from "./ai-analysis.service";

// This test will only run if an OpenAI API key is available
describe("AIAnalysisService Integration Test", () => {
  // Use a conditional to skip the test if the API key is not present
  const itif = (condition: any) => (condition ? it : it.skip);

  itif(process.env.OPENAI_API_KEY)(
    "should get a valid response from the OpenAI API",
    async () => {
      // We still mock the parsers to isolate the test to the AI interaction
      const packageJsonParser = {
        parseDependencies: jest.fn().mockReturnValue({
          dependencies: {
            react: "18.2.0",
          },
        }),
      } as any;
      const dockerfileParser = {
        parse: jest.fn().mockReturnValue("FROM node:18-alpine"),
      } as any;
      const githubActionsParser = {
        parse: jest.fn().mockReturnValue([]),
      } as any;
      const redactionService = {
        redact: jest.fn((content) => content),
      } as any;

      const aiAnalysisService = new AIAnalysisService(
        packageJsonParser,
        dockerfileParser,
        githubActionsParser,
        redactionService
      );

      const result = await aiAnalysisService.analyze("/fake/path");

      // We can't test for an exact response, but we can check for a non-empty string
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result).not.toBe("No analysis available.");
    },
    20000 // Increase the timeout for this test to 20 seconds
  );
});
