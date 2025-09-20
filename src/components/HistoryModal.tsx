import { FileText, Calendar, Download, Eye, X } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { ScrollArea } from './ui/scroll-area'

interface HistoryFile {
  id: string
  name: string
  size: number
  uploadDate: Date
  analysisComplete: boolean
}

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onFileSelect: (file: HistoryFile) => void
}

export function HistoryModal({ isOpen, onClose, onFileSelect }: HistoryModalProps) {
  // Mock history data
  const historyFiles: HistoryFile[] = [
    {
      id: '1',
      name: 'Annual Report 2023.pdf',
      size: 2.4 * 1024 * 1024,
      uploadDate: new Date(2024, 11, 15),
      analysisComplete: true
    },
    {
      id: '2',
      name: 'Product Specifications.pdf',
      size: 1.8 * 1024 * 1024,
      uploadDate: new Date(2024, 11, 12),
      analysisComplete: true
    },
    {
      id: '3',
      name: 'User Manual v2.1.pdf',
      size: 5.6 * 1024 * 1024,
      uploadDate: new Date(2024, 11, 8),
      analysisComplete: true
    },
    {
      id: '4',
      name: 'Research Paper Draft.pdf',
      size: 3.2 * 1024 * 1024,
      uploadDate: new Date(2024, 11, 5),
      analysisComplete: false
    },
    {
      id: '5',
      name: 'Meeting Notes Q4.pdf',
      size: 0.8 * 1024 * 1024,
      uploadDate: new Date(2024, 11, 1),
      analysisComplete: true
    }
  ]

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800/95 border-cyan-500/30 text-cyan-100">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            Document History
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-3">
            {historyFiles.map((file) => (
              <div
                key={file.id}
                className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      file.analysisComplete 
                        ? 'bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/30' 
                        : 'bg-gray-600 border border-gray-500'
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        file.analysisComplete ? 'text-cyan-400' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-cyan-200 truncate">{file.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(file.uploadDate)}
                        </span>
                        <span>{formatFileSize(file.size)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          file.analysisComplete 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {file.analysisComplete ? 'Analyzed' : 'Processing'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
                      onClick={() => {
                        onFileSelect(file)
                        onClose()
                      }}
                      disabled={!file.analysisComplete}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t border-gray-600">
          <p className="text-sm text-gray-400">
            {historyFiles.length} documents in history
          </p>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-cyan-300 hover:bg-cyan-400/10"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}