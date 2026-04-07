import AppRouter from './router/AppRouter'
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

// Set backend base URL from environment variable
// Dev: http://localhost:3000 | Production: your deployed backend URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"

function App() {
  return (
    <>
     <AppRouter></AppRouter>
     <ToastContainer
        position="top-center"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
        toastClassName="!rounded-2xl !shadow-xl !backdrop-blur-md !bg-white/90 border border-gray-100/50 mt-4 mx-4 sm:mx-0 font-medium font-sans text-gray-800"
        bodyClassName="!p-1 text-sm"
      />
    </>
  )
}

export default App