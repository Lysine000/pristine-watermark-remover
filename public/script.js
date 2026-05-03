document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const resultContainer = document.getElementById('result-container');
    const resultImg = document.getElementById('result-img');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const status = document.getElementById('status');

    // Drag and drop handlers
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('drag-over');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFile(fileInput.files[0]);
        }
    });

    resetBtn.addEventListener('click', () => {
        resultContainer.style.display = 'none';
        dropzone.style.display = 'block';
        status.textContent = '';
        fileInput.value = '';
    });

    async function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        dropzone.style.display = 'none';
        status.textContent = 'Processing image...';

        try {
            const response = await fetch('/api/clean', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            resultImg.src = url;
            downloadBtn.href = url;
            downloadBtn.download = `cleaned_${file.name}`;
            
            resultContainer.style.display = 'block';
            status.textContent = 'Processing complete!';
        } catch (error) {
            console.error('Error:', error);
            status.textContent = 'Error processing image. Please try again.';
            dropzone.style.display = 'block';
        }
    }
});
