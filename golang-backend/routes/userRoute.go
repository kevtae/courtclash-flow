package routes

import (
	"golang-backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func UserRoute(app *fiber.App) {
	app.Post("/user", controllers.CreateUser)
	app.Post("/user-get-balance", controllers.GetUserBalance)
	// app.Get("/export-wallet")
}
