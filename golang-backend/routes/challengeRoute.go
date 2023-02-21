package routes

import (
	"golang-backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func ChallengeRoute(app *fiber.App) {
	app.Post("/challenge", controllers.CreateChallenge)
	app.Get("/challenge", controllers.GetAllChallenges)
	// app.Get("/user/:userId", controllers.GetAUser)
	// app.Put("/user/:userId", controllers.EditAUser)
	// app.Delete("/user/:userId", controllers.DeleteAUser)
	// app.Get("/users", controllers.GetAllUsers)
}
