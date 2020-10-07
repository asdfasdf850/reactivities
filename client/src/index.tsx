import React from 'react'
import { render } from 'react-dom'
import 'semantic-ui-css/semantic.min.css'

import './app/layout/styles.css'
import App from './app/layout/App'
import * as serviceWorker from './serviceWorker'

render(<App />, document.getElementById('root'))

serviceWorker.unregister()
