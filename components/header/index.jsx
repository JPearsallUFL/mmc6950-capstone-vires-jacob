import Link from "next/link";
import useLogout from "../../hooks/useLogout";
import {Container, Nav, Navbar, NavDropdown, Row, Col} from 'react-bootstrap'


export default function Header(props) {
  const logout = useLogout();
  return (

    //Header bg controlled by global css, not bootstrap
    <header>
      <Navbar expand = "lg">
        <Container>
          <Navbar.Brand href="/">
            <img 
              src="https://imageupload.io/ib/kK8ODRu2kWfytBI_1699628165.png" 
              height="75"
              className="d-inline-block align-top"
              alt="NANI Logo" 
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            {props.isLoggedIn ? (
              <>
              <Nav>
                <Nav.Link href="/search" className="link-danger fs-5">Search</Nav.Link>
                <Nav.Link href="/myReports" className="link-danger fs-5">My Saved Reports</Nav.Link>
                <Nav.Link href="/" onClick={logout} className="link-danger fs-5">Logout</Nav.Link>
              </Nav>
              </>
            ) : (
              <>
              <Nav>
                <Nav.Link href="/login" className="link-danger fs-5">Login</Nav.Link>
                <Nav.Link href="/signup" className="link-danger fs-5">Signup</Nav.Link>
              </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

