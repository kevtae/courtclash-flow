package controllers

import (
	"context"
	"fmt"

	"golang-backend/configs"
	"golang-backend/models"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var submissionCollection *mongo.Collection = configs.GetCollection(configs.DB, "submission")

// take parameter of userID and challengeID
func CreateSubmission(userID primitive.ObjectID, challengeID primitive.ObjectID, videoLink string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var submission models.Submission
	defer cancel()

	objectID := primitive.NewObjectID()

	newSubmission := models.Submission{
		ID:          objectID,
		VideoLink:   submission.VideoLink,
		ChallengeID: challengeID,
		UserID:      userID,
	}

	result, err := challengeCollection.InsertOne(ctx, newSubmission)
	if err != nil {
		// return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	fmt.Println(result)

	// return c.Status(http.StatusCreated).JSON(responses.UserResponse{Status: http.StatusCreated, Message: "success", Data: &fiber.Map{"data": result}})
}
