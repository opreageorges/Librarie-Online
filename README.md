# Librarie-Online=

An online library where you can read books, magazines, scientific publications or anything with the option **"save as .pdf"**.

## Technologies:

  - Python/JavaScript - Programming
  - Flask - The framework used and the backbone of the application.
  - Sqlalchemy - Library used for database interaction and ORM creation.
  - google-auth-oauthlib/google-auth-httplib2 - Libraries used for authentication to Google services, in this app Google Drive
  - google-api-python-client - Library used for interaction with Google Drive
  - waitress - Library used for serving the application
  - distro - Library used to determinate what Linux distribution the application runs on, if it runs on a Linux machine.
  - ReacctJS - Used for the FrontEnd

## How to install and start:

```sh
git clone https://github.com/opreageorges/Librarie-Online.git

cd ./Librarie-Online

chmod 744 ./start.sh

sudo ./start.sh
```
