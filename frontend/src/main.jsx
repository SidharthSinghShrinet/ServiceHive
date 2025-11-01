import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { myRoutes } from './routes/Routing.jsx'
import { Provider } from 'react-redux'
import { store } from '../redux/store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={myRoutes}/>
  </Provider>
)
