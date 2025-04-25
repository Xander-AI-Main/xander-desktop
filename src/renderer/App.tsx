import { MemoryRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import Home from './components/Home';
import Layout from './components/Layout';
import { useEffect } from 'react';

export default function App() {
  const data = {}
  return (
    <Router>
      <AppContent data={data} />
    </Router>
  );
}

const AppContent = ({ data }: {data: any}) => {
  const location = useLocation();
  const noLayoutPaths = ["/signup", "/login", "/pricing", "/", "/contests", '/confirmation'];
  const useLayout = !noLayoutPaths.includes(location.pathname);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("userId") && !window.location.href.includes("contests")) {
      // navigate("/");
    }
  }, []);

  return (
    <div>
        <Layout data={data}>
          <Routes>
            <Route path="/home" element={<Home />} />
          </Routes>
        </Layout>
      {/* <ToastContainer /> */}
    </div>
  );
};

