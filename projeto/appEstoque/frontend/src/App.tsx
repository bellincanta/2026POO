import './App.css'
import { LoginPage } from './pages/LoginPage'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoginPage/>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App