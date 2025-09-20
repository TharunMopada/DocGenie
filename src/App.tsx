import { useState } from 'react'
import { Header } from './components/Header'
import { LandingPage } from './components/LandingPage'
import { ChatInterface } from './components/ChatInterface'
import { LoginPage } from './components/LoginPage'
import { SignupPage } from './components/SignupPage'
import { HistoryModal } from './components/HistoryModal'

type Page = 'landing' | 'login' | 'signup' | 'chat'

interface HistoryFile {
  id: string
  name: string
  size: number
  uploadDate: Date
  analysisComplete: boolean
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setCurrentPage('chat')
  }

  const handleLogin = (email: string, password: string) => {
    // Mock login - in real app, this would validate credentials
    setUser({ name: email.split('@')[0], email })
    setIsLoggedIn(true)
    setCurrentPage('landing')
  }

  const handleSignup = (fullName: string, email: string, password: string) => {
    // Mock signup - in real app, this would create account
    setUser({ name: fullName, email })
    setIsLoggedIn(true)
    setCurrentPage('landing')
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setUploadedFile(null)
    setCurrentPage('login')
  }

  const handleLogoClick = () => {
    if (isLoggedIn) {
      setCurrentPage('landing')
      setUploadedFile(null)
    } else {
      setCurrentPage('landing')
    }
  }

  const handleNewClick = () => {
    setUploadedFile(null)
    setCurrentPage('landing')
  }

  const handleHistoryFileSelect = (file: HistoryFile) => {
    // Mock file object for history file
    const mockFile = new File([''], file.name, { type: 'application/pdf' })
    Object.defineProperty(mockFile, 'size', { value: file.size })
    setUploadedFile(mockFile)
    setCurrentPage('chat')
  }

  const handleBackToLanding = () => {
    setUploadedFile(null)
    setCurrentPage('landing')
  }

  // Redirect to login if not logged in and not on auth pages
  if (!isLoggedIn && currentPage !== 'login' && currentPage !== 'signup') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header 
          isLoggedIn={false}
          onLogoClick={handleLogoClick}
          onNewClick={handleNewClick}
          onHistoryClick={() => setShowHistory(true)}
          onLoginClick={() => setCurrentPage('login')}
          onLogoutClick={handleLogout}
        />
        <LoginPage 
          onLogin={handleLogin}
          onSignupClick={() => setCurrentPage('signup')}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {currentPage !== 'login' && currentPage !== 'signup' && (
        <Header 
          isLoggedIn={isLoggedIn}
          onLogoClick={handleLogoClick}
          onNewClick={handleNewClick}
          onHistoryClick={() => setShowHistory(true)}
          onLoginClick={() => setCurrentPage('login')}
          onLogoutClick={handleLogout}
        />
      )}
      
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin}
          onSignupClick={() => setCurrentPage('signup')}
        />
      )}

      {currentPage === 'signup' && (
        <SignupPage 
          onSignup={handleSignup}
          onLoginClick={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'landing' && (
        <LandingPage onFileUpload={handleFileUpload} />
      )}

      {currentPage === 'chat' && uploadedFile && (
        <ChatInterface 
          file={uploadedFile} 
          onBack={handleBackToLanding}
        />
      )}

      {/* History Modal */}
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onFileSelect={handleHistoryFileSelect}
      />
    </div>
  )
}