package models

type User struct {
	PrivateKey string `json:"privateKey" validate:"required"`
	Address    string `json:"address,omitempty" validate:"required"`
	Email      string `json:"email,omitempty" validate:"required"`
}
