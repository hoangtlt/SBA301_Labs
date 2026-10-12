import { Container, Nav, Navbar } from "react-bootstrap";

function AppNavBar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="md">
      <Container>
        <Navbar.Brand href="#">Orchid Gallery</Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#orchids">Orchids</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavBar;