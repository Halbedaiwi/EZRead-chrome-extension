document.addEventListener('DOMContentLoaded', function () {
    // Get stored text and clear it if it exists
    chrome.storage.local.get('transferredText', function (result) {
        if (result.transferredText) {
            document.getElementById('inputText').value = result.transferredText;
            // Clear the stored text after displaying it
            chrome.storage.local.remove('transferredText');
        }
    });
  
    // Get elements from DOM
    const form = document.getElementById('myForm'); // Form
    const inputText = document.getElementById('inputText'); // Input field
    const extendButton = document.getElementById('extendButton'); // Extend button
    const responseContainer = document.getElementById('responseContainer'); // Response container
    const zoomInButton = document.getElementById('zoomInButton'); // Zoom in button
    const zoomOutButton = document.getElementById('zoomOutButton'); // Zoom out button
    const resetButton = document.getElementById('resetButton'); // Reset button
    const deleteButton = document.getElementById('deleteButton'); // Delete button
    const prevButton = document.getElementById('prevButton'); // Previous button
  
    // Initialize variables
    let zoomLevel = 1; // Zoom level
    let paddingLevel = 20; // Padding level
    let historyStack = []; // History stack
    let currentIndex = -1; // Current index
  
    // Load saved state on DOMContentLoaded
    loadSavedState();
    loadZoomSettings();
  
    // Prevent default form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        // Get user input and send to backend
        const userInput = inputText.value.trim();
        sendToBackend(userInput, 'submit');
    });
  
    // Extend button click event
    extendButton.addEventListener('click', function () {
        // Get user input and send to backend
        const userInput = inputText.value.trim();
        sendToBackend(userInput, 'extend');
    });
  
    // Zoom in button click event
    zoomInButton.addEventListener('click', function () {
        // Increment zoom level and padding level
        zoomLevel += 0.1;
        document.body.style.transform = `scale(${zoomLevel})`;
        if (paddingLevel === 20) {
            paddingLevel = 50;
        } else if (paddingLevel === 50) {
            paddingLevel = 80;
        } else {
            paddingLevel += 30;
        }
        document.querySelector('.container').style.padding = `${paddingLevel}px`;
        saveZoomSettings(); // Save settings after zooming
    });
  
    // Zoom out button click event
    zoomOutButton.addEventListener('click', function () {
        // Decrement zoom level and padding level
        if (zoomLevel > 0.1) {
            zoomLevel -= 0.1;
            document.body.style.transform = `scale(${zoomLevel})`;
            if (paddingLevel === 80) {
                paddingLevel = 50;
            } else if (paddingLevel === 50) {
                paddingLevel = 20;
            } else {
                paddingLevel = Math.max(20, paddingLevel - 30);
            }
            document.querySelector('.container').style.padding = `${paddingLevel}px`;
            saveZoomSettings(); // Save settings after zooming
        }
    });
  
    // Reset button click event
    resetButton.addEventListener('click', function () {
        // Reset zoom level and padding level to default
        zoomLevel = 1;
        paddingLevel = 20;
        document.body.style.transform = `scale(${zoomLevel})`;
        document.querySelector('.container').style.padding = `${paddingLevel}px`;
        saveZoomSettings(); // Save default settings
    });
  
    // Delete button click event
    deleteButton.addEventListener('click', function () {
        // Save current state before clearing
        saveCurrentState();
        inputText.value = ''; // Clear input text
        responseContainer.textContent = ''; // Clear response
    });
  
    // Previous button click event
    prevButton.addEventListener('click', function () {
        // Load previous state when Prev button is clicked
        loadPreviousState();
    });
  
    // Save current state
    function saveCurrentState() {
        // Get user input and response content
        const userInput = inputText.value.trim();
        const generatedInfo = responseContainer.textContent.trim();
  
        // Save state if user input or response content is not empty
        if (userInput || generatedInfo) {
            historyStack.push({ userInput, generatedInfo });
            currentIndex = historyStack.length - 1;
            chrome.storage.local.set({ historyStack, currentIndex });
        }
    }
  
    // Load saved state
    function loadSavedState() {
        chrome.storage.local.get(['historyStack', 'currentIndex'], function (result) {
            // Check if history stack is not empty
            if (result.historyStack && result.historyStack.length > 0) {
                historyStack = result.historyStack;
                currentIndex = result.currentIndex !== undefined ? result.currentIndex : historyStack.length - 1;
                // Get current state from history stack
                const currentState = historyStack[currentIndex];
                if (currentState) {
                    // Update input field and response container
                    inputText.value = currentState.userInput;
                    responseContainer.textContent = currentState.generatedInfo;
                }
            }
        });
    }
  
    // Load previous state
    function loadPreviousState() {
        // Check if current index is greater than 0
        if (currentIndex > 0) {
            currentIndex -= 1;
            // Get previous state from history stack
            const previousState = historyStack[currentIndex];
            if (previousState) {
                // Update input field and response container
                inputText.value = previousState.userInput;
                responseContainer.textContent = previousState.generatedInfo;
                // Save current index
                chrome.storage.local.set({ currentIndex });
            }
        }
    }
  
    // Save zoom settings
    function saveZoomSettings() {
        chrome.storage.local.set({ zoomLevel, paddingLevel });
    }
  
    // Load zoom settings
    function loadZoomSettings() {
        chrome.storage.local.get(['zoomLevel', 'paddingLevel'], function (result) {
            // Check if zoom level and padding level are set
            if (result.zoomLevel && result.paddingLevel) {
                zoomLevel = result.zoomLevel;
                paddingLevel = result.paddingLevel;
                document.body.style.transform = `scale(${zoomLevel})`;
                document.querySelector('.container').style.padding = `${paddingLevel}px`;
            }
        });
    }
  
    // Send user input to backend
    function sendToBackend(userInput, clickedButton) {
        // Send POST request to backend with user input and button data
        fetch('http://localhost:5000/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userInput, clickedButton })
        })
        .then(response => {
            // Check if response is JSON
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse JSON response
            return response.json();
        })
        .then(data => {
            // Log response from backend
            console.log('Response from backend:', data.message);
            // Display response on webpage
            displayResponse(data.message);
        })
        .catch(error => {
            // Log error
            console.error('Error communicating with backend:', error);
            // Display error message on webpage
            responseContainer.textContent = 'Error communicating with backend. Please try again.';
        });
    }
  
    // Display response on webpage
    function displayResponse(content) {
        // Update response container
        responseContainer.textContent = content;
        // Save current state
        saveCurrentState();
    }
  
    // Save state before popup is closed
    window.addEventListener('beforeunload', function () {
        // Get user input and response content
        const userInput = inputText.value.trim();
        const generatedInfo = responseContainer.textContent.trim();
        // Save state to storage
        chrome.storage.local.set({ userInput, generatedInfo });
    });
  
  });