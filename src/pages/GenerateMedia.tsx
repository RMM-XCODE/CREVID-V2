import { useState, useEffect } from 'react'
import { Content } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ErrorModal } from '@/components/ui/error-modal'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { Image, Video, Wand2, RefreshCw, Copy, ArrowLeft, Calendar, FileText, Settings, Upload, MessageSquare, Clipboard, X, Link, ExternalLink } from 'lucide-react'

export function GenerateMedia() {
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [selectedScenes, setSelectedScenes] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMedia, setGeneratedMedia] = useState<any>(null)
  const { errorState, showError, hideError, handleFetchError } = useErrorHandler()
  
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

  // State untuk data dari backend
  const [contentList, setContentList] = useState<Content[]>([])
  const [, setLoading] = useState(true)

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
        // Filter hanya konten yang belum ada media atau bisa generate media
        const contents: Content[] = data.data || []
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

  // Fallback mock data untuk development
  /* const mockContentList = [
    {
      id: 1,
      title: "Tutorial Lengkap React Hooks untuk Pemula",
      createdAt: "2024-01-15",
      scenes: 5,
      hasMedia: false,
      description: "Belajar React Hooks dari dasar hingga advanced",
      goFileFolder: null, // Will be created after first media generation
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
      hasMedia: true,
      description: "Penjelasan fitur-fitur terbaru JavaScript ES6",
      goFileFolder: {
        folderId: "abc123-def456-ghi789",
        folderUrl: "https://gofile.io/d/abc123-def456-ghi789",
        folderName: "JavaScript_ES6_Features_Explained"
      },
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
  ] */

  const handleGenerateMedia = async () => {
    if (!selectedContent || selectedScenes.length === 0) return
    
    setIsGenerating(true)
    
    try {
      // Call backend API untuk generate media
      const response = await fetch('http://localhost:3001/api/media/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_id: selectedContent.id,
          scene_ids: selectedScenes,
          media_type: 'image', // Default ke image, bisa ditambah pilihan
          presets: mediaPresetConfig || undefined
        })
      })

      if (!response.ok) {
        await handleFetchError(response, 'Gagal generate media')
        setIsGenerating(false)
        return
      }

      const data = await response.json()
      
      if (data.success) {
        // Poll job status
        pollJobStatus(data.data.job_id)
      } else {
        showError('Generate Error', 'Gagal generate media', data)
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
          setGeneratedMedia(job.result_data)
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

  // Fallback untuk development
  /* const handleGenerateMediaFallback = () => {
    setTimeout(() => {
      // Simulate GoFile folder creation
      const goFileFolder = {
        folderId: `${selectedContent.id}-${Date.now()}`,
        folderUrl: `https://gofile.io/d/${selectedContent.id}-${Date.now()}`,
        folderName: selectedContent.title.replace(/\s+/g, '_')
      }

      setGeneratedMedia({
        goFileFolder,
        images: [
          {
            sceneId: 1,
            fileName: "scene_1_intro.jpg",
            goFileUrl: `${goFileFolder.folderUrl}/scene_1_intro.jpg`,
            prompt: "Professional YouTuber in modern home office setup, speaking to camera with React logo and coding setup in background, warm lighting, high quality",
            style: "Photorealistic"
          },
          {
            sceneId: 2,
            fileName: "scene_2_diagram.jpg", 
            goFileUrl: `${goFileFolder.folderUrl}/scene_2_diagram.jpg`,
            prompt: "Clean animated diagram showing React Hooks concept, with before/after comparison of class vs functional components, modern UI design",
            style: "Illustration"
          }
        ],
        videos: [
          {
            sceneId: 3,
            fileName: "scene_3_demo.mp4",
            goFileUrl: `${goFileFolder.folderUrl}/scene_3_demo.mp4`,
            prompt: "Screen recording of VS Code showing useState hook implementation, clean code editor with syntax highlighting, smooth transitions",
            duration: "15s",
            style: "Screen Recording"
          }
        ]
      })
      setIsGenerating(false)
    }, 3000)
  } */

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

  const selectContent = async (content: any) => {
    try {
      // Fetch detailed content with scenes data
      const response = await fetch(`http://localhost:3001/api/content/${content.id}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        // Parse script to extract scenes if available
        let scenesData = []
        if (data.data.script) {
          try {
            const parsed = JSON.parse(data.data.script)
            scenesData = parsed.scenes || []
          } catch (error) {
            // If script is not JSON, create a single scene
            scenesData = [{
              id: 1,
              text: data.data.script,
              mediaPrompt: data.data.script
            }]
          }
        }
        
        setSelectedContent({
          ...data.data,
          scenesData: scenesData
        })
      } else {
        // Fallback to original content with empty scenes
        setSelectedContent({
          ...content,
          scenesData: []
        })
      }
    } catch (error) {
      console.error('Error fetching content details:', error)
      // Fallback to original content with empty scenes
      setSelectedContent({
        ...content,
        scenesData: []
      })
    }
    
    setSelectedScenes([])
    setGeneratedMedia(null)
  }

  const backToContentList = () => {
    setSelectedContent(null)
    setSelectedScenes([])
    setGeneratedMedia(null)
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
              {selectedContent?.scenesData?.length > 0 ? selectedContent.scenesData.map((scene: any) => (
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
              )) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Scenes Available</h3>
                  <p className="text-muted-foreground mb-4">
                    This content doesn't have any scenes to generate media for.
                  </p>
                  <Button variant="outline" onClick={backToContentList}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Content List
                  </Button>
                </div>
              )}

              {selectedContent?.scenesData?.length > 0 && (
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
              )}
            </CardContent>
          </Card>
        </div>

        {/* Generated Media Results */}
        {generatedMedia && (
          <div className="space-y-6">
            {/* GoFile Folder Info */}
            {generatedMedia.goFileFolder && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Link className="h-5 w-5" />
                    GoFile Folder Created
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-green-700">
                      <strong>Folder:</strong> {generatedMedia.goFileFolder.folderName}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(generatedMedia.goFileFolder.folderUrl, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open GoFile Folder
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigator.clipboard.writeText(generatedMedia.goFileFolder.folderUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                          <p className="text-xs text-muted-foreground mb-2">
                            <strong>File:</strong> {image.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            {image.prompt}
                          </p>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => window.open(image.goFileUrl, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Open File
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigator.clipboard.writeText(image.goFileUrl)}
                            >
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
                          <p className="text-xs text-muted-foreground mb-2">
                            <strong>File:</strong> {video.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            {video.prompt}
                          </p>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => window.open(video.goFileUrl, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Open File
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigator.clipboard.writeText(video.goFileUrl)}
                            >
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
        <Dialog open={showPresetModal} onOpenChange={setShowPresetModal}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Media Presets Configuration
              </DialogTitle>
              <DialogDescription>
                Konfigurasi preset untuk generate media yang konsisten
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('gambar')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'gambar'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Presets Gambar
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'video'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Presets Video
                </button>
              </div>

              {/* Load Preset Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={loadDefaultMediaPreset}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Load Default {activeTab === 'gambar' ? 'Gambar' : 'Video'} Presets
                </Button>
              </div>

              {/* Editable Preset Configuration */}
              <div>
                <Label htmlFor="media-preset-config" className="text-sm font-medium">
                  {activeTab === 'gambar' ? 'Gambar' : 'Video'} Presets Configuration
                </Label>
                <Textarea
                  id="media-preset-config"
                  placeholder={`Masukkan konfigurasi ${activeTab} presets Anda di sini...`}
                  value={activeTab === 'gambar' ? tempGambarPreset : tempVideoPreset}
                  onChange={(e) => {
                    if (activeTab === 'gambar') {
                      setTempGambarPreset(e.target.value)
                    } else {
                      setTempVideoPreset(e.target.value)
                    }
                  }}
                  className="mt-2 min-h-[400px] font-mono text-sm leading-relaxed"
                />
              </div>

              {/* Parameter Guidelines */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Format Presets {activeTab === 'gambar' ? 'Gambar' : 'Video'}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <p><strong>Gaya:</strong> Style visual konsisten (flat vector, 2D cel animation)</p>
                    <p><strong>Framing:</strong> Aturan komposisi dan layout</p>
                    <p><strong>Aturan Prompt:</strong> Panduan cara membuat prompt per scene</p>
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
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => {
                    // Combine both presets into one config
                    const combinedConfig = `=== PRESETS GAMBAR ===
${tempGambarPreset}

=== PRESETS VIDEO ===
${tempVideoPreset}`
                    setMediaPresetConfig(combinedConfig)
                    console.log('Saving media preset config:', combinedConfig)
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
        {contentList.map((content: Content) => (
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
                  {content.hasMedia ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Media Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      No Media
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
                  {content.goFileFolder && (
                    <div className="flex items-center space-x-1">
                      <Link className="h-4 w-4 text-purple-600" />
                      <span>GoFile</span>
                    </div>
                  )}
                </div>
              </div>

              {/* GoFile Links (if media exists) */}
              {content.hasMedia && content.goFileFolder && (
                <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Link className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Media Files</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-700">{content.goFileFolder.folderName}</span>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(content.goFileFolder?.folderUrl || '', '_blank')
                          }}
                          className="h-6 px-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigator.clipboard.writeText(content.goFileFolder?.folderUrl || '')
                          }}
                          className="h-6 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled={content.hasMedia}
                  onClick={(e) => {
                    e.stopPropagation()
                    selectContent(content)
                  }}
                >
                  {content.hasMedia ? 'Media Generated' : 'Generate Media'}
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