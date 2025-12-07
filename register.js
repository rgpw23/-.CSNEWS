document.addEventListener('DOMContentLoaded', function() {
  console.log('Register page loaded - SHOW USER AFTER REGISTRATION');
  
  const registerForm = document.getElementById('registerForm');
  const passwordInput = document.getElementById('registerPassword');
  const confirmPasswordInput = document.getElementById('registerConfirmPassword');
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegistration);
  }
  
  // Индикатор силы пароля
  if (passwordInput) {
    passwordInput.addEventListener('input', checkPasswordStrength);
  }
  
  // Проверка подтверждения пароля
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);
  }
  
  function handleRegistration(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const termsAgree = document.getElementById('termsAgree') ? document.getElementById('termsAgree').checked : true;
    
    // Валидация
    if (!validateForm(username, email, password, confirmPassword, termsAgree)) {
      return;
    }
    
    // Показываем успех
    showSuccess('Регистрация выполнена! Перенаправляем на страницу входа...');
    
    // Сохраняем данные пользователя для перехода на страницу входа
    const userData = {
      username: username,
      email: email,
      avatar: username.charAt(0).toUpperCase(),
      isNewUser: true,
      timestamp: Date.now()
    };
    
    // Сохраняем во временное хранилище на 5 минут
    localStorage.setItem('tempUserData', JSON.stringify(userData));
    localStorage.setItem('tempUserExpiry', (Date.now() + 5 * 60 * 1000).toString());
    
    // Перенаправляем на страницу входа через 1.5 секунды
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }
  
  function validateForm(username, email, password, confirmPassword, termsAgree) {
    hideMessages();
    
    if (!username) {
      showError('Введите имя пользователя');
      document.getElementById('registerUsername').focus();
      return false;
    }
    
    if (username.length < 3) {
      showError('Имя пользователя должно содержать минимум 3 символа');
      document.getElementById('registerUsername').focus();
      return false;
    }
    
    if (!email) {
      showError('Введите email');
      document.getElementById('registerEmail').focus();
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Введите корректный email адрес');
      document.getElementById('registerEmail').focus();
      return false;
    }
    
    if (!password) {
      showError('Введите пароль');
      passwordInput.focus();
      return false;
    }
    
    if (password.length < 6) {
      showError('Пароль должен содержать минимум 6 символов');
      passwordInput.focus();
      return false;
    }
    
    if (!confirmPassword) {
      showError('Подтвердите пароль');
      confirmPasswordInput.focus();
      return false;
    }
    
    if (password !== confirmPassword) {
      showError('Пароли не совпадают');
      confirmPasswordInput.focus();
      return false;
    }
    
    if (!termsAgree) {
      showError('Необходимо согласие с условиями использования');
      const termsCheckbox = document.getElementById('termsAgree');
      if (termsCheckbox) termsCheckbox.focus();
      return false;
    }
    
    return true;
  }
  
  function checkPasswordStrength() {
    const password = passwordInput.value;
    const strengthBar = document.querySelector('.password-strength-bar') || createStrengthIndicator();
    
    if (!password) {
      strengthBar.style.width = '0%';
      strengthBar.className = 'password-strength-bar';
      return;
    }
    
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    let width = 0;
    let className = '';
    
    switch(strength) {
      case 0:
      case 1:
        width = 33;
        className = 'strength-weak';
        break;
      case 2:
      case 3:
        width = 66;
        className = 'strength-medium';
        break;
      case 4:
      case 5:
        width = 100;
        className = 'strength-strong';
        break;
    }
    
    strengthBar.style.width = width + '%';
    strengthBar.className = 'password-strength-bar ' + className;
  }
  
  function createStrengthIndicator() {
    const strengthContainer = document.createElement('div');
    strengthContainer.className = 'password-strength';
    
    const strengthBar = document.createElement('div');
    strengthBar.className = 'password-strength-bar';
    
    strengthContainer.appendChild(strengthBar);
    passwordInput.parentNode.appendChild(strengthContainer);
    
    return strengthBar;
  }
  
  function checkPasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (!password || !confirmPassword) return;
    
    if (password !== confirmPassword) {
      confirmPasswordInput.style.borderColor = '#ff5050';
    } else {
      confirmPasswordInput.style.borderColor = '#50ff50';
    }
  }
  
  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${message}</span>`;
    errorDiv.style.cssText = `
      background: rgba(255, 50, 50, 0.1);
      border: 1px solid #ff5050;
      color: #ff5050;
      padding: 12px 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    `;
    
    const oldError = document.querySelector('.error-message');
    if (oldError) oldError.remove();
    
    const form = document.getElementById('registerForm');
    if (form) {
      form.insertBefore(errorDiv, form.firstChild);
      
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.remove();
        }
      }, 5000);
    }
  }
  
  function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
    successDiv.style.cssText = `
      background: rgba(50, 255, 50, 0.1);
      border: 1px solid #50ff50;
      color: #50ff50;
      padding: 12px 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    `;
    
    const oldSuccess = document.querySelector('.success-message');
    if (oldSuccess) oldSuccess.remove();
    
    const form = document.getElementById('registerForm');
    if (form) {
      form.insertBefore(successDiv, form.firstChild);
    }
  }
  
  function hideMessages() {
    const errorMsg = document.querySelector('.error-message');
    const successMsg = document.querySelector('.success-message');
    
    if (errorMsg) errorMsg.remove();
    if (successMsg) successMsg.remove();
  }
});