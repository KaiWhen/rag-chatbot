import axios from "axios";
import { requestHandler } from "./requestHandler";
import type { UploadPDFParams, UploadPDFResponse } from "../types/pdf";

const API_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:8080";

export const uploadPDFRequest = requestHandler<UploadPDFParams, UploadPDFResponse> (params => {
    const formData = new FormData();
    formData.append("file", params!.file);
    formData.append("filename", params!.filename);

    return axios.post<UploadPDFResponse>(`${API_URL}/upload-pdf`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
});
