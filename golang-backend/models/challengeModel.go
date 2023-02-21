package models

//import userModal

type Challenge struct {
	VideoLink string `json:"videoLink" validate:"required"`
	Ended     bool   `json:"ended" default:"false"`
}
