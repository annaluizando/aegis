import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import { FileReaderService } from "../utils/file-reader.service";

export interface GithubActionsWorkflow {
  jobs: {
    [jobName: string]: {
      steps: {
        name?: string;
        uses?: string;
        run?: string;
      }[];
    };
  };
}

export class GithubActionsParserService {
  constructor(private readonly fileReaderService: FileReaderService) {}

  parse(projectPath: string): GithubActionsWorkflow[] {
    const workflowsPath = path.join(projectPath, ".github", "workflows");
    const workflowFiles = fs
      .readdirSync(workflowsPath)
      .filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"));

    return workflowFiles.map((file) => {
      const filePath = path.join(workflowsPath, file);
      const fileContent = this.fileReaderService.readFile(filePath);
      return yaml.load(fileContent) as GithubActionsWorkflow;
    });
  }
}
