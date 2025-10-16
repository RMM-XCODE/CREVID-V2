import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Wand2, Copy, Download, RefreshCw, FileText, Link2, Settings } from 'lucide-react'

export function GenerateContent() {
  const [contentMode, setContentMode] = useState<'topic' | 'reference'>('topic')
  
  // Simple input states - only text content
  const [topicText, setTopicText] = useState('')
  const [referenceText, setReferenceText] = useState('')
  
  // Preset configuration as single text
  const [presetConfig, setPresetConfig] = useState('')
  
  // Modal states
  const [showPresetModal, setShowPresetModal] = useState(false)
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [, setJobId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)



  const openPresetModal = () => {
    // Load default preset if empty
    if (!presetConfig) {
      loadRuangTumbuhPreset()
    }
    setShowPresetModal(true)
  }

  const loadRuangTumbuhPreset = () => {
    const ruangTumbuhConfig = `Channel Name: RUANG TUMBUH
Audience Call: Growers
Perspective: kita/ayo/kamu
Formula: S.O.C.I.A.L
Word Count: 650-1000
Duration: 8-12 menit
Target Audience: Gen Z
Tone: Santai, hangat, optimistis, tanpa menggurui
Difficulty: Beginner-Intermediate
Content Angle: Pengembangan Diri Gen Z
Format: Talking Head + Visual Support
Language & Style: Indonesia santai, hangat, optimistis, ramah Gen Z, tanpa menggurui. Pakai kata "kita/ayo" dan sapa audiens sebagai Growers. Sisipkan humor ringan atau sisi manusiawi. Sederhanakan konsep rumit dengan analogi sederhana.

Formula S.O.C.I.A.L:
S – Story: buka dengan konflik atau data mencengangkan
O – Observation: angkat pengamatan keseharian yang "relate"
C – Connection: ajak berpikir/berpartisipasi (pertanyaan reflektif)
I – Insight: sertakan 1–3 fakta/konsep psikologi/pengembangan diri
A – Agenda: jelaskan garis besar poin yang akan dibahas
L – Lo-faen/Impact: tutup dengan manfaat nyata/aksi sederhana

Validation Rules:
- Script harus 650–1000 kata
- Gunakan panggilan 'Growers' minimal 2x (awal & akhir)
- Pastikan urutan S.O.C.I.A.L terpenuhi
- Kalimat pendek dengan tanda baca jelas (., , , …, !, ?, —)
- Sisipkan humor ringan atau sisi manusiawi
- Sederhanakan konsep rumit dengan analogi sederhana`

    setPresetConfig(ruangTumbuhConfig)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)
    
    try {
      const input = contentMode === 'topic' ? topicText : referenceText
      
      // Call backend API
      const response = await fetch('http://localhost:3001/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: contentMode,
          input: input,
          presets: presetConfig || undefined
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setJobId(data.data.job_id)
        setProgress(10)
        
        // Poll for job status
        pollJobStatus(data.data.job_id)
      } else {
        throw new Error(data.error || 'Failed to generate content')
      }
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Gagal generate content. Pastikan backend sudah running dan API keys sudah dikonfigurasi di Settings.')
      setIsGenerating(false)
    }
  }

  const pollJobStatus = async (jobId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/jobs/${jobId}`)
      const data = await response.json()
      
      if (data.success) {
        const job = data.data
        setProgress(job.progress || 0)
        
        if (job.status === 'completed') {
          console.log('Job completed, result_data:', job.result_data)
          
          // Validate result data structure
          if (job.result_data && job.result_data.scenes && Array.isArray(job.result_data.scenes)) {
            setGeneratedContent(job.result_data)
          } else {
            console.error('Invalid result data structure:', job.result_data)
            alert('Generated content has invalid structure')
          }
          setIsGenerating(false)
        } else if (job.status === 'failed') {
          throw new Error(job.error_message || 'Job failed')
        } else {
          // Continue polling
          setTimeout(() => pollJobStatus(jobId), 2000)
        }
      }
    } catch (error) {
      console.error('Error polling job status:', error)
      alert('Error checking job status')
      setIsGenerating(false)
    }
  }

  // Fallback untuk development jika backend belum ready
  /* const handleGenerateFallback = () => {
    setTimeout(() => {
      if (contentMode === 'topic') {
        setGeneratedContent({
          title: `${topicText} - Panduan untuk Growers yang Ingin Berkembang`,
          description: `Halo Growers! 🌱

Di video ini, kita bahas ${topicText} dengan pendekatan yang relate sama kehidupan sehari-hari.

🎯 Yang akan kita dapatkan:
• Insight praktis tentang ${topicText}
• Data dan fakta yang eye-opening
• Aksi sederhana yang bisa langsung diterapin
• Perspektif baru untuk Gen Z

📊 Channel: RUANG TUMBUH
⏰ Durasi: 8-12 menit
🎨 Formula: S.O.C.I.A.L
📝 650-1000 kata

#RuangTumbuh #${topicText.replace(/\s+/g, '')} #Growers`,
          scenes: [
            {
              id: 1,
              text: `[S - Story] Halo Growers! Tau nggak, 73% Gen Z merasa stuck dalam hidup mereka? Hari ini kita bahas ${topicText} yang bisa jadi game changer.`,
              mediaPrompt: `RUANG TUMBUH host speaking directly to camera, santai dan hangat expression, engaging Gen Z style setup with warm lighting`
            },
            {
              id: 2,
              text: `[O - Observation] Pernah nggak sih Growers, kita ngerasa kayak ${topicText} ini cuma teori doang? Padahal di kehidupan sehari-hari, ini bener-bener relate banget sama yang kita alamin.`,
              mediaPrompt: `Talking Head + Visual Support showing relatable daily life scenarios, santai storytelling style, visual metaphors for Gen Z`
            },
            {
              id: 3,
              text: `[C - Connection] Coba deh Growers, refleksi sebentar. Kapan terakhir kali kamu bener-bener nerapin ${topicText} dalam hidup? Drop di comment ya!`,
              mediaPrompt: `Interactive moment with audience, santai engagement style, encouraging participation from Gen Z`
            },
            {
              id: 4,
              text: `[I - Insight] Nah, ini dia fakta menariknya Growers. Menurut penelitian, ${topicText} ternyata punya dampak yang lebih besar dari yang kita kira. Mari kita breakdown bareng-bareng.`,
              mediaPrompt: `Talking Head + Visual Support presenting facts and insights, educational style, visual data presentation for Gen Z`
            },
            {
              id: 5,
              text: `[A - Agenda] Oke Growers, jadi hari ini kita akan bahas 3 poin utama tentang ${topicText}: pertama konsep dasarnya, kedua cara praktis nerapinnya, dan ketiga tips buat Gen Z kayak kita.`,
              mediaPrompt: `Talking Head + Visual Support outlining main points, structured presentation, clear agenda for Gen Z`
            },
            {
              id: 6,
              text: `[L - Lo-faen/Impact] Nah Growers, sekarang kamu udah tau kan gimana ${topicText} bisa bikin hidup kamu lebih meaningful? Mulai dari hal kecil aja, ayo terapin satu tips hari ini. Keep growing, Growers! 🌱`,
              mediaPrompt: `Talking Head + Visual Support closing with actionable takeaways, motivational style, inspiring Gen Z to take action`
            }
          ]
        })
      } else {
        // Reference mode
        setGeneratedContent({
          title: `Analisis Mendalam - Berdasarkan Referensi Terbaru`,
          description: `Video ini membahas referensi dengan sudut pandang pengembangan diri! 📰

📋 Yang akan dibahas:
• Analisis mendalam dari referensi
• Sudut pandang pengembangan diri
• Implikasi dan dampaknya
• Kesimpulan dan takeaway
• Diskusi dengan gaya santai

📊 Detail:
• Target: Gen Z
• Level: Beginner-Intermediate
• Format: Talking Head + Visual Support
• Durasi: 8-12 menit

#AnalisisMendalam #Analysis #Reference`,
          scenes: [
            {
              id: 1,
              text: `Halo Growers! Hari ini kita akan membahas referensi ini dengan sudut pandang pengembangan diri.`,
              mediaPrompt: `Professional presenter, Talking Head + Visual Support style, santai presentation discussing current topics`
            },
            {
              id: 2,
              text: `Berdasarkan referensi yang saya analisis, ada beberapa poin penting untuk Gen Z dengan level Beginner-Intermediate.`,
              mediaPrompt: `Talking Head + Visual Support showing reference analysis, santai explanation, highlighting key points`
            },
            {
              id: 3,
              text: `Mari kita analisis lebih dalam dengan pendekatan pengembangan diri dan gaya santai.`,
              mediaPrompt: `Talking Head + Visual Support analytical presentation, santai style, professional analysis for Gen Z`
            }
          ]
        })
      }
      setIsGenerating(false)
    }, 3000)
  } */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Generate Content</h1>
        </div>

        {/* Content Mode Selection - Minimalist */}
        <div className="flex justify-center space-x-4 mb-6">
          <Button 
            variant={contentMode === 'topic' ? 'default' : 'outline'}
            onClick={() => setContentMode('topic')}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Input Topik</span>
          </Button>
          
          <Button 
            variant={contentMode === 'reference' ? 'default' : 'outline'}
            onClick={() => setContentMode('reference')}
            className="flex items-center space-x-2"
          >
            <Link2 className="h-4 w-4" />
            <span>Input Referensi</span>
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
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form - Minimalist */}
        <Card>
          <CardHeader>
            <CardTitle>
              {contentMode === 'topic' ? 'Input Topik' : 'Input Referensi'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Only textarea input - everything else from preset */}
            {contentMode === 'topic' ? (
              <Textarea
                placeholder="Masukkan topik yang ingin dibahas..."
                value={topicText}
                onChange={(e) => setTopicText(e.target.value)}
                className="min-h-[120px]"
              />
            ) : (
              <Textarea
                placeholder="Paste artikel/berita yang ingin dijadikan referensi..."
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
                className="min-h-[120px]"
              />
            )}

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {progress < 20 && 'Memulai generate content...'}
                  {progress >= 20 && progress < 50 && 'Menganalisis input...'}
                  {progress >= 50 && progress < 80 && 'Membuat konten dengan AI...'}
                  {progress >= 80 && 'Menyelesaikan...'}
                </p>
              </div>
            )}

            <Button 
              onClick={handleGenerate}
              disabled={
                (contentMode === 'topic' && !topicText) ||
                (contentMode === 'reference' && !referenceText) ||
                isGenerating
              }
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating... ({progress}%)
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Content - Minimalist */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
          </CardHeader>
          <CardContent>
            {!generatedContent ? (
              <div className="text-center py-8 text-muted-foreground">
                Generate content to see results
              </div>
            ) : (
              <div className="space-y-4">
                {/* Title */}
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Title</p>
                  <p className="text-sm">{generatedContent.title}</p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* Description */}
                <div className="p-3 bg-muted rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-sm font-medium mb-2">Description</p>
                  <pre className="text-sm whitespace-pre-wrap">{generatedContent.description}</pre>
                  <Button variant="ghost" size="sm" className="mt-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scenes - Minimalist */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Scenes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedContent?.scenes?.length > 0 ? generatedContent.scenes.map((scene: any) => (
                <div key={scene.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Scene {scene.id}</h4>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm">{scene.text}</p>
                    <p className="text-xs p-2 bg-muted rounded text-muted-foreground">
                      {scene.mediaPrompt}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Scenes Generated</h3>
                  <p className="text-muted-foreground">
                    The generated content doesn't have any scenes to display.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      </div>

      {/* Preset Modal */}
      <Dialog open={showPresetModal} onOpenChange={setShowPresetModal}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Content Presets
            </DialogTitle>
            <DialogDescription>
              Konfigurasi preset untuk generate content yang konsisten
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Load Preset Button */}
            <div className="flex justify-center">
              <Button 
                onClick={loadRuangTumbuhPreset}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Load RUANG TUMBUH Presets
              </Button>
            </div>

            {/* Editable Preset Configuration */}
            <div>
              <Label htmlFor="preset-config" className="text-sm font-medium">Konfigurasi Presets</Label>
              <Textarea
                id="preset-config"
                placeholder="Masukkan konfigurasi presets Anda di sini..."
                value={presetConfig}
                onChange={(e) => setPresetConfig(e.target.value)}
                className="mt-2 min-h-[400px] font-mono text-sm leading-relaxed"
              />
            </div>

            {/* Parameter Guidelines */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Parameter Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <p><strong>Channel Name:</strong> Nama channel (contoh: RUANG TUMBUH)</p>
                  <p><strong>Audience Call:</strong> Sebutan penonton (contoh: Growers)</p>
                  <p><strong>Perspective:</strong> Sudut pandang (contoh: kita/ayo/kamu)</p>
                  <p><strong>Formula:</strong> Struktur naskah (contoh: S.O.C.I.A.L)</p>
                  <p><strong>Word Count:</strong> Panjang naskah (contoh: 650-1000)</p>
                  <p><strong>Duration:</strong> Durasi video (contoh: 8-12 menit)</p>
                  <p><strong>Target Audience:</strong> Target penonton (contoh: Gen Z)</p>
                  <p><strong>Tone:</strong> Gaya penyampaian (contoh: Santai, hangat)</p>
                  <p><strong>Difficulty:</strong> Level kesulitan (contoh: Beginner-Intermediate)</p>
                  <p><strong>Content Angle:</strong> Sudut pandang konten</p>
                  <p><strong>Format:</strong> Format video (contoh: Talking Head + Visual)</p>
                  <p><strong>Language & Style:</strong> Nada & bahasa yang digunakan</p>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button 
                onClick={() => {
                  console.log('Saving preset config:', presetConfig)
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
    </div>
  )
}