export function formatJson(jsonString: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, indent);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

export function minifyJson(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

export function validateJson(jsonString: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(jsonString);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    };
  }
}
