import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Creating the CartContext
export const CartContext = createContext({
    cartItems: [],
    addToCart: () => { },
    removeFromCart: () => { },
    updateQuantity: () => { },
    totalItems: 0,
    totalPrice: 0,
});

// Creating a custom hook to use the CartContext
export const useCart = () => {
    return useContext(CartContext);
};

// CartProvider that will wrap around your app
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Initialize cart from localStorage
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
            toast.success(`${product.name} quantity updated in cart!`);
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
            toast.success(`${product.name} added to cart!`);
        }
    };

    const removeFromCart = (productId) => {
        const removedItem = cartItems.find(item => item.id === productId);
        setCartItems(cartItems.filter(item => item.id !== productId));
        if (removedItem) {
            toast.info(`${removedItem.name} removed from cart!`);
        }
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const updatedItem = cartItems.find(item => item.id === productId);
        setCartItems(cartItems.map(item =>
            item.id === productId ? { ...item, quantity } : item
        ));
        if (updatedItem) {
            toast.info(`${updatedItem.name} quantity updated to ${quantity}!`);
        }
    };

    const cartContextValue = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems: cartItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    };

    return (
        <CartContext.Provider value={cartContextValue}>
            {children}
        </CartContext.Provider>
    );
};
