import { signal } from '@preact/signals-react';
import type { Message } from '../types/message';

export const messages = signal<Message[]>([]);
export const pdfFile = signal<File | null>(null);
export const fileUploaded = signal(false);
export const uploadError = signal<string | null>(null);
