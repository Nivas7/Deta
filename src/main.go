package main

import (
	"github.com/gin-gonic/gin"
	"os"
)

func main() {

	dsn := loadConfig()
	initDB(dsn)

	// Set up Gin router
	r := gin.Default()
	setupHandlers(r)

	// Run server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
