# EZRead

EZRead is a Chrome extension designed to enhance text management by summarizing or extending content. It features an intuitive interface with memory for previously generated text, offering users a seamless experience in handling text efficiently.

## Features

- **Summarize**: Condense content to highlight key points.
- **Extend**: Provide more detailed explanations and context.
- **Memory**: Remembers previously generated information.
- **User-Friendly**: Clean and intuitive interface for a smooth experience.

## Installation

### Backend Setup

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install the required packages.
```bash
pip install flask
pip install flask-cors
pip install groq
```
After installing the packages, clone the the repository with "git clone https://github.com/Halbedaiwi/EZRead-chrome-extension.git".
## API Key Setup

EZRead uses the powerful Llama 3.1 model from Meta. To use this LLM, createa an API key with [GroqCloud](https://console.groq.com/keys). 
Make sure to set the GROQ_API_KEY in your environment to use the Groq API within the "api_backend.py" folder.

## Load Unpacked Extensions
1. While loged in on a Chrome browser, head to [manage extensions](chrome://extensions/). This can be found while clicking on your profile icon on the top right of the Chrome browser
2. On the top left, select "Load unpacked"
3. Naviate to the directory containing EZRead, and select it

At this point, EZRead should appear as a load unpacked extension within the Chrome Extensions page.

## Run The Program via Terminal
1. If not already, change directories to where the program has been saved. For example, "cd C:\Users\YourUsername\Documents\YourProjectDirectory"
2. Run the command "python api_backend.py"
 
