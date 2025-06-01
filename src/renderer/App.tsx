import {
  MemoryRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import Home from './screens/Home';
import Layout from './screens/Layout';
import { useEffect } from 'react';
import Train from './screens/Train';
import SelectDataset from './screens/SelectDataset';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';
import DatasetViewer from './screens/DatasetViewer';
import SavedDatasets from './screens/SavedDatasets';
import MainTrainer from './screens/MainTrainer';
import SavedModels from './screens/SavedModels';
import ModelPlayground from './screens/ModelPlayground';

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
          <Route path="/main-trainer" element={<MainTrainer />} />
          <Route path="/saved-models" element={<SavedModels />} />
          <Route path="/model-playground" element={<ModelPlayground />} />
        </Routes>
      </Layout>
      {/* <ToastContainer /> */}
    </div>
  );
};
