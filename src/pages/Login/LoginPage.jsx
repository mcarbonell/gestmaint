import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Wrench, Store, KeyRound } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (role) => {
        login(role);
        navigate('/');
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        className="btn btn-secondary"
                        style={{ justifyContent: 'flex-start', padding: '1rem' }}
                        onClick={() => handleLogin('admin')}
                    >
                        <ShieldCheck size={20} color="var(--color-primary)" />
                        <span>Entrar como Administrador</span>
                    </button>

                    <button
                        className="btn btn-secondary"
                        style={{ justifyContent: 'flex-start', padding: '1rem' }}
                        onClick={() => handleLogin('controller')}
                    >
                        <Wrench size={20} color="var(--color-accent)" />
                        <span>Entrar como Controlador</span>
                    </button>

                    <button
                        className="btn btn-secondary"
                        style={{ justifyContent: 'flex-start', padding: '1rem' }}
                        onClick={() => handleLogin('local')}
                    >
                        <Store size={20} color="var(--color-success)" />
                        <span>Entrar como Local</span>
                    </button>
                </div>

                <p style={{ marginTop: '2rem', fontSize: '0.8rem', textAlign: 'center', color: '#94a3b8' }}>
                    Seleccione un perfil para la demo interactiva.
                </p>
            </div>
        </div>
    );
}
