package main

import (
	"os"

	"github.com/gin-gonic/gin"
)

func main() {

	dsn := loadConfig()
	initDB(dsn)

	r := gin.Default()
	setupHandlers(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
