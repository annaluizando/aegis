export class RedactionService {
  redact(content: string, keywords: string[]): string {
    let redactedContent = content;
    if (!keywords || keywords.length === 0) {
      return redactedContent;
    }

    for (const keyword of keywords) {
      const regex = new RegExp(this.escapeRegExp(keyword), "gi");
      redactedContent = redactedContent.replace(
        regex,
        `[REDACTED_PROJECT_NAME]`
      );
    }
    return redactedContent;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
