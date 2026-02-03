import ChatBox from '../components/chat/ChatBox';
import UploadBox from '../components/ui/UploadBox';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">PDF RAG Chatbot</h1>
          <p className="text-sm text-gray-600">Upload a PDF and ask questions</p>
        </div>

        {/* Upload Box */}
        <UploadBox />

        {/* Chat */}
        <ChatBox />
      </div>
    </div>
  );
}
