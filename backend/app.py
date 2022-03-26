from pydoc import describe
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:cwss1994@localhost/users'
db = SQLAlchemy(app)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"Event: {self.name} and {self.email}"

    def __init__(self, name, email):
        self.name = name
        self.email = email

def format_event(event):
    return {
        "id": event.id,
        "name": event.name,
        "email": event.email,
        "created_at": event.created_at
    }


@app.route('/')
def hello():
    return 'Hey!'

@app.route('/event', methods = ['POST'])
def create_event():
    name = request.json['name']
    email = request.json['email']
    event = Event(name, email)
    db.session.add(event)
    db.session.commit()
    return format_event(event)

if __name__=='__main__':
    app.run()