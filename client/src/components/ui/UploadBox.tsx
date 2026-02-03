import { signal } from '@preact/signals-react';
import { Show } from '@preact/signals-react/utils';
import { useSignals } from '@preact/signals-react/runtime';
import { useRef } from 'react';
import { Upload, FileText, X, LoaderCircle } from 'lucide-react';
import { uploadPDFRequest } from '../../api/uploadPDF';
import { indexStatus } from '../../api/indexStatus';
import { pdfFile, fileUploaded, uploadError, messages } from '../../signals';

// Signals
const isUploading = signal<boolean>(false);
const uploadText = signal<string>('Click to upload PDF');

export default function UploadBox() {
  useSignals();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      fileUploaded.value = false;
      isUploading.value = true;
      uploadError.value = null;
      uploadText.value = 'Processing PDF...';

      const result = await uploadPDFRequest({ file, filename: file.name });

      if (result.code === 'success') {
        pdfFile.value = file;
      } else uploadError.value = 'Failed to upload PDF. Please try again.';

      uploadText.value = 'Creating search index...';
      await waitForIndex(file.name);

      isUploading.value = false;
      fileUploaded.value = true;
      uploadText.value = 'Click to upload PDF';

      messages.value = [
        {
          type: 'system',
          content: `PDF "${file.name}" uploaded successfully. Ask me anything about this document.`,
        },
      ];
    }
  };

  const removeFile = () => {
    pdfFile.value = null;
    fileUploaded.value = false;
    messages.value = [];
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const waitForIndex = (filename: string) => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(async () => {
        const res = await indexStatus({ filename });
        if (res.code === 'success' && res.data) {
          if (res.data.ready) {
            clearInterval(interval);
            resolve();
          }
        }
      }, 1000);
    });
  };

  return (
    <div>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isUploading.value}
        />
        {!isUploading.value && <Upload className="mx-auto mb-2" size={32} />}
        <div className="flex flex-row justify-center items-center">
          <p className="text-sm">{uploadText.value}</p>
          {isUploading.value && <LoaderCircle className="animate-spin ml-2" size={16} />}
        </div>
      </div>
      <Show when={fileUploaded}>
        {(value) => (
          <div className="border rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={20} />
              <div>
                <p className="font-medium text-sm">{value ? pdfFile.value?.name : ''}</p>
                <p className="text-xs text-gray-500">
                  {value ? `${(pdfFile.value!.size / 1024 / 1024).toFixed(2)} MB` : `0 MB`}
                </p>
              </div>
            </div>
            <button onClick={removeFile} className="p-1">
              <X size={18} />
            </button>
          </div>
        )}
      </Show>
    </div>
  );
}
