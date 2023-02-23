package routes

import (
	"golang-backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func CircleRoute(app *fiber.App) {
	// app.Post("/create-wallet", controllers.CreateWalletCircle)
	// app.Post("/create-deposit-wallet", controllers.CreateDepositAddress)
	// app.Get("/user/:userId", controllers.GetAUser)
	// app.Put("/user/:userId", controllers.EditAUser)
	// app.Delete("/user/:userId", controllers.DeleteAUser)
	app.Get("/setupVault", controllers.SetupVault)
	app.Get("/transfer", controllers.TransferUSDC)
}
