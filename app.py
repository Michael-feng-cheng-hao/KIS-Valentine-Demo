from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'kis_valentine_secret_key_demo'

# Fictional demo users database
DEMO_USERS = {
    "Michael": {"grade": "9", "match": "Emma", "clue": "Loves sitting by the library window during lunch 📚"},
    "Emma": {"grade": "9", "match": "Michael", "clue": "Always has a sketchpad out during art class 🎨"},
    "Jamie": {"grade": "10", "match": "Sam", "clue": "Can be found playing basketball at the gym courts 🏀"},
    "Sam": {"grade": "8", "match": "Jamie", "clue": "Wears a bright yellow backpack near the science lab 🧪"},
    "Taylor": {"grade": "11", "match": "Taylor", "clue": "Loves reading in the courtyard 🌿"}
}

# Fictional demo messages for inbox
DEMO_MESSAGES = [
    {"sender": "Anonymous", "recipient": "Public", "text": "Hope everyone has a great Valentine's Day! 💕", "private": False},
    {"sender": "Jamie", "recipient": "Michael", "text": "Good luck with the matchmaker activity!", "private": True}
]

@app.route('/')
def index():
    if 'user' in session:
        return redirect(url_for('home'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        name = request.form.get('name', '').strip().capitalize()
        grade = request.form.get('grade', '').strip()

        if name in DEMO_USERS and DEMO_USERS[name]['grade'] == grade:
            session['user'] = name
            session['grade'] = grade
            return redirect(url_for('question'))
        else:
            error = "Invalid demo credentials! Try Name: 'Michael' and Grade: '9'."

    return render_template('login.html', error=error)

@app.route('/home')
def home():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('home.html', username=session['user'])

@app.route('/question')
def question():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('question.html')

@app.route('/game')
def game():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('game.html')

@app.route('/memories')
def memories():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('memories.html')

@app.route('/letter')
def letter():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('letter.html')

@app.route('/match')
def match():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    current_user = session['user']
    user_info = DEMO_USERS.get(current_user, {})
    match_name = user_info.get('match', 'A Secret Friend')
    match_clue = DEMO_USERS.get(match_name, {}).get('clue', 'Look around the main courtyard!')

    return render_template('match.html', match_name=match_name, clue=match_clue)

@app.route('/send', methods=['GET', 'POST'])
def send():
    if 'user' not in session:
        return redirect(url_for('login'))
    if request.method == 'POST':
        recipient = request.form.get('recipient')
        message = request.form.get('message', '').strip()
        if recipient not in DEMO_USERS and recipient != 'Public' or not message or len(message) > 500:
            return render_template('send.html', sent=False, users=DEMO_USERS.keys(), error='Choose a recipient and write a note between 1 and 500 characters.'), 400
        anonymous = request.form.get('anonymous')
        visibility = request.form.get('visibility', 'private')
        
        sender = "Anonymous" if anonymous else session['user']
        is_private = (visibility != 'public' and recipient != 'Public')
        
        DEMO_MESSAGES.append({
            "sender": sender,
            "recipient": recipient,
            "text": message,
            "private": is_private
        })
        return render_template('send.html', sent=True)
    
    return render_template('send.html', sent=False, users=DEMO_USERS.keys())

@app.route('/messages')
def messages():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    current_user = session['user']
    visible_messages = [
        msg for msg in DEMO_MESSAGES 
        if not msg.get('private', False) or msg.get('recipient') == current_user or msg.get('sender') == current_user
    ]
    
    return render_template('messages.html', messages=visible_messages, current_user=current_user)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)