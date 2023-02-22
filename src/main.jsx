import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { MoralisProvider } from 'react-moralis'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MoralisProvider initializeOnMount={false}>
      <App />
    </MoralisProvider>
  </React.StrictMode>
)
