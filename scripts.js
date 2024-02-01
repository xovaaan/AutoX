function showLandingPage() {
    var landingContainer = document.getElementById('landing-container');
    var mainContainer = document.getElementById('main-container');
    
    // Only hide the landing page, keep the dashboard visible
    landingContainer.style.display = 'none';
    mainContainer.style.display = 'block';
}

function showEditor() {
    var landingContainer = document.getElementById('landing-container');
    var mainContainer = document.getElementById('main-container');
    
    // Hide both landing page and dashboard, show the main content
    landingContainer.style.display = 'none';
    mainContainer.style.display = 'block';
    document.getElementById('dashboard').style.display = 'block';
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

// Helper function to replace text at a specific range
String.prototype.replaceRange = function (start, end, replacement) {
    return this.substring(0, start) + replacement + this.substring(end);
};
