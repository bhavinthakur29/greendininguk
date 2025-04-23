import React, { useState, useEffect, forwardRef } from 'react';
import './Menu.css';

const menuItems = [
    {
        name: 'Avocado Salad',
        description: 'Fresh avocado with greens, cherry tomatoes, and citrus dressing.',
        price: '£9.99',
        image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
        name: 'Vegan Buddha Bowl',
        description: 'Quinoa, chickpeas, roasted veggies, and tahini sauce.',
        price: '£11.50',
        image: 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
        name: 'Zucchini Noodles',
        description: 'Spiralized zucchini tossed with pesto and cherry tomatoes.',
        price: '£10.00',
        image: 'https://images.pexels.com/photos/793759/pexels-photo-793759.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
        name: 'Stuffed Peppers',
        description: 'Bell peppers stuffed with rice, lentils, and herbs.',
        price: '£9.50',
        image: 'https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
];

const Menu = forwardRef((props, ref) => {
    const [modalItem, setModalItem] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="menu-section" ref={ref}>
            <h2>Our Menu</h2>
            <p>Explore our delicious, sustainable, and healthy dishes!</p>
            <div className="menu-grid">
                {menuItems.map((item, index) => (
                    <div className="menu-card" key={index}>
                        <img src={item.image} alt={item.name} />
                        <div className="menu-card-body">
                            <h3>{item.name}</h3>
                            <p className="price">{item.price}</p>
                            <button onClick={() => setModalItem(item)}>More Info</button>
                        </div>
                    </div>
                ))}
            </div>

            {modalItem && (
                <div className="modal" onClick={() => setModalItem(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={() => setModalItem(null)}>&times;</span>
                        <img src={modalItem.image} alt={modalItem.name} />
                        <h2>{modalItem.name}</h2>
                        <p>{modalItem.description}</p>
                        <p className="modal-price">{modalItem.price}</p>
                    </div>
                </div>
            )}

            {showScrollTop && (
                <button className="scroll-to-top" onClick={scrollToTop}>
                    ↑ Top
                </button>
            )}
        </section>
    );
});

export default Menu;
