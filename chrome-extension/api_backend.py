from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from groq import Groq

os.environ["GROQ_API_KEY"] = "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"

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

summerizeAI = "You are a helpful assistant that will summarize the given content in layman terms, and will only give important details. You will be as short and concise as possible, cutting straight to the chase. Refrain from using opening's such as, here is your summery, then stating the summery."
extendAI = "You are a highly detailed and descriptive assistant. For any given input, provide thorough explanations, additional context, and extensive commentary. Ensure your responses are significantly longer and more enriched than the original input."

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/api/search', methods=['POST'])
def search():
    data = request.get_json()
    userInput = data.get('userInput')
    clickedButton = data.get('clickedButton')

    if clickedButton == 'submit':
        roleAI = summerizeAI
    elif clickedButton == 'extend':
        roleAI = extendAI
    else:
        return jsonify({'message': 'Unknown button clicked.'}), 400

    try:
        # API request to groq
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": roleAI,
                },
                {
                    "role": "user",
                    "content": userInput,
                }
            ],
            model="llama-3.1-8b-instant",
        )
        response_content = response.choices[0].message.content
        return jsonify({'message': response_content})

    except Exception as e:
        print(f"Error communicating with API: {e}")
        return jsonify({'message': 'Error communicating with API.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
