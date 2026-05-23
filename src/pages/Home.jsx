import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Upload from "../components/Upload";
import "../index.css";
import "../styles/home.css";
import { Subjects } from "../components/Subjects";

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <Subjects />
      <Upload />
    </div>
  );
}