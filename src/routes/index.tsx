import HomePage from "../pages/HomePage";
import VenuePage from "../pages/VenuePage";
import ProfilePage from "../pages/ProfilePage";
import Layout from "../components/layout";

import { Route, Routes } from 'react-router-dom';


const AppRoutes = () => {
    return (
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="venue" element={<VenuePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
    );
  };
  
  export default AppRoutes;