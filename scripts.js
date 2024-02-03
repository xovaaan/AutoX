function showLandingPage() {
    var landingContainer = document.getElementById('landing-container');
    var mainContainer = document.getElementById('main-container');
    var dashboard = document.getElementById('dashboard');

    // Only hide the landing page, keep the dashboard visible on desktop
    if (window.innerWidth >= 768 && dashboard) {
        dashboard.style.display = 'block';
    }

    landingContainer.style.display = 'none';
    mainContainer.style.display = 'block';
}

function showEditor() {
    var landingContainer = document.getElementById('landing-container');
    var mainContainer = document.getElementById('main-container');
    var dashboard = document.getElementById('dashboard');

    // Hide landing page and dashboard, show the main content
    landingContainer.style.display = 'none';
    mainContainer.style.display = 'block';

    // Check if dashboard exists and screen width is less than or equal to 768px before hiding it
    if (dashboard && window.innerWidth < 768) {
        dashboard.style.display = 'none';
    }
}

function autocorrectText() {
    var editor = document.getElementById('editor');
    var userText = editor.value;

    // LanguageTool API endpoint
    var apiUrl = 'https://languagetool.org/api/v2/check';

    // Make a POST request to the LanguageTool API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `text=${encodeURIComponent(userText)}&language=en-US`,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the response for debugging
        // Process the API response and update the editor content
        if (data.matches) {
            // Sort matches by offset in descending order
            data.matches.sort((a, b) => b.offset - a.offset);

            data.matches.forEach(match => {
                if (match.length > 0) {
                    userText = userText.replaceRange(match.offset, match.offset + match.length, match.replacements[0].value);
                } else {
                    // Handle suggestions for zero-length matches (punctuation, sentence structure)
                    userText = userText.substring(0, match.offset) + match.replacements[0].value + userText.substring(match.offset);
                }
            });

            // Add auto-punctuation at the end of the text if needed
            if (!userText.endsWith('.') && !userText.endsWith('!') && !userText.endsWith('?')) {
                userText += '.';
            }

            editor.value = userText; // Use value to update the plain text content
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function textToSpeech() {
    var editor = document.getElementById('editor');
    var userText = editor.value;

    // Example: Use the Web Speech API to read the text aloud
    var speechSynthesis = window.speechSynthesis;
    var speechUtterance = new SpeechSynthesisUtterance(userText);
    speechSynthesis.speak(speechUtterance);
}

function goBack() {
    var landingContainer = document.getElementById('landing-container');
    var mainContainer = document.getElementById('main-container');
    var dashboard = document.getElementById('dashboard');

    // Show landing page and dashboard, hide the main content
    landingContainer.style.display = 'block';
    mainContainer.style.display = 'none';

    // Check if dashboard exists and screen width is less than or equal to 768px before showing it
    if (dashboard && window.innerWidth < 768) {
        dashboard.style.display = 'none';
    }
}

// Helper function to replace text at a specific range
String.prototype.replaceRange = function (start, end, replacement) {
    return this.substring(0, start) + replacement + this.substring(end);
};

function updateCharacterCount() {
    var editor = document.getElementById('editor');
    var counter = document.getElementById('character-counter');
    
    var currentCount = editor.value.length;
    var limit = 2000;
    
    // Update character count
    counter.textContent = '(' + currentCount + '/' + limit + ')';
}

// Attach the updateCharacterCount function to the input event of the editor
document.getElementById('editor').addEventListener('input', updateCharacterCount);

function showTextToImagePage() {
    // Redirect to the Text to Image page
    window.location.href = 'textToImage.html';
}
