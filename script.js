/**
 * Lógica de interacción para la página de presentación personal
 * - Validación de formulario de contacto
 * - Manejo de mensajes (almacenamiento en LocalStorage + mailto fallback)
 * - Lightbox modal de galería de imágenes
 */

document.addEventListener('DOMContentLoaded', () => {
  initCopyrightYear();
  initContactForm();
});

// 1. Actualización automática de año en el footer
function initCopyrightYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// 2. Lightbox / Visor de fotos
function openLightbox(imgId) {
  const sourceImg = document.getElementById(imgId);
  const modal = document.getElementById('lightboxModal');
  const targetImg = document.getElementById('lightboxImg');

  if (sourceImg && modal && targetImg) {
    targetImg.src = sourceImg.src;
    targetImg.alt = sourceImg.alt;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox(event) {
  // Solo cerrar si da clic fuera de la foto o en el botón de cerrar
  if (event.target.id === 'lightboxModal' || event.target.classList.contains('lightbox-close')) {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
}

// 3. Formulario de Mensajes & Contacto
function initContactForm() {
  const form = document.getElementById('messageForm');
  if (!form) return;

  const nameInput = document.getElementById('senderName');
  const contactInput = document.getElementById('senderContact');
  const subjectInput = document.getElementById('messageSubject');
  const messageInput = document.getElementById('senderMessage');
  const submitBtn = document.getElementById('submitBtn');
  const successAlert = document.getElementById('formSuccessAlert');

  // Limpiar mensajes de error en foco
  [nameInput, contactInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        clearError(input);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validación básica de campos requeridos
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Por favor, indícame tu nombre');
      isValid = false;
    }

    if (!contactInput.value.trim()) {
      showError(contactInput, 'Indica una forma de responderte (Instagram, correo o número)');
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      showError(messageInput, 'Escribe un mensaje para poder leerte');
      isValid = false;
    }

    if (!isValid) return;

    // Simulación de envío con feedback háptico/visual
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Enviando...</span>`;

    const messageData = {
      name: nameInput.value.trim(),
      contact: contactInput.value.trim(),
      subject: subjectInput.value.trim() || 'Nuevo mensaje desde tu perfil web',
      message: messageInput.value.trim(),
      date: new Date().toISOString()
    };

    // Guardar en LocalStorage para no perder ningún mensaje que dejen en el navegador
    try {
      const stored = JSON.parse(localStorage.getItem('perfil_mensajes_recibidos') || '[]');
      stored.push(messageData);
      localStorage.setItem('perfil_mensajes_recibidos', JSON.stringify(stored));
    } catch (err) {
      console.warn('No se pudo guardar en almacenamiento local:', err);
    }

    // Efecto de transición realista
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Mostrar alerta de confirmación
      successAlert.style.display = 'flex';
      form.reset();

      // Opción: Abrir cliente de correo preparado para envío real si se desea
      // const mailtoUrl = `mailto:tu-correo@ejemplo.com?subject=${encodeURIComponent(messageData.subject)}&body=${encodeURIComponent("De: " + messageData.name + " (" + messageData.contact + ")\n\n" + messageData.message)}`;
      // window.location.href = mailtoUrl;

      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 7000);
    }, 800);
  });
}

function showError(inputElement, message) {
  const errorSpan = document.getElementById(
    inputElement.id === 'senderName' ? 'nameError' :
    inputElement.id === 'senderContact' ? 'contactError' : 'messageError'
  );
  if (errorSpan) {
    errorSpan.textContent = message;
  }
  inputElement.style.borderColor = '#ff6b6b';
}

function clearError(inputElement) {
  const errorSpan = document.getElementById(
    inputElement.id === 'senderName' ? 'nameError' :
    inputElement.id === 'senderContact' ? 'contactError' : 'messageError'
  );
  if (errorSpan) {
    errorSpan.textContent = '';
  }
  inputElement.style.borderColor = '';
}
