document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const batchPreview = document.getElementById('batchPreview');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');
    const toast = document.getElementById('toast');

    const MAX_FILES = 20;
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
    let imageFiles = [];

    // 显示 Toast 提示
    function showToast(message, duration = 3000) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // 验证文件
    function validateFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('请上传图片文件');
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            showToast(`${file.name} 超过20MB限制`);
            return false;
        }
        return true;
    }

    // 处理文件上传
    function handleFiles(files) {
        const validFiles = Array.from(files).filter(validateFile);
        
        if (imageFiles.length + validFiles.length > MAX_FILES) {
            showToast(`最多只能上传${MAX_FILES}张图片`);
            return;
        }

        imageFiles.push(...validFiles);
        previewContainer.style.display = 'block';
        processImages();
    }

    // 处理图片压缩和预览
    async function processImages() {
        batchPreview.innerHTML = ''; // 清空预览区域

        for (const file of imageFiles) {
            const card = document.createElement('div');
            card.className = 'image-card';
            
            const previewImages = document.createElement('div');
            previewImages.className = 'preview-images';
            
            // 创建原图预览
            const originalDiv = document.createElement('div');
            originalDiv.innerHTML = `
                <h4>原图</h4>
                <img src="${URL.createObjectURL(file)}" alt="原图">
                <p>大小: ${formatFileSize(file.size)}</p>
            `;

            // 创建压缩后预览
            const compressedDiv = document.createElement('div');
            compressedDiv.innerHTML = '<h4>压缩后</h4>';
            
            previewImages.appendChild(originalDiv);
            previewImages.appendChild(compressedDiv);
            
            card.innerHTML = `<div class="file-name">${file.name}</div>`;
            card.appendChild(previewImages);
            batchPreview.appendChild(card);

            // 压缩图片
            const compressedImage = await compressImage(file);
            compressedDiv.innerHTML = `
                <h4>压缩后</h4>
                <img src="${compressedImage.url}" alt="压缩后">
                <p>大小: ${formatFileSize(compressedImage.size)}</p>
            `;
        }
    }

    // 压缩单张图片
    function compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    ctx.drawImage(img, 0, 0);
                    
                    const quality = qualitySlider.value / 100;
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                    
                    // 计算压缩后的大小
                    const base64Length = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
                    const compressedBytes = base64Length * 0.75;
                    
                    resolve({
                        url: compressedDataUrl,
                        size: compressedBytes
                    });
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // 下载所有压缩后的图片
    async function downloadAll() {
        if (imageFiles.length === 0) return;

        // 创建 ZIP 文件
        const zip = new JSZip();
        
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const compressedImage = await compressImage(file);
            
            // 将 base64 转换为 blob
            const response = await fetch(compressedImage.url);
            const blob = await response.blob();
            
            // 添加到 ZIP
            const fileName = file.name.replace(/\.[^/.]+$/, "") + "_compressed.jpg";
            zip.file(fileName, blob);
        }

        // 生成并下载 ZIP
        const content = await zip.generateAsync({type: "blob"});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "compressed_images.zip";
        link.click();
    }

    // 事件监听器
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#E5E5E5';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#E5E5E5';
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
        processImages();
    });

    downloadBtn.addEventListener('click', downloadAll);

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}); 