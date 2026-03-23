import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { Box, CircularProgress, CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme.ts'
import { Api } from './api/api.ts'
import './i18n'

const Home = lazy(() => import('./views/home/home.tsx').then((m) => ({ default: m.Home })))
const Projects = lazy(() => import('./views/projects/projects.tsx').then((m) => ({ default: m.Projects })))
const Planner = lazy(() => import('./views/planner/planner.tsx').then((m) => ({ default: m.Planner })))
const LoadCalculator = lazy(() =>
  import('./views/load-calculator/load-calculator.tsx').then((m) => ({ default: m.LoadCalculator })),
)

const RouteLoader = () => (
  <Box sx={{ display: 'grid', placeItems: 'center', height: '100vh' }} data-cy="route-loader">
    <CircularProgress />
  </Box>
)

export const ApiInstance = new Api({ baseUrl: '', baseApiParams: { format: 'json' } })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              <Route path="/" element={<App />}>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/planner/:projectId" element={<Planner />} />
                <Route path="/load_calculator" element={<LoadCalculator />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
)