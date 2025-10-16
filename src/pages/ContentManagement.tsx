import { useState, useEffect } from 'react'
import { Content } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  FileText,
  Image,
  Volume2,
  Copy,
  Archive,
  Share2,
  Link,
  ExternalLink
} from 'lucide-react'

export function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [moreModalOpen, setMoreModalOpen] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [viewTitle, setViewTitle] = useState('')
  const [viewDescription, setViewDescription] = useState('')
  const [viewScript, setViewScript] = useState('')

  // State untuk data dari backend
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    withMedia: 0,
    withAudio: 0
  })

  // Fetch data dari backend
  useEffect(() => {
    fetchContents()
    fetchStats()
  }, [])

  const fetchContents = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/content')
      const data = await response.json()
      
      if (data.success) {
        setContents(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/content')
      const data = await response.json()
      
      if (data.success) {
        const contentList: Content[] = data.data || []
        setStats({
          total: contentList.length,
          completed: contentList.filter((c: Content) => c.status === 'completed').length,
          withMedia: contentList.filter((c: Content) => c.hasMedia).length,
          withAudio: contentList.filter((c: Content) => c.hasAudio).length
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const filteredContents = contents.filter((content: Content) => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || content.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai'
      case 'draft': return 'Draft'
      case 'processing': return 'Proses'
      default: return status
    }
  }

  const handleViewContent = (content: any) => {
    setSelectedContent(content)
    setViewTitle(content.title)
    setViewDescription(content.description || 'No description available')
    
    // Handle script content
    let scriptContent = 'No script available'
    if (content.script && content.script.trim().length > 0) {
      // First try to use as plain text (most common case)
      scriptContent = content.script
      
      // If it looks like JSON, try to parse it
      if (content.script.trim().startsWith('{') || content.script.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(content.script)
          if (parsed.scenes && Array.isArray(parsed.scenes)) {
            scriptContent = parsed.scenes.map((scene: any, index: number) => 
              `Scene ${index + 1}:\n${scene.text}`
            ).join('\n\n')
          }
        } catch (error) {
          // If JSON parsing fails, keep the original script as plain text
          scriptContent = content.script
        }
      }
    }
    
    setViewScript(scriptContent)
    setViewModalOpen(true)
  }



  const handleMoreActions = (content: any) => {
    setSelectedContent(content)
    setMoreModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedContent) return
    
    try {
      const response = await fetch(`http://localhost:3001/api/content/${selectedContent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Refresh content list
        fetchContents()
        alert('Konten berhasil diupdate')
      } else {
        throw new Error(data.error || 'Failed to update content')
      }
    } catch (error) {
      console.error('Error updating content:', error)
      alert('Gagal mengupdate konten')
    }
    
    setEditModalOpen(false)
    setSelectedContent(null)
  }

  const handleEditContent = () => {
    if (selectedContent) {
      setEditTitle(selectedContent.title)
      setEditDescription(selectedContent.description || '')
      setMoreModalOpen(false)
      setEditModalOpen(true)
    }
  }

  const handleDeleteContent = async () => {
    if (!selectedContent) return
    
    if (confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/content/${selectedContent.id}`, {
          method: 'DELETE'
        })
        
        const data = await response.json()
        
        if (data.success) {
          // Refresh content list
          fetchContents()
          alert('Konten berhasil dihapus')
        } else {
          throw new Error(data.error || 'Failed to delete content')
        }
      } catch (error) {
        console.error('Error deleting content:', error)
        alert('Gagal menghapus konten')
      }
    }
    
    setMoreModalOpen(false)
    setSelectedContent(null)
  }

  const handleDuplicateContent = async () => {
    if (!selectedContent) return
    
    try {
      const response = await fetch('http://localhost:3001/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: `${selectedContent.title} (Copy)`,
          description: selectedContent.description,
          script: selectedContent.script
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Refresh content list
        fetchContents()
        alert('Konten berhasil diduplikasi')
      } else {
        throw new Error(data.error || 'Failed to duplicate content')
      }
    } catch (error) {
      console.error('Error duplicating content:', error)
      alert('Gagal menduplikasi konten')
    }
    
    setMoreModalOpen(false)
    setSelectedContent(null)
  }

  const handleArchiveContent = () => {
    // Simulasi archive - dalam implementasi nyata akan hit API
    console.log('Archiving content:', selectedContent?.id)
    setMoreModalOpen(false)
    setSelectedContent(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Content Management</h1>
          <p className="text-muted-foreground">
            Kelola semua konten yang telah di-generate
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total === 0 ? 'Belum ada konten' : 'Total konten'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% completion rate` : 'Belum ada data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Media</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withMedia}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? `${Math.round((stats.withMedia / stats.total) * 100)}% have media` : 'Belum ada data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Audio</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withAudio}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? `${Math.round((stats.withAudio / stats.total) * 100)}% have audio` : 'Belum ada data'}
            </p>
          </CardContent>
        </Card>
      </div>

      </div>

      {/* Filters and Search */}
      <div className="max-w-4xl mx-auto">
        <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari konten..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">Semua Status</option>
                <option value="completed">Selesai</option>
                <option value="draft">Draft</option>
                <option value="processing">Proses</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      </div>

      {/* Content List */}
      <div className="max-w-4xl mx-auto">
        <Card>
        <CardHeader>
          <CardTitle>Daftar Konten</CardTitle>
          <CardDescription>
            {filteredContents.length} konten ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-muted-foreground mt-2">Memuat konten...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContents.map((content) => (
              <div key={content.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{content.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                        {getStatusText(content.status)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {content.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(content.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{content.scenes} scenes</span>
                      </div>
                      {content.hasMedia && (
                        <div className="flex items-center space-x-1">
                          <Image className="h-4 w-4 text-green-600" />
                          <span>Media</span>
                        </div>
                      )}
                      {content.hasAudio && (
                        <div className="flex items-center space-x-1">
                          <Volume2 className="h-4 w-4 text-blue-600" />
                          <span>Audio</span>
                        </div>
                      )}
                      {content.goFileFolder && (
                        <div className="flex items-center space-x-1">
                          <Link className="h-4 w-4 text-purple-600" />
                          <span>GoFile</span>
                        </div>
                      )}
                    </div>
                    
                    {/* GoFile Link */}
                    {content.goFileFolder && (
                      <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-purple-700 font-medium">
                            Files: {content.goFileFolder.folderName}
                          </span>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => window.open(content.goFileFolder?.folderUrl || '', '_blank')}
                              className="h-6 px-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => navigator.clipboard.writeText(content.goFileFolder?.folderUrl || '')}
                              className="h-6 px-2"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewContent(content)} className="hidden sm:flex">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleViewContent(content)} className="sm:hidden">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleMoreActions(content)}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}

          {!loading && filteredContents.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {contents.length === 0 ? 'Belum ada konten' : 'Tidak ada konten yang ditemukan'}
              </p>
              {contents.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Mulai dengan generate content pertama Anda
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>


      </div>

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="dialog-content">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Eye className="h-5 w-5" />
              Detail Konten
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Lihat dan edit konten secara langsung
            </DialogDescription>
          </DialogHeader>
          
          {selectedContent && (
            <div className="space-y-6">
              {/* Status Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">
                      {new Date(selectedContent.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">
                      {selectedContent.hasMedia ? 'Media ✓' : 'No Media'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">
                      {selectedContent.hasAudio ? 'Audio ✓' : 'No Audio'}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedContent.status)}`}>
                  {getStatusText(selectedContent.status)}
                </span>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="view-title" className="text-sm font-medium">Judul</Label>
                  <Textarea
                    id="view-title"
                    value={viewTitle}
                    onChange={(e) => setViewTitle(e.target.value)}
                    className="mt-1 min-h-[60px] text-lg font-semibold"
                    placeholder="Masukkan judul konten"
                  />
                </div>

                <div>
                  <Label htmlFor="view-description" className="text-sm font-medium">Deskripsi</Label>
                  <Textarea
                    id="view-description"
                    value={viewDescription}
                    onChange={(e) => setViewDescription(e.target.value)}
                    className="mt-1 min-h-[100px]"
                    placeholder="Masukkan deskripsi konten"
                  />
                </div>

                <div>
                  <Label htmlFor="view-script" className="text-sm font-medium">Naskah Lengkap</Label>
                  <Textarea
                    id="view-script"
                    value={viewScript}
                    onChange={(e) => setViewScript(e.target.value)}
                    className="mt-1 min-h-[400px] font-mono text-sm leading-relaxed"
                    placeholder="Masukkan naskah lengkap video"
                  />
                </div>
              </div>

              {/* GoFile Links */}
              {selectedContent.goFileFolder && (
                <div>
                  <Label className="text-lg font-semibold text-gray-800">File Storage (GoFile)</Label>
                  <Card className="mt-4 p-4 bg-purple-50 border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Link className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-purple-800">
                          {selectedContent.goFileFolder.folderName}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(selectedContent.goFileFolder.folderUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open Folder
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(selectedContent.goFileFolder.folderUrl)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-purple-700">
                      Semua file media dan audio untuk konten ini disimpan dalam folder GoFile ini.
                      Klik "Open Folder" untuk mengakses semua file.
                    </p>
                  </Card>
                </div>
              )}

              {/* Scene Breakdown for Media Generation */}
              {selectedContent.hasMedia && (
                <div>
                  <Label className="text-lg font-semibold text-gray-800">Scene Breakdown (untuk Generate Media)</Label>
                  <p className="text-sm text-gray-600 mt-1 mb-4">
                    Pembagian scene ini digunakan untuk generate media/visual setiap bagian
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: selectedContent.scenes }, (_, i) => (
                      <Card key={i} className="p-4 border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Scene {i + 1}</h4>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Media ✓
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs font-medium text-gray-600">Judul Scene:</Label>
                            <p className="text-sm font-medium">
                              {i === 0 && "Intro - Hook dan Perkenalan"}
                              {i === 1 && "Penjelasan Konsep Dasar"}
                              {i === 2 && "Demo/Tutorial Praktis"}
                              {i === 3 && "Tips dan Best Practices"}
                              {i >= 4 && `Advanced Topics - Part ${i - 3}`}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-600">Media Prompt:</Label>
                            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              {i === 0 && "Professional presenter in modern studio, welcoming gesture, clean background with RUANG TUMBUH branding"}
                              {i === 1 && "Animated diagrams and flowcharts, clean infographic style, educational visual elements"}
                              {i === 2 && "Screen recording with code editor, step-by-step tutorial overlay, professional development setup"}
                              {i === 3 && "Bullet points animation, tips and tricks visual, modern presentation style"}
                              {i >= 4 && "Advanced concepts visualization, complex diagrams, professional technical presentation"}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => {
                    // Simulasi save - dalam implementasi nyata akan hit API
                    console.log('Saving content:', { 
                      title: viewTitle, 
                      description: viewDescription, 
                      script: viewScript 
                    })
                    setViewModalOpen(false)
                  }}
                  className="w-full sm:w-auto"
                >
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="dialog-content">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Edit className="h-5 w-5" />
              Edit Konten
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Ubah informasi dasar konten
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Judul</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Masukkan judul konten"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Deskripsi</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Masukkan deskripsi konten"
                rows={4}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
              <Button variant="outline" onClick={() => setEditModalOpen(false)} className="w-full sm:w-auto">
                Batal
              </Button>
              <Button onClick={handleSaveEdit} className="w-full sm:w-auto">
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* More Actions Modal */}
      <Dialog open={moreModalOpen} onOpenChange={setMoreModalOpen}>
        <DialogContent className="dialog-content">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <MoreVertical className="h-5 w-5" />
              Aksi Lainnya
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Pilih aksi yang ingin dilakukan pada konten ini
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleEditContent}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Konten
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleDuplicateContent}
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplikasi Konten
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleArchiveContent}
            >
              <Archive className="h-4 w-4 mr-2" />
              Arsipkan
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Bagikan Link
            </Button>
            
            <hr className="my-2" />
            
            <Button 
              variant="destructive" 
              className="w-full justify-start" 
              onClick={handleDeleteContent}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Konten
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}