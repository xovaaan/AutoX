const apiKey = "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";
const maxImages = 9; // Update to generate 8 images for each prompt
let selectedImageNumber = null;

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function disableGenerateButton() {
    document.querySelector(".generate").disabled = true;
}

function enableGenerateButton() {
    document.querySelector(".generate").disabled = false;
}

function clearImageGrid() {
    const imageGrid = document.querySelector(".grid");
    imageGrid.innerHTML = "";
}

async function generateImages() {
    const input = document.querySelector("#prompt").value;
    disableGenerateButton();
    clearImageGrid();

    const loading = document.querySelector(".loading");
    loading.style.display = "block";

    const imageUrls = [];

    for (let i = 0; i < maxImages; i++) {
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            alert("Failed to generate image!");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.querySelector(".grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null; // Reset selected image number
}

function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}
