import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Home } from './views/home/home.tsx'
import { Projects } from './views/projects/projects.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme.ts'
import { Api } from './api/api.ts'
import { Planner } from './views/planner/planner.tsx'
import { LoadCalculator } from './views/load-calculator/load-calculator.tsx'
import './i18n';

export const ApiInstance = new Api({ baseUrl: '', baseApiParams: { format: 'json' } })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/planner/:projectId" element={<Planner />} />
              <Route path="/load_calculator" element={<LoadCalculator />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
