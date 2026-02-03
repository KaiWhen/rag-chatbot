import axios from 'axios';
import { requestHandler } from './requestHandler';
import type { IndexStatusParams, IndexStatusResponse } from '../types/index';

const API_URL: string = (import.meta.env.VITE_API_BASE_URL as string) ?? 'http://localhost:8080';

export const indexStatus = requestHandler<IndexStatusParams, IndexStatusResponse>((params) => {
  return axios.post<IndexStatusResponse>(
    `${API_URL}/index-status`,
    {
      filename: params!.filename,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
});
