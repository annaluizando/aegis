import { PackageJsonParserService } from "./package-json-parser.service";
import { DockerfileParserService } from "./dockerfile-parser.service";
import { GithubActionsParserService } from "./github-actions-parser.service";
import { RequirementsTxtParserService } from "./requirements-txt-parser.service";
import { PomXmlParserService } from "./pom-xml-parser.service";
import { GemfileParserService } from "./gemfile-parser.service";
import { GoModParserService } from "./go-mod-parser.service";
import { Dockerfile } from "dockerfile-ast";

export interface ParsedProjectData {
  packageJson: any;
  dockerfile: Dockerfile | null;
  githubActions: any;
  requirementsTxt: string | null;
  pomXml: string | null;
  gemfile: string | null;
  goMod: string | null;
}

export class ParserManager {
  constructor(
    private readonly packageJsonParserService: PackageJsonParserService,
    private readonly dockerfileParserService: DockerfileParserService,
    private readonly githubActionsParserService: GithubActionsParserService,
    private readonly requirementsTxtParserService: RequirementsTxtParserService,
    private readonly pomXmlParserService: PomXmlParserService,
    private readonly gemfileParserService: GemfileParserService,
    private readonly goModParserService: GoModParserService
  ) {}

  parseAll(projectPath: string): ParsedProjectData {
    return {
      packageJson: this.packageJsonParserService.parse(
        `${projectPath}/package.json`
      ),
      dockerfile: this.dockerfileParserService.parse(projectPath),
      githubActions: this.githubActionsParserService.parse(projectPath),
      requirementsTxt: this.requirementsTxtParserService.parse(projectPath),
      pomXml: this.pomXmlParserService.parse(projectPath),
      gemfile: this.gemfileParserService.parse(projectPath),
      goMod: this.goModParserService.parse(projectPath),
    };
  }
}
