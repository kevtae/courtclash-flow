package routes

import (
	"golang-backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func ChallengeRoute(app *fiber.App) {
	app.Post("/challenge", controllers.CreateChallenge)
	app.Get("/challenge", controllers.GetAllChallenges)
	app.Post("/verify-submission", controllers.VerfiySubmission)
	app.Get("/get-total-stake", controllers.GetBalance)
	app.Get("/end-challenge", controllers.EndChallenge)
	app.Post("/create-submission", controllers.CreateSubmission)
	app.Get("/get-submission", controllers.GetAllSubmission)
	app.Get("/get-submission-notverify", controllers.GetSubmissionNotVerify)
	app.Get("/get-user-submission", controllers.GetSubmissionUser)

}
