import { FileReaderService } from "../utils/file-reader.service";
import { Dockerfile, DockerfileParser } from "dockerfile-ast";

export class DockerfileParserService {
  constructor(private readonly fileReaderService: FileReaderService) {}

  parse(projectPath: string): Dockerfile | null {
    try {
      const dockerfilePath = `${projectPath}/Dockerfile`;
      const dockerfileContent = this.fileReaderService.readFile(dockerfilePath);
      return DockerfileParser.parse(dockerfileContent);
    } catch (error) {
      // Dockerfile might not exist, which is a valid scenario
      if (error instanceof Error && error.message.includes("ENOENT")) {
        return null;
      }
      throw error;
    }
  }
}
