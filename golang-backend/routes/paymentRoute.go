package routes

import (
	"golang-backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func PaymentRoute(app *fiber.App) {
	app.Get("/get-client-secret", controllers.SendPaymentIntent)
	app.Post("/webhook", controllers.RetrieveWebhook)
}

///NGROK_AUTHTOKEN=1mytm1hKO3RNkezAyVhSPvxFIBW_4aipyrs1LvAJX6fFYfinS go run main.go
