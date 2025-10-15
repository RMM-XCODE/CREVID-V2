import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Volume2, RefreshCw, Calendar, FileText, Settings, X, Save, Upload } from 'lucide-react'

export function GenerateTTS() {
  const [isGenerating] = useState(false)
  
  // TTS preset configuration
  const [ttsPresets, setTtsPresets] = useState({
    voice: 'Aria',
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0,
    speed: 1,
    timestamps: false,
    previousText: '',
    nextText: '',
    languageCode: ''
  })
  
  // Modal states
  const [showPresetModal, setShowPresetModal] = useState(false)
  const [tempPresets, setTempPresets] = useState(ttsPresets)

  // Mock content data - content yang sudah ada naskah
  const contentList = [
    {
      id: 1,
      title: "Tutorial Lengkap React Hooks untuk Pemula",
      createdAt: "2024-01-15",
      scenes: 5,
      hasAudio: false,
      description: "Belajar React Hooks dari dasar hingga advanced",
      scenesData: [
        {
          id: 1,
          text: "Halo Growers! Tau nggak, 73% Gen Z merasa stuck dalam hidup mereka? Hari ini kita bahas React Hooks yang bisa jadi game changer.",
          duration: "8s"
        },
        {
          id: 2,
          text: "Pernah nggak sih Growers, kita ngerasa kayak React Hooks ini cuma teori doang? Padahal di kehidupan sehari-hari, ini bener-bener relate banget sama yang kita alamin.",
          duration: "12s"
        },
        {
          id: 3,
          text: "Coba deh Growers, refleksi sebentar. Kapan terakhir kali kamu bener-bener nerapin React Hooks dalam hidup? Drop di comment ya!",
          duration: "10s"
        },
        {
          id: 4,
          text: "Nah, ini dia fakta menariknya Growers. Menurut penelitian, React Hooks ternyata punya dampak yang lebih besar dari yang kita kira.",
          duration: "11s"
        },
        {
          id: 5,
          text: "Nah Growers, sekarang kamu udah tau kan gimana React Hooks bisa bikin hidup kamu lebih meaningful? Keep growing, Growers! 🌱",
          duration: "9s"
        }
      ]
    },
    {
      id: 2,
      title: "JavaScript ES6 Features Explained",
      createdAt: "2024-01-14",
      scenes: 4,
      hasAudio: false,
      description: "Penjelasan fitur-fitur terbaru JavaScript ES6",
      scenesData: [
        {
          id: 1,
          text: "Halo Growers! JavaScript ES6 itu game changer banget untuk development modern.",
          duration: "7s"
        },
        {
          id: 2,
          text: "Mari kita explore fitur-fitur keren yang bisa bikin coding kamu lebih efisien.",
          duration: "8s"
        },
        {
          id: 3,
          text: "Dari arrow functions sampai destructuring, semua ada manfaatnya masing-masing.",
          duration: "9s"
        },
        {
          id: 4,
          text: "Keep practicing Growers, dan jangan lupa implement di project kalian! 🚀",
          duration: "7s"
        }
      ]
    }
  ]



  const savePresetSettings = () => {
    setTtsPresets(tempPresets)
    setShowPresetModal(false)
  }

  const openPresetModal = () => {
    setTempPresets(ttsPresets)
    setShowPresetModal(true)
  }

  const loadDefaultTTSPreset = () => {
    const defaultPresets = {
      voice: 'Aria',
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0,
      speed: 1,
      timestamps: false,
      previousText: '',
      nextText: '',
      languageCode: 'id-ID'
    }
    setTempPresets(defaultPresets)
  }



  const handleGenerateContent = (contentId: number) => {
    console.log(`Generating TTS for content ${contentId}`)
    // TODO: Implement TTS generation for entire content
  }

  const handleUploadContent = (contentId: number) => {
    console.log(`Opening upload dialog for content ${contentId}`)
    // TODO: Implement audio upload for content
  }



        {/* TTS Preset Modal */}
        {showPresetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">TTS Presets Configuration</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPresetModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Load Preset Button */}
              <div className="mb-4">
                <Button 
                  onClick={loadDefaultTTSPreset}
                  variant="outline"
                  className="w-full"
                >
                  Load Default TTS Presets
                </Button>
              </div>

              {/* TTS Controls */}
              <div className="space-y-6">
                {/* Voice Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Voice</label>
                  <select 
                    value={tempPresets.voice}
                    onChange={(e) => setTempPresets({...tempPresets, voice: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Aria">Aria</option>
                    <option value="Sari">Sari</option>
                    <option value="Gadis">Gadis</option>
                    <option value="Joko">Joko</option>
                  </select>
                </div>

                {/* Stability Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Stability</label>
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
                    <label className="text-sm font-medium">Similarity Boost</label>
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Style Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Style</label>
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Speed Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Speed</label>
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
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
                    <span className="text-sm font-medium">Timestamps</span>
                  </label>
                </div>

                {/* Previous Text */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Previous Text</label>
                  <Textarea
                    value={tempPresets.previousText}
                    onChange={(e) => setTempPresets({...tempPresets, previousText: e.target.value})}
                    className="min-h-[80px] text-sm"
                    placeholder="Text yang muncul sebelum scene ini..."
                  />
                </div>

                {/* Next Text */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Next Text</label>
                  <Textarea
                    value={tempPresets.nextText}
                    onChange={(e) => setTempPresets({...tempPresets, nextText: e.target.value})}
                    className="min-h-[80px] text-sm"
                    placeholder="Text yang muncul setelah scene ini..."
                  />
                </div>

                {/* Language Code */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Language Code</label>
                  <Input
                    value={tempPresets.languageCode}
                    onChange={(e) => setTempPresets({...tempPresets, languageCode: e.target.value})}
                    placeholder="id-ID"
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPresetModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={savePresetSettings}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        )}

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
                <div className="ml-2 flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                    No Audio
                  </span>
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
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleGenerateContent(content.id)}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Volume2 className="h-4 w-4 mr-1" />
                  )}
                  Generate
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

      {/* Empty State */}
      {contentList.length === 0 && (
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
      {showPresetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">TTS Presets Configuration</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowPresetModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Load Preset Button */}
            <div className="mb-4">
              <Button 
                onClick={loadDefaultTTSPreset}
                variant="outline"
                className="w-full"
              >
                Load Default TTS Presets
              </Button>
            </div>

            {/* TTS Controls */}
            <div className="space-y-6">
              {/* Voice Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Voice</label>
                <select 
                  value={tempPresets.voice}
                  onChange={(e) => setTempPresets({...tempPresets, voice: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Aria">Aria</option>
                  <option value="Sari">Sari</option>
                  <option value="Gadis">Gadis</option>
                  <option value="Joko">Joko</option>
                </select>
              </div>

              {/* Stability Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Stability</label>
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

              {/* Save Button */}
              <div className="flex space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPresetModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={savePresetSettings}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}