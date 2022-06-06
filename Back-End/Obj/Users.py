from sqlalchemy import Column, INT, VARCHAR
from sqlalchemy.dialects.mssql import TINYINT
from sqlalchemy.orm import declarative_base
from hashlib import sha3_512
from os import urandom


Base = declarative_base()


class Users(Base):

    __tablename__ = 'Users'
    _id = Column("UserID", INT, primary_key=True, autoincrement=True)
    username = Column("Username", VARCHAR(513))
    password = Column("Password", VARCHAR(513))
    salt = Column("Salt", VARCHAR(513))
    is_admin = Column("Is_Admin", TINYINT)
    email = Column("E-mail_Address", VARCHAR(200), unique=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.is_admin = 0

        # Makes the user password secure to be stored.
        self.salt = str(urandom(100).hex())
        self.password += self.salt
        self.password = sha3_512(self.password.encode()).hexdigest()

    def verify_pass(self, p: str) -> bool:
        """
        verify_pass(password, salt, hashed_password) -> (True or False)

        Verifies if the inserted password hash is the same with the stored hash.

        :param p: Password that will be verified
        :return: True if the hash is the same
        """

        if not p:
            return False
        combined = p + self.salt
        return sha3_512(combined.encode()).hexdigest() == self.password

    def to_dict(self):
        return {"username": str(self.username),
                "email": str(self.email),
                "isAdmin": str(self.is_admin)
                }
