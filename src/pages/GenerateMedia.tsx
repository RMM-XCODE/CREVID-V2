import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Image, Video, Wand2, Download, RefreshCw, Copy, ArrowLeft, Calendar, FileText, Settings, X, Save, Upload, MessageSquare, Clipboard } from 'lucide-react'

export function GenerateMedia() {
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [selectedScenes, setSelectedScenes] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMedia, setGeneratedMedia] = useState<any>(null)
  
  // Media preset configuration
  const [mediaPresetConfig, setMediaPresetConfig] = useState('')
  
  // Modal states
  const [showPresetModal, setShowPresetModal] = useState(false)
  const [tempGambarPreset, setTempGambarPreset] = useState('')
  const [tempVideoPreset, setTempVideoPreset] = useState('')
  const [activeTab, setActiveTab] = useState<'gambar' | 'video'>('gambar')
  
  // Prompt modal states
  const [showPromptModal, setShowPromptModal] = useState(false)
  const [selectedScene, setSelectedScene] = useState<any>(null)
  const [promptTab, setPromptTab] = useState<'gambar' | 'video'>('gambar')

  // Mock content data - content yang belum ada medianya
  const contentList = [
    {
      id: 1,
      title: "Tutorial Lengkap React Hooks untuk Pemula",
      createdAt: "2024-01-15",
      scenes: 5,
      hasMedia: false,
      description: "Belajar React Hooks dari dasar hingga advanced",
      scenesData: [
        {
          id: 1,
          text: "Halo Growers! Tau nggak, 73% Gen Z merasa stuck dalam hidup mereka? Hari ini kita bahas React Hooks yang bisa jadi game changer.",
          mediaPrompt: "RUANG TUMBUH host speaking directly to camera, santai dan hangat expression, engaging Gen Z style setup with warm lighting"
        },
        {
          id: 2,
          text: "Pernah nggak sih Growers, kita ngerasa kayak React Hooks ini cuma teori doang? Padahal di kehidupan sehari-hari, ini bener-bener relate banget sama yang kita alamin.",
          mediaPrompt: "Talking Head + Visual Support showing relatable daily life scenarios, santai storytelling style, visual metaphors for Gen Z"
        },
        {
          id: 3,
          text: "Coba deh Growers, refleksi sebentar. Kapan terakhir kali kamu bener-bener nerapin React Hooks dalam hidup? Drop di comment ya!",
          mediaPrompt: "Interactive moment with audience, santai engagement style, encouraging participation from Gen Z"
        },
        {
          id: 4,
          text: "Nah, ini dia fakta menariknya Growers. Menurut penelitian, React Hooks ternyata punya dampak yang lebih besar dari yang kita kira.",
          mediaPrompt: "Talking Head + Visual Support presenting facts and insights, educational style, visual data presentation for Gen Z"
        },
        {
          id: 5,
          text: "Nah Growers, sekarang kamu udah tau kan gimana React Hooks bisa bikin hidup kamu lebih meaningful? Keep growing, Growers! 🌱",
          mediaPrompt: "Talking Head + Visual Support closing with actionable takeaways, motivational style, inspiring Gen Z to take action"
        }
      ]
    },
    {
      id: 2,
      title: "JavaScript ES6 Features Explained",
      createdAt: "2024-01-14",
      scenes: 4,
      hasMedia: false,
      description: "Penjelasan fitur-fitur terbaru JavaScript ES6",
      scenesData: [
        {
          id: 1,
          text: "Halo Growers! JavaScript ES6 itu game changer banget untuk development modern.",
          mediaPrompt: "RUANG TUMBUH host explaining JavaScript concepts, coding environment background"
        },
        {
          id: 2,
          text: "Mari kita explore fitur-fitur keren yang bisa bikin coding kamu lebih efisien.",
          mediaPrompt: "Screen recording showing ES6 features, clean code examples"
        },
        {
          id: 3,
          text: "Dari arrow functions sampai destructuring, semua ada manfaatnya masing-masing.",
          mediaPrompt: "Code comparison showing before and after ES6, visual explanations"
        },
        {
          id: 4,
          text: "Keep practicing Growers, dan jangan lupa implement di project kalian! 🚀",
          mediaPrompt: "Motivational closing with project examples, encouraging implementation"
        }
      ]
    },
    {
      id: 3,
      title: "CSS Grid Layout Masterclass",
      createdAt: "2024-01-13",
      scenes: 6,
      hasMedia: false,
      description: "Panduan lengkap CSS Grid untuk layout modern",
      scenesData: [
        {
          id: 1,
          text: "Halo Growers! CSS Grid itu solusi layout yang kita tunggu-tunggu.",
          mediaPrompt: "RUANG TUMBUH host with CSS Grid examples on screen"
        },
        {
          id: 2,
          text: "Dari basic grid sampai complex layouts, semuanya jadi lebih mudah.",
          mediaPrompt: "Live coding CSS Grid, step by step tutorial"
        },
        {
          id: 3,
          text: "Mari kita lihat bagaimana Grid bisa solve masalah layout yang rumit.",
          mediaPrompt: "Before and after comparison, complex layout examples"
        },
        {
          id: 4,
          text: "Responsive design jadi lebih powerful dengan Grid properties.",
          mediaPrompt: "Responsive grid demonstration, mobile to desktop"
        },
        {
          id: 5,
          text: "Tips dan tricks untuk optimize Grid performance di production.",
          mediaPrompt: "Performance tips visualization, best practices"
        },
        {
          id: 6,
          text: "Sekarang saatnya practice dan bikin layout impian kalian! 💪",
          mediaPrompt: "Inspiring closing with portfolio examples, call to action"
        }
      ]
    }
  ]

  const handleGenerateMedia = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setGeneratedMedia({
        images: [
          {
            sceneId: 1,
            url: "/api/placeholder/800/450",
            prompt: "Professional YouTuber in modern home office setup, speaking to camera with React logo and coding setup in background, warm lighting, high quality",
            style: "Photorealistic"
          },
          {
            sceneId: 2,
            url: "/api/placeholder/800/450",
            prompt: "Clean animated diagram showing React Hooks concept, with before/after comparison of class vs functional components, modern UI design",
            style: "Illustration"
          }
        ],
        videos: [
          {
            sceneId: 3,
            url: "/api/placeholder/800/450",
            prompt: "Screen recording of VS Code showing useState hook implementation, clean code editor with syntax highlighting, smooth transitions",
            duration: "15s",
            style: "Screen Recording"
          }
        ]
      })
      setIsGenerating(false)
    }, 3000)
  }

  const handleGenerateImage = (sceneId: number) => {
    // Handle generate image for specific scene
    console.log(`Generating image for scene ${sceneId}`)
    // TODO: Implement individual scene image generation
  }

  const handleGenerateVideo = (sceneId: number) => {
    // Handle generate video for specific scene
    console.log(`Generating video for scene ${sceneId}`)
    // TODO: Implement individual scene video generation
  }

  const handleUploadScene = (sceneId: number) => {
    // Handle upload for specific scene
    console.log(`Opening upload dialog for scene ${sceneId}`)
    // TODO: Implement file upload for scene
  }

  const generatePrompt = (scene: any, type: 'gambar' | 'video') => {
    const basePrompt = scene.mediaPrompt
    const presets = type === 'gambar' ? tempGambarPreset || getGambarPreset() : tempVideoPreset || getVideoPreset()
    
    // Combine scene context with presets
    return `${basePrompt}

Style & Guidelines:
${presets}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('Prompt copied to clipboard')
    }).catch(err => {
      console.error('Failed to copy: ', err)
    })
  }

  const toggleScene = (sceneId: number) => {
    setSelectedScenes(prev => 
      prev.includes(sceneId) 
        ? prev.filter(id => id !== sceneId)
        : [...prev, sceneId]
    )
  }

  const selectContent = (content: any) => {
    setSelectedContent(content)
    setSelectedScenes([])
    setGeneratedMedia(null)
  }

  const backToContentList = () => {
    setSelectedContent(null)
    setSelectedScenes([])
    setGeneratedMedia(null)
  }

  const savePresetSettings = () => {
    // Combine both presets into one config
    const combinedConfig = `=== PRESETS GAMBAR ===
${tempGambarPreset}

=== PRESETS VIDEO ===
${tempVideoPreset}`
    setMediaPresetConfig(combinedConfig)
    setShowPresetModal(false)
  }

  const openPresetModal = () => {
    // Parse existing config to separate gambar and video presets
    const existingConfig = mediaPresetConfig
    if (existingConfig.includes('=== PRESETS GAMBAR ===') && existingConfig.includes('=== PRESETS VIDEO ===')) {
      const gambarSection = existingConfig.split('=== PRESETS GAMBAR ===')[1]?.split('=== PRESETS VIDEO ===')[0]?.trim() || ''
      const videoSection = existingConfig.split('=== PRESETS VIDEO ===')[1]?.trim() || ''
      setTempGambarPreset(gambarSection)
      setTempVideoPreset(videoSection)
    } else {
      setTempGambarPreset('')
      setTempVideoPreset('')
    }
    setActiveTab('gambar')
    setShowPresetModal(true)
  }

  const getGambarPreset = () => {
    return `Gaya: flat vector, 2D cel animation, clean lines, solid colors, minimal detail, soft long-shadow, high contrast, smooth easing, subtle parallax

Framing: komposisi bersih, ruang negatif cukup, fokus pada satu gagasan tiap scene

Aturan Prompt Visual per Scene:
- Mulai dengan konteks singkat objek/aksi utama dari beat_text
- Pertahankan gaya global; jangan ulang panjang-panjang gaya (cukup tambahkan konten unik scene)
- Sertakan elemen desain: komposisi, foreground/midground/background untuk efek parallax halus; long-shadow lembut; kontras tinggi`
  }

  const getVideoPreset = () => {
    return `Gaya: flat vector, 2D cel animation, clean lines, solid colors, minimal detail, soft long-shadow, high contrast, smooth easing, subtle parallax

Framing: komposisi bersih, ruang negatif cukup, fokus pada satu gagasan tiap scene

Transisi: smooth easing, subtle parallax movement

Aturan Prompt Visual per Scene:
- Mulai dengan konteks singkat objek/aksi utama dari beat_text
- Pertahankan gaya global; jangan ulang panjang-panjang gaya (cukup tambahkan konten unik scene)
- Sertakan elemen design: komposisi, foreground/midground/background untuk efek parallax halus; long-shadow lembut; kontras tinggi
- Tambahkan gerakan halus yang mendukung narasi`
  }

  const loadDefaultMediaPreset = () => {
    if (activeTab === 'gambar') {
      setTempGambarPreset(getGambarPreset())
    } else {
      setTempVideoPreset(getVideoPreset())
    }
  }

  // If content is selected, show scene selection
  if (selectedContent) {
    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={backToContentList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              variant="outline"
              onClick={openPresetModal}
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Presets</span>
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{selectedContent.title}</h1>
            <p className="text-muted-foreground">
              Pilih scene yang ingin di-generate medianya
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Scene Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Scene Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedContent.scenesData.map((scene: any) => (
                <div 
                  key={scene.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedScenes.includes(scene.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleScene(scene.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">Scene {scene.id}</h4>
                    <input
                      type="checkbox"
                      checked={selectedScenes.includes(scene.id)}
                      onChange={() => toggleScene(scene.id)}
                      className="rounded"
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {scene.text}
                  </p>

                  {/* Scene Action Buttons */}
                  <div className="flex space-x-2 mb-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedScene(scene)
                        setPromptTab('gambar')
                        setShowPromptModal(true)
                      }}
                      className="flex-1"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Prompt
                    </Button>
                  </div>

                  {/* Generate Buttons */}
                  <div className="flex space-x-2 mb-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGenerateImage(scene.id)
                      }}
                      className="flex-1"
                    >
                      <Image className="h-4 w-4 mr-1" />
                      Generate Image
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGenerateVideo(scene.id)
                      }}
                      className="flex-1"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Generate Video
                    </Button>
                  </div>

                  {/* Upload Button */}
                  <div className="flex">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUploadScene(scene.id)
                      }}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload Media
                    </Button>
                  </div>
                </div>
              ))}

              <Button 
                onClick={handleGenerateMedia}
                disabled={selectedScenes.length === 0 || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Media ({selectedScenes.length} scenes)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>


        </div>

        {/* Generated Media Results */}
        {generatedMedia && (
          <div className="space-y-6">
            {/* Generated Images */}
            {generatedMedia.images && generatedMedia.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedMedia.images.map((image: any, index: number) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <Image className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Scene {image.sceneId}</h4>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {image.style}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            {image.prompt}
                          </p>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Videos */}
            {generatedMedia.videos && generatedMedia.videos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedMedia.videos.map((video: any, index: number) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <Video className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Scene {video.sceneId}</h4>
                            <div className="flex space-x-2">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {video.duration}
                              </span>
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                {video.style}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            {video.prompt}
                          </p>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Media Preset Modal */}
        {showPresetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Media Presets Configuration</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPresetModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex border-b mb-4">
                <button
                  onClick={() => setActiveTab('gambar')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'gambar'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Gambar
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'video'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Video
                </button>
              </div>

              {/* Load Preset Button */}
              <div className="mb-4">
                <Button 
                  onClick={loadDefaultMediaPreset}
                  variant="outline"
                  className="w-full"
                >
                  Load {activeTab === 'gambar' ? 'Gambar' : 'Video'} Presets
                </Button>
              </div>

              {/* Single Textarea for Preset Configuration */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {activeTab === 'gambar' ? 'Gambar' : 'Video'} Presets Configuration
                  </label>
                  <Textarea
                    placeholder={`Masukkan konfigurasi ${activeTab} presets Anda di sini...`}
                    value={activeTab === 'gambar' ? tempGambarPreset : tempVideoPreset}
                    onChange={(e) => {
                      if (activeTab === 'gambar') {
                        setTempGambarPreset(e.target.value)
                      } else {
                        setTempVideoPreset(e.target.value)
                      }
                    }}
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>

                {/* Parameter Guidelines */}
                <div className="bg-blue-50 p-4 rounded-lg text-sm">
                  <h4 className="font-semibold mb-2">Format Presets {activeTab === 'gambar' ? 'Gambar' : 'Video'}:</h4>
                  <div className="space-y-1 text-xs">
                    <p><strong>Gaya:</strong> Definisikan style visual yang konsisten (flat vector, 2D cel animation, dll)</p>
                    <p><strong>Framing:</strong> Aturan komposisi dan layout</p>
                    <p><strong>Aturan Prompt:</strong> Panduan cara membuat prompt untuk setiap scene</p>
                    {activeTab === 'video' && (
                      <p><strong>Transisi:</strong> Jenis transisi dan movement</p>
                    )}
                  </div>
                  <div className="mt-3 p-2 bg-white rounded border-l-4 border-blue-400">
                    <p className="text-xs">
                      <strong>Tips:</strong> Fokus pada konsistensi visual dan kemudahan implementasi. 
                      {activeTab === 'gambar' 
                        ? ' Untuk gambar, prioritaskan komposisi dan gaya visual.' 
                        : ' Untuk video, tambahkan elemen gerakan dan transisi.'
                      }
                    </p>
                  </div>
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

        {/* Prompt Modal */}
        {showPromptModal && selectedScene && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Scene {selectedScene.id} - Media Prompts</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPromptModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex border-b mb-4">
                <button
                  onClick={() => setPromptTab('gambar')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    promptTab === 'gambar'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Prompt Gambar
                </button>
                <button
                  onClick={() => setPromptTab('video')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    promptTab === 'video'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Prompt Video
                </button>
              </div>

              {/* Scene Context */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Scene Context:</h4>
                <p className="text-sm text-gray-700">{selectedScene.text}</p>
              </div>

              {/* Generated Prompt */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Generated {promptTab === 'gambar' ? 'Image' : 'Video'} Prompt:
                  </label>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(generatePrompt(selectedScene, promptTab))}
                  >
                    <Clipboard className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap font-mono max-h-60 overflow-y-auto">
                    {generatePrompt(selectedScene, promptTab)}
                  </pre>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={() => setShowPromptModal(false)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default view: Content List
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Media</h1>
        <p className="text-muted-foreground">
          Pilih konten yang ingin di-generate medianya
        </p>
      </div>

      {/* Content List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentList.map((content) => (
          <Card 
            key={content.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => selectContent(content)}
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
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                    No Media
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
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
                <Button size="sm" variant="outline">
                  Generate Media
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
            <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Tidak ada konten yang perlu media</h3>
            <p className="text-muted-foreground">
              Semua konten sudah memiliki media atau belum ada konten yang dibuat.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}