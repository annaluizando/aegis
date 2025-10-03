import { FileReaderService } from "./utils/file-reader.service";
import { PackageJsonParserService } from "./parsers/package-json-parser.service";
import { DockerfileParserService } from "./parsers/dockerfile-parser.service";
import { GithubActionsParserService } from "./parsers/github-actions-parser.service";
import { ProjectScannerService } from "./services/project-scanner.service";
import { AIAnalysisService } from "./analysis/ai-analysis.service";
import { RedactionService } from "./services/redaction.service";
import { ConfigService } from "./services/config.service";

// instance to be shared
const fileReaderService = new FileReaderService();

// Instantiate and wire up the services
const packageJsonParserService = new PackageJsonParserService(
  fileReaderService
);
const dockerfileParserService = new DockerfileParserService(fileReaderService);
const githubActionsParserService = new GithubActionsParserService(
  fileReaderService
);
const redactionService = new RedactionService();

export const aiAnalysisService = new AIAnalysisService(
  packageJsonParserService,
  dockerfileParserService,
  githubActionsParserService,
  redactionService
);

export const projectScannerService = new ProjectScannerService();
export const configService = new ConfigService();
