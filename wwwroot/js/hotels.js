document.addEventListener('DOMContentLoaded', () => {
    // --- HERO IMAGE ROTATION ---
    const heroImg = document.getElementById('hotel-hero-img');
    if (heroImg) {
        const heroImages = [
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&h=900&fit=crop', // Initial image
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&h=900&fit=crop', // Resort pool
            'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1600&h=900&fit=crop', // Beach resort
            'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1600&h=900&fit=crop'  // Luxury hotel
        ];
        let heroIdx = 0;
        
        heroImg.style.transition = 'opacity 0.8s ease-in-out';
        
        function rotateHeroBg() {
            heroIdx = (heroIdx + 1) % heroImages.length;
            
            // Fade out
            heroImg.style.opacity = 0;
            
            setTimeout(() => {
                heroImg.src = heroImages[heroIdx];
                // Fade in
                heroImg.style.opacity = 1;
            }, 800);
        }
        
        setInterval(rotateHeroBg, 5000);
    }

    // --- TICKER AMÉRICA DO SUL (GRADE DINÂMICA) ---
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

        // --- AMÉRICA DO NORTE ---
        { name: 'Estados Unidos', capital: 'Washington', price: '$ 800', img: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=800' },
        { name: 'Canadá', capital: 'Ottawa', price: '$ 850', img: 'https://images.unsplash.com/photo-1503614472-8413df3ded4a?w=800' },
        { name: 'México', capital: 'Cidade do México', price: '$ 600', img: 'https://images.unsplash.com/photo-1512813588311-50745b729ac3?w=800' },

        // --- EUROPA ---
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
            if (tickers[i].country) tickers[i].country.textContent = countries[i].name;
            if (tickers[i].capital) tickers[i].capital.textContent = `${countries[i].capital}, ${countries[i].name}`;
            if (tickers[i].link) tickers[i].link.href = `/Hotels/Listing?destination=${encodeURIComponent(countries[i].name)}`;
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
            if (target.link) target.link.href = `/Hotels/Listing?destination=${encodeURIComponent(country.name)}`; // Alterado para Hotels

            target.card.style.opacity = '1';
            target.card.style.transform = 'translateY(0) scale(1)';
            
            currentCountryIdx = (currentCountryIdx + 1) % countries.length;
            currentCardIdx = (currentCardIdx + 1) % 3;
        }, 500);
    }

    if (tickers[0] && tickers[0].card) {
        setInterval(updateTicker, 3000);
    }

    // --- BACKPACKING / FEATURED STAYS SECTION (ROTAÇÃO DINÂMICA) ---
    const featuredStays = [
        {
            name: 'Sri Lanka',
            price: '$ 700',
            description: 'Sri Lanka is a unique experience as it\'s the best way to unplug from the pushes and pulls of daily life. Explore ancient ruins, lush tea plantations, and pristine beaches in this vibrant island nation.',
            images: [
                'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
                'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800'
            ]
        },
        {
            name: 'Maldivas',
            price: '$ 1,200',
            description: 'The Maldives is the ultimate tropical paradise. Stay in luxurious overwater bungalows, snorkel in crystal-clear lagoons, and enjoy world-class dining under the stars.',
            images: [
                'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
                'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800'
            ]
        },
        {
            name: 'Suíça',
            price: '$ 980',
            description: 'Switzerland offers majestic Alpine scenery and storybook villages. Whether skiing in winter or hiking in summer, the stunning landscapes and cozy chalets make for a perfect getaway.',
            images: [
                'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
            ]
        },
        {
            name: 'Japão',
            price: '$ 850',
            description: 'Experience the perfect blend of ancient tradition and ultra-modern city life in Japan. Stay in a traditional ryokan, soak in hot springs, and enjoy unparalleled hospitality.',
            images: [
                'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800',
                'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800'
            ]
        },
        {
            name: 'Grécia',
            price: '$ 750',
            description: 'Discover the magic of the Greek Islands. Whitewashed buildings, deep blue seas, and spectacular sunsets make Greece an unforgettable destination for a relaxing stay.',
            images: [
                'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
                'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'
            ]
        }
    ];

    let bpIndex = 0;
    const bpTitle = document.getElementById('bp-title');
    const bpPrice = document.getElementById('bp-price');
    const bpDescription = document.getElementById('bp-description');
    const bpLink = document.getElementById('bp-link');
    const bpImgs = [
        document.getElementById('bp-img-0'),
        document.getElementById('bp-img-1')
    ];

    // Configurando transições suaves de fade via JS para evitar piscar brusco
    if (bpTitle) bpTitle.style.transition = 'opacity 0.4s ease-in-out';
    if (bpPrice) bpPrice.style.transition = 'opacity 0.4s ease-in-out';
    if (bpDescription) bpDescription.style.transition = 'opacity 0.4s ease-in-out';
    bpImgs.forEach(img => {
        if (img) img.style.transition = 'opacity 0.4s ease-in-out';
    });

    function updateFeaturedStays() {
        if (!bpTitle || !bpPrice || !bpDescription) return;

        // Avança o índice
        bpIndex = (bpIndex + 1) % featuredStays.length;
        const data = featuredStays[bpIndex];

        // 1. Fade OUT
        bpTitle.style.opacity = 0;
        bpPrice.style.opacity = 0;
        bpDescription.style.opacity = 0;
        bpImgs.forEach(img => { if (img) img.style.opacity = 0; });

        // 2. Espera a animação de Fade Out terminar (400ms) para trocar o conteúdo
        setTimeout(() => {
            bpTitle.textContent = "Backpacking " + data.name;
            bpPrice.textContent = data.price;
            bpDescription.textContent = data.description;
            
            // Atualizando as imagens
            data.images.forEach((src, index) => {
                if (bpImgs[index]) {
                    bpImgs[index].src = src;
                }
            });

            // Opcional: atualizar link dinamicamente se quiser levar para a busca daquele país
            if (bpLink) {
                bpLink.href = `/Hotels/Listing?destination=${encodeURIComponent(data.name)}`;
            }

            // 3. Fade IN com o novo conteúdo
            bpTitle.style.opacity = 1;
            bpPrice.style.opacity = 1;
            bpDescription.style.opacity = 1;
            bpImgs.forEach(img => { if (img) img.style.opacity = 1; });

        }, 400); // tempo de espera do Fade Out
    }

    // Intervalo de Rotação (Troca a cada 5 Segundos)
    setInterval(updateFeaturedStays, 5000);
});
