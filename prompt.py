from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Prompt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_input = db.Column(db.Text, nullable=False)
    generated_prompt = db.Column(db.Text, nullable=False)
    target_tool = db.Column(db.String(50), nullable=False)  # chatgpt, dalle, midjourney
    prompt_style = db.Column(db.String(50), nullable=False)  # creative, factual, detailed
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Optional for anonymous users
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Prompt {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_input': self.user_input,
            'generated_prompt': self.generated_prompt,
            'target_tool': self.target_tool,
            'prompt_style': self.prompt_style,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
