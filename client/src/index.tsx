import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import 'react-toastify/dist/ReactToastify.min.css'
import 'semantic-ui-css/semantic.min.css'

import './app/layout/styles.css'
import App from './app/layout/App'
import ScrollToTop from 'app/layout/ScrollToTop'
import * as serviceWorker from './serviceWorker'

export const history = createBrowserHistory()

render(
  <Router history={history}>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </Router>,
  document.getElementById('root')
)

serviceWorker.unregister()
