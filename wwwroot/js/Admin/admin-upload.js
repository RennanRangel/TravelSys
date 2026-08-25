document.addEventListener('DOMContentLoaded', () => {
    const magicInputs = document.querySelectorAll('.magic-paste-target');

    magicInputs.forEach(input => {
        input.addEventListener('paste', (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            let blob = null;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") === 0) {
                    blob = items[i].getAsFile();
                    break;
                }
            }

            if (blob) {
                e.preventDefault();
                const targetId = input.getAttribute('data-target-file');
                const fileInput = document.querySelector(`#${targetId}`) || document.querySelector(`input[name="${targetId}"]`);

                if (fileInput) {
                    const dataTransfer = new DataTransfer();
                    const fileName = `pasted-image-${Date.now()}.png`;
                    dataTransfer.items.add(new File([blob], fileName, { type: "image/png" }));
                    fileInput.files = dataTransfer.files;

                    input.value = `[Imagem Colada] ${fileName}`;
                    input.classList.add('is-valid');
                }
            }
        });
    });

    document.querySelectorAll('input[type="file"]').forEach(fileInput => {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const group = fileInput.closest('.input-group');
                const textInput = group?.querySelector('.magic-paste-target');
                if (textInput) {
                    textInput.value = `[Arquivo Selecionado] ${fileInput.files[0].name}`;
                }
            }
        });
    });
});
