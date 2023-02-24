package main

import (
	"context"
	"fmt"
	"golang-backend/configs"
	"golang-backend/routes"
	"log"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"golang.ngrok.com/ngrok"
	"golang.ngrok.com/ngrok/config"
)

func main() {
	app := fiber.New(fiber.Config{
		ReadTimeout:  time.Second * 30,
		WriteTimeout: time.Second * 30,
	})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(&fiber.Map{"data": "Hello from Fiber & mongoDB"})
	})

	// //run database
	configs.ConnectDB()

	routes.UserRoute(app)
	routes.ChallengeRoute(app)
	routes.PaymentRoute(app)

	app.Listen(":6000")

}

func run(ctx context.Context) error {
	tun, err := ngrok.Listen(ctx,
		config.HTTPEndpoint(),
		ngrok.WithAuthtokenFromEnv(),
	)
	if err != nil {
		return err
	}

	log.Println("tunnel created:", tun.URL())

	return http.Serve(tun, http.HandlerFunc(handler))
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello from ngrok-go!")
}
