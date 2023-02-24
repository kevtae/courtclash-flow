package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Submission struct {
	ID          primitive.ObjectID `bson:"_id"`
	VideoLink   string             `json:"videoLink" validate:"required"`
	ChallengeID primitive.ObjectID `json:"challengeID" "`
	UserID      primitive.ObjectID `json:"userID" "`
}
