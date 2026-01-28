import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const { login, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSlow, setIsSlow] = useState(false);

    // Monitor for slow initial load
    useEffect(() => {
        if (authLoading) {
            const timer = setTimeout(() => setIsSlow(true), 3000);
            return () => clearTimeout(timer);
        } else {
            setIsSlow(false);
        }
    }, [authLoading]);

    // If already authenticated, go home
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        const savedEmail = localStorage.getItem('asvian_remembered_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');

            await login(email, password);

            if (rememberMe) {
                localStorage.setItem('asvian_remembered_email', email);
            } else {
                localStorage.removeItem('asvian_remembered_email');
            }

            // Navigation will be handled by the useEffect above
        } catch (err) {
            console.error('Login error:', err);
            if (err.message === 'Invalid login credentials') {
                setError('Email o contraseña incorrectos.');
            } else if (err.message === 'Profile not found') {
                setError('Usuario autenticado pero sin perfil configurado. Contacte soporte.');
            } else if (err.message.includes('fetch')) {
                setError('Error de conexión. Verifique su internet.');
            } else {
                setError('Error al iniciar sesión: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            padding: '1rem'
        }}>
            <div className="card" style={{
                maxWidth: '440px',
                width: '100%',
                padding: '3rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                borderRadius: '1.5rem'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        background: 'linear-gradient(to bottom right, #3b82f6, #1e40af)',
                        borderRadius: '20px',
                        margin: '0 auto 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <KeyRound size={36} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1e293b' }}>ASVIAN</h1>
                    <p style={{ color: '#64748b', fontWeight: 500 }}>Gestión de Mantenimiento</p>
                </div>

                {(isSlow && authLoading) && (
                    <div style={{
                        background: '#fffbeb',
                        color: '#92400e',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.75rem',
                        marginBottom: '1.5rem',
                        fontSize: '0.85rem',
                        textAlign: 'center',
                        border: '1px solid #fef3c7',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Loader2 className="spinner" size={16} />
                        La conexión es lenta. Espere un momento...
                    </div>
                )}

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        color: '#991b1b',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        border: '1px solid #fee2e2'
                    }}>
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>
                            Email
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="email"
                                className="input"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ paddingLeft: '3rem', background: '#f8fafc' }}
                            />
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>
                                Contraseña
                            </label>
                            <a href="#" onClick={(e) => { e.preventDefault(); alert('Ponte en contacto con el administrador para resetear tu contraseña.'); }}
                                style={{ fontSize: '0.85rem', color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                                ¿Olvidaste la contraseña?
                            </a>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingLeft: '3rem', paddingRight: '3rem', background: '#f8fafc' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#94a3b8',
                                    cursor: 'pointer',
                                    padding: '0.25rem'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            style={{ width: '1rem', height: '1rem' }}
                        />
                        <label htmlFor="remember" style={{ fontSize: '0.9rem', color: '#64748b', cursor: 'pointer' }}>
                            Recordar email
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            height: '3.5rem',
                            fontSize: '1rem',
                            fontWeight: 700,
                            justifyContent: 'center',
                            borderRadius: '0.75rem',
                            marginTop: '0.5rem'
                        }}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="spinner" size={24} /> : 'Iniciar Sesión'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        Para fines de demostración:<br />
                        Contraseña: <b>gestmaint2026</b>
                    </p>
                </div>
            </div>
        </div>
    );
}
