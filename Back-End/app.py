from Obj.Users import Users
from Obj.Books import Books
from Obj.DataBase import DataBase

import json
from flask import Flask, request, Response
from flask_cors import CORS
import re

app = Flask(__name__)
app.config['BUNDLE_ERRORS'] = True
CORS(app)


@app.route('/user', methods=['POST'])
def register() -> json:
    """
    Function that handles user registration.
    It is called with a http post request at <domain>/user.
    It takes the following arguments: username, name, surname, password, email, age.
    It returns a json with the number of errors it had.
    Errors cont == 0 -> user registration was successful.
    Errors cont > 0  -> user registration failed,returns what caused these errors.
    :return: Json with the number errors
    """

    # Initializations of the output with 0 errors
    output = {"errors": {"count": 0}}

    # Database connection
    try:
        db = DataBase()
    except Exception as e:
        output["errors"]["count"] += 1
        output["errors"]["database error"] = str(e)
        Response(json.JSONEncoder().encode(output), 500)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        output["errors"]["count"] += 1
        output["errors"]["server error"] = str(e)
        Response(json.JSONEncoder().encode(output), 500)

    args = request.args

    # Mandatory arguments verification
    if not ("username" in args.keys()
            and "password" in args.keys()
            and "email" in args.keys()):
        output["errors"]["count"] += 1
        output["errors"]["parameters"] = "Mandatory parameters are missing"
        return Response(json.JSONEncoder().encode(output), 400)

    username = str(args["username"])
    password = args["password"]
    email = str(args["email"])

    # Email format verification
    if not re.match("(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email):
        output["errors"]["count"] += 1
        output["errors"]["email"] = "Wrong email format"

    # Password format verification.
    # Minimum eight characters, at least one uppercase letter, one lowercase letter,
    # one number and one special character:
    if not re.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", password):
        output["errors"]["count"] += 1
        output["errors"]["password"] = "Wrong password format"

    # If anything went wrong
    db.session.rollback()

    users = db.session.query(Users)
    # Verify that the username is not already in the database
    for user in users.filter_by(username=username):
        if username == user.username:
            output["errors"]["count"] += 1
            output["errors"]["username"] = "Username already taken"
            break
    for user in users.filter_by(email=email):
        if email == user.email:
            output["errors"]["count"] += 1
            output["errors"]["email"] = "Email already registered"
            break

    # Returns a json with the errors without creating the user
    if len(output["errors"]) > 1:
        return Response(json.JSONEncoder().encode(output), 400)

    db.session.add(Users(username=username,
                         email=email,
                         password=password))

    db.session.commit()

    return Response(json.JSONEncoder().encode(output), 201)


@app.route('/user', methods=['GET'])
def login() -> json:
    """
    Arguments : username, password

    :return: Json with user data or Json with any error that may occur
    """
    args = request.args

    # Initializations of the output with 0 errors
    output = {"errors": {"count": 0}}

    # Establish database connection when it works
    try:
        db = DataBase()
    except Exception as e:
        output["errors"]["count"] += 1
        output["errors"]["database error"] = str(e)
        Response(json.JSONEncoder().encode(output), 500)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        output["errors"]["count"] += 1
        output["errors"]["server error"] = str(e)
        Response(json.JSONEncoder().encode(output), 500)

    # Verify mandatory arguments
    if not ("username" in args.keys()
            and "password" in args.keys()):
        output["errors"]["count"] += 1
        output["errors"]["parameters"] = "Mandatory parameters are missing"
        return Response(json.JSONEncoder().encode(output), 400)

    username = args["username"]
    password = args["password"]

    # Searches the username in the database
    user = None
    for user in db.session.query(Users).filter_by(username=username):
        if str(username) == user.username:
            break

    # If the username is not present in the database return an error
    if user is None:
        output["errors"]["count"] += 1
        output["errors"]["username_or_password"] = "Username does not exist or the password is incorrect"
        return Response(json.JSONEncoder().encode(output), 400)

    # Verifies if the inserted password is the same with the stored one
    if not user.verify_pass(password):
        output["errors"]["count"] += 1
        output["errors"]["username_or_password"] = "Username does not exist or the password is incorrect"

    if len(output["errors"]) > 1:
        return Response(json.JSONEncoder().encode(output), 400)

    output["user"] = user.to_dict()
    return Response(json.JSONEncoder().encode(output), 200)


@app.route('/book', methods=['GET'])
def search() -> json:
    """
    Takes search arguments and returns matching books
    (Any of the book characteristics except id and remote_id).

    :return: Books JSON
    """

    output = {"errors": {"count": 0}}
    try:
        db = DataBase()
    except Exception as e:
        output["errors"]["count"] += 1
        output["errors"]["database error"] = str(e)
        Response(json.JSONEncoder().encode(output), 500)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        output["errors"]["count"] += 1
        output["errors"]["server error"] = str(e)
        Response(json.JSONEncoder().encode(output), 500)

    args = dict(request.args)
    pop_me = []

    for arg in args:
        if arg == '_id' or arg == "remote_id":
            pop_me.append(arg)
        if not hasattr(Books, arg):
            output["errors"]["count"] += 1
            output["errors"][arg] = "Unknown characteristic"
            pop_me.append(arg)

    for i in pop_me:
        args.pop(i)
    query = db.session.query(Books)

    for arg in args:
        # query = query.filter(Books.__getattribute__(Books, arg).like(f"%{args[arg]}%"))
        query = query.filter(getattr(Books, arg).like(f"%{args[arg]}%"))

    output["books"] = []
    for elem in query:
        output["books"].append(elem.to_dict())

    return Response(json.JSONEncoder().encode(output), 200)


@app.route('/book', methods=['POST'])
def admin_upload() -> json:
    args = request.args
    files = request.files

    output = {"errors": {"count": 0}}

    # Establish database connection
    try:
        db = DataBase()
    except Exception as e:
        output["errors"]["count"] += 1
        output["errors"]["database error"] = str(e)
        Response(json.JSONEncoder().encode(output), 500)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        output["errors"]["count"] += 1
        output["errors"]["server error"] = str(e)
        Response(json.JSONEncoder().encode(output), 500)

    # Verify mandatory arguments
    if not ("author" in args.keys()
            or "name" in args.keys()):
        output["errors"]["count"] += 1
        output["errors"]["parameters"] = "Mandatory parameters are missing"
        return Response(json.JSONEncoder().encode(output), 400)

    # Verify if any book was uploaded
    elif "book" not in files:
        output["errors"]["count"] += 1
        output["errors"]["files"] = "No book was uploaded"
        return Response(json.JSONEncoder().encode(output), 400)

    # Verify book data type to be PDF
    elif files['book'].content_type != "application/pdf":
        output["errors"]["count"] += 1
        output["errors"]["files"] = "Uploaded book must be a pdf"
        return Response(json.JSONEncoder().encode(output), 400)

    # Verify if the book already exists in the database
    else:

        book = Books(author=args['author'], name=args["name"], remote_id=None)

        query = db.session.query(Books)
        for arg in args:
            query = query.filter(getattr(Books, arg).like(f"%{args[arg]}%"))

        for elem in query:
            if book.to_dict()["hash_id"] == elem.to_dict()["hash_id"]:
                output["errors"]["count"] += 1
                output["errors"]["files"] = "Book already exists"
                return Response(json.JSONEncoder().encode(output), 400)

    # Upload the book to Google Drive
    book_remote = db.upload_book({k: args[k] for k in ["author", "name"]}, files["book"].stream)

    if book_remote is None:
        output["errors"]["count"] += 1
        output["errors"]["GDRIVE"] = "Failed to upload to Google Drive"
        return Response(json.JSONEncoder().encode(output), 502)

    # Save the id from Google Drive
    book.remote_id = book_remote

    # Adds it to the database
    db.session.add(book)
    db.session.commit()

    return Response(json.JSONEncoder().encode(output), 200)


@app.route('/book', methods=['DELETE'])
def admin_delete() -> json:
    args = request.args

    output = {"errors": {"count": 0}, "books": []}

    # Establish database connection
    try:
        db = DataBase()
    except Exception as e:
        output["errors"]["count"] += 1
        output["errors"]["database error"] = str(e)
        Response(json.JSONEncoder().encode(output), 500)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        output["errors"]["count"] += 1
        output["errors"]["server error"] = str(e)
        Response(json.JSONEncoder().encode(output), 500)


    # Verify mandatory arguments
    if not ("author" in args.keys()
            or "name" in args.keys()):
        output["errors"]["count"] += 1
        output["errors"]["parameters"] = "Mandatory parameters are missing"
        return Response(json.JSONEncoder().encode(output), 400)

    # Verify if the book already exists in the database
    else:

        book = Books(author=args['author'], name=args["name"], remote_id=None)

        query = db.session.query(Books)
        for arg in args:
            query = query.filter(getattr(Books, arg) == args[arg])

        # Removes it from the database
        for elem in query:
            if book.to_dict()["hash_id"] == elem.to_dict()["hash_id"]:
                output["books"].append(elem.to_dict())
                if db.delete_book(elem.to_dict()["remote_id"]):
                    db.session.delete(elem)
                else:
                    output["errors"]["count"] += 1
                    output["errors"]["GDRIVE"] = "Failed to delete from Google Drive"
                    Response(json.JSONEncoder().encode(output), 502)

    db.session.commit()

    return Response(json.JSONEncoder().encode(output), 200)


@app.errorhandler(404)
def error_404(e) -> json:
    output = {"errors": {"count": 0}}
    output["errors"]["count"] += 1
    output["errors"]["404"] = "Endpoint does not exist"
    output["errors"]["message"] = str(e)
    return Response(json.JSONEncoder().encode(output), 404)


if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=5000)
