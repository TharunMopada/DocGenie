import { useState } from 'react'
import { Upload, FileText, Zap, MessageCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { ImageWithFallback } from './figma/ImageWithFallback'
import homeRobotImage from 'figma:asset/b1caf2360e23f6f2db909a1f446039d94950e825.png'

interface LandingPageProps {
  onFileUpload: (file: File) => void
}

export function LandingPage({ onFileUpload }: LandingPageProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('File size must be less than 10MB')
      return
    }
    onFileUpload(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Smart PDF
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  Analysis & Chat
                </span>
              </h1>
              
              <p className="text-lg text-purple-300 max-w-md">
                An Introduction to the World of Intelligent Machines
              </p>
            </div>

            <Card className="bg-gray-800/50 border-cyan-500/30 backdrop-blur-sm p-6">
              <p className="text-cyan-200">
                Upload your PDF and let our AI assistant analyze it instantly. Ask questions and get 
                intelligent answers about your document content in real-time.
              </p>
            </Card>

            {/* Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-cyan-400 bg-cyan-400/10' 
                  : 'border-gray-600 hover:border-cyan-500/50 hover:bg-gray-800/30'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-cyan-200 mb-2">Drop your PDF here or click to browse</p>
                  <p className="text-sm text-gray-400">Maximum file size: 10MB</p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Choose PDF File
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-gray-800/30 border border-cyan-500/20">
                <Zap className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm text-cyan-200">Instant Analysis</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-800/30 border border-purple-500/20">
                <MessageCircle className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-purple-200">AI Chat</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-800/30 border border-green-500/20">
                <FileText className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-green-200">Smart Insights</p>
              </div>
            </div>
          </div>

          {/* Right side - Robot image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-3xl p-6 backdrop-blur-sm border border-cyan-500/30">
                <img
                  src={homeRobotImage}
                  alt="AI Robot Assistant"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Floating elements around robot */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full animate-bounce opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-pulse opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}