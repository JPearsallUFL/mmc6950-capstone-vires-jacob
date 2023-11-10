import Head from "next/head";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import { useRouter } from "next/router";
import { useState } from "react";
import singlePerner from "../hooks/singlePerner";
import { Container } from "react-bootstrap";
import { getRouteMatcher } from "next/dist/shared/lib/router/utils/route-matcher";
import { dbConnect } from "../db/controllers/util";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const { user } = req.session;
    const props = {};
    if (user) {
      props.user = req.session.user;
    }
    props.isLoggedIn = !!user;
    return { props };
  },
  sessionOptions
);

export default function Signup(props) {
    const router = useRouter();
    const [{username, pernr, password, "confirm-password": confirmPassword}, setForm,]=useState({
        username: "",
        pernr: "",
        password: "",
        "confirm-password": "",
    });
    const [error, setError] = useState("");

    function handleChange(e){
        setForm({
            username, pernr, password, "confirm-password": confirmPassword, ...{[e.target.name]:e.target.value.trim()},
        });
    }
    async function handleCreateAccount(e){
        e.preventDefault();
        if (!username.trim()) return setError("Must include username");
        if (!pernr.trim()) return setError("Must include pernr");
        if (!password.trim()) return setError("Must include password");
        if (!confirmPassword.trim()) return setError("Please confirm password");
        if (password !== confirmPassword) return setError("Passwords must match");

        try {
            const rostrRes = await singlePerner(pernr)
            const firstName = rostrRes.first_name
            const lastName = rostrRes.last_name
            const department = rostrRes.organizational_unit_name
            const emailAddress = rostrRes.email
            const supervisorName = rostrRes.supervisor.full_name
            const supervisorEmail = rostrRes.supervisor.email
            const resPernr = rostrRes.pernr
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({username, password, firstName, lastName, emailAddress, department, supervisorName, supervisorEmail, pernr}),
            });

            if (res.status === 200) return router.push("/login");
            else{
                const signupError = await res.text();
            }
            const {error: message} = await res.json();
            setError(message);
        }
        catch (err){
            console.log(err);
        }
    }
  return (
    <>
      <Head>
        <title>NANI User Signup</title>
        <meta name="description" content="Creat an account on NANI" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn}/>

      <Container>
        <main>
          <div className="signup_form">
            <h1>Create an account:</h1>
            <form onSubmit={handleCreateAccount}>
                <div className="fields">
                  <label htmlFor="username">Username:</label>
                  <input type="text" name="username" id="username" onChange={handleChange} value={username} />
                  <label htmlFor="pernr">Pernr:</label>
                  <input type="text" name="pernr" id="pernr" onChange={handleChange} value={pernr} />
                  <label htmlFor="password">Password:</label>
                  <input type="password" name="password" id="password" onChange={handleChange} value={password} />
                  <label htmlFor="confirm-password">Confirm Password:</label>
                  <input type="password" name="confirm-password" id="confirm-password" onChange={handleChange} value={confirmPassword} />
                </div>
                <div><button>Submit</button></div>
                {error && <p>{error}</p>}
            </form>
            </div>
        </main>
      </Container>
    </>
  );
}
