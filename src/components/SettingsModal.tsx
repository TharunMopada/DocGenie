import { useState, useEffect } from 'react'
import { Settings, Eye, EyeOff, Save, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onApiKeySave: (apiKey: string) => void
}

export function SettingsModal({ isOpen, onClose, onApiKeySave }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load existing API key from localStorage
    const savedApiKey = localStorage.getItem('docgenie_api_key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [isOpen])

  const handleSave = async () => {
    if (!apiKey.trim()) return

    setIsSaving(true)
    
    // Simulate save delay
    setTimeout(() => {
      localStorage.setItem('docgenie_api_key', apiKey.trim())
      onApiKeySave(apiKey.trim())
      setIsSaving(false)
      onClose()
    }, 500)
  }

  const handleCancel = () => {
    // Reset to saved value
    const savedApiKey = localStorage.getItem('docgenie_api_key')
    setApiKey(savedApiKey || '')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-800/95 border-cyan-500/30 text-cyan-100">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* API Key Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-cyan-200">
                Google Studio API Key
              </Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter your Google Studio API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-cyan-100 placeholder:text-gray-400 focus:border-cyan-400 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-cyan-300"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                This key enables real-time AI responses for your PDF analysis.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
              <h4 className="text-cyan-300 text-sm font-medium mb-2">How to get your API key:</h4>
              <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                <li>Visit Google AI Studio</li>
                <li>Create or select a project</li>
                <li>Enable the Gemini API</li>
                <li>Generate an API key</li>
                <li>Copy and paste it above</li>
              </ol>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="text-gray-400 hover:text-cyan-300 hover:bg-cyan-400/10"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!apiKey.trim() || isSaving}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-0"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}