import { FileReaderService } from "./file-reader.service";

export class PackageJsonParserService {
  constructor(private readonly fileReaderService: FileReaderService) {}

  parse(packageJsonPath: string): any {
    try {
      const fileContent = this.fileReaderService.readFile(packageJsonPath);
      return JSON.parse(fileContent);
    } catch (error) {
      // It's possible the file doesn't exist
      if (error instanceof Error && error.message.includes("ENOENT")) {
        return {};
      }
      throw error;
    }
  }
}
