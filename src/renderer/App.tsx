import {
  MemoryRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import Home from './components/Home';
import Layout from './components/Layout';
import { useEffect } from 'react';
import Train from './components/Train';
import SelectDataset from './components/SelectDataset';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';
import DatasetViewer from './components/DatasetViewer';
import SavedDatasets from './components/SavedDatasets';

export default function App() {
  const data = {};
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AppContent data={data} />
        </Router>
      </PersistGate>
    </Provider>
  );
}

const AppContent = ({ data }: { data: any }) => {
  const location = useLocation();
  const noLayoutPaths = [
    '/signup',
    '/login',
    '/pricing',
    '/',
    '/contests',
    '/confirmation',
  ];
  const useLayout = !noLayoutPaths.includes(location.pathname);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !localStorage.getItem('userId') &&
      !window.location.href.includes('contests')
    ) {
      // navigate("/");
    }
    if (location.pathname == '/') {
      navigate('/dashboard');
    }
  }, []);

  console.log(location.pathname);

  return (
    <div>
      <Layout data={data}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/train" element={<Train />} />
          <Route path="/select" element={<SelectDataset />} />
          <Route path="/dataset-viewer" element={<DatasetViewer />} />
          <Route path="/saved-datasets" element={<SavedDatasets />} />
        </Routes>
      </Layout>
      {/* <ToastContainer /> */}
    </div>
  );
};
