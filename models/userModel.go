package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID         primitive.ObjectID `bson:"_id"`
	PrivateKey string             `json:"privateKey" validate:"required"`
	Address    string             `json:"address,omitempty" validate:"required"`
	Email      string             `json:"email,omitempty" validate:"required"`
}
