import config
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
# for personal safety reasons the password is imported from a python external file that is not committed on Git
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://postgres:{config.passwd}@localhost/users'
db = SQLAlchemy(app)

# python uses this class to create a table on the database
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"User: {self.name} and {self.email}"

    def __init__(self, name, email):
        self.name = name
        self.email = email

def format_user(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "created_at": user.created_at
    }


@app.route('/')
def hello():
    return 'Hey!'
# create a record
@app.route('/users/new', methods=['POST'])
def create_user():
    name = request.json['name']
    email = request.json['email']
    user = User(name, email)
    db.session.add(user)
    db.session.commit()
    return format_user(user)

# get all users
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.order_by(User.id.asc()).all()
    user_list = []
    for user in users:
        user_list.append(format_user(user))
    return {'users': user_list}

# get a single user
@app.route('/users/get/<id>', methods=['GET'])
def get_user(id):
    user = User.query.filter_by(id=id).one()
    formatted_user = format_user(user)
    return {'user': formatted_user}

# delete an user
@app.route('/users/delete/<id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.filter_by(id=id).one()
    db.session.delete(user)
    db.session.commit()
    return f'User (id: {id}) deleted succesfully!'

@app.route('/users/update/<id>', methods=['PUT'])
def update_user(id):
    user = User.query.filter_by(id=id)
    name = request.json['name']
    email = request.json['email']
    user.update(dict(name=name, email=email, created_at=datetime.utcnow()))
    db.session.commit()
    return {'user': format_user(user.one())}

if __name__=='__main__':
    app.run()