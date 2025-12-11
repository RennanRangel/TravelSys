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
                e.preventDefault(); // Prevent pasting the binary code as text

                const targetFileInputName = input.getAttribute('data-target-file');
                // Try to find by ID first, then by Name
                const fileInput = document.getElementById(targetFileInputName) || document.querySelector(`input[name="${targetFileInputName}"]`);

                if (fileInput) {
                    const dataTransfer = new DataTransfer();
                    // Use a generic name or consistent naming convention
                    // Adding a timestamp to help avoid caching issues visually if needed, though not strictly required for upload
                    const fileName = "pasted-image-" + Date.now() + ".png";
                    dataTransfer.items.add(new File([blob], fileName, { type: "image/png" }));
                    fileInput.files = dataTransfer.files;

                    // Visual feedback
                    input.value = `[Image Pasted] ${fileName}`;
                    input.classList.add('is-valid');

                    // Alert user (optional, maybe remove for smoother experience or keep as confirmation)
                    // alert("Image pasted successfully! It will be uploaded when you submit.");

                    // Show a toast or small message instead of alert if possible, but alert is fine for now.
                    console.log('Image pasted and assigned to file input');
                } else {
                    console.error('File input not found for target:', targetFileInputName);
                }
            }
        });
    });

    // Sync file input with text input (if user selects file manually)
    document.querySelectorAll('input[type="file"]').forEach(fileInput => {
        fileInput.addEventListener('change', (e) => {
            if (fileInput.files.length > 0) {
                // Find previous sibling that is a magic paste target
                let sibling = fileInput.previousElementSibling;
                while (sibling) {
                    if (sibling.classList.contains('magic-paste-target') || (sibling.querySelector && sibling.querySelector('.magic-paste-target'))) {
                        // If the sibling structure is complex (like input group), we might need to find the text input inside
                        const textInput = sibling.classList.contains('magic-paste-target') ? sibling : sibling.querySelector('.magic-paste-target');
                        if (textInput) {
                            textInput.value = `[File Selected] ${fileInput.files[0].name}`;
                            break;
                        }
                    }
                    // If structure is div.input-group > input.magic-paste-target + input.file
                    if (fileInput.parentElement.classList.contains('input-group')) {
                        const textInput = fileInput.parentElement.querySelector('.magic-paste-target');
                        if (textInput) {
                            textInput.value = `[File Selected] ${fileInput.files[0].name}`;
                            break;
                        }
                    }
                    sibling = sibling.previousElementSibling;
                }
            }
        });
    });
});
