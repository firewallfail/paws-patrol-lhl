import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import Footer from './components/Footer';
import Map from './components/Map';
import Account from './components/Account';
import Device from './components/Device';
import Contact from './components/Contact';
import Confirm from './components/Confirm';
import Update from './components/Update';
import Perimeter from './components/Perimeter';

function App() {
  const [logged, setLogged] = useState(false);
  const [perimeters, setPerimeters] = useState([]);

  return (
    <>
      <Header logged={logged} setLogged={setLogged} />
      <Routes>
        <Route path="/" element={<Map interactive perimeter={false} track />} />
        <Route path="/device" element={<Device />} />
        <Route
          path="/perimeter"
          element={<Perimeter perimeters={perimeters} setPerimeters={setPerimeters} />}
        />
        <Route path="/account" element={<Account />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/update" element={<Update />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
        <Route path="/login" element={<Login logged={logged} setLogged={setLogged} />} />
        <Route path="/register" element={<Register logged={logged} setLogged={setLogged} />} />
        <Route
          path="*"
          element={
            <div className="d-flex justify-content-center align-items-center m-5 p-5">
              <h2>404 page not found</h2>
            </div>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
