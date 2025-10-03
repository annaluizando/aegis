import * as fs from "fs";
import * as path from "path";

export class FileReaderService {
  readFile(filePath: string): string {
    try {
      const absolutePath = path.resolve(filePath);
      return fs.readFileSync(absolutePath, "utf-8");
    } catch (error) {
      console.error(`Error reading file at ${filePath}:`, error);
      throw error;
    }
  }
}
