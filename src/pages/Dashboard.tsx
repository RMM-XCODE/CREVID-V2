
import { useState, useEffect } from 'react'
import { Content, Job } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Image, Volume2, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Dashboard() {
  const [stats, setStats] = useState({
    totalContent: 0,
    mediaGenerated: 0,
    ttsGenerated: 0,
    successRate: 0
  })
  const [recentActivity, setRecentActivity] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch content stats
      const contentResponse = await fetch('http://localhost:3001/api/content')
      const contentData = await contentResponse.json()
      
      // Fetch jobs for recent activity
      const jobsResponse = await fetch('http://localhost:3001/api/jobs?limit=4')
      const jobsData = await jobsResponse.json()
      
      if (contentData.success) {
        const contents: Content[] = contentData.data || []
        setStats({
          totalContent: contents.length,
          mediaGenerated: contents.filter((c: Content) => c.hasMedia).length,
          ttsGenerated: contents.filter((c: Content) => c.hasAudio).length,
          successRate: contents.length > 0 ? Math.round((contents.filter((c: Content) => c.status === 'completed').length / contents.length) * 100) : 0
        })
      }

      if (jobsData.success) {
        setRecentActivity(jobsData.data || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang di CREVID - Generator konten YouTube dengan AI
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Generate Content</CardTitle>
            </div>
            <CardDescription>
              Buat judul, deskripsi, dan naskah untuk video YouTube
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/generate-content">
              <Button className="w-full">Mulai Generate</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Image className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">Generate Media</CardTitle>
            </div>
            <CardDescription>
              Buat prompt untuk gambar/video setiap scene
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/generate-media">
              <Button className="w-full" variant="outline">Buat Media</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Volume2 className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Generate TTS</CardTitle>
            </div>
            <CardDescription>
              Convert naskah menjadi audio dengan AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/generate-tts">
              <Button className="w-full" variant="outline">Generate TTS</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : stats.totalContent}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalContent === 0 ? 'Belum ada konten' : 'Total konten'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Generated</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : stats.mediaGenerated}</div>
            <p className="text-xs text-muted-foreground">
              {stats.mediaGenerated === 0 ? 'Belum ada media' : 'Konten dengan media'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TTS Generated</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : stats.ttsGenerated}</div>
            <p className="text-xs text-muted-foreground">
              {stats.ttsGenerated === 0 ? 'Belum ada audio' : 'Konten dengan audio'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : `${stats.successRate}%`}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalContent === 0 ? 'Belum ada data' : 'Tingkat keberhasilan'}
            </p>
          </CardContent>
        </Card>
      </div>

      </div>

      {/* Recent Activity */}
      <div className="max-w-4xl mx-auto">
        <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>
            Riwayat generate content akan muncul di sini
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-muted-foreground mt-2">Memuat aktivitas...</p>
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity: Job, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg border">
                  <div className="flex-shrink-0">
                    {activity.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : activity.status === 'processing' ? (
                      <Clock className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.type === 'content_generation' && 'Content Generation'}
                      {activity.type === 'media_generation' && 'Media Generation'}
                      {activity.type === 'tts_generation' && 'TTS Generation'}
                      {activity.type === 'batch_operation' && 'Batch Operation'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Job ID: {activity.job_id || activity.id}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {new Date(activity.created_at || activity.createdAt).toLocaleDateString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Belum ada aktivitas</p>
              <p className="text-sm text-muted-foreground mt-2">
                Mulai dengan generate content pertama Anda
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}