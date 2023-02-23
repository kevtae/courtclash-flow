package main

import (
	"golang-backend/configs"
	"golang-backend/routes"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(&fiber.Map{"data": "Hello from Fiber & mongoDB"})
	})

	// //run database
	configs.ConnectDB()

	routes.UserRoute(app)
	routes.ChallengeRoute(app)
	routes.CircleRoute(app)

	app.Listen(":6000")
}
