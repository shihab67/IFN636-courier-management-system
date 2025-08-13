import { createRoot } from 'react-dom/client';

// third party
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// project imports
import App from 'App';
import * as serviceWorker from 'serviceWorker';
import { store } from './store/index';

// style + assets
import 'assets/scss/style.scss';
import config from './config';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContextProvider } from './store/modules/authContext';

// ==============================|| REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <AuthContextProvider>
    <Provider store={store}>
      <BrowserRouter basename={config.basename}>
        <>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition="Bounce"
          />
          <App />
        </>
      </BrowserRouter>
    </Provider>
  </AuthContextProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
