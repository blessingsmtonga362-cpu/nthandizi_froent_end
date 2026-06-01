export const MALAWI_PHONE_PATTERN = /^[89]\d{8}$/;
export const MALAWI_PHONE_ERROR = "Please enter a valid phone number.";

export function toMalawiLocalPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  const withoutCountryCode = digits.startsWith("265") ? digits.slice(3) : digits;
  const withoutLeadingZero = withoutCountryCode.startsWith("0")
    ? withoutCountryCode.slice(1)
    : withoutCountryCode;

  return withoutLeadingZero.slice(0, 9);
}

export function isValidMalawiPhone(value: string): boolean {
  return MALAWI_PHONE_PATTERN.test(toMalawiLocalPhone(value));
}

export function formatMalawiPhone(value?: string | null): string {
  if (!value) return "";
  const local = toMalawiLocalPhone(value);
  return local ? `+265${local}` : "";
}
