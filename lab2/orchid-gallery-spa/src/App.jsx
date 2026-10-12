// src/App.jsx
import NavBar from './components/NavBar';
import Orchids from './components/Orchids';

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="flex-grow-1">
        <Orchids />
      </main>
      <footer className="bg-light text-center py-3 border-top mt-auto text-muted">
        <small>&copy; {new Date().getFullYear()} Orchid Gallery SPA - SBA301 Lab 02 &amp; Slot 9</small>
      </footer>
    </div>
  );
}
