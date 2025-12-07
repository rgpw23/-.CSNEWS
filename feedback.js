document.addEventListener('DOMContentLoaded', function() {
  const feedbackForm = document.getElementById('feedbackForm');
  const successModal = document.getElementById('successModal');
  const ratingStars = document.querySelectorAll('.rating-star');
  const ratingInput = document.getElementById('rating');
  
  // Инициализация рейтинга
  initializeRating();
  
  // Обработка отправки формы
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Закрытие модального окна при клике вне его
  if (successModal) {
    successModal.addEventListener('click', function(e) {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
    
    // Закрытие при клике на кнопку
    const successBtn = successModal.querySelector('.success-btn');
    if (successBtn) {
      successBtn.addEventListener('click', closeSuccessModal);
    }
  }
  
  // Функции
  
  function initializeRating() {
    if (!ratingStars.length || !ratingInput) return;
    
    // Устанавливаем рейтинг по умолчанию (5 звезд)
    setRating(5);
    
    // Добавляем обработчики для каждой звезды
    ratingStars.forEach(star => {
      star.addEventListener('click', function() {
        const value = parseInt(this.getAttribute('data-value'));
        setRating(value);
      });
      
      star.addEventListener('mouseover', function() {
        const value = parseInt(this.getAttribute('data-value'));
        highlightStars(value);
      });
      
      star.addEventListener('mouseout', function() {
        const currentValue = parseInt(ratingInput.value);
        highlightStars(currentValue);
      });
    });
  }
  
  function setRating(value) {
    if (value < 1 || value > 5) return;
    
    ratingInput.value = value;
    highlightStars(value);
    
    // Добавляем анимацию
    ratingStars[value - 1].classList.add('bounce');
    setTimeout(() => {
      ratingStars[value - 1].classList.remove('bounce');
    }, 500);
  }
  
  function highlightStars(value) {
    ratingStars.forEach((star, index) => {
      if (index < value) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }
  
  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Собираем данные формы
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      category: document.querySelector('input[name="category"]:checked').value,
      rating: ratingInput.value,
      message: document.getElementById('message').value.trim(),
      date: new Date().toLocaleString('ru-RU'),
      timestamp: new Date().toISOString()
    };
    
    // Валидация
    if (!validateForm(formData)) {
      return;
    }
    
    
    // Для демонстрации просто логируем
    console.log('Отправлен отзыв:', formData);
    saveToLocalStorage(formData);
    
    // Показываем окно успеха
    showSuccessModal();
    
    // Очищаем форму через 1 секунду
    setTimeout(resetForm, 1000);
  }
  
  function validateForm(data) {
    // Проверка имени
    if (data.name.length < 2) {
      alert('Имя должно содержать минимум 2 символа');
      document.getElementById('name').focus();
      return false;
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('Введите корректный email адрес');
      document.getElementById('email').focus();
      return false;
    }
    
    // Проверка сообщения
    if (data.message.length < 10) {
      alert('Сообщение должно содержать минимум 10 символов');
      document.getElementById('message').focus();
      return false;
    }
    
    // Проверка согласия
    const consentCheckbox = document.querySelector('input[name="consent"]');
    if (!consentCheckbox.checked) {
      alert('Необходимо согласие на обработку персональных данных');
      consentCheckbox.focus();
      return false;
    }
    
    return true;
  }
  
  function saveToLocalStorage(data) {
    try {
      // Получаем существующие отзывы или создаем новый массив
      const existingFeedback = JSON.parse(localStorage.getItem('cs2Feedback')) || [];
      
      // Добавляем новый отзыв
      existingFeedback.push(data);
      
      // Сохраняем обратно 
      localStorage.setItem('cs2Feedback', JSON.stringify(existingFeedback));
      
      console.log('Отзыв сохранен в localStorage. Всего отзывов:', existingFeedback.length);
    } catch (error) {
      console.error('Ошибка при сохранении в localStorage:', error);
    }
  }
  
  function showSuccessModal() {
    if (!successModal) return;
    
    successModal.classList.add('show');
    
    // Добавляем анимацию иконке
    const successIcon = successModal.querySelector('.success-icon i');
    if (successIcon) {
      successIcon.classList.add('pulse');
    }
    
    // Блокируем прокрутку страницы
    document.body.style.overflow = 'hidden';
  }
  
  function closeSuccessModal() {
    if (!successModal) return;
    
    successModal.classList.remove('show');
    
    // Убираем анимацию
    const successIcon = successModal.querySelector('.success-icon i');
    if (successIcon) {
      successIcon.classList.remove('pulse');
    }
    
    // Возвращаем прокрутку
    document.body.style.overflow = 'auto';
  }
  
  function resetForm() {
    if (!feedbackForm) return;
    
    // Сбрасываем форму
    feedbackForm.reset();
    
    // Сбрасываем рейтинг к значению по умолчанию
    setRating(5);
    
    // Сбрасываем категорию к первой опции
    const firstCategory = document.getElementById('category1');
    if (firstCategory) {
      firstCategory.checked = true;
    }
  }
  

  
  
  // Загружаем данные пользователя если есть
  loadUserData();
});