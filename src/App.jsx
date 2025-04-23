import { useRef } from "react"
import About from "./components/about/About"
import Contact from "./components/contact/Contact"
import Footer from "./components/footer/Footer"
import Hero from "./components/hero/Hero"
import Menu from "./components/menu/Menu"
import Navbar from "./components/navbar/Navbar"

export default function App() {
  const menuRef = useRef(null);
  const contactRef = useRef(null);

  const handleScrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div>
      <Navbar onExploreClick={handleScrollToMenu} />
      <Hero onExploreClick={handleScrollToMenu} />
      <About />
      <Menu ref={menuRef} />
      <Contact ref={contactRef} />
      <Footer />
    </div>
  )
}
