import { useState } from 'react'

interface ErrorState {
  isOpen: boolean
  title: string
  message: string
  error: any
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    isOpen: false,
    title: '',
    message: '',
    error: null
  })

  const showError = (title: string, message: string, error?: any) => {
    // Debug logging
    console.group('🚨 Error Handler Debug')
    console.log('Title:', title)
    console.log('Message:', message)
    console.log('Error (original):', error)
    console.log('Error type:', typeof error)
    console.log('Error instanceof Error:', error instanceof Error)
    if (error) {
      console.log('Error keys:', Object.keys(error))
      console.log('Error own property names:', Object.getOwnPropertyNames(error))
    }
    console.groupEnd()

    setErrorState({
      isOpen: true,
      title,
      message,
      error
    })
  }

  const hideError = () => {
    setErrorState({
      isOpen: false,
      title: '',
      message: '',
      error: null
    })
  }

  // Helper function untuk handle API errors
  const handleApiError = (error: any, customMessage?: string) => {
    let title = 'API Error'
    let message = customMessage || 'Terjadi kesalahan saat menghubungi server'
    let errorDetails = error

    // Parse different types of errors
    if (error?.response) {
      // Axios error with response
      title = `HTTP ${error.response.status} Error`
      message = error.response.data?.message || error.response.data?.error || message
      errorDetails = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method
      }
    } else if (error instanceof Error) {
      // Standard Error object - manually extract properties
      message = error.message
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error as any) // Include any additional properties
      }
      
      // Add cause if it exists (ES2022 feature)
      if ('cause' in error) {
        errorDetails.cause = (error as any).cause
      }
    } else if (error?.message) {
      // Error-like object
      message = error.message
      errorDetails = {
        name: error.name || 'Error',
        message: error.message,
        stack: error.stack,
        ...error // Spread all properties
      }
    } else if (typeof error === 'string') {
      // String error
      message = error
      errorDetails = { 
        type: 'string_error',
        error: error,
        timestamp: new Date().toISOString()
      }
    } else {
      // Unknown error type
      errorDetails = {
        type: 'unknown_error',
        originalError: error,
        errorType: typeof error,
        timestamp: new Date().toISOString()
      }
    }

    showError(title, message, errorDetails)
  }

  // Helper function untuk handle fetch errors
  const handleFetchError = async (response: Response, customMessage?: string) => {
    let title = `HTTP ${response.status} Error`
    let message = customMessage || 'Terjadi kesalahan saat menghubungi server'
    let errorDetails: any = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      type: response.type,
      redirected: response.redirected,
      timestamp: new Date().toISOString()
    }

    try {
      const data = await response.json()
      message = data.message || data.error || message
      errorDetails.responseData = data
    } catch (e) {
      // Response is not JSON
      try {
        const text = await response.text()
        errorDetails.responseText = text
      } catch (textError) {
        errorDetails.parseError = 'Could not read response body'
      }
    }

    showError(title, message, errorDetails)
  }

  return {
    errorState,
    showError,
    hideError,
    handleApiError,
    handleFetchError
  }
}