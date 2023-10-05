import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
//import styles from "../styles/Home.module.css";

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

export default function Home(props) {
  return (
    <>
      <Head>
        <title>NANI Home</title>
        <meta name="description" content="Welcome to NANI!" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main>
        <h1>Welcome to NANI</h1>
        <p>is a web application that enables team leaders to submit evaluations on their employees to their leadership. This application streamlines the process of creating and managing employee evaluation reports, making it easier for team leaders to provide feedback and track employee performance.</p>
      </main>

    </>
  );
}
