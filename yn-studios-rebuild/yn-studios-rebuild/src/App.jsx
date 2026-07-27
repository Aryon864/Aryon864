import { ReactLenis } from "lenis/react";
import "./App.css";
import ScrollToTop from "./Components/ScrollToTop";
import { BrowserRouter, Route, Routes } from "react-router";
import ProjectPage from "./Components/Project";
import Main from "./Components/Main";
import NoPage from "./Components/NoPage";
import ContactForm from "./Components/Form";

function App() {
  return (
    <>
      <ReactLenis root />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
