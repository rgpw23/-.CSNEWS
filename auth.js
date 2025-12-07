// auth.js - Показ пользователя только если он только что зарегистрировался 
document.addEventListener('DOMContentLoaded', function() {
  console.log('Auth module - SHOW TEMP USER ONLY');
  

  const userNameDisplay = document.getElementById('userNameDisplay');
  const userAvatarText = document.getElementById('userAvatarText');
  const userLoggedInInfo = document.getElementById('userLoggedInInfo');
  const authTabs = document.getElementById('authTabs');
  const logoutBtnHeader = document.getElementById('logoutBtnHeader');
  
  // Проверяем, есть ли временные данные пользователя
  checkTempUserData();
  
  // Обрабатываем кнопку выхода
  if (logoutBtnHeader) {
    logoutBtnHeader.addEventListener('click', function(e) {
      e.preventDefault();
      clearTempUserData();
      showLoggedOutState();
      
      // Показываем уведомление
      showNotification('Вы вышли из системы', 'info');
      
      // Обновляем страницу через 1 секунду
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }
  
  // Проверка временных данных пользователя
  function checkTempUserData() {
    const tempUserData = localStorage.getItem('tempUserData');
    const tempUserExpiry = localStorage.getItem('tempUserExpiry');
    
    // Если есть данные и они не истекли
    if (tempUserData && tempUserExpiry) {
      const expiryTime = parseInt(tempUserExpiry);
      const currentTime = Date.now();
      
      if (currentTime < expiryTime) {
        // Данные валидны, показываем пользователя
        try {
          const user = JSON.parse(tempUserData);
          console.log('Showing temp user:', user.username);
          showLoggedInState(user);
          return;
        } catch (error) {
          console.error('Error parsing temp user data:', error);
        }
      } else {
        // Данные истекли, очищаем
        console.log('Temp user data expired');
        clearTempUserData();
      }
    }
    
    // Если нет временных данных - показываем состояние "не вошел"
    showLoggedOutState();
  }
  
  // 2. Показать состояние "вошел в систему" 
  function showLoggedInState(user) {
    console.log('Showing TEMPORARY logged in state for:', user.username);
    
    if (authTabs) authTabs.style.display = 'none';
    if (userLoggedInInfo) userLoggedInInfo.style.display = 'flex';
    
    if (userNameDisplay) {
      userNameDisplay.textContent = user.username || 'Новый пользователь';
    }
    
    if (userAvatarText) {
      userAvatarText.textContent = (user.avatar || user.username || 'U').charAt(0).toUpperCase();
    }
    
    // Автоматически очищаем данные через 5 минут
    setTimeout(() => {
      console.log('Auto-clearing temp user data after 5 minutes');
      clearTempUserData();
      showLoggedOutState();
    }, 5 * 60 * 1000); 
  }
  
  // Показать состояние "не вошел в систему"
  function showLoggedOutState() {
    console.log('Showing logged out state');
    
    if (authTabs) {
      authTabs.style.display = 'flex';
    }
    
    if (userLoggedInInfo) {
      userLoggedInInfo.style.display = 'none';
    }
  }
  
  // Очистка временных данных
  function clearTempUserData() {
    localStorage.removeItem('tempUserData');
    localStorage.removeItem('tempUserExpiry');
    console.log('Temp user data cleared');
  }
  
  // Функция показа уведомлений
  function showNotification(message, type = 'info') {
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
      oldNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                'fa-info-circle';
    const color = type === 'success' ? '#50ff50' : 
                 type === 'error' ? '#ff5050' : 
                 '#ffcc00';
    
    notification.innerHTML = `
      <i class="fas ${icon}"></i>
      <span>${message}</span>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #222;
      color: ${color};
      padding: 15px 20px;
      border-radius: 8px;
      border-left: 4px solid ${color};
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 3000;
      animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
      font-family: 'Roboto', sans-serif;
      font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
  
  // Добавляем стили для анимации уведомлений
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
});