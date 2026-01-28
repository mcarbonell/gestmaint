import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Save, Loader2, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
    const { user, updateProfile } = useAuth();
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await updateProfile({ full_name: fullName });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Error al actualizar el perfil: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Configuración</h1>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                            <Mail size={16} inline style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            className="input"
                            value={user?.email || ''}
                            disabled
                            style={{ background: '#f8fafc', cursor: 'not-allowed' }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            El correo no se puede cambiar por seguridad.
                        </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            <User size={16} inline style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            className="input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Tu nombre completo"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                            <Shield size={16} inline style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            Rol asignado
                        </label>
                        <div style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            background: '#f1f5f9',
                            borderRadius: '1rem',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#475569',
                            textTransform: 'capitalize'
                        }}>
                            {user?.role === 'admin' ? 'Gestoría' : (user?.role === 'controller' ? 'Mantenimiento' : 'Local')}
                        </div>
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', background: '#fef2f2', padding: '0.75rem', borderRadius: '0.5rem' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        {loading ? (
                            <Loader2 className="spinner" size={20} />
                        ) : success ? (
                            <><CheckCircle size={20} style={{ marginRight: '0.5rem' }} /> Guardado</>
                        ) : (
                            <><Save size={20} style={{ marginRight: '0.5rem' }} /> Guardar Cambios</>
                        )}
                    </button>
                </form>
            </div>

            <div className="card" style={{ marginTop: '2rem', border: '1px solid #e2e8f0', background: '#fafafa' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Sobre la cuenta</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Esta cuenta está vinculada a {user?.role === 'local' ? 'un establecimiento' : 'los servicios centrales'} del Parque Comercial Albán.
                    Si necesitas cambiar de rol o reportar un error de acceso, contacta con administración.
                </p>
            </div>
        </div>
    );
}
