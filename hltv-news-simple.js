// hltv-news-simple.js - ВЕРСИЯ БЕЗ ИЗОБРАЖЕНИЙ ПО УМОЛЧАНИЮ
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Загрузчик новостей CS2');
    
    const newsContainer = document.querySelector('.news-container');
    if (!newsContainer) return;
    
    // Инициализация
    let allNews = [];
    let displayedCount = 0;
    const initialLoad = 12;
    const loadMoreCount = 9;
    let isLoading = false;
    
    // Показываем скелетоны
    showSkeletonLoader(newsContainer);
    
    // Загружаем новости
    loadNewsFromAllSources();
    

    function getSafeLink(newsItem) {
        if (!newsItem.link || 
            newsItem.link === 'undefined' || 
            newsItem.link.includes('undefined') ||
            newsItem.link.trim() === '') {
            
            // Возвращаем ссылку по умолчанию в зависимости от источника
            if (newsItem.source === 'Reddit') {
                return 'https://www.reddit.com/r/GlobalOffensive/';
            } else if (newsItem.source === 'Steam' || newsItem.source === 'Steam Community') {
                return 'https://store.steampowered.com/news/app/730';
            } else if (newsItem.source === 'Valve') {
                return 'https://www.counter-strike.net/news';
            } else if (newsItem.source === 'Steam Charts') {
                return 'https://steamcharts.com/app/730';
            } else if (newsItem.source === 'Telegram: CS2 News') {
                return 'https://t.me/cs2news_ru';
            } else if (newsItem.source === 'Cybersport.ru') {
                return 'https://www.cybersport.ru/tags/cs2';
            } else if (newsItem.source === 'Esports News') {
                return 'https://www.hltv.org/news';
            }
            
            // По умолчанию - HLTV
            return 'https://www.hltv.org/news';
        }
        return newsItem.link;
    }
    
    // ============== ФУНКЦИЯ ДЛЯ БЕЗОПАСНОГО ИЗОБРАЖЕНИЯ ==============
    function getSafeImage(newsItem) {
        // Если есть изображение и оно валидно - возвращаем его
        if (newsItem.image && 
            typeof newsItem.image === 'string' && 
            newsItem.image.startsWith('http') &&
            !newsItem.image.includes('undefined')) {
            return newsItem.image;
        }
        

        return '';
    }
    

    
    async function loadNewsFromAllSources() {
        isLoading = true;
        
        try {
            console.log('🌐 Загружаем новости...');
            
            // Параллельная загрузка
            const [redditNews, demoNews] = await Promise.allSettled([
                loadRedditNews(),
                Promise.resolve(getDemoNews())
            ]);
            
            // Собираем все новости
            allNews = [];
            
            // 1. Новости с Reddit
            if (redditNews.status === 'fulfilled' && redditNews.value) {
                console.log(`✅ Reddit: ${redditNews.value.length} новостей`);
                
                const processedRedditNews = redditNews.value.map(item => ({
                    ...item,
                    image: extractImageFromSource(item) || '' // Пустое изображение если нет
                }));
                
                allNews.push(...processedRedditNews);
            }
            
            // 2. Демо-новости
            console.log(`📦 Демо-новости: ${demoNews.value.length} шт`);
            allNews.push(...demoNews.value);
            
            console.log(`🎯 Всего собрано: ${allNews.length} новостей`);
            
            // Убираем дубликаты
            allNews = removeDuplicates(allNews);
            
            // Сортируем по дате
            allNews.sort((a, b) => b.createdUtc - a.createdUtc);
            
            // Ограничиваем количество
            allNews = allNews.slice(0, 30);
            
            console.log(`📊 После обработки: ${allNews.length} уникальных новостей`);
            
            // Показываем новости
            displayedCount = Math.min(initialLoad, allNews.length);
            displayNews(newsContainer, allNews.slice(0, displayedCount));
            createLoadMoreButton();
            
        } catch (error) {
            console.error('❌ Ошибка загрузки новостей:', error);
            showDemoNewsOnly();
        } finally {
            isLoading = false;
            removeSkeletons();
        }
    }
    

    
    function extractImageFromSource(newsItem) {
        if (newsItem.originalPost) {
            const post = newsItem.originalPost;
            
            const possibleSources = [
                () => {
                    if (post.preview?.images?.[0]?.source?.url) {
                        return post.preview.images[0].source.url.replace(/&amp;/g, '&');
                    }
                    return null;
                },
                () => {
                    if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' && 
                        post.thumbnail.startsWith('http')) {
                        return post.thumbnail;
                    }
                    return null;
                },
                () => {
                    if (post.url && isImageUrl(post.url)) {
                        return post.url;
                    }
                    return null;
                }
            ];
            
            for (const source of possibleSources) {
                const imgUrl = source();
                if (imgUrl && isImageUrl(imgUrl)) {
                    return imgUrl;
                }
            }
        }
        
        return null;
    }
    
    function isImageUrl(url) {
        if (!url || typeof url !== 'string') return false;
        
        const urlLower = url.toLowerCase();
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const hasImageExtension = imageExtensions.some(ext => urlLower.includes(ext));
        
        const imageDomains = [
            'i.redd.it', 'preview.redd.it', 'external-preview.redd.it',
            'i.imgur.com', 'imgur.com', 'gyazo.com',
            'cdn.akamai.steamstatic.com', 'cloudflare.steamstatic.com',
            'img-cdn.hltv.org', 'hltv.org', 'dotesports.com'
        ];
        
        const hasImageDomain = imageDomains.some(domain => urlLower.includes(domain));
        
        return hasImageExtension || hasImageDomain;
    }
    
    // ============== ЗАГРУЗКА С REDDIT ==============
    
    async function loadRedditNews() {
        try {
            const endpoints = [
                'https://www.reddit.com/r/GlobalOffensive/hot.json?limit=15',
                'https://www.reddit.com/r/cs2/hot.json?limit=15'
            ];
            
            for (const endpoint of endpoints) {
                try {
                    const response = await fetchWithTimeout(endpoint, 5000);
                    
                    if (response.ok) {
                        const data = await response.json();
                        const news = processRedditData(data);
                        
                        if (news && news.length > 0) {
                            console.log(`✅ Reddit: загружено ${news.length} новостей`);
                            return news;
                        }
                    }
                } catch (error) {
                    continue;
                }
            }
            
            return null;
            
        } catch (error) {
            console.log('⚠️ Reddit недоступен');
            return null;
        }
    }
    
    function processRedditData(data) {
        if (!data?.data?.children) return null;
        
        const news = data.data.children
            .slice(0, 10)
            .map(child => {
                const post = child.data;
                
                if (!post.title || post.title.length < 5) return null;
                
                // Описание
                let description = post.selftext || '';
                if (description.length > 0) {
                    description = description.substring(0, 120) + '...';
                    description = cleanText(description);
                } else {
                    description = 'Читать на Reddit...';
                }
                
                return {
                    title: post.title,
                    description: description,
                    link: post.permalink ? 'https://reddit.com' + post.permalink : 'https://www.reddit.com/r/GlobalOffensive/',
                    image: '', // Пустое изображение по умолчанию
                    source: 'Reddit',
                    category: getCategoryFromFlair(post.link_flair_text),
                    createdUtc: post.created_utc,
                    originalPost: post,
                    isRUS: false
                };
            })
            .filter(item => item !== null);
        
        return news;
    }
    

    
    function getDemoNews() {
        const demoNews = [
            {
                title: "Team Spirit побеждает NAVI на BLAST Premier",
                description: "Team Spirit обыграли NAVI со счетом 2:1 в финале турнира BLAST Premier Fall Finals 2024.",
                image: "https://avatars.mds.yandex.net/i?id=473a4a6cdef81694176a7b056857152f846a3521-5857999-images-thumbs&n=13",
                link: "https://www.hltv.org/news/37107/team-spirit-win-blast-premier-fall-final-2024",
                source: "HLTV.org",
                category: "Турниры",
                createdUtc: Date.now() / 1000,
                isRUS: false
            },
            {
                title: "Обновление CS2: новые карты и баланс оружия",
                description: "Valve выпустила большое обновление для CS2 с двумя новыми картами и изменениями баланса AWP и M4A1-S.",
                image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/capsule_616x353.jpg",
                link: "https://www.hltv.org/news/37092/cs2-update-adds-new-maps-and-weapon-balance-changes",
                source: "Valve",
                category: "Обновления",
                createdUtc: Date.now() / 1000 - 10800,
                isRUS: false
            },
            {
                title: "Команда Mouz прошла в плей-офф",
                description: "Mouz вышли в плей-офф обыграв команду Falcons",
                image: "https://images.cybersport.ru/images/material-card/plain/7b/7bcd371b-3428-425f-ac3c-0eab751f4972.jpg@jpg",
                link: "https://www.cybersport.ru/tags/cs2/mouz-proshla-v-plei-off-starladder-budapest-major-2025-obygrav-team-falcons",
                source: "HLTV.org",
                category: "Команды",
                createdUtc: Date.now() / 1000 - 86400,
                isRUS: true
            },
            {
                title: "Дастан о выступлении PariVision на StarLadder Budapest Major 2025",
                description: "Могли выйграть больше карт,больше команд",
                image: "https://images.cybersport.ru/images/material-card/plain/37/379cc031-78a8-4aab-b8c0-3fb55478d1b0.jpg@jpg", 
                link: "https://www.cybersport.ru/tags/cs2/dastan-o-parivision-na-starladder-budapest-major-2025-mogli-vyigrat-bolshe-kart",
                source: "HLTV.org",
                category: "Трансферы",
                createdUtc: Date.now() / 1000 - 172800,
                isRUS: false
            },
            {
                title: "Jame о вылете с мажора",
                description: "«С NAVI мы уперлись в наш потолок. И нам надо придумать, как этот потолок пробить»",
                image: "https://images.cybersport.ru/images/material-card/plain/eb/ebeef97c-00b9-47f1-8504-3f1b24b24567.jpg@jpg",
                link: "https://www.cybersport.ru/tags/cs2/jame-o-vylete-parivision-iz-meidzhora-s-navi-my-uperlis-v-nash-potolok-i-nam",
                source: "HLTV.org",
                category: "Турниры",
                createdUtc: Date.now() / 1000 - 259200,
                isRUS: false
            },
            {
                title: "Faze выбили 3DMAX с мажора",
                description: "",
                image: "https://images.cybersport.ru/images/material-card/plain/94/94bde51d-fbaa-451e-91be-cc77708ed7b6.jpg@jpg",
                link: "https://www.cybersport.ru/tags/cs2/faze-clan-vybila-team-3dmax-iz-starladder-budapest-major-2025",
                source: "HLTV.org",
                category: "Статистика",
                createdUtc: Date.now() / 1000 - 345600,
                isRUS: false
            },
            {
                title: "Zonic о будущем после мажора",
                description: "«У нас не будет замен в случае провала»",
                image: "https://images.cybersport.ru/images/material-card/plain/c4/c47281eb-6fc3-4b56-9cc1-b1ffd94eb77d.jpg@jpg",
                link: "https://www.cybersport.ru/tags/cs2/zonic-o-budushchem-posle-starladder-budapest-major-2025-u-nas-ne-budet-zamen-v",
                source: "HLTV.org",
                category: "Безопасность",
                createdUtc: Date.now() / 1000 - 432000,
                isRUS: false
            },
            {
                title: "Donk об атмосфере на мажоре",
                description: "Даже нечувствуется что на сцене играешь",
                image: "https://images.cybersport.ru/images/material-card/plain/c2/c22d4b16-0c42-413d-94e6-ad04627889ff.jpg@jpg",
                link: "https://www.cybersport.ru/tags/cs2/donk-ob-atmosfere-v-gruppovoi-stadii-meidzhora-dazhe-ne-oshchushchayet-sya-chto",
                source: "HLTV.org",
                category: "Команды",
                createdUtc: Date.now() / 1000 - 518400,
                isRUS: false
            },
            {
                title: "Аналитики не верят в упех команды NAVI",
                description: "6 декабря в 17:00 мск Team Vitality сразится с Natus Vincere в третьей групповой стадии",
                image: "https://images.cybersport.ru/images/material-card/plain/0a/0ab1a03e-ef73-4b51-812b-dfb0d7722e14.jpg@jpg",
                link: "https://www.cybersport.ru/tags/cs2/analitiki-ne-veryat-v-pobedu-navi-nad-team-vitality-na-starladder-budapest-major",
                source: "HLTV.org",
                category: "Команды",
                createdUtc: Date.now() / 1000 - 604800,
                isRUS: false
            },
            {
                title: "YEKINDAR о матче против G2 на мейджоре",
                description: "«Очень рад, что даже смог показать какой-то индивидуальный уровень»",
                image: "https://images.cybersport.ru/images/material-card/plain/e3/e36c8bb9-5bea-46a8-ab4c-d6be4eb8eff8.jpg@jpg", 
                link: "https://www.cybersport.ru/tags/cs2/yekindar-o-matche-protiv-g2-na-meidzhore-ochen-rad-chto-dazhe-smog-pokazat-kakoi",
                source: "HLTV.org",
                category: "Скины",
                createdUtc: Date.now() / 1000 - 691200,
                isRUS: false
            }
        ];
        
        return demoNews;
    }
    
    function showDemoNewsOnly() {
        console.log('📦 Показываем демо-новости');
        
        allNews = getDemoNews();
        displayedCount = Math.min(initialLoad, allNews.length);
        displayNews(newsContainer, allNews.slice(0, displayedCount));
        createLoadMoreButton();
        
        removeSkeletons();
    }
    
    // ============== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==============
    
    function removeDuplicates(newsArray) {
        const seen = new Set();
        return newsArray.filter(item => {
            const key = item.title.toLowerCase().substring(0, 50);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
    
    function getCategoryFromFlair(flair) {
        if (!flair) return 'CS2';
        const map = {
            'News': 'Новости', 'Discussion': 'Обсуждение',
            'Highlight': 'Хайлайт', 'Clip': 'Клип',
            'Esports': 'Киберспорт', 'Meme': 'Мем',
            'Fluff': 'Разное', 'Question': 'Вопрос',
            'Guide': 'Гайд', 'Tournament': 'Турнир'
        };
        return map[flair] || 'CS2';
    }
    
    function cleanText(text) {
        return text
            .replace(/\[.*?\]\(.*?\)/g, '')
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/#/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\n/g, ' ');
    }
    
    
    function showSkeletonLoader(container) {
        container.innerHTML = '';
        for (let i = 0; i < initialLoad; i++) {
            const skeleton = document.createElement('article');
            skeleton.className = 'news-card skeleton';
            skeleton.innerHTML = `
                <div class="news-image" style="background: #333;"></div>
                <div class="news-content">
                    <div style="background: #444; height: 24px; margin-bottom: 10px; border-radius: 4px;"></div>
                    <div style="background: #444; height: 16px; margin-bottom: 8px; border-radius: 4px;"></div>
                    <div style="background: #444; height: 16px; width: 80%; margin-bottom: 20px; border-radius: 4px;"></div>
                    <div style="display: flex; justify-content: space-between;">
                        <div style="background: #444; width: 60px; height: 24px; border-radius: 12px;"></div>
                        <div style="background: #444; width: 40px; height: 16px; border-radius: 8px;"></div>
                    </div>
                </div>
            `;
            container.appendChild(skeleton);
        }
    }
    
    function removeSkeletons() {
        document.querySelectorAll('.skeleton').forEach(el => el.remove());
    }
    
    function displayNews(container, news, append = false) {
        if (!append) container.innerHTML = '';
        
        const fragment = document.createDocumentFragment();
        
        news.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'news-card';
            card.style.setProperty('--card-index', index);
            
            // Бейдж для русских новостей
            const rusBadge = item.isRUS ? 
                `<div class="rus-badge">🇷🇺</div>` : 
                '';
            
            // Безопасная ссылка
            const safeLink = getSafeLink(item);
            
            // Безопасное изображение
            const safeImage = getSafeImage(item);
            
            // Определяем стиль для изображения
            const imageStyle = safeImage ? 
                `background-image: url('${safeImage}');` : 
                'background: #222;'; // Темный фон если нет изображения
            
            card.innerHTML = `
                <div class="news-image" style="${imageStyle}">
                    ${rusBadge}
                </div>
                <div class="news-content">
                    <h3>${item.title}</h3>
                    <p class="news-excerpt">${item.description}</p>
                    <div class="news-meta">
                        <span class="news-category">${item.category}</span>
                        <span class="news-source-badge">${item.source}</span>
                    </div>
                    <a href="${safeLink}" target="_blank" class="news-readmore" rel="noopener noreferrer">
                        Читать <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            `;
            
            // Если есть изображение - добавляем обработчик ошибки
            if (safeImage) {
                const img = new Image();
                img.onerror = () => {
                    const imageDiv = card.querySelector('.news-image');
                    if (imageDiv) {
                        // При ошибке загрузки - убираем изображение
                        imageDiv.style.backgroundImage = 'none';
                        imageDiv.style.background = '#222';
                    }
                };
                img.src = safeImage;
            }
            
            fragment.appendChild(card);
        });
        
        container.appendChild(fragment);
    }
    
    function createLoadMoreButton() {
        const oldBtn = document.getElementById('loadMoreBtn');
        if (oldBtn) oldBtn.remove();
        
        if (displayedCount >= allNews.length) return;
        
        const btn = document.createElement('button');
        btn.id = 'loadMoreBtn';
        btn.className = 'load-more-btn';
        btn.innerHTML = '<i class="fas fa-chevron-down"></i> Показать еще новости';
        
        btn.onclick = () => {
            if (isLoading || displayedCount >= allNews.length) return;
            
            isLoading = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
            btn.disabled = true;
            
            setTimeout(() => {
                const newCount = Math.min(displayedCount + loadMoreCount, allNews.length);
                const additionalNews = allNews.slice(displayedCount, newCount);
                
                displayNews(newsContainer, additionalNews, true);
                displayedCount = newCount;
                
                btn.innerHTML = '<i class="fas fa-chevron-down"></i> Показать еще новости';
                btn.disabled = false;
                isLoading = false;
                
                if (displayedCount >= allNews.length) {
                    btn.style.opacity = '0.5';
                    btn.disabled = true;
                    btn.innerHTML = '<i class="fas fa-check"></i> Все новости загружены';
                }
            }, 300);
        };
        
        newsContainer.parentNode.insertBefore(btn, newsContainer.nextSibling);
    }
    
    // ============== ВСПОМОГАТЕЛЬНЫЕ ==============
    
    function fetchWithTimeout(url, timeout) {
        return Promise.race([
            fetch(url),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), timeout)
            )
        ]);
    }
});

// Глобальные функции
window.refreshNews = function() {
    console.log('🔄 Обновление новостей...');
    localStorage.removeItem('cs2_news_cache');
    location.reload();
};

// Стили для новостей без времени
if (!document.querySelector('#news-no-time-styles')) {
    const style = document.createElement('style');
    style.id = 'news-no-time-styles';
    style.textContent = `
        /* Убираем дату и время чтения */
        .news-date, .news-readtime {
            display: none !important;
        }
        
        /* Новый стиль для мета-информации */
        .news-meta {
            margin-bottom: 20px;
            padding-top: 15px;
            border-top: 1px solid #333;
        }
        
        .news-category {
            background: #222;
            color: #ffcc00;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .news-source-badge {
            background: #333;
            color: #888;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 13px;
            font-weight: normal;
        }
        
        .rus-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            z-index: 2;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        /* Увеличиваем отступы для лучшего вида */
        .news-content h3 {
            margin: 0 0 15px 0;
            font-size: 22px;
            line-height: 1.3;
            min-height: 60px;
        }
        
        .news-excerpt {
            color: #ccc;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 20px 0;
            flex: 1;
            min-height: 80px;
        }
        
        /* Стили для пустых изображений */
        .news-image {
            min-height: 180px;
            background-color: #222 !important;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            position: relative;
        }
        
        /* Анимации */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .news-card {
            animation: fadeInUp 0.5s ease forwards;
            animation-delay: calc(var(--card-index, 0) * 0.1s);
            opacity: 0;
        }
        
        @keyframes skeletonPulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.8; }
            100% { opacity: 0.6; }
        }
        
        .skeleton {
            animation: skeletonPulse 1.5s infinite;
        }
        
        /* Кнопка "Показать еще" */
        .load-more-btn {
            display: block;
            margin: 40px auto;
            padding: 15px 40px;
            background: #ffcc00;
            color: #111;
            border: none;
            border-radius: 25px;
            font-family: 'Oswald', sans-serif;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(255, 204, 0, 0.3);
        }
        
        .load-more-btn:hover {
            background: #e0b200;
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(255, 204, 0, 0.4);
        }
        
        .load-more-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none !important;
        }
        
        /* Адаптивность */
        @media (max-width: 768px) {
            .news-content h3 {
                font-size: 20px;
                min-height: 50px;
            }
            
            .news-excerpt {
                font-size: 15px;
                min-height: 70px;
            }
            
            .load-more-btn {
                padding: 12px 30px;
                font-size: 15px;
                margin: 30px auto;
            }
        }
        
        @media (max-width: 480px) {
            .news-content h3 {
                font-size: 18px;
                min-height: 45px;
            }
            
            .news-excerpt {
                font-size: 14px;
                min-height: 60px;
            }
            
            .load-more-btn {
                padding: 10px 25px;
                font-size: 14px;
                width: 90%;
                max-width: 300px;
            }
        }
    `;
    document.head.appendChild(style);
}