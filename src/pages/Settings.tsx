import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Settings as SettingsIcon, 
  Key, 
  User, 
  Save,
  Eye,
  EyeOff,
  Cloud,
  Folder
} from 'lucide-react'

export function Settings() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    openaiApiKey: '',
    openaiModel: 'gpt-4',
    openaiMaxTokens: 2000,
    openaiTemperature: 0.7,
    gofileToken: '',
    gofileRootFolder: 'CREVID_Content',
    qstashToken: '',
    qstashCurrentSigningKey: '',
    qstashNextSigningKey: '',
    rateLimitPerHour: 100,
    maxConcurrentJobs: 5,
    jobTimeoutMinutes: 10,
    jobRetryAttempts: 3,
    // UI preferences
    notifications: true,
    autoSave: false,
    theme: 'light',
    userName: '',
    email: ''
  })

  // Fetch settings dari backend
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/settings')
      const data = await response.json()
      
      if (data.success) {
        setSettings(prev => ({
          ...prev,
          ...data.data
        }))
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch('http://localhost:3001/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Settings berhasil disimpan!')
        // Refresh settings to get updated data
        await fetchSettings()
      } else {
        throw new Error(data.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Gagal menyimpan settings: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Konfigurasi aplikasi dan preferensi pengguna
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <CardTitle>API Configuration</CardTitle>
            </div>
            <CardDescription>
              Konfigurasi OpenAI API untuk generate content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">OpenAI API Key</label>
              <div className="relative">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={settings.openaiApiKey}
                  onChange={(e) => setSettings({...settings, openaiApiKey: e.target.value})}
                  placeholder="Masukkan OpenAI API Key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Model</label>
              <select 
                value={settings.openaiModel}
                onChange={(e) => setSettings({...settings, openaiModel: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Max Tokens</label>
              <Input
                type="number"
                value={settings.openaiMaxTokens}
                onChange={(e) => setSettings({...settings, openaiMaxTokens: parseInt(e.target.value) || 2000})}
                placeholder="2000"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Temperature</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={settings.openaiTemperature}
                onChange={(e) => setSettings({...settings, openaiTemperature: parseFloat(e.target.value) || 0.7})}
                placeholder="0.7"
              />
            </div>
          </CardContent>
        </Card>

        {/* GoFile API Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Cloud className="h-5 w-5" />
              <CardTitle>GoFile API</CardTitle>
            </div>
            <CardDescription>
              Konfigurasi GoFile untuk penyimpanan media dan audio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">GoFile API Token</label>
              <div className="relative">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={settings.gofileToken}
                  onChange={(e) => setSettings({...settings, gofileToken: e.target.value})}
                  placeholder="Masukkan GoFile API Token"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Token untuk upload dan manage files di GoFile
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Root Folder Name</label>
              <div className="relative">
                <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={settings.gofileRootFolder}
                  onChange={(e) => setSettings({...settings, gofileRootFolder: e.target.value})}
                  placeholder="CREVID_Content"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Nama folder utama untuk menyimpan semua konten
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Struktur Penyimpanan:</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p>📁 {settings.gofileRootFolder}/</p>
                <p className="ml-4">📁 Tutorial_React_Hooks/</p>
                <p className="ml-8">🖼️ scene_1_intro.jpg</p>
                <p className="ml-8">🎵 full_script_audio.mp3</p>
                <p className="ml-4">📁 JavaScript_ES6_Features/</p>
                <p className="ml-8">🎬 scene_2_demo.mp4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>User Profile</CardTitle>
            </div>
            <CardDescription>
              Informasi profil pengguna
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nama Lengkap</label>
              <Input
                value={settings.userName}
                onChange={(e) => setSettings({...settings, userName: e.target.value})}
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({...settings, email: e.target.value})}
                placeholder="Masukkan email"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Bio</label>
              <Textarea
                placeholder="Ceritakan tentang diri Anda..."
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

        </div>

        {/* Preferences - Full Width */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <CardTitle>App Preferences</CardTitle>
            </div>
            <CardDescription>
              Pengaturan preferensi dan konfigurasi aplikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Notifications</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Push Notifications</label>
                    <p className="text-xs text-muted-foreground">Terima notifikasi untuk update</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Auto Save</label>
                    <p className="text-xs text-muted-foreground">Simpan otomatis setiap perubahan</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => setSettings({...settings, autoSave: e.target.checked})}
                    className="rounded"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Appearance</h4>
                <div>
                  <label className="text-sm font-medium mb-2 block">Theme</label>
                  <select 
                    value={settings.theme}
                    onChange={(e) => setSettings({...settings, theme: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Content Generation</h4>
                <div>
                  <label className="text-sm font-medium mb-2 block">Default Max Tokens</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="1000">1000 (Short)</option>
                    <option value="2000">2000 (Medium)</option>
                    <option value="4000">4000 (Long)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Auto Generate Media</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="manual">Manual</option>
                    <option value="auto">Automatic</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">File Management</h4>
                <div>
                  <label className="text-sm font-medium mb-2 block">Auto Upload to GoFile</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">File Retention</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                    <option value="forever">Forever</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Save Button */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleSaveSettings} 
            disabled={saving || loading}
            className="px-12 py-3 text-base"
          >
            <Save className="mr-2 h-5 w-5" />
            {saving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}