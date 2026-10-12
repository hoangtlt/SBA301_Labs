import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ListOfOrchids from "./components/ListOfOrchids";
import EditOrchid from "./components/EditOrchid";
import OrchidDetail from "./components/OrchidDetail";

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="container py-4 flex-grow-1" style={{ maxWidth: "1140px" }}>
        <Routes>
          <Route path="/" element={<ListOfOrchids />} />
          <Route path="/orchids/:id" element={<OrchidDetail />} />
          <Route path="/orchids/:id/edit" element={<EditOrchid />} />
          <Route path="/orchids/new" element={<EditOrchid createMode />} />
        </Routes>
      </main>
      <footer className="py-3 text-center text-secondary border-top bg-white small">
        SBA301 - Lab 05 • Orchid Management Single Page Application
      </footer>
    </div>
  );
}
