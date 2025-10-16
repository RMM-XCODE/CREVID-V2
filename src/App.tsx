import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { GenerateContent } from '@/pages/GenerateContent'
import { GenerateMedia } from '@/pages/GenerateMedia'
import { GenerateTTS } from '@/pages/GenerateTTS'
import { ContentManagement } from '@/pages/ContentManagement'
import { Settings } from '@/pages/Settings'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/generate-content" element={<GenerateContent />} />
          <Route path="/generate-media" element={<GenerateMedia />} />
          <Route path="/generate-tts" element={<GenerateTTS />} />
          <Route path="/content-management" element={<ContentManagement />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App