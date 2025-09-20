import { MessageSquare, User, History, FileText, LogOut } from 'lucide-react'
import { Button } from './ui/button'

interface HeaderProps {
  isLoggedIn: boolean
  onLogoClick: () => void
  onNewClick: () => void
  onHistoryClick: () => void
  onLoginClick: () => void
  onLogoutClick: () => void
}

export function Header({ 
  isLoggedIn, 
  onLogoClick, 
  onNewClick, 
  onHistoryClick, 
  onLoginClick, 
  onLogoutClick 
}: HeaderProps) {
  return (
    <header className="border-b border-cyan-500/20 bg-gray-900/50 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={onLogoClick}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              DocGenie
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-green-400 hover:text-green-300 hover:bg-green-400/10" 
                  title="New Document"
                  onClick={onNewClick}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">New</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10" 
                  title="History"
                  onClick={onHistoryClick}
                >
                  <History className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">History</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10" 
                  title="Logout"
                  onClick={onLogoutClick}
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10" 
                title="Login"
                onClick={onLoginClick}
              >
                <User className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}