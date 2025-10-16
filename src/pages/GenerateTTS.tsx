import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ErrorModal } from '@/components/ui/error-modal'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { Volume2, RefreshCw, Calendar, FileText, Settings, Upload, Link, ExternalLink, Copy } from 'lucide-react'

export function GenerateTTS() {
  // TTS preset configuration
  const [ttsPresets, setTtsPresets] = useState({
    voice: 'Aria',
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0,
    speed: 1,
    timestamps: false,
    languageCode: ''
  })
  
  // Modal states
  const [showPresetModal, setShowPresetModal] = useState(false)
  const [tempPresets, setTempPresets] = useState(ttsPresets)

  // State untuk data dari backend
  const [contentList, setContentList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const { errorState, showError, hideError, handleFetchError } = useErrorHandler()

  // Fetch content dari backend
  useEffect(() => {
    fetchContentList()
  }, [])

  const fetchContentList = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/content')
      
      if (!response.ok) {
        await handleFetchError(response, 'Gagal mengambil daftar content')
        return
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Tampilkan semua content, biarkan user pilih mana yang ingin di-generate TTS
        const contents = data.data || []
        setContentList(contents)
      } else {
        showError('Content Error', 'Gagal mengambil daftar content', data)
      }
    } catch (error) {
      showError('Network Error', 'Gagal terhubung ke server', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateTTS = async (content: any) => {
    // Validasi script
    if (!content.script || content.script.trim().length === 0) {
      showError('Validation Error', 'Content ini belum memiliki script. Silakan generate content terlebih dahulu.', { content_id: content.id })
      return
    }

    try {
      setIsGenerating(true)
      
      const response = await fetch('http://localhost:3001/api/tts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_id: content.id,
          script: content.script,
          voice_settings: ttsPresets
        })
      })

      if (!response.ok) {
        await handleFetchError(response, 'Gagal generate TTS')
        setIsGenerating(false)
        return
      }

      const data = await response.json()
      
      if (data.success) {
        // Poll job status
        pollJobStatus(data.data.job_id)
      } else {
        showError('Generate Error', 'Gagal generate TTS', data)
        setIsGenerating(false)
      }
    } catch (error) {
      showError('Network Error', 'Gagal terhubung ke server. Pastikan backend sudah running dan API keys sudah dikonfigurasi.', error)
      setIsGenerating(false)
    }
  }

  const pollJobStatus = async (jobId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/jobs/${jobId}`)
      
      if (!response.ok) {
        await handleFetchError(response, 'Gagal mengecek status job')
        setIsGenerating(false)
        return
      }
      
      const data = await response.json()
      
      if (data.success) {
        const job = data.data
        
        if (job.status === 'completed') {
          setIsGenerating(false)
          // Refresh content list
          fetchContentList()
        } else if (job.status === 'failed') {
          showError('Job Failed', job.error_message || 'Job processing failed', job)
          setIsGenerating(false)
        } else {
          // Continue polling
          setTimeout(() => pollJobStatus(jobId), 2000)
        }
      } else {
        showError('Job Status Error', 'Gagal mengecek status job', data)
        setIsGenerating(false)
      }
    } catch (error) {
      showError('Network Error', 'Gagal terhubung ke server saat mengecek status job', error)
      setIsGenerating(false)
    }
  }





  const openPresetModal = () => {
    setTempPresets(ttsPresets)
    setShowPresetModal(true)
  }



  const handleGenerateContent = (content: any) => {
    handleGenerateTTS(content)
  }

  const handleUploadContent = (contentId: string) => {
    console.log(`Opening upload dialog for content ${contentId}`)
    // TODO: Implement audio upload for content
  }





  // Main view: Content List with Presets
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Generate TTS</h1>
            <p className="text-muted-foreground">
              Generate audio untuk seluruh naskah konten
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={openPresetModal}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Presets</span>
          </Button>
        </div>
      </div>

      {/* Content List */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-muted-foreground mt-2">Memuat konten...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentList.map((content) => (
            <Card 
              key={content.id} 
              className="hover:shadow-md transition-shadow"
            >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{content.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {content.description}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0 space-y-1">
                  {content.script && content.script.trim().length > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Script Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      No Script
                    </span>
                  )}
                  {content.hasAudio ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Audio Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      No Audio
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(content.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{content.scenes} scenes</span>
                  </div>
                </div>
              </div>
              
              {/* GoFile Links (if audio exists) */}
              {content.hasAudio && content.goFileFolder && (
                <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Link className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Audio Files</span>
                  </div>
                  <div className="space-y-2">
                    {content.audioFiles?.map((audio: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-green-700">{audio.fileName} ({audio.duration})</span>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => window.open(audio.goFileUrl, '_blank')}
                            className="h-6 px-2"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => navigator.clipboard.writeText(audio.goFileUrl)}
                            className="h-6 px-2"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(content.goFileFolder.folderUrl, '_blank')}
                      className="w-full mt-2"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open GoFile Folder
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleGenerateContent(content)}
                  disabled={isGenerating || content.hasAudio || !content.script || content.script.trim().length === 0}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Volume2 className="h-4 w-4 mr-1" />
                  )}
                  {content.hasAudio ? 'Generated' : 
                   (!content.script || content.script.trim().length === 0) ? 'No Script' : 'Generate'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleUploadContent(content.id)}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
            </CardContent>
          </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && contentList.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Volume2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Tidak ada konten yang perlu audio</h3>
            <p className="text-muted-foreground">
              Semua konten sudah memiliki audio atau belum ada konten yang dibuat.
            </p>
          </CardContent>
        </Card>
      )}
      </div>

      {/* TTS Preset Modal */}
      <Dialog open={showPresetModal} onOpenChange={setShowPresetModal}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              TTS Presets Configuration
            </DialogTitle>
            <DialogDescription>
              Konfigurasi preset untuk generate audio/TTS yang konsisten
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Load Preset Button */}
            <div className="flex justify-center">
              <Button 
                onClick={() => {
                  setTempPresets({
                    voice: 'Aria',
                    stability: 0.5,
                    similarityBoost: 0.75,
                    style: 0,
                    speed: 1,
                    timestamps: true,
                    languageCode: 'id-ID'
                  })
                }}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Load Default TTS Presets
              </Button>
            </div>

            {/* TTS Form Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Voice Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Voice</Label>
                <select 
                  value={tempPresets.voice}
                  onChange={(e) => setTempPresets({...tempPresets, voice: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Aria">Aria (Professional Female)</option>
                  <option value="Sari">Sari (Friendly Female)</option>
                  <option value="Gadis">Gadis (Young Female)</option>
                  <option value="Joko">Joko (Professional Male)</option>
                </select>
              </div>

              {/* Language Code */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Language Code</Label>
                <Input
                  value={tempPresets.languageCode}
                  onChange={(e) => setTempPresets({...tempPresets, languageCode: e.target.value})}
                  placeholder="id-ID"
                  className="text-sm"
                />
              </div>

              {/* Stability Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Stability</Label>
                  <Input 
                    type="number" 
                    value={tempPresets.stability}
                    onChange={(e) => setTempPresets({...tempPresets, stability: parseFloat(e.target.value)})}
                    className="w-20 h-8 text-sm"
                    min="0" 
                    max="1" 
                    step="0.01"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={tempPresets.stability}
                  onChange={(e) => setTempPresets({...tempPresets, stability: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${tempPresets.stability * 100}%, #e5e7eb ${tempPresets.stability * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>

              {/* Similarity Boost Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Similarity Boost</Label>
                  <Input 
                    type="number" 
                    value={tempPresets.similarityBoost}
                    onChange={(e) => setTempPresets({...tempPresets, similarityBoost: parseFloat(e.target.value)})}
                    className="w-20 h-8 text-sm"
                    min="0" 
                    max="1" 
                    step="0.01"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={tempPresets.similarityBoost}
                  onChange={(e) => setTempPresets({...tempPresets, similarityBoost: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${tempPresets.similarityBoost * 100}%, #e5e7eb ${tempPresets.similarityBoost * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>

              {/* Style Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Style</Label>
                  <Input 
                    type="number" 
                    value={tempPresets.style}
                    onChange={(e) => setTempPresets({...tempPresets, style: parseFloat(e.target.value)})}
                    className="w-20 h-8 text-sm"
                    min="0" 
                    max="1" 
                    step="0.01"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={tempPresets.style}
                  onChange={(e) => setTempPresets({...tempPresets, style: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${tempPresets.style * 100}%, #e5e7eb ${tempPresets.style * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>

              {/* Speed Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Speed</Label>
                  <Input 
                    type="number" 
                    value={tempPresets.speed}
                    onChange={(e) => setTempPresets({...tempPresets, speed: parseFloat(e.target.value)})}
                    className="w-20 h-8 text-sm"
                    min="0.25" 
                    max="4" 
                    step="0.01"
                  />
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="4"
                  step="0.01"
                  value={tempPresets.speed}
                  onChange={(e) => setTempPresets({...tempPresets, speed: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((tempPresets.speed - 0.25) / 3.75) * 100}%, #e5e7eb ${((tempPresets.speed - 0.25) / 3.75) * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>
            </div>

            {/* Timestamps Checkbox */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={tempPresets.timestamps}
                  onChange={(e) => setTempPresets({...tempPresets, timestamps: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm font-medium">Enable Timestamps</span>
              </label>
            </div>



            {/* Parameter Guidelines */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">TTS Parameter Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <p><strong>Voice:</strong> Pilih voice model sesuai karakter konten</p>
                  <p><strong>Stability:</strong> 0.0-1.0 (0.5 recommended untuk balanced)</p>
                  <p><strong>Similarity Boost:</strong> 0.0-1.0 (0.75 recommended)</p>
                  <p><strong>Style:</strong> 0-1 (0 = natural, 1 = expressive)</p>
                  <p><strong>Speed:</strong> 0.25-4.0 (1.0 = normal speed)</p>
                  <p><strong>Language:</strong> id-ID untuk Bahasa Indonesia</p>
                  <p><strong>Timestamps:</strong> Enable untuk editing yang lebih presisi</p>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button 
                onClick={() => {
                  setTtsPresets(tempPresets)
                  console.log('Saving TTS presets:', tempPresets)
                  setShowPresetModal(false)
                }}
                className="w-full sm:w-auto"
              >
                Simpan Konfigurasi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorState.isOpen}
        onClose={hideError}
        title={errorState.title}
        message={errorState.message}
        error={errorState.error}
      />
    </div>
  )
}