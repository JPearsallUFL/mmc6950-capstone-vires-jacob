import Link from "next/link";
import useLogout from "../../hooks/useLogout";

export default function Header(props) {
  const logout = useLogout();
  return (
    <header>
      <p>
        <Link href="/">NANI</Link>
      </p>
      <div>
      {props.isLoggedIn ? (
        <>
          <Link href="/search">Search</Link>
          <Link href="/myReports">My Saved Reports</Link>
          <a href="#" onClick={logout}>
            Logout
          </a>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
        </>
      )}
      </div>
    </header>
  );
}

