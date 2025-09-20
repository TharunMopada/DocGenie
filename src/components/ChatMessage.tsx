import { Bot, User } from "lucide-react";
import chatRobotImage from "figma:asset/3439e5c174e8ba417a8a55e0fa72d195658a0eb3.png";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatMessage({
  message,
  isUser,
  timestamp,
}: ChatMessageProps) {
  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} mb-6`}
    >
      {/* Robot character for AI messages - moved to left */}
      {!isUser && (
        <div className="flex-shrink-0 w-16 h-16 relative">
          <div className="w-full h-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-cyan-400/30 p-1">
            <img
              src={chatRobotImage}
              alt="AI Assistant"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-cyan-400/10 rounded-xl blur-md"></div>
        </div>
      )}

      {/* Avatar for user messages only */}
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
          <User className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`max-w-xs lg:max-w-md ${isUser ? "text-right" : "text-left"}`}
      >
        {!isUser && (
          <div className="relative mb-3">
            {/* Sci-fi style message bubble for AI */}
            <div className="relative bg-gradient-to-r from-gray-800 to-gray-700 border border-cyan-400/50 rounded-2xl p-4 shadow-lg">
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-3 h-3 bg-cyan-400 rounded-br-lg"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-400 rounded-tl-lg"></div>

              {/* Message content */}
              <p className="text-cyan-100 relative z-10 whitespace-pre-wrap">
                {message}
              </p>

              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-2xl blur-sm -z-10"></div>
            </div>

            {/* Connection line from robot */}
            <div className="absolute -left-8 top-4 w-6 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
          </div>
        )}

        {isUser && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl px-4 py-3 shadow-lg">
            <p>{message}</p>
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-xs text-gray-400 mt-1 ${isUser ? "text-right" : "text-left"}`}
        >
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}