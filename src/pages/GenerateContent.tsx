import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Wand2, Copy, Download, RefreshCw, FileText, Link2, Settings, X, Save } from 'lucide-react'

export function GenerateContent() {
  const [contentMode, setContentMode] = useState<'topic' | 'reference'>('topic')
  
  // Simple input states - only text content
  const [topicText, setTopicText] = useState('')
  const [referenceText, setReferenceText] = useState('')
  
  // Preset configuration as single text
  const [presetConfig, setPresetConfig] = useState('')
  
  // Modal states
  const [showPresetModal, setShowPresetModal] = useState(false)
  
  // Temporary preset state
  const [tempPresetConfig, setTempPresetConfig] = useState('')
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)



  const savePresetSettings = () => {
    // Save temp preset config to actual state
    setPresetConfig(tempPresetConfig)
    setShowPresetModal(false)
  }

  const openPresetModal = () => {
    // Load current preset config into temp
    setTempPresetConfig(presetConfig)
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

    setTempPresetConfig(ruangTumbuhConfig)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate API call
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
  }

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
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate
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
              {generatedContent.scenes.map((scene: any) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>

      {/* Preset Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Content Presets</h3>
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
                onClick={loadRuangTumbuhPreset}
                variant="outline"
                className="w-full"
              >
                Load RUANG TUMBUH Presets
              </Button>
            </div>

            {/* Single Textarea for Preset Configuration */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Presets Configuration</label>
                <Textarea
                  placeholder="Masukkan konfigurasi presets Anda di sini..."
                  value={tempPresetConfig}
                  onChange={(e) => setTempPresetConfig(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>

              {/* Parameter Guidelines */}
              <div className="bg-blue-50 p-4 rounded-lg text-sm">
                <h4 className="font-semibold mb-2">Parameter yang Harus Terpenuhi:</h4>
                <div className="space-y-1 text-xs">
                  <p><strong>Channel Name:</strong> Nama channel (contoh: RUANG TUMBUH)</p>
                  <p><strong>Audience Call:</strong> Sebutan penonton (contoh: Growers)</p>
                  <p><strong>Perspective:</strong> Sudut pandang (contoh: kita/ayo/kamu)</p>
                  <p><strong>Formula:</strong> Struktur naskah (contoh: S.O.C.I.A.L)</p>
                  <p><strong>Word Count:</strong> Panjang naskah (contoh: 650-1000)</p>
                  <p><strong>Duration:</strong> Durasi video (contoh: 8-12 menit)</p>
                  <p><strong>Target Audience:</strong> Target penonton (contoh: Gen Z)</p>
                  <p><strong>Tone:</strong> Gaya penyampaian (contoh: Santai, hangat, optimistis)</p>
                  <p><strong>Difficulty:</strong> Level kesulitan (contoh: Beginner-Intermediate)</p>
                  <p><strong>Content Angle:</strong> Sudut pandang konten (contoh: Pengembangan Diri Gen Z)</p>
                  <p><strong>Format:</strong> Format video (contoh: Talking Head + Visual Support)</p>
                  <p><strong>Language & Style:</strong> Nada & bahasa yang digunakan</p>
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
    </div>
  )
}