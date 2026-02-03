export interface UploadPDFParams {
  filename: string;
  file: File;
}

export interface UploadPDFResponse {
  success: boolean;
  error?: string;
}
