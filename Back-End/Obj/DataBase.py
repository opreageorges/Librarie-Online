from time import sleep

from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from typing import IO, Optional

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from googleapiclient.errors import HttpError


class DataBase:
    """
    Singleton class that handles the connection to both the database and Google Drive.

    _instance - the only instance of this class
    connection - database connection
    session - session created from that connection
    base_url - the base url used to access all the files from the drive
    _token - token to connect to the Google Drive

    Both the database URI and the Google Drive token are read from files,
    not available on GitHub, for security reasons, that need to be created manually.
    """

    _instance = None
    connection = None
    session = None
    _token = None
    _drive = None

    def __new__(cls):
        if not isinstance(cls._instance, cls):
            cls._instance = object.__new__(cls)

            with open("Misc/dbURI", "r") as f:
                dburi = f.read()

            if dburi == '':
                raise ValueError("Database URI is empty. Inside the file \"dbURI\" write the database URI. "
                                 "Form: mysql://[user]:[password]@[host]:[port]/<database>")

            cls.connection = create_engine(dburi, echo=True)
            cls.session = Session(bind=cls.connection)
            cls._token = Credentials.from_authorized_user_file('token.json', ['https://www.googleapis.com/auth/drive'])

            if cls._token.expired:
                cls._token.refresh(Request())

                with open('token.json', 'w') as token:
                    token.write(cls._token.to_json())

            cls._drive = build('drive', 'v3', credentials=cls._token)

        return cls._instance

    def upload_book(self, metadata: dict, file: IO) -> Optional[str]:
        try:
            media = MediaIoBaseUpload(file, mimetype='application/pdf')

            file_id = self._drive.files().create(body=metadata, media_body=media, fields='id').execute()
            file_id = self._drive.files().update(fileId=file_id['id'],
                                                 addParents="18YjgqhRMQDv1RGNMxf47-qKUdM0iXDjo",
                                                 fields='id').execute()
            return file_id["id"]
        except HttpError:
            return None

    def delete_book(self, book_id: str):
        try:
            self._drive.files().delete(fileId=book_id).execute()
            return True
        except HttpError:
            return False
