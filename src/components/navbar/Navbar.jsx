import './Navbar.css'

export default function Navbar({ onExploreClick }) {
    return (
        <nav className="navbar">
            <div title='Green Dining' className="logo">Green Dining</div>
            <ul className="nav-links">
                <li><a href="#about" onClick={onExploreClick}>About</a></li>
                <li><a href="#menu" onClick={onExploreClick}>Menu</a></li>
                <li><a href="#contact" onClick={onExploreClick}>Contact</a></li>
            </ul>
        </nav>
    )
}
