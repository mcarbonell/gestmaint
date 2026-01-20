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
    PlusCircle
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
                <div className={styles.brand}>GestMaint</div>
                <button className={styles.menuBtn} onClick={toggleSidebar}>
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>GestMaint</div>
                    <div className={styles.roleBadge}>{user?.role?.toUpperCase()}</div>
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

                <div className={styles.userProfile}>
                    <img src={user?.avatar} alt="User" className={styles.avatar} />
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>{user?.name}</div>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            <LogOut size={16} /> Salir
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}
