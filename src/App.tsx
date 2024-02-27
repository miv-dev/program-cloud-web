import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RequireAuth from './helpers/RequireAuth';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />}/>
          <Route path='login' element={ <LoginPage/> } />
          {/*<Route element={<RequireAuth/>}>*/}

          {/*</Route>*/}
        </Route>
      </Routes>
    </>
  );
}

export default App;
