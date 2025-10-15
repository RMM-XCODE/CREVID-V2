
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Image, Volume2, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Dashboard() {
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
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +3 dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Generated</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 dari minggu lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TTS Generated</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +7 dari minggu lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              +0.5% dari bulan lalu
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
            Riwayat generate content dalam 7 hari terakhir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Video Tutorial React Hooks",
                type: "Content Generated",
                time: "2 jam yang lalu",
                status: "completed"
              },
              {
                title: "Thumbnail Design Tips",
                type: "Media Generated", 
                time: "4 jam yang lalu",
                status: "completed"
              },
              {
                title: "JavaScript ES6 Features",
                type: "TTS Generated",
                time: "6 jam yang lalu",
                status: "completed"
              },
              {
                title: "CSS Grid Layout Guide",
                type: "Content Generated",
                time: "1 hari yang lalu",
                status: "completed"
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  {activity.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.type}
                  </p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}