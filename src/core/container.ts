import { FileReaderService } from "./utils/file-reader.service";
import { PackageJsonParserService } from "./parsers/package-json-parser.service";
import { DockerfileParserService } from "./parsers/dockerfile-parser.service";
import { GithubActionsParserService } from "./parsers/github-actions-parser.service";
import { RequirementsTxtParserService } from "./parsers/requirements-txt-parser.service";
import { PomXmlParserService } from "./parsers/pom-xml-parser.service";
import { GemfileParserService } from "./parsers/gemfile-parser.service";
import { GoModParserService } from "./parsers/go-mod-parser.service";
import { ParserManager } from "./parsers/parser-manager.service";
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
const requirementsTxtParserService = new RequirementsTxtParserService(
  fileReaderService
);
const pomXmlParserService = new PomXmlParserService(fileReaderService);
const gemfileParserService = new GemfileParserService(fileReaderService);
const goModParserService = new GoModParserService(fileReaderService);
const redactionService = new RedactionService();

const parserManager = new ParserManager(
  packageJsonParserService,
  dockerfileParserService,
  githubActionsParserService,
  requirementsTxtParserService,
  pomXmlParserService,
  gemfileParserService,
  goModParserService
);

export const aiAnalysisService = new AIAnalysisService(
  parserManager,
  redactionService
);

export const projectScannerService = new ProjectScannerService();
export const configService = new ConfigService();
