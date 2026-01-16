import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Phone, Search, Briefcase } from 'lucide-react';

export default function ContactsPage() {
    const { contacts } = useData();
    const [search, setSearch] = useState('');

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.specialty.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Agenda de Especialistas</h1>

            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                    type="text"
                    placeholder="Buscar por nombre o especialidad..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ paddingLeft: '3rem' }}
                />
            </div>

            <div className="grid-2">
                {filteredContacts.map(contact => (
                    <div key={contact.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '50%',
                            background: '#e0f2fe', color: '#0284c7',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Briefcase size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.25rem' }}>{contact.name}</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{contact.specialty}</p>
                        </div>
                        <a
                            href={`tel:${contact.phone}`}
                            className="btn btn-primary"
                            style={{ borderRadius: '50%', padding: '0.75rem' }}
                        >
                            <Phone size={20} />
                        </a>
                    </div>
                ))}

                {filteredContacts.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No se encontraron contactos.
                    </div>
                )}
            </div>
        </div>
    );
}
