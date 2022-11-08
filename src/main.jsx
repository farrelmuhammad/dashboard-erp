import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.css'
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './redux/store';
import persistStore from 'redux-persist/es/persistStore';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const persistor = persistStore(store)

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Suspense fallback={<Spin className='spin-loading' indicator={antIcon} />}>
            <App />
          </Suspense>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
