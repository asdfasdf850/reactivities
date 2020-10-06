import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import 'semantic-ui-css/semantic.min.css'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
