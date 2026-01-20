import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Wrench, Store, KeyRound, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const { loginAsDemo } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (role) => {
        try {
            setLoading(true);
            setError('');
            await loginAsDemo(role);
            navigate('/');
        } catch (err) {
            setError('Error al iniciar sesión. ¿Has creado los usuarios en Supabase?');
            console.error(err);
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
            background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)'
        }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--color-primary)',
                        borderRadius: '16px',
                        margin: '0 auto 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <KeyRound size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Bienvenido</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Gestión de Mantenimiento</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2', color: '#991b1b',
                        padding: '0.75rem', borderRadius: '0.5rem',
                        marginBottom: '1rem', fontSize: '0.85rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        className="btn btn-secondary"
                        style={{ justifyContent: 'flex-start', padding: '1rem' }}
                        onClick={() => handleLogin('admin')}
                        disabled={loading}
                    >
                        <ShieldCheck size={20} color="var(--color-primary)" />
                        <span>Gestoría (Admin)</span>
                    </button>

                    <button
                        className="btn btn-secondary"
                        style={{ justifyContent: 'flex-start', padding: '1rem' }}
                        onClick={() => handleLogin('controller')}
                        disabled={loading}
                    >
                        <Wrench size={20} color="var(--color-accent)" />
                        <span>Mantenimiento</span>
                    </button>

                    <button
                        className="btn btn-secondary"
                        style={{ justifyContent: 'flex-start', padding: '1rem' }}
                        onClick={() => handleLogin('familycash@asvian.com')}
                        disabled={loading}
                    >
                        <Store size={20} color="var(--color-success)" />
                        <span>Local (FamilyCash)</span>
                    </button>

                    <button
                        className="btn btn-secondary"
                        style={{ justifyContent: 'flex-start', padding: '1rem' }}
                        onClick={() => handleLogin('buffet@asvian.com')}
                        disabled={loading}
                    >
                        <Store size={20} color="var(--color-success)" />
                        <span>Local (Buffet Colonial)</span>
                    </button>
                </div>

                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                        <Loader2 className="spinner" size={24} color="var(--color-primary)" />
                    </div>
                )}

                <p style={{ marginTop: '2rem', fontSize: '0.8rem', textAlign: 'center', color: '#94a3b8' }}>
                    Requiere que los usuarios estén creados en Supabase Auth.<br />
                    Contraseña demo: <b>gestmaint2026</b>
                </p>
            </div>
        </div>
    );
}
