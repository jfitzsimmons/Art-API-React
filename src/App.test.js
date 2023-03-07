import { createRoot } from 'react-dom/client'
import App from './App'
const container = document.getElementById('App')
const root = createRoot(container)

it('renders without crashing', () => {
  root.render(<App tab="home" />)
  root.unmount()
})
