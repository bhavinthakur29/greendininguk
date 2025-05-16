import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import LoginModal from '../../components/LoginModal/LoginModal';
import './AdminLogin.css';

const AdminLogin = () => {
    const [showModal, setShowModal] = useState(true);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/');
    };

    return (
        <div className="admin-login-page">
            <LoginModal isOpen={showModal} onClose={handleCloseModal} />
        </div>
    );
};

export default AdminLogin; 