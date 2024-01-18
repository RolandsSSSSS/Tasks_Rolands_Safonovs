import dataclasses


@dataclasses.dataclass
class ModelTag:
    tag_id: int = 0
    label: str = ""
    created: int = 0
    is_deleted: bool = False
