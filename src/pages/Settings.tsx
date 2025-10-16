import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ErrorModal } from '@/components/ui/error-modal'
import { useErrorHandler } from '@/hooks/useErrorHandler'
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
  const { errorState, showError, hideError, handleFetchError } = useErrorHandler()
  const [settings, setSettings] = useState({
    openaiApiKey: '',
    openaiModel: 'gpt-4o',
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
      
      if (!response.ok) {
        await handleFetchError(response, 'Gagal mengambil data settings')
        return
      }
      
      const data = await response.json()
      
      if (data.success) {
        setSettings(prev => ({
          ...prev,
          ...data.data
        }))
      } else {
        showError('Settings Error', 'Gagal mengambil data settings', data)
      }
    } catch (error) {
      showError('Network Error', 'Gagal terhubung ke server', error)
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

      if (!response.ok) {
        await handleFetchError(response, 'Gagal menyimpan settings')
        return
      }

      const data = await response.json()
      
      if (data.success) {
        alert('Settings berhasil disimpan!')
        // Refresh settings to get updated data
        await fetchSettings()
      } else {
        showError('Save Error', 'Gagal menyimpan settings', data)
      }
    } catch (error) {
      showError('Network Error', 'Gagal terhubung ke server saat menyimpan', error)
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

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
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
              <Input
                type="text"
                value={settings.openaiModel}
                onChange={(e) => setSettings({...settings, openaiModel: e.target.value})}
                placeholder="Masukkan nama model OpenAI (contoh: gpt-4o, gpt-4o-mini, gpt-4)"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Masukkan nama model OpenAI yang ingin digunakan. Contoh: gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-4, gpt-3.5-turbo
              </p>
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

        {/* QStash Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <CardTitle>QStash Configuration</CardTitle>
            </div>
            <CardDescription>
              Konfigurasi QStash untuk background job processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">QStash Token</label>
              <div className="relative">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={settings.qstashToken}
                  onChange={(e) => setSettings({...settings, qstashToken: e.target.value})}
                  placeholder="Masukkan QStash Token"
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
                Token untuk mengakses QStash API
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Current Signing Key</label>
              <div className="relative">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={settings.qstashCurrentSigningKey}
                  onChange={(e) => setSettings({...settings, qstashCurrentSigningKey: e.target.value})}
                  placeholder="Masukkan Current Signing Key"
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
                Key untuk verifikasi signature webhook
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Next Signing Key</label>
              <div className="relative">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={settings.qstashNextSigningKey}
                  onChange={(e) => setSettings({...settings, qstashNextSigningKey: e.target.value})}
                  placeholder="Masukkan Next Signing Key"
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
                Key untuk rotasi signature (opsional)
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-medium text-green-800 mb-2">QStash Features:</h4>
              <div className="text-xs text-green-700 space-y-1">
                <p>⚡ Background job processing</p>
                <p>🔄 Automatic retry mechanism</p>
                <p>📊 Job status tracking</p>
                <p>⏰ Scheduled task execution</p>
                <p>🔐 Secure webhook verification</p>
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
        <Card className="xl:col-span-4">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <CardTitle>App Preferences & Job Configuration</CardTitle>
            </div>
            <CardDescription>
              Pengaturan preferensi aplikasi dan konfigurasi job processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Job Processing</h4>
                <div>
                  <label className="text-sm font-medium mb-2 block">Rate Limit (per hour)</label>
                  <Input
                    type="number"
                    value={settings.rateLimitPerHour}
                    onChange={(e) => setSettings({...settings, rateLimitPerHour: parseInt(e.target.value) || 100})}
                    placeholder="100"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maksimal job per jam
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Max Concurrent Jobs</label>
                  <Input
                    type="number"
                    value={settings.maxConcurrentJobs}
                    onChange={(e) => setSettings({...settings, maxConcurrentJobs: parseInt(e.target.value) || 5})}
                    placeholder="5"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Job bersamaan maksimal
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Job Timeout (minutes)</label>
                  <Input
                    type="number"
                    value={settings.jobTimeoutMinutes}
                    onChange={(e) => setSettings({...settings, jobTimeoutMinutes: parseInt(e.target.value) || 10})}
                    placeholder="10"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Timeout untuk setiap job
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Retry Attempts</label>
                  <Input
                    type="number"
                    value={settings.jobRetryAttempts}
                    onChange={(e) => setSettings({...settings, jobRetryAttempts: parseInt(e.target.value) || 3})}
                    placeholder="3"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Jumlah retry jika gagal
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Save Button */}
      <div className="max-w-7xl mx-auto">
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