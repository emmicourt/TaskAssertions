export function IsNullOrWhitespace(inputString: string): boolean {
  if (
    inputString === undefined ||
    inputString === null ||
    inputString.trim().length == 0
  ) {
    return true;
  }

  return false;
}
