package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Challenge struct {
	ID            primitive.ObjectID `bson:"_id"`
	VideoLink     string             `json:"videoLink" validate:"required"`
	Ended         bool               `json:"ended" default:"false"`
	Name          string             `json:"name" validate:"required"`
	ChallengeType string             `json:"challengeType" validate:"required"`
	Link          string             `json:"link" validate:"required"`
	Description   string             `json:"description" validate:"required"`
	Image         []string           `bson:"Image"`
	Date          primitive.DateTime `json:"date"`
}

// type Images struct {
// 	// Fields for your object
// 	ID        primitive.ObjectID `bson:"_id"`
// 	VideoLink string             `json:"videoLink" validate:"required"`
// }
