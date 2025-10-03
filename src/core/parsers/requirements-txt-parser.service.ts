import { FileReaderService } from "../utils/file-reader.service";

export class RequirementsTxtParserService {
  constructor(private readonly fileReaderService: FileReaderService) {}

  parse(projectPath: string): string | null {
    try {
      const filePath = `${projectPath}/requirements.txt`;
      return this.fileReaderService.readFile(filePath);
    } catch (error) {
      // It's possible the file doesn't exist
      if (error instanceof Error && error.message.includes("ENOENT")) {
        return null;
      }
      throw error;
    }
  }
}
