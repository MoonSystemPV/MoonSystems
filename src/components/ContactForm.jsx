import { useState, useEffect } from "react";

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    // Función para obtener el parámetro subject
    const getSubjectFromUrl = () => {
      // Primero intentamos obtener del hash
      const hash = window.location.hash;
      if (hash.includes('?')) {
        const hashParams = new URLSearchParams(hash.split('?')[1]);
        const subject = hashParams.get('subject');
        if (subject) {
          return decodeURIComponent(subject);
        }
      }
      
      // Si no está en el hash, intentamos de la URL normal
      const urlParams = new URLSearchParams(window.location.search);
      const subject = urlParams.get('subject');
      if (subject) {
        return decodeURIComponent(subject);
      }
      
      return null;
    };

    const subject = getSubjectFromUrl();
    if (subject) {
      setSelectedSubject(subject);
    }
  }, []);

  // Escuchar cambios en el valor del select
  useEffect(() => {
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
      // Función para actualizar el estado
      const updateState = () => {
        setSelectedSubject(subjectSelect.value);
      };

      // Escuchar cambios directos en el select
      subjectSelect.addEventListener('change', updateState);
      
      // Crear un observer para detectar cambios en el valor
      const observer = new MutationObserver(updateState);
      observer.observe(subjectSelect, { 
        attributes: true,
        attributeFilter: ['value']
      });

      return () => {
        subjectSelect.removeEventListener('change', updateState);
        observer.disconnect();
      };
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            ¡Mensaje enviado!
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Gracias por contactarnos. Te responderemos lo más pronto posible.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="btn btn-primary"
          >
            Enviar otro mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
      <h3 className="text-2xl font-bold mb-6">Envíanos un mensaje</h3>

      <form
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <input type="hidden" name="form-name" value="contact" />
        <div style={{ display: "none" }}>
          <label>
            No llenes esto si eres humano: <input name="bot-field" />
          </label>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Servicio
          </label>
          <select
            id="subject"
            name="subject"
            required
            disabled={isLoading}
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:opacity-50"
          >
            <option value="">Seleccione Servicio</option>
            <option value="Oferta Especial - Página Web + Dominio">Oferta Especial - Página Web + Dominio</option>
            <option value="Pagina web">Pagina web</option>
            <option value="aplicacion movil">aplicacion movil</option>
            <option value="E-Commerce">E-Commerce</option>
            <option value="Solicitud de Funcionalidad">
              Solicitud de Funcionalidad
            </option>
            <option value="Inteligencia artificial">
              Inteligencia artificial
            </option>
            <option value="Consulta"> Consulta</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Mostrar select de planes solo si NO es la oferta especial */}
        {selectedSubject !== "Oferta Especial - Página Web + Dominio" && selectedSubject !== "" && (
          <div>
            <label
              htmlFor="plan"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Nuestros planes
            </label>
            <select
              id="plan"
              name="plan"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:opacity-50"
            >
              <option value="">Seleccione Plan</option>
              <option value="Plan Basico">Plan Basico</option>
              <option value="Plan Profesional">Plan Profesional</option>
              <option value="Especifique">Especifique</option>
            </select>
          </div>
        )}

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            required
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:opacity-50"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>
    </div>
  );
}
