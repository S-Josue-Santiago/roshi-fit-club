// roshi_fit/src/pages/dashboard/settings/GeneralSettings.tsx
import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSetting } from '../../../api/settingApi';

const GeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    nombre_sitio: '',
    telefono: '',
    email_contacto: '',
    horario_apertura: '',
    direccion: '',
    facebook_url: '',
    instagram_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        setSettings({
          nombre_sitio: data.nombre_sitio || '',
          telefono: data.telefono || '',
          email_contacto: data.email_contacto || '',
          horario_apertura: data.horario_apertura || '',
          direccion: data.direccion || '',
          facebook_url: data.facebook_url || '',
          instagram_url: data.instagram_url || '',
        });
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      for (const [clave, valor] of Object.entries(settings)) {
        await updateSetting(clave, valor);
      }
      setMessage('Configuración guardada exitosamente.');
    } catch (error) {
      console.error('Error al guardar:', error);
      setMessage('Error al guardar la configuración.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-dashboard-text">Cargando configuración...</p>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-dashboard-primary mb-6">Configuración General</h1>

      {message && (
        <div className={`p-3 mb-6 rounded ${message.includes('Error') ? 'bg-red-800/50 text-red-200' : 'bg-green-800/50 text-green-200'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-dashboard-text-secondary mb-2">Nombre del Sitio</label>
          <input
            name="nombre_sitio"
            value={settings.nombre_sitio}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
        </div>

        <div>
          <label className="block text-sm text-dashboard-text-secondary mb-2">Teléfono</label>
          <input
            name="telefono"
            value={settings.telefono}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
        </div>

        <div>
          <label className="block text-sm text-dashboard-text-secondary mb-2">Email de Contacto</label>
          <input
            name="email_contacto"
            type="email"
            value={settings.email_contacto}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
        </div>

        <div>
          <label className="block text-sm text-dashboard-text-secondary mb-2">Horario de Apertura</label>
          <input
            name="horario_apertura"
            value={settings.horario_apertura}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
        </div>

        <div>
          <label className="block text-sm text-dashboard-text-secondary mb-2">Dirección</label>
          <input
            name="direccion"
            value={settings.direccion}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
        </div>

        <div>
          <label className="block text-sm text-dashboard-text-secondary mb-2">URL de Facebook</label>
          <input
            name="facebook_url"
            type="url"
            value={settings.facebook_url}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
        </div>

        <div>
          <label className="block text-sm text-dashboard-text-secondary mb-2">URL de Instagram</label>
          <input
            name="instagram_url"
            type="url"
            value={settings.instagram_url}
            onChange={handleChange}
            className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;