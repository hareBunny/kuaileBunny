import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Kuaile8 from './pages/Kuaile8'
import Latest from './pages/Latest'
import History from './pages/History'
import BasicStats from './pages/BasicStats'
import Profile from './pages/Profile'
import Membership from './pages/Membership'
import Login from './pages/Login'
import Disclaimer from './pages/Disclaimer'
import DisclaimerModal from './components/DisclaimerModal'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <DisclaimerModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kuaile8" element={<Kuaile8 />} />
        <Route path="/latest" element={<Latest />} />
        <Route path="/history" element={<History />} />
        <Route path="/basic-stats" element={<BasicStats />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/login" element={<Login />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
