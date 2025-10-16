import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Copy, Check, X } from 'lucide-react'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  error?: any
}

export function ErrorModal({ isOpen, onClose, title = "Error", message, error }: ErrorModalProps) {
  const [copied, setCopied] = useState(false)

  // Enhanced error serialization
  const getErrorDetails = (error: any): string | null => {
    if (!error) return null

    try {
      // If it's an Error object, manually extract properties
      if (error instanceof Error) {
        const errorObj: any = {
          name: error.name,
          message: error.message,
          stack: error.stack,
          // Include any additional enumerable properties
          ...Object.getOwnPropertyNames(error).reduce((acc, key) => {
            if (!['name', 'message', 'stack'].includes(key)) {
              acc[key] = (error as any)[key]
            }
            return acc
          }, {} as any)
        }
        
        // Add cause if it exists (ES2022 feature)
        if ('cause' in error) {
          errorObj.cause = (error as any).cause
        }
        
        return JSON.stringify(errorObj, null, 2)
      }

      // For regular objects, use JSON.stringify with replacer
      return JSON.stringify(error, (_key, value) => {
        // Handle circular references and functions
        if (typeof value === 'function') {
          return '[Function]'
        }
        if (typeof value === 'undefined') {
          return '[Undefined]'
        }
        return value
      }, 2)
    } catch (e) {
      // Fallback for circular references or other issues
      return `Error serializing: ${String(error)}\n\nOriginal error: ${e}`
    }
  }

  const errorDetails = getErrorDetails(error)

  const handleCopyToClipboard = async () => {
    if (errorDetails) {
      try {
        await navigator.clipboard.writeText(errorDetails)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy to clipboard:', err)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </DialogTitle>
          {message && (
            <DialogDescription className="text-gray-700">
              {message}
            </DialogDescription>
          )}
        </DialogHeader>

        {errorDetails && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">Error Details:</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex-1 overflow-auto bg-gray-50 border rounded-md p-3">
              <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                {errorDetails}
              </pre>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}