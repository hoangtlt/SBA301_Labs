import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();

  return (
    <Navbar expand="lg" className="app-navbar mb-4">
      <Container>
        <div className="d-flex align-items-center gap-2">
          <Navbar.Brand as={Link} to="/" className="navbar-brand-title mb-0">
            Orchid Management
          </Navbar.Brand>
          <span className="navbar-brand-badge">SBA301</span>
        </div>

        <Navbar.Toggle aria-controls="app-navbar-nav" className="border-0 text-white" />

        <Navbar.Collapse id="app-navbar-nav">
          <Nav className="ms-auto gap-1">
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link-item ${location.pathname === "/" ? "active" : ""}`}
            >
              List
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/orchids/new"
              className={`nav-link-item ${location.pathname === "/orchids/new" ? "active" : ""}`}
            >
              Create
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
