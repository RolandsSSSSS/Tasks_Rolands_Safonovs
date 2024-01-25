import dataclasses
from sqlalchemy import ForeignKey, Column, Integer
from sqlalchemy.orm import relationship


@dataclasses.dataclass
class ModelAttachment:
    attachments_id: int = 0
    post_id: int = 0
    file_name: str = ""
    file_path: str = ""
    thumbnail_uuid: str = ""

    post = relationship("ModelPost", back_populates="attachments")
    post_id = Column(Integer, ForeignKey('post.post_id'))