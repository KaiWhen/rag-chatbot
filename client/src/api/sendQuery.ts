import axios from "axios";
import { requestHandler } from "./requestHandler";
import type { QueryParams, QueryResponse } from "../types/query";

const API_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:8080";

export const sendQuery = requestHandler<QueryParams, QueryResponse> (params => {
    return axios.post<QueryResponse>(`${API_URL}/query`, {
      query: params!.query,
      filename: params!.filename,
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });
});
