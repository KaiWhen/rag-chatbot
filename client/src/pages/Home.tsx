import { useRef, useEffect, useState } from 'react';
import { signal } from '@preact/signals-react';
import { Show } from "@preact/signals-react/utils";
import { useSignals } from "@preact/signals-react/runtime";
import { Send } from 'lucide-react';
import { pdfFile, fileUploaded } from '../components/ui/UploadBox';
import UploadBox from '../components/ui/UploadBox';

// Types
interface Message {
  type: 'user' | 'assistant' | 'system';
  content: string;
}

// Signals
const isProcessing = signal<boolean>(false);

export default function Home() {
  useSignals();
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!input.trim() || !pdfFile.value) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(messages => [...messages, { type: 'user', content: userMessage }]);
    isProcessing.value = true;

    // placeholder
    setTimeout(() => {
      setMessages(messages => [...messages, {
        type: 'assistant',
        content: `Here's the obligatory lorem ipsum placeholder:
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Ab dolorem quisquam, cum aut voluptatum, praesentium corrupti maxime
          velit accusantium cumque voluptatibus, illum numquam? Voluptatum
          perspiciatis sit fugiat dolorem laborum at!
        `
      }]);
      isProcessing.value = false;
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">PDF Chatbot</h1>
          <p className="text-sm text-gray-600">Upload a PDF and ask questions</p>
        </div>

        {/* Upload Box */}
        <UploadBox />

        {/* Chat */}
        <Show when={fileUploaded}>
          <>
            <div className="border rounded-lg h-96 overflow-y-auto p-4 mb-4">
              {messages.length === 0 ? (
                <p className="text-center text-gray-400 text-sm">Ask your first question...</p>
              ) : (
                messages.map((msg: Message, idx: number) => (
                  <div
                    key={idx}
                    className={`mb-3 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : msg.type === 'system'
                          ? 'bg-gray-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <Show when={isProcessing}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </Show>
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onInput={e => setInput(e.currentTarget.value)}
                placeholder="Ask a question..."
                disabled={isProcessing.value}
                className="flex-1 border rounded-lg px-4 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isProcessing.value}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Send size={16} />
                Send
              </button>
            </form>
          </>
        </Show>
      </div>
    </div>
  );
}