import { FileReaderService } from "./file-reader.service";
import { PackageJsonParserService } from "./package-json-parser.service";
import { DockerfileParserService } from "./dockerfile-parser.service";
import { GithubActionsParserService } from "./github-actions-parser.service";
import { ProjectScannerService } from "./project-scanner.service";
import { AIAnalysisService } from "../analysis/ai-analysis.service";
import { RedactionService } from "./redaction.service";
import { ConfigService } from "./config.service";

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
