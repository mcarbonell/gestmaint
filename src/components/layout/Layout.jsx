import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    ClipboardList,
    Users,
    Phone,
    Settings,
    LogOut,
    Menu,
    X,
    PlusCircle,
    HardHat
} from 'lucide-react';
import styles from './Layout.module.css'; // We'll create this next

export default function Layout() {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Role-based navigation items
    const getNavItems = () => {
        const common = [{ icon: Home, label: 'Inicio', to: '/' }];

        if (user?.role === 'controller') {
            return [
                ...common,
                { icon: ClipboardList, label: 'Incidencias', to: '/incidents' },
                { icon: Users, label: 'Agenda / Técnicos', to: '/contacts' },
            ];
        }

        if (user?.role === 'local') {
            return [
                ...common,
                { icon: HardHat, label: 'Mis Incidencias', to: '/my-incidents' },
            ];
        }

        if (user?.role === 'admin') {
            return [
                ...common,
                { icon: Users, label: 'Usuarios', to: '/users' },
                { icon: ClipboardList, label: 'Incidencias', to: '/incidents' },
                { icon: Phone, label: 'Agenda / Técnicos', to: '/contacts' },
                { icon: Settings, label: 'Configuración', to: '/settings' },
            ];
        }

        return common;
    };

    return (
        <div className={styles.layout}>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <div className={styles.brand}>Parque Albán</div>
                <button className={styles.menuBtn} onClick={toggleSidebar}>
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>ASVIAN</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, letterSpacing: '0.1em', marginTop: '0.25rem' }}>
                        GESTIÓN TÉCNICA
                    </div>
                </div>

                <div className={styles.userProfile}>
                    <div className={styles.avatar}>
                        {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>{user?.full_name || 'Cargando...'}</div>
                        <div className={styles.userRole}>{user?.role?.toUpperCase() || ''}</div>
                    </div>
                    <button
                        className={styles.logoutBtn}
                        onClick={logout}
                        title="Cerrar sesión"
                    >
                        <LogOut size={20} />
                    </button>
                </div>

                <nav className={styles.nav}>
                    {getNavItems().map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}
