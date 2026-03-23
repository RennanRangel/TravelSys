/**
 * Gerenciamento de Formulários Administrativos com Stepper
 */
document.addEventListener('DOMContentLoaded', function() {
    // 1. Gerenciamento de Upload de Arquivos
    window.updateFileUpload = function(input) {
        const container = input.closest('.admin-file-upload-container');
        if (!container) return;
        
        const display = container.querySelector('.filename-display');
        const textSpan = display ? display.querySelector('.name-text') : null;
        
        if (input.files && input.files.length > 0) {
            if (textSpan) textSpan.textContent = input.files[0].name;
            if (display) display.style.display = 'block';
        } else {
            if (display) display.style.display = 'none';
        }
    };

    // 2. Lógica do Stepper (Navegação entre Seções)
    const sections = document.querySelectorAll('.creation-form-section');
    const stepperItems = document.querySelectorAll('.stepper-item');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    let currentStep = 0;

    function updateStepperUI() {
        sections.forEach((s, i) => {
            s.classList.toggle('active', i === currentStep);
        });

        stepperItems.forEach((item, i) => {
            item.classList.toggle('active', i === currentStep);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < sections.length - 1) {
                currentStep++;
                updateStepperUI();
            }
        });
    });

    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateStepperUI();
            }
        });
    });

    stepperItems.forEach((item, i) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            currentStep = i;
            updateStepperUI();
        });
    });

    // 3. Validação de Formulário com Troca de Aba Automática
    document.addEventListener('invalid', function(e) {
        const section = e.target.closest('.creation-form-section');
        if (section) {
            const sectionsArray = Array.from(sections);
            const idx = sectionsArray.indexOf(section);
            if (idx !== -1 && idx !== currentStep) {
                currentStep = idx;
                updateStepperUI();
                setTimeout(() => e.target.reportValidity(), 50);
            }
        }
    }, true);

    // 4. Lógica de Campos de Preço por Classe (Voo)
    window.togglePriceFields = function() {
        const chkEco = document.getElementById('chkEconomy');
        const chkBus = document.getElementById('chkBusiness');
        const chkFir = document.getElementById('chkFirstClass');
        
        const eco = chkEco ? chkEco.checked : false;
        const bus = chkBus ? chkBus.checked : false;
        const fir = chkFir ? chkFir.checked : false;
        
        const contEco = document.getElementById('price-economy-container');
        const contBus = document.getElementById('price-business-container');
        const contFir = document.getElementById('price-firstclass-container');
        
        if (contEco) {
            contEco.style.display = eco ? 'block' : 'none';
            const inp = document.querySelector('[name="EconomyPrice"]') || document.querySelector('[name="NewFlight.EconomyPrice"]');
            if (inp) inp.required = eco;
        }
        if (contBus) {
            contBus.style.display = bus ? 'block' : 'none';
            const inp = document.querySelector('[name="BusinessPrice"]') || document.querySelector('[name="NewFlight.BusinessPrice"]');
            if (inp) inp.required = bus;
        }
        if (contFir) {
            contFir.style.display = fir ? 'block' : 'none';
            const inp = document.querySelector('[name="FirstClassPrice"]') || document.querySelector('[name="NewFlight.FirstClassPrice"]');
            if (inp) inp.required = fir;
        }
        
        const classes = [];
        if (eco) classes.push(chkEco.value);
        if (bus) classes.push(chkBus.value);
        if (fir) classes.push(chkFir.value);
        
        const hiddenInput = document.getElementById('FlightClasses');
        if (hiddenInput) {
            hiddenInput.value = classes.join(',');
        }
    };

    // Inicialização se for voo
    if (document.getElementById('chkEconomy')) {
        togglePriceFields();
    }
});
