import * as fs from "fs";
import * as path from "path";

export enum ProjectFileType {
  PackageJson = "package.json",
  Dockerfile = "Dockerfile",
  DockerCompose = "docker-compose.yml",
  GithubActions = ".github/workflows",
  RequirementsTxt = "requirements.txt",
  PomXml = "pom.xml",
  Gemfile = "Gemfile",
  GoMod = "go.mod",
}

export class ProjectScannerService {
  scan(directoryPath: string): ProjectFileType[] {
    const foundFiles: ProjectFileType[] = [];
    try {
      const files = fs.readdirSync(directoryPath);

      if (files.includes("package.json")) {
        foundFiles.push(ProjectFileType.PackageJson);
      }

      if (files.includes("Dockerfile")) {
        foundFiles.push(ProjectFileType.Dockerfile);
      }

      if (files.includes("docker-compose.yml")) {
        foundFiles.push(ProjectFileType.DockerCompose);
      }

      if (files.includes("requirements.txt")) {
        foundFiles.push(ProjectFileType.RequirementsTxt);
      }

      if (files.includes("pom.xml")) {
        foundFiles.push(ProjectFileType.PomXml);
      }

      if (files.includes("Gemfile")) {
        foundFiles.push(ProjectFileType.Gemfile);
      }

      if (files.includes("go.mod")) {
        foundFiles.push(ProjectFileType.GoMod);
      }

      // Check for GitHub Actions
      const githubWorkflowsPath = path.join(
        directoryPath,
        ".github",
        "workflows"
      );
      if (
        fs.existsSync(githubWorkflowsPath) &&
        fs.lstatSync(githubWorkflowsPath).isDirectory()
      ) {
        const workflowFiles = fs.readdirSync(githubWorkflowsPath);
        if (
          workflowFiles.some(
            (file) => file.endsWith(".yml") || file.endsWith(".yaml")
          )
        ) {
          foundFiles.push(ProjectFileType.GithubActions);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${directoryPath}:`, error);
      throw error;
    }

    return foundFiles;
  }
}
