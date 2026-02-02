import { signal } from '@preact/signals-react';
import { Show } from "@preact/signals-react/utils";
import { useSignals } from "@preact/signals-react/runtime";
import { useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

// signals
export const pdfFile = signal<File | null>(null);
export const fileUploaded = signal(false);

export default function UploadBox() {
    useSignals();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            pdfFile.value = file;
            fileUploaded.value = true;
            // setMessages([{
            // type: 'system',
            // content: `PDF "${file.name}" uploaded successfully. Ask me anything about this document.`
            // }]);
        }
    };
    
    const removeFile = () => {
        pdfFile.value = null;
        fileUploaded.value = false;
        // setMessages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
            />
            <Upload className="mx-auto mb-2" size={32} />
            <p className="text-sm">Click to upload PDF</p>
        </div>
        <Show when={fileUploaded}>{value =>
            <div className="border rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} />
                <div>
                  <p className="font-medium text-sm">{value ? pdfFile.value?.name : ""}</p>
                  <p className="text-xs text-gray-500">
                    {value ? `${(pdfFile.value!.size / 1024 / 1024).toFixed(2)} MB` : `0 MB`}
                  </p>
                </div>
              </div>
              <button onClick={removeFile} className="p-1">
                <X size={18} />
              </button>
            </div>
          }
          </Show>
      </div>
    );
}