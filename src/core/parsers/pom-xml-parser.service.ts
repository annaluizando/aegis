import { FileReaderService } from "../utils/file-reader.service";

export class PomXmlParserService {
  constructor(private readonly fileReaderService: FileReaderService) {}

  parse(projectPath: string): string | null {
    try {
      const filePath = `${projectPath}/pom.xml`;
      return this.fileReaderService.readFile(filePath);
    } catch (error) {
      if (error instanceof Error && error.message.includes("ENOENT")) {
        return null;
      }
      throw error;
    }
  }
}
