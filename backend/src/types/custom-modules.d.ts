declare module "pdf-parse" {
  const pdfParse: (data: Buffer) => Promise<{ text: string }>;
  export default pdfParse;
}

declare module "mammoth" {
  export function extractRawText(options: { buffer: Buffer }): Promise<{ value: string }>;
}

declare module "uuid" {
  export function v4(): string;
  export function validate(value: string): boolean;
}
