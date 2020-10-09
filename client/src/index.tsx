import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'

import './app/layout/styles.css'
import App from './app/layout/App'
import ScrollToTop from 'app/layout/ScrollToTop'
import * as serviceWorker from './serviceWorker'

render(
  <BrowserRouter>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </BrowserRouter>,
  document.getElementById('root')
)

serviceWorker.unregister()
