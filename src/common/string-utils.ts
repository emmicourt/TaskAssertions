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

export function parseEnum<E, K extends string>(
  enumDef: { [key in K]: E },
  str: string | undefined
): E | undefined {
  if (str && str in enumDef) {
    return enumDef[str as K] as E;
  }
  return undefined;
}
