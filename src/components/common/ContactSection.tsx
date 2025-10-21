// roshi_fit/src/components/common/ContactSection.tsx
import React, { useState, useEffect } from 'react';
import { fetchContactContent } from '../../api/contentApi';
import { type ContactContent } from '../../types/Content';

interface ContactData {
  ubicacion: string;
  telefono: string;
  correo: string;
  redes: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

const ContactSection: React.FC = () => {
  const [content, setContent] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactContent()
      .then(setContent)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-text-gray text-center py-6">Cargando contacto...</p>;
  }

  if (!content) {
    return <p className="text-text-gray text-center py-6">Contenido no disponible.</p>;
  }

  // Parsear contenido como JSON
  let contactData: ContactData | null = null;
  try {
    if (content.contenido) {
      contactData = JSON.parse(content.contenido);
    }
  } catch (e) {
    console.error('Error al parsear contenido de contacto:', e);
  }

  return (
    <div className="bg-secondary/80 py-16 px-4 border-t border-accent/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          {content.titulo || 'Contacto'}
        </h2>
        {content.subtitulo && (
          <p className="text-text-gray mb-8 max-w-2xl mx-auto">{content.subtitulo}</p>
        )}

        {contactData && (
          <div className="space-y-6">
            {/* Ubicación */}
            <div>
              <p className="text-text-light font-medium">📍 {contactData.ubicacion}</p>
            </div>

            {/* Teléfono */}
            <div>
              <a
                href={`tel:${contactData.telefono.replace(/-/g, '')}`}
                className="text-gold hover:text-primary transition-colors"
              >
                📞 {contactData.telefono}
              </a>
            </div>

            {/* Correo */}
            <div>
              <a
                href={`mailto:${contactData.correo}`}
                className="text-gold hover:text-primary transition-colors"
              >
                ✉️ {contactData.correo}
              </a>
            </div>

            {/* Redes sociales */}
            <div className="flex justify-center space-x-6 mt-6">
              {contactData.redes.facebook && (
                <a
                  href={contactData.redes.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-light hover:text-gold text-2xl"
                  aria-label="Facebook"
                >
                  f
                </a>
              )}
              {contactData.redes.instagram && (
                <a
                  href={contactData.redes.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-light hover:text-gold text-2xl"
                  aria-label="Instagram"
                >
                  📷
                </a>
              )}
              {contactData.redes.whatsapp && (
                <a
                  href={contactData.redes.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-light hover:text-gold text-2xl"
                  aria-label="WhatsApp"
                >
                  💬
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSection;