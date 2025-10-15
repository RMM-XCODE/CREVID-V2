import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Calendar,
  FileText,
  Image,
  Volume2
} from 'lucide-react'

export function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Mock data
  const contents = [
    {
      id: 1,
      title: "Tutorial Lengkap React Hooks untuk Pemula",
      type: "content",
      status: "completed",
      createdAt: "2024-01-15",
      scenes: 5,
      hasMedia: true,
      hasAudio: true,
      description: "Tutorial komprehensif tentang React Hooks..."
    },
    {
      id: 2,
      title: "JavaScript ES6 Features Explained",
      type: "content",
      status: "draft",
      createdAt: "2024-01-14",
      scenes: 7,
      hasMedia: false,
      hasAudio: true,
      description: "Penjelasan fitur-fitur terbaru JavaScript ES6..."
    },
    {
      id: 3,
      title: "CSS Grid Layout Masterclass",
      type: "content",
      status: "completed",
      createdAt: "2024-01-13",
      scenes: 6,
      hasMedia: true,
      hasAudio: false,
      description: "Panduan lengkap CSS Grid untuk layout modern..."
    },
    {
      id: 4,
      title: "Node.js API Development",
      type: "content",
      status: "processing",
      createdAt: "2024-01-12",
      scenes: 8,
      hasMedia: false,
      hasAudio: false,
      description: "Membangun REST API dengan Node.js dan Express..."
    }
  ]

  const filteredContents = contents.filter(content => {
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
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +3 bulan ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              75% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Media</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              50% have media
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Audio</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              62.5% have audio
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
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredContents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada konten yang ditemukan
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
          <CardDescription>
            Aksi untuk multiple konten sekaligus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
            <Button variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
            <Button variant="outline">
              Archive Selected
            </Button>
            <Button variant="outline">
              Duplicate Selected
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}