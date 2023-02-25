package routes

import (
	"golang-backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func PaymentRoute(app *fiber.App) {
	app.Get("/get-client-secret", controllers.SendPaymentIntent)
	app.Post("/webhook", controllers.RetrieveWebhook)
}
