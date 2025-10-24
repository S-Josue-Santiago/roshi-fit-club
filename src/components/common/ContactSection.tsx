// roshi_fit/src/components/common/ContactSection.tsx
import React, { useState, useEffect } from 'react';
import { fetchContactContent } from '../../api/contentApi';
import { MapPin, Phone, Mail, Facebook, Instagram, MessageSquare } from 'lucide-react';
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

// Hook para detectar el tema actual
const useTheme = () => {
  const [theme, setTheme] = useState<'original' | 'futurista'>('original');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      setTheme(bodyClass.includes('futurista') ? 'futurista' : 'original');
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return theme;
};

const ContactSection: React.FC = () => {
  const [content, setContent] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchContactContent()
      .then(setContent)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getLoadingStyle = () => {
    return theme === 'futurista'
      ? 'text-gray-600 text-lg font-light'
      : 'text-gray-400 text-lg font-light';
  };

  if (loading) {
    return <p className={`${getLoadingStyle()} text-center py-10`}>Cargando contacto...</p>;
  }

  if (!content) {
    return <p className={`${getLoadingStyle()} text-center py-10`}>Contenido de contacto no disponible.</p>;
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

  const getStyles = () => {
    if (theme === 'futurista') {
      return {
        container: 'py-24 px-4',
        containerStyle: {
          background: 'linear-gradient(135deg, #f0f4f8, #e8f0f7)',
        },
        title: 'text-5xl font-black mb-4 text-center tracking-wider',
        titleStyle: {
          background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        subtitle: 'text-xl text-gray-600 mb-12 max-w-3xl mx-auto text-center font-light',
        contactContainer: 'max-w-4xl mx-auto p-8 rounded-[40px]',
        contactContainerStyle: {
          background: 'linear-gradient(315deg, #ffffff, #f0f4f8)',
          boxShadow: '-12px -12px 24px rgba(255, 255, 255, 0.9), 12px 12px 24px rgba(0, 120, 255, 0.15)',
          border: '2px solid rgba(0, 120, 255, 0.2)'
        },
        contactItem: 'text-gray-700 font-medium text-lg',
        contactLink: 'text-blue-600 hover:text-cyan-500 transition-colors duration-300',
        contactIcon: 'text-blue-500',
        socialButton: 'p-4 rounded-full transition-all duration-300 transform hover:scale-110',
        socialButtonStyle: {
          background: 'linear-gradient(315deg, #f0f4f8, #ffffff)',
          boxShadow: '-6px -6px 12px rgba(255, 255, 255, 0.8), 6px 6px 12px rgba(0, 120, 255, 0.2)',
        },
        socialIcon: 'text-blue-500 hover:text-cyan-400 transition-colors'
      };
    }
    // Tema Original
    return {
      container: 'py-24 px-4',
      containerStyle: {},
      title: 'text-5xl font-black text-primary mb-4 text-center',
      titleStyle: {},
      subtitle: 'text-xl text-text-gray mb-12 max-w-2xl mx-auto text-center',
      contactContainer: 'max-w-4xl mx-auto p-8 rounded-[40px]',
      contactContainerStyle: {
        background: 'linear-gradient(315deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.95))',
        boxShadow: '-12px -12px 24px rgba(20, 20, 20, 0.8), 12px 12px 24px rgba(80, 80, 80, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      },
      contactItem: 'text-text-light font-medium text-lg',
      contactLink: 'text-gold hover:text-primary transition-colors duration-300',
      contactIcon: 'text-primary',
      socialButton: 'p-2 rounded-full transition-colors duration-300',
      socialButtonStyle: {},
      socialIcon: 'text-text-light hover:text-gold'
    };
  };

  const styles = getStyles();

  return (
    <div className={styles.container} style={styles.containerStyle} id="contacto">
      <div className={styles.contactContainer} style={styles.contactContainerStyle}>
        <h2 className={styles.title} style={styles.titleStyle}>
          {content.titulo || 'Contacto'}
        </h2>
        {content.subtitulo && (
          <p className={styles.subtitle}>{content.subtitulo}</p>
        )}

        {contactData && (
          <div className="space-y-8 text-center">
            <ContactItem icon={<MapPin size={24} className={styles.contactIcon} />} text={contactData.ubicacion} styles={styles} />
            <ContactItem icon={<Phone size={24} className={styles.contactIcon} />} text={contactData.telefono} href={`tel:${contactData.telefono.replace(/-/g, '')}`} styles={styles} />
            <ContactItem icon={<Mail size={24} className={styles.contactIcon} />} text={contactData.correo} href={`mailto:${contactData.correo}`} styles={styles} />

            {/* Redes sociales */}
            <div className="flex justify-center space-x-6 pt-6">
              {contactData.redes.facebook && (
                <a href={contactData.redes.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialButton} style={styles.socialButtonStyle} aria-label="Facebook">
                  <Facebook size={28} className={styles.socialIcon} />
                </a>
              )}
              {contactData.redes.instagram && (
                <a href={contactData.redes.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialButton} style={styles.socialButtonStyle} aria-label="Instagram">
                  <Instagram size={28} className={styles.socialIcon} />
                </a>
              )}
              {contactData.redes.whatsapp && (
                <a href={contactData.redes.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.socialButton} style={styles.socialButtonStyle} aria-label="WhatsApp">
                  <MessageSquare size={28} className={styles.socialIcon} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para item de contacto
const ContactItem: React.FC<{ icon: React.ReactNode; text: string; href?: string; styles: any }> = ({ icon, text, href, styles }) => {
  const content = (
    <div className="flex items-center justify-center gap-4">
      {icon}
      <span className={styles.contactItem}>{text}</span>
    </div>
  );

  if (href) {
    return <a href={href} className={styles.contactLink}>{content}</a>;
  }

  return <div className={styles.contactItem}>{content}</div>;
};


export default ContactSection;