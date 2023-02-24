package controllers

import (
	"fmt"
	"golang-backend/responses"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/paymentintent"
)

func SendPaymentIntent(c *fiber.Ctx) error {

	stripe.Key = "sk_test_51J9HwGC27aEgmaoGn561Cp0sTGqYKMobdmQwXJigBCXia7XdmjYHonkizmPhOTDkFvmJRS5CMXBs6Q2I2NeuS6u2000P9Ceigs"

	params := &stripe.PaymentIntentParams{
		Amount: stripe.Int64(2000),
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
		Currency: stripe.String(string(stripe.CurrencyUSD)),
	}
	pi, _ := paymentintent.New(params)

	//get clientSecret and send to frontend
	data := &fiber.Map{
		"clientSecret": pi.ClientSecret,
	}

	fmt.Println(data)

	return c.Status(http.StatusOK).JSON(responses.UserResponse{
		Status:  http.StatusOK,
		Message: "success",
		Data:    data,
	})

}

func RetrieveWebhook(c *fiber.Ctx) error {
	body := c.Body()

	fmt.Println(body)

	return c.Status(http.StatusOK).JSON(responses.SimpleResponse{
		Status: http.StatusOK,
	})
}
