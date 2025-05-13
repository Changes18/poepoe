import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Main from "./Pages/Main.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login.tsx";
import Register from "./Pages/Register.tsx";
import Account from "./Pages/Account.tsx";
import NikeSlider from "./components/NikeSlider.tsx";
import Page from "./Pages/Catalog.tsx";
import Footer from "./components/Footer.tsx";
import AdminPanel from "./Pages/AdminPanel.tsx";
import Basket from "./Pages/Basket.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/slider" element={<NikeSlider />} />
        <Route path="/page" element={<Page />} />
        <Route path="/ft" element={<Footer />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/bask" element={<Basket />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
