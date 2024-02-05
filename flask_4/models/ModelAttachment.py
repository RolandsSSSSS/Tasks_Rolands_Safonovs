import dataclasses
from sqlalchemy.orm import relationship


@dataclasses.dataclass
class ModelAttachment:
    attachments_id: int = 0
    post_id: int = 0
    file_name: str = ""
    file_path: str = ""
    thumbnail_uuid: str = ""

    post = relationship("ModelPost", back_populates="attachments")