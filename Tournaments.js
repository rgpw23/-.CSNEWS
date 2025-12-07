// tournaments.js - JavaScript для страницы турниров CS2 (без поля teams)
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Загрузчик реальных турниров CS2');
    
    const tournamentsContainer = document.querySelector('.tournaments-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!tournamentsContainer) return;
    
    // Инициализация
    let allTournaments = [];
    let currentFilter = 'all';
    
    // Показываем скелетоны загрузки
    showSkeletonLoader(tournamentsContainer);
    
    // Загружаем турниры
    loadTournaments();
    
    // Обработчики фильтров
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Обновляем активную кнопку
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Применяем фильтр
            currentFilter = this.getAttribute('data-filter');
            filterTournaments(currentFilter);
        });
    });
    
    // ============== ОСНОВНЫЕ ФУНКЦИИ ==============
    
    async function loadTournaments() {
        try {
            console.log('🌐 Загружаем реальные турниры CS2...');
            
            allTournaments = getRealCS2Tournaments();
            
  
            displayTournaments(allTournaments);
            removeSkeletons();
            
            console.log(`✅ Загружено ${allTournaments.length} реальных турниров`);
            
        } catch (error) {
            console.error('❌ Ошибка загрузки турниров:', error);
            showRealTournamentsOnly();
        }
    }
    
    function getRealCS2Tournaments() {
        return [
  
            {
                id: 2,
                name: "StarLadder Budapest Major 2025",
                image: "https://avatars.mds.yandex.net/i?id=1e1301354a45c5904e040f38b0cb36cfdba46647-5427399-images-thumbs&n=13",
                prize: "$1,250,000",
                date: "24 ноября-14 декабря 2025",
                location: "Budapest, Hungary",
                status: "ongoing",
                type: "major",
                hltvLink: "https://www.hltv.org/events/8042/starladder-budapest-major-2025"
            },
           
            

            {
                id: 4,
                name: "BetBoom Streamers Battle x Динамо CS",
                image: "https://avatars.mds.yandex.net/i?id=2a0000019af42d385ef088ae5ff547d8ff55-1371038-fast-images&n=13",
                prize: "$61 556",
                date: "18-26 декабря 2025",
                location: "Онлайн",
                status: "upcoming",
                type: "premium",
                hltvLink: "https://www.cybersport.ru/tags/cs2/molodoy-sygrayet-v-komande-shadowkekw-na-betboom-streamers-battle-x-dinamo-cs-4"
            },
            
            

            {
                id: 6,
                name: "BLAST Premier World Final 2024",
                image: "https://avatars.mds.yandex.net/i?id=1d06f6643bb7bbaba8f85dca51e1fe2d_l-10090660-images-thumbs&n=13",
                prize: "$1,000,000",
                date: "11-15 декабря 2024",
                location: "Абу-Даби, ОАЭ",
                status: "past",
                type: "premium",
                hltvLink: "https://www.hltv.org/events/7557/blast-premier-world-final-2024"
            },
            {
                id: 7,
                name: "Thunderpick World Championship 2024",
                image: "https://avatars.mds.yandex.net/i?id=31e856dfda3cc36ae5199c815f9a1f6b74a2979d-12421995-images-thumbs&n=13",
                prize: "$500,000",
                date: "27 октября - 24 ноября 2024",
                location: "Онлайн/Оффлайн финал",
                status: "past",
                type: "championship",
                hltvLink: "https://www.hltv.org/events/7455/thunderpick-world-championship-2024"
            },
            {
                id: 8,
                name: "IEM Cologne 2024",
                image: "https://avatars.mds.yandex.net/i?id=e730c2db7fd6d623965c362e98ca7fa0fa51e5cd-10251881-images-thumbs&n=13",
                prize: "$1,000,000",
                date: "5-14 августа 2024",
                location: "Кёльн, Германия (LANXESS arena)",
                status: "past",
                type: "premium",
                hltvLink: "https://www.hltv.org/events/7436/iem-cologne-2024"
            },
            {
                id: 9,
                name: "PGL Major Copenhagen 2024",
                image: "https://avatars.mds.yandex.net/i?id=4247fcac6cf4e653fa25993bc0c4dc9f439bfde0-5232197-images-thumbs&n=13",
                prize: "$1,250,000",
                date: "17-31 марта 2024",
                location: "Копенгаген, Дания",
                status: "past",
                type: "major",
                organizer: "PGL",
                hltvLink: "https://www.hltv.org/events/7148/pgl-cs2-major-copenhagen-2024"
            },
            {
                id: 10,
                name: "IEM Katowice 2024",
                image: "https://avatars.mds.yandex.net/i?id=c9f5066caf6c9ff8340e62cb519a80d94af85bae-10471168-images-thumbs&n=13",
                prize: "$1,000,000",
                date: "31 января - 11 февраля 2024",
                location: "Катовице, Польша",
                status: "past",
                type: "premium",
                hltvLink: "https://www.hltv.org/events/7435/iem-katowice-2024"
            },
            {
                id: 11,
                name: "BLAST Premier World Final 2023",
                image: "https://img-cdn.hltv.org/gallerypicture/blast-world-final-2023.jpg",
                prize: "$1,000,000",
                date: "13-17 декабря 2023",
                location: "Абу-Даби, ОАЭ",
                status: "past",
                type: "premium",
                hltvLink: "https://www.hltv.org/events/7425/blast-premier-world-final-2023"
            },
            {
                id: 12,
                name: "BLAST.tv Paris Major 2023",
                image: "https://avatars.mds.yandex.net/i?id=ead893c19f63918190dfa8cd8d96b975eab058b0-9182431-images-thumbs&n=13",
                prize: "$1,250,000",
                date: "8-21 мая 2023",
                location: "Париж, Франция (Accor Arena)",
                status: "past",
                type: "major",
                hltvLink: "https://www.hltv.org/events/6976/blast-premier-world-final-2023"
            },
            {
                id: 13,
                name: "IEM Rio Major 2022",
                image: "https://avatars.mds.yandex.net/i?id=b2529813256fb6bbd6c183187203833772b72170-7765754-images-thumbs&n=13",
                prize: "$1,250,000",
                date: "31 октября - 13 ноября 2022",
                location: "Рио-де-Жанейро, Бразилия",
                status: "past",
                type: "major",
                hltvLink: "https://www.hltv.org/events/6586/iem-rio-major-2022"
            },
            {
                id: 14,
                name: "PGL Major Antwerp 2022",
                image: "https://img-cdn.hltv.org/gallerypicture/antwerp-major-2022.jpg",
                prize: "$1,000,000",
                date: "9-22 мая 2022",
                location: "Антверпен, Бельгия",
                status: "past",
                type: "major",
                hltvLink: "https://www.hltv.org/events/6372/pgl-major-antwerp-2022"
            },
            {
                id: 15,
                name: "PGL Major Stockholm 2021",
                image: "https://avatars.mds.yandex.net/i?id=8c4e01f7f6c230dc5fd46ce02c2533ffcde76886-5440198-images-thumbs&n=13",
                prize: "$2,000,000",
                date: "26 октября - 7 ноября 2021",
                location: "Стокгольм, Швеция",
                status: "past",
                type: "major",
                hltvLink: "https://www.hltv.org/events/4866/pgl-major-stockholm-2021"
            }
        ];
    }
    
    function showRealTournamentsOnly() {
        console.log('📦 Показываем реальные турниры');
        allTournaments = getRealCS2Tournaments();
        displayTournaments(allTournaments);
        removeSkeletons();
    }
    
    function showSkeletonLoader(container) {
        container.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            const skeleton = document.createElement('article');
            skeleton.className = 'tournament-card skeleton';
            skeleton.innerHTML = `
                <div class="tournament-image" style="background: #333;"></div>
                <div class="tournament-content">
                    <div style="background: #444; height: 24px; margin-bottom: 10px; border-radius: 4px; width: 80%;"></div>
                    <div style="background: #444; height: 20px; margin-bottom: 8px; border-radius: 4px; width: 60%;"></div>
                    <div style="background: #444; height: 16px; margin-bottom: 8px; border-radius: 4px; width: 70%;"></div>
                    <div style="background: #444; height: 16px; margin-bottom: 20px; border-radius: 4px; width: 50%;"></div>
                    <div style="background: #444; width: 120px; height: 36px; border-radius: 18px;"></div>
                </div>
            `;
            container.appendChild(skeleton);
        }
    }
    
    function removeSkeletons() {
        document.querySelectorAll('.tournament-card.skeleton').forEach(el => el.remove());
    }
    
    function displayTournaments(tournaments) {
        tournamentsContainer.innerHTML = '';
        
        const fragment = document.createDocumentFragment();
        
        tournaments.forEach((tournament, index) => {
            const card = document.createElement('article');
            card.className = 'tournament-card';
            card.style.setProperty('--card-index', index);
            card.setAttribute('data-status', tournament.status);
            card.setAttribute('data-type', tournament.type);
            

            let badgeClass = tournament.status;
            let badgeText = '';
            
            switch(tournament.status) {
                case 'upcoming':
                    badgeText = 'Предстоящий';
                    break;
                case 'ongoing':
                    badgeText = 'Текущий';
                    break;
                case 'past':
                    badgeText = 'Завершен';
                    break;
            }
            
            if (tournament.type === 'major') {
                badgeClass = 'major';
                badgeText = 'Мейджор';
            }
            

            const winnerInfo = tournament.status === 'past' && tournament.winner ? 
                `<div class="tournament-winner">
                    <i class="fas fa-trophy"></i>
                    <span>Победитель: <strong>${tournament.winner}</strong></span>
                </div>` : '';
            
            // Организатор турнира
            const organizerInfo = tournament.organizer ? 
                `<div class="tournament-organizer">
                    <i class="fas fa-building"></i>
                    <span>Организатор: ${tournament.organizer}</span>
                </div>` : '';
            
            // Создаем карточку
            card.innerHTML = `
                <div class="tournament-image" style="background-image: url('${tournament.image}');">
                    <div class="tournament-badge ${badgeClass}">${badgeText}</div>
                </div>
                <div class="tournament-content">
                    <h3>${tournament.name}</h3>
                    <div class="tournament-prize">
                        <i class="fas fa-coins"></i>
                        <span>Призовой фонд: ${tournament.prize}</span>
                    </div>
                    <div class="tournament-dates">
                        <i class="far fa-calendar-alt"></i>
                        <span>${tournament.date}</span>
                    </div>
                    <div class="tournament-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${tournament.location}</span>
                    </div>
                    ${organizerInfo}
                    ${winnerInfo}
                    <a href="${tournament.hltvLink}" target="_blank" class="tournament-details" 
                       onclick="trackTournamentClick(${tournament.id}, '${tournament.name.replace(/'/g, "\\'")}')">
                        Подробнее на HLTV <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            `;
            
            // Обработчик ошибки изображения
            const img = new Image();
            img.onerror = () => {
                const imageDiv = card.querySelector('.tournament-image');
                if (imageDiv) {
                    // Используем CS2 изображение по умолчанию
                    imageDiv.style.backgroundImage = `url('https://cdn.akamai.steamstatic.com/apps/csgo/images/csgo_react/social/cs2.jpg')`;
                }
            };
            img.src = tournament.image;
            
            fragment.appendChild(card);
        });
        
        tournamentsContainer.appendChild(fragment);
    }
    
    function filterTournaments(filter) {
        let filteredTournaments = [...allTournaments];
        
        switch(filter) {
            case 'upcoming':
                filteredTournaments = allTournaments.filter(t => t.status === 'upcoming');
                break;
            case 'ongoing':
                filteredTournaments = allTournaments.filter(t => t.status === 'ongoing');
                break;
            case 'past':
                filteredTournaments = allTournaments.filter(t => t.status === 'past');
                break;
            case 'major':
                filteredTournaments = allTournaments.filter(t => t.type === 'major');
                break;
            case 'all':
            default:
                filteredTournaments = allTournaments;
        }
        
        displayTournaments(filteredTournaments);
    }
});

// Глобальные функции
function trackTournamentClick(tournamentId, tournamentName) {
    console.log(`Пользователь кликнул на турнир: ${tournamentName} (#${tournamentId})`);
    
    // Сохраняем в localStorage для аналитики
    try {
        const clicks = JSON.parse(localStorage.getItem('tournamentClicks')) || [];
        clicks.push({
            id: tournamentId,
            name: tournamentName,
            timestamp: new Date().toISOString(),
            page: window.location.href
        });
        localStorage.setItem('tournamentClicks', JSON.stringify(clicks.slice(-50))); // Храним последние 50 кликов
    } catch (error) {
        console.error('Ошибка сохранения аналитики:', error);
    }
}

window.refreshTournaments = function() {
    console.log('🔄 Обновление турниров...');
    location.reload();
};