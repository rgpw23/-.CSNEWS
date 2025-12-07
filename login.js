document.addEventListener('DOMContentLoaded', function() {
  console.log('Login page loaded - SHOW TEMP USER');
  
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    // Валидация
    if (!validateForm(email, password)) {
      return;
    }
    
    // Тестовые пользователи для демо
    const demoUsers = [
      { username: 'ДемоПользователь', email: 'demo@example.com', password: '123456', avatar: 'Д' },
      { username: 'ИгрокCS2', email: 'player@cs2.com', password: 'password', avatar: 'И' }
    ];
    
    // Проверяем демо-пользователей
    const user = demoUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      showSuccess('Вход выполнен! Перенаправляем на главную...');
      
      // Сохраняем временные данные пользователя
      const userData = {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isDemoUser: true,
        timestamp: Date.now()
      };
      
      localStorage.setItem('tempUserData', JSON.stringify(userData));
      localStorage.setItem('tempUserExpiry', (Date.now() + 5 * 60 * 1000).toString());
      
      // Перенаправляем на главную через 1.5 секунды
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
      
    } else {
      showError('Неверный email или пароль. Используйте demo@example.com / 123456');
    }
  }
  
  function validateForm(email, password) {
    if (!email) {
      showError('Пожалуйста, введите email');
      document.getElementById('loginEmail').focus();
      return false;
    }
    
    if (!password) {
      showError('Пожалуйста, введите пароль');
      document.getElementById('loginPassword').focus();
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Введите корректный email адрес');
      document.getElementById('loginEmail').focus();
      return false;
    }
    
    if (password.length < 6) {
      showError('Пароль должен содержать минимум 6 символов');
      document.getElementById('loginPassword').focus();
      return false;
    }
    
    return true;
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
    
    const form = document.getElementById('loginForm');
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
    
    const form = document.getElementById('loginForm');
    if (form) {
      form.insertBefore(successDiv, form.firstChild);
    }
  }
});