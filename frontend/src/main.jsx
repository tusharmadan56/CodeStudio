import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, theme } from 'antd'
import './index.css'
import { AppRoutes } from './routes/AppRoutes'
import { AuthProvider } from './components/auth/AuthProvider'

const queryClient = new QueryClient()

// terminal-brutalist: full mono, sharp corners, Dracula green as the only accent
const appTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#50fa7b',
    colorBgBase: '#191a21',
    colorTextBase: '#f8f8f2',
    colorBorder: '#44475a',
    colorLink: '#8be9fd',
    borderRadius: 0,
    fontFamily: "'JetBrains Mono', 'Cascadia Code', ui-monospace, Consolas, monospace",
    fontSize: 13,
  },
  components: {
    // dark text on the green primary button — antd would default to white
    Button: { primaryColor: '#191a21', fontWeight: 500 },
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={appTheme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  </StrictMode>,
)
