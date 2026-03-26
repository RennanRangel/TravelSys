document.addEventListener('DOMContentLoaded', () => {
    const heroImg = document.getElementById('flight-hero-img');
    if (heroImg) {
        const heroImages = [
            'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1440&h=537&fit=crop',
            'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&h=600&fit=crop'
        ];
        let heroIdx = 0;
        
        heroImg.style.transition = 'opacity 0.8s ease-in-out';
        
        function rotateHeroBg() {
            heroIdx = (heroIdx + 1) % heroImages.length;
            console.log('Rotating flight hero image to index:', heroIdx);
            
            heroImg.style.opacity = 0;
            
            setTimeout(() => {
                heroImg.src = heroImages[heroIdx];
                heroImg.style.opacity = 1;
            }, 800);
        }
        
        setInterval(rotateHeroBg, 5000);
    }
    
    const DOM = {
        tabBtns: document.querySelectorAll('.tab-btn'),
        searchForm: document.querySelector('.search-form'),
        newsletterForm: document.querySelector('.newsletter-form'),
        markers: document.querySelectorAll('.location-marker')
    };


    DOM.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });


    DOM.searchForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Busca de voos submetida');
    });

    DOM.newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Obrigado por se inscrever!');
        DOM.newsletterForm.reset();
    });


    DOM.markers.forEach((marker, i) => {
        setTimeout(() => {
            marker.style.opacity = '0';
            marker.style.transform = 'scale(0)';
            setTimeout(() => {
                marker.style.transition = 'all 0.3s ease';
                marker.style.opacity = '1';
                marker.style.transform = 'scale(1)';
            }, 100);
        }, i * 200);
    });
    const countries = [
        { name: 'Brasil', capital: 'Brasília', price: '$ 450', img: '/images/OIP.webp' },
        { name: 'Argentina', capital: 'Buenos Aires', price: '$ 520', img: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800' },
        { name: 'Chile', capital: 'Santiago', price: '$ 580', img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800' },
        { name: 'Colômbia', capital: 'Bogotá', price: '$ 490', img: '/images/dsc_1920_45035203494_o.webp' },
        { name: 'Peru', capital: 'Lima', price: '$ 550', img: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800' },
        { name: 'Uruguai', capital: 'Montevidéu', price: '$ 480', img: '/images/turismo-no-uruguai-punta-del-este.webp' },
        { name: 'Bolívia', capital: 'La Paz', price: '$ 430', img: '/images/turismo-na-bolivia.webp' },
        { name: 'Equador', capital: 'Quito', price: '$ 460', img: '/images/flag-of-ecuador.webp' },
        { name: 'Paraguai', capital: 'Assunção', price: '$ 410', img: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800' },

        { name: 'Guiana', capital: 'Georgetown', price: '$ 620', img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800' },
        { name: 'Suriname', capital: 'Paramaribo', price: '$ 640', img: 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=800' },
        { name: 'Venezuela', capital: 'Caracas', price: '$ 400', img: '/images/Venezuela-7-The-Orinoco-and-its-delta-e1490917945896.webp' },

        { name: 'Estados Unidos', capital: 'Washington', price: '$ 800', img: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=800' },
        { name: 'Canadá', capital: 'Ottawa', price: '$ 850', img: 'https://images.unsplash.com/photo-1503614472-8413df3ded4a?w=800' },
        { name: 'México', capital: 'Cidade do México', price: '$ 600', img: 'https://images.unsplash.com/photo-1512813588311-50745b729ac3?w=800' },

        { name: 'França', capital: 'Paris', price: '$ 950', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
        { name: 'Reino Unido', capital: 'Londres', price: '$ 980', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800' },
        { name: 'Alemanha', capital: 'Berlim', price: '$ 920', img: 'https://images.unsplash.com/photo-1589544621535-7798dd1c0704?w=800' },
        { name: 'Espanha', capital: 'Madri', price: '$ 890', img: 'https://images.unsplash.com/photo-1543783232-f79fdbcc59ed?w=800' },
        { name: 'Itália', capital: 'Roma', price: '$ 940', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800' },
        { name: 'Portugal', capital: 'Lisboa', price: '$ 870', img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800' },
        { name: 'Holanda', capital: 'Amsterdã', price: '$ 960', img: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800' }
    ];


    const tickers = [];
    for (let i = 0; i < 3; i++) {
        tickers.push({
            card: document.getElementById(`ticker-card-${i}`),
            country: document.getElementById(`ticker-country-${i}`),
            capital: document.getElementById(`ticker-capital-${i}`),
            bgTitle: document.getElementById(`bg-title-${i}`),
            link: document.getElementById(`ticker-link-${i}`)
        });

        if (tickers[i].card) {
            tickers[i].card.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url('${countries[i].img}')`;
            if (tickers[i].bgTitle) tickers[i].bgTitle.textContent = countries[i].name.toUpperCase();
        }
    }

    let currentCountryIdx = 3; 
    let currentCardIdx = 0;    

    function updateTicker() {
        const target = tickers[currentCardIdx];
        if (!target.card) return;

        const country = countries[currentCountryIdx];

        target.card.style.opacity = '0';
        target.card.style.transform = 'translateY(20px) scale(0.95)';

        setTimeout(() => {
            if (target.country) target.country.textContent = country.name;
            if (target.capital) target.capital.textContent = `${country.capital}, ${country.name}`;
            if (target.bgTitle) target.bgTitle.textContent = country.name.toUpperCase();
            if (target.card) target.card.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url('${country.img}')`;
            if (target.link) target.link.href = `/Flights/Listing?route=${encodeURIComponent(country.name)}`;

            target.card.style.opacity = '1';
            target.card.style.transform = 'translateY(0) scale(1)';
            
            currentCountryIdx = (currentCountryIdx + 1) % countries.length;
            currentCardIdx = (currentCardIdx + 1) % 3;
        }, 500);
    }

    if (tickers[0].card) {
        setInterval(updateTicker, 3000);
    }

    const backpackingCountries = [
        {
            name: 'Brasil',
            price: '$ 450',
            description: 'Explore the vibrant culture of Brazil, from the stunning beaches of Rio de Janeiro to the lush Amazon rainforest. Discover samba rhythms, taste authentic feijoada, and witness the breathtaking Iguazu Falls.',
            images: [
                '/images/OIP.webp',
                'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800'
            ]
        },
        {
            name: 'Argentina',
            price: '$ 520',
            description: 'From the colorful streets of Buenos Aires to the majestic glaciers of Patagonia, Argentina offers an unforgettable adventure. Enjoy world-class wine in Mendoza and dance tango under the stars.',
            images: [
                'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800',
                'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800'
            ]
        },
        {
            name: 'Chile',
            price: '$ 580',
            description: 'Chile stretches along South America\'s western edge with an extraordinary diversity of landscapes. From the Atacama Desert to Patagonian ice fields, every corner reveals a new wonder.',
            images: [
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
                'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800'
            ]
        },
        {
            name: 'Colômbia',
            price: '$ 490',
            description: 'Colombia is a land of stunning contrasts — Caribbean coastlines, Andean highlands, and Amazon jungle. Walk through the colorful colonial streets of Cartagena and sip the world\'s finest coffee.',
            images: [
                '/images/dsc_1920_45035203494_o.webp',
                'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800'
            ]
        },
        {
            name: 'Peru',
            price: '$ 550',
            description: 'Discover the ancient wonders of Peru, from the mystical ruins of Machu Picchu to the vibrant markets of Cusco. Taste ceviche in Lima and trek through the Sacred Valley of the Incas.',
            images: [
                'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'
            ]
        },
        {
            name: 'México',
            price: '$ 600',
            description: 'Mexico blends ancient civilizations with vibrant modern culture. Explore Mayan pyramids, relax on Caribbean shores in Cancún, and savor authentic tacos in the bustling streets of Mexico City.',
            images: [
                'https://images.unsplash.com/photo-1512813588311-50745b729ac3?w=800',
                'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800'
            ]
        },
        {
            name: 'França',
            price: '$ 950',
            description: 'From the iconic Eiffel Tower to the lavender fields of Provence, France is a feast for the senses. Indulge in gourmet cuisine, world-class wines, and timeless art in every charming village.',
            images: [
                'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
                'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
            ]
        },
        {
            name: 'Itália',
            price: '$ 940',
            description: 'Italy is a treasure trove of art, history and culinary mastery. Wander through the ruins of Rome, glide along Venice\'s canals, and taste authentic pizza in the heart of Naples.',
            images: [
                'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
                'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
            ]
        },
        {
            name: 'Espanha',
            price: '$ 890',
            description: 'Spain captivates with its flamenco rhythms, Gaudí architecture and sun-kissed Mediterranean coastline. Explore the Alhambra, stroll La Rambla, and enjoy tapas under a Seville sunset.',
            images: [
                'https://images.unsplash.com/photo-1543783232-f79fdbcc59ed?w=800',
                'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
            ]
        },
        {
            name: 'Portugal',
            price: '$ 870',
            description: 'Portugal charms visitors with its pastel-colored cities, golden beaches and world-famous pastéis de nata. Ride a vintage tram through Lisbon and explore the stunning cliffs of the Algarve.',
            images: [
                'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800',
                'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
            ]
        },
        {
            name: 'Estados Unidos',
            price: '$ 800',
            description: 'The United States offers endless variety — from New York\'s skyline to the Grand Canyon\'s vast beauty. Road trip across Route 66, surf California\'s waves, and explore vibrant national parks.',
            images: [
                'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=800',
                'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800'
            ]
        },
        {
            name: 'Canadá',
            price: '$ 850',
            description: 'Canada welcomes you with pristine wilderness, cosmopolitan cities, and breathtaking northern lights. Ski in Whistler, explore the Rocky Mountains, and savor poutine in Montréal.',
            images: [
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
                'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800'
            ]
        }
    ];




    
    const bpTitle = document.getElementById('bp-title');
    const bpPrice = document.getElementById('bp-price');
    const bpDesc = document.getElementById('bp-description');
    const bpLink = document.getElementById('bp-link');
    const bpImgs = [
        document.getElementById('bp-img-0'),
        document.getElementById('bp-img-1')
    ];




    let bpIndex = 0;

    if (bpTitle) bpTitle.style.transition = 'opacity 0.4s ease-in-out';
    if (bpPrice) bpPrice.style.transition = 'opacity 0.4s ease-in-out';
    if (bpDesc) bpDesc.style.transition = 'opacity 0.4s ease-in-out';
    bpImgs.forEach(img => {
        if (img) img.style.transition = 'opacity 0.4s ease-in-out';
    });

    function updateBackpacking() {
        if (!bpTitle || !bpPrice || !bpDesc) return;

        bpIndex = (bpIndex + 1) % backpackingCountries.length;
        const c = backpackingCountries[bpIndex];

        bpTitle.style.opacity = 0;
        bpPrice.style.opacity = 0;
        bpDesc.style.opacity = 0;
        bpImgs.forEach(img => { if (img) img.style.opacity = 0; });

        setTimeout(() => {
            bpTitle.textContent = `Backpacking ${c.name}`;
            bpPrice.textContent = c.price;
            bpDesc.textContent = c.description;
            
            // Atualizando as imagens
            c.images.forEach((src, i) => {
                if (bpImgs[i]) {
                    bpImgs[i].src = src;
                    bpImgs[i].alt = `${c.name} ${i + 1}`;
                }
            });

            if (bpLink) {
                bpLink.href = `/Flights/Listing?route=${encodeURIComponent(c.name)}`;
            }

            bpTitle.style.opacity = 1;
            bpPrice.style.opacity = 1;
            bpDesc.style.opacity = 1;
            bpImgs.forEach(img => { if (img) img.style.opacity = 1; });
        }, 400);
    }

    if (bpTitle) {
        bpTitle.style.opacity = 1;
        bpPrice.style.opacity = 1;
        bpDesc.style.opacity = 1;
        bpImgs.forEach(img => { if (img) img.style.opacity = 1; });
        
        setInterval(updateBackpacking, 5000);
    }
});

