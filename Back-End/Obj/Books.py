from hashlib import sha3_512
from sqlalchemy import Column, INT, VARCHAR
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Books(Base):

    __tablename__ = 'Books'
    _id = Column("BookID", INT, primary_key=True, autoincrement=True)
    name = Column("Name", VARCHAR(513))
    author = Column("Author", VARCHAR(513))
    hash_id = Column("Hash_id", VARCHAR(513), unique=True)
    remote_id = Column("Remote_id", VARCHAR(513), unique=True)
    _base_url = 'https://drive.google.com/file/d/{}/view'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.hash_id = sha3_512((self.name + self.author).encode()).hexdigest()

    def to_dict(self):
        return {"author": str(self.author),
                "name": str(self.name),
                "hash_id": str(self.hash_id),
                "remote_id": str(self.remote_id),
                "url": self.get_url()
                }

    def get_url(self):
        return self._base_url.format(self.remote_id)
