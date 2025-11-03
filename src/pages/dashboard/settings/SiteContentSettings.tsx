import React, { useState, useEffect } from 'react';
import { fetchSiteContent, updateSiteContent } from '../../../api/settingApi';
import { type SiteContent } from '../../../types/Setting';
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';

const SiteContentSettings: React.FC = () => {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<SiteContent>({
    ubicacion: '',
    telefono: '',
    correo: '',
    redes: { facebook: '', instagram: '', whatsapp: '' },
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSiteContent = async () => {
      console.log('SiteContentSettings: Loading site content...'); // DEBUG
      try {
        setLoading(true);
        const data = await fetchSiteContent();
        console.log('SiteContentSettings: Data fetched:', data); // DEBUG
        setSiteContent(data);
        setFormData(data || { ubicacion: '', telefono: '', correo: '', redes: { facebook: '', instagram: '', whatsapp: '' } });
      } catch (err) {
        console.error('SiteContentSettings: Error in loadSiteContent:', err);
        setError('Error al cargar el contenido del sitio.');
        setSiteContent({ ubicacion: '', telefono: '', correo: '', redes: { facebook: '', instagram: '', whatsapp: '' } }); // Set default on error
        setFormData({ ubicacion: '', telefono: '', correo: '', redes: { facebook: '', instagram: '', whatsapp: '' } }); // Set default on error
      } finally {
        setLoading(false);
      }
    };
    loadSiteContent();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('redes.')) {
      setFormData((prev: SiteContent) => ({
        ...prev,
        redes: {
          ...prev.redes,
          [name.split('.')[1]]: value,
        },
      }));
    } else {
      setFormData((prev: SiteContent) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SiteContentSettings: Submitting form data:', formData); // DEBUG

    try {
      setError(null);
      setSuccessMessage(null);
      const updatedData = await updateSiteContent(formData);
      console.log('SiteContentSettings: Update successful:', updatedData); // DEBUG
      setSiteContent(updatedData);
      setIsEditing(false);
      setSuccessMessage('Contenido del sitio actualizado exitosamente!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('SiteContentSettings: Error in handleSubmit:', err);
      setError('Error al actualizar el contenido del sitio.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dashboard-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border-red-500/40 text-red-300 flex items-center gap-3 p-4 rounded-xl">
        <AlertCircle size={20} />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  // Se remueve la verificación de !siteContent aquí porque formData siempre tendrá un valor inicial

  return (
    <div className="bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-dashboard-text">Contenido del Sitio</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-dashboard-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-dashboard-primary-dark transition-colors"
          >
            Editar
          </button>
        )}
      </div>

      {successMessage && (
        <div className="bg-green-900/20 border-green-500/40 text-green-300 flex items-center gap-3 p-4 rounded-xl mb-4">
          <CheckCircle size={20} />
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ubicacion" className="block text-dashboard-text-secondary text-sm font-bold mb-2">Ubicación:</label>
          <div className="flex items-center gap-2 w-full p-3 bg-dashboard-bg border border-dashboard-accent/50 rounded-lg text-dashboard-text focus:outline-none focus:ring-2 focus:ring-dashboard-primary">
            <MapPin size={20} className="text-dashboard-text-secondary" />
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              readOnly={!isEditing} // Ahora editable
              className="flex-grow bg-transparent focus:outline-none disabled:opacity-75"
            />
          </div>
        </div>
        <div>
          <label htmlFor="telefono" className="block text-dashboard-text-secondary text-sm font-bold mb-2">Teléfono:</label>
          <div className="flex items-center gap-2 w-full p-3 bg-dashboard-bg border border-dashboard-accent/50 rounded-lg text-dashboard-text focus:outline-none focus:ring-2 focus:ring-dashboard-primary">
            <Phone size={20} className="text-dashboard-text-secondary" />
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              readOnly={!isEditing} // Ya estaba así
              className="flex-grow bg-transparent focus:outline-none disabled:opacity-75"
            />
          </div>
        </div>
        <div>
          <label htmlFor="correo" className="block text-dashboard-text-secondary text-sm font-bold mb-2">Correo:</label>
          <div className="flex items-center gap-2 w-full p-3 bg-dashboard-bg border border-dashboard-accent/50 rounded-lg text-dashboard-text focus:outline-none focus:ring-2 focus:ring-dashboard-primary">
            <Mail size={20} className="text-dashboard-text-secondary" />
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange} // Añadir onChange
              readOnly={!isEditing} // Ahora editable
              className="flex-grow bg-transparent focus:outline-none disabled:opacity-75"
            />
          </div>
        </div>

        <h3 className="text-xl font-bold text-dashboard-text mt-6 mb-4">Redes Sociales</h3>
        <div className="space-y-4 pl-4 border-l-2 border-dashboard-accent/50">
          <div>
            <label htmlFor="redes.facebook" className="block text-dashboard-text-secondary text-sm font-bold mb-2">Facebook:</label>
            <div className="flex items-center gap-2 w-full p-3 bg-dashboard-bg border border-dashboard-accent/50 rounded-lg text-dashboard-text focus:outline-none focus:ring-2 focus:ring-dashboard-primary">
              <Facebook size={20} className="text-dashboard-text-secondary" />
              <input
                type="url"
                id="redes.facebook"
                name="redes.facebook"
                value={formData.redes.facebook || ''}
                onChange={handleChange} // Añadir onChange
                readOnly={!isEditing} // Ahora editable
                className="flex-grow bg-transparent focus:outline-none disabled:opacity-75"
              />
            </div>
          </div>
          <div>
            <label htmlFor="redes.instagram" className="block text-dashboard-text-secondary text-sm font-bold mb-2">Instagram:</label>
            <div className="flex items-center gap-2 w-full p-3 bg-dashboard-bg border border-dashboard-accent/50 rounded-lg text-dashboard-text focus:outline-none focus:ring-2 focus:ring-dashboard-primary">
              <Instagram size={20} className="text-dashboard-text-secondary" />
              <input
                type="url"
                id="redes.instagram"
                name="redes.instagram"
                value={formData.redes.instagram || ''}
                onChange={handleChange} // Añadir onChange
                readOnly={!isEditing} // Ahora editable
                className="flex-grow bg-transparent focus:outline-none disabled:opacity-75"
              />
            </div>
          </div>
          <div>
            <label htmlFor="redes.whatsapp" className="block text-dashboard-text-secondary text-sm font-bold mb-2">WhatsApp:</label>
            <div className="flex items-center gap-2 w-full p-3 bg-dashboard-bg border border-dashboard-accent/50 rounded-lg text-dashboard-text focus:outline-none focus:ring-2 focus:ring-dashboard-primary">
              <MessageCircle size={20} className="text-dashboard-text-secondary" />
              <input
                type="url"
                id="redes.whatsapp"
                name="redes.whatsapp"
                value={formData.redes.whatsapp || ''}
                onChange={handleChange} // Añadir onChange
                readOnly={!isEditing} // Ahora editable
                className="flex-grow bg-transparent focus:outline-none disabled:opacity-75"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData(siteContent || { ubicacion: '', telefono: '', correo: '', redes: { facebook: '', instagram: '', whatsapp: '' } }); // Restaurar a los datos originales o por defecto
                setError(null);
                setSuccessMessage(null);
              }}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SiteContentSettings;
