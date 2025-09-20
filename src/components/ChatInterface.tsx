import { useState, useRef, useEffect } from 'react'
import { Send, FileText, ArrowLeft, Download, Share, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ChatMessage } from './ChatMessage'
import { Card } from './ui/card'
import { SettingsModal } from './SettingsModal'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatInterfaceProps {
  file: File
  onBack: () => void
}

export function ChatInterface({ file, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `I've successfully analyzed your PDF "${file.name}". I can now answer questions about its content, summarize key points, or help you extract specific information. What would you like to know?`,
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load API key on component mount
    const savedApiKey = localStorage.getItem('docgenie_api_key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      let responseText = ''
      
      if (apiKey) {
        // Use real API
        responseText = await callGoogleStudioAPI(currentInput)
      } else {
        // Show prompt to set up API key
        responseText = "Please add your Google Studio API key in Settings to enable real-time answers. Click the ⚙️ Settings button in the top-right corner to get started."
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to the AI service. Please check your API key in Settings or try again later.",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    }
    
    setIsLoading(false)
  }

  // Extract text from the uploaded PDF (first N pages for speed)
  const extractPdfText = async (file: File, maxPages = 20): Promise<{ text: string; pages: string[] }> => {
    const [pdfjs, workerSrc] = await Promise.all([
      import('pdfjs-dist'),
      import('pdfjs-dist/build/pdf.worker.min.mjs?url')
    ])
    ;(pdfjs as any).GlobalWorkerOptions.workerSrc = (workerSrc as any).default

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await (pdfjs as any).getDocument({ data: arrayBuffer }).promise

    const pages: string[] = []
    const total = Math.min(pdf.numPages, maxPages)
    for (let i = 1; i <= total; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const strings = content.items.map((it: any) => ('str' in it ? it.str : '') as string)
      const pageText = strings.join(' ').replace(/\s+/g, ' ').trim()
      pages.push(pageText)
    }

    return { text: pages.join('\n\n'), pages }
  }

  // Build a document-grounded prompt for Gemini
  const buildPrompt = (question: string, fileName: string, pages: string[]) => {
    const preview = pages
      .map((p, idx) => `Page ${idx + 1}: ${p.substring(0, 1200)}`) // limit per page
      .join('\n\n')

    return `You are DocQA Assistant. Answer concisely using only the PDF provided. If not found, say "Not found in the document."\n\nDocument: ${fileName}\nContext (excerpts by page):\n${preview}\n\nQuestion: ${question}\n\nRespond with:\n- Short answer (1–2 sentences)\n- 1–2 quoted excerpts with page numbers\n- Confidence (High/Medium/Low with reason)`
  }

  // Call Gemini via Google AI Studio (API key is stored in localStorage)
  const callGoogleStudioAPI = async (userInput: string): Promise<string> => {
    try {
      const key = apiKey?.trim()
      if (!key || key.length < 10) {
        return 'API key missing or invalid. Open Settings and paste a valid Google AI Studio API key.'
      }

      const { pages } = await extractPdfText(file)
      const prompt = buildPrompt(userInput, file.name, pages)

      const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
      const res = await fetch(`${endpoint}?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 800 }
        })
      })

      if (!res.ok) {
        let details = ''
        try {
          const j = await res.json()
          details = j?.error?.message || JSON.stringify(j)
        } catch {
          details = await res.text()
        }

        // Provide concise, actionable error to user (do not expose secrets)
        if (res.status === 401 || res.status === 403) {
          return `Authorization error (${res.status}). Check that your API key is valid and not restricted for http://localhost:3000. Details: ${details}`
        }
        if (res.status === 429) {
          return 'Rate limit exceeded. Please wait a moment and try again.'
        }
        if (res.status === 400) {
          return `Bad request: ${details}`
        }
        return `Service error (${res.status}). ${details}`
      }

      const data = await res.json()
      const output = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('\n') || 'No response.'
      return output
    } catch (e: any) {
      console.error(e)
      return "I'm unable to analyze the PDF right now. Please verify your API key in Settings and try again."
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20">
      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-gray-900/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-cyan-200 truncate max-w-xs">{file.name}</h2>
                  <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                onClick={() => setShowSettings(true)}
                title="Settings"
              >
                <Settings className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="container mx-auto px-6 py-6 flex flex-col h-[calc(100vh-140px)]">
        {/* Analysis Status */}
        <Card className="bg-gray-800/50 border-green-500/30 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-green-300">PDF Analysis Complete - Ready for questions</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10">
                <Download className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10">
                <Share className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="bg-gray-800 border border-cyan-400/50 rounded-2xl px-4 py-3">
                <p className="text-cyan-200">Analyzing your question...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-gray-800/50 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex space-x-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask questions about your PDF..."
              className="flex-1 bg-gray-700/50 border-gray-600 text-cyan-100 placeholder:text-gray-400 focus:border-cyan-400"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick Questions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Summarize this document",
              "What are the key points?",
              "Find important dates",
              "Extract main conclusions"
            ].map((question) => (
              <Button
                key={question}
                variant="ghost"
                size="sm"
                onClick={() => setInputValue(question)}
                className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 border border-cyan-500/30"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onApiKeySave={(key) => setApiKey(key)}
      />
    </div>
  )
}