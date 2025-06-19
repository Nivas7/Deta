package main

import "github.com/gin-gonic/gin"

func setupHandlers(r *gin.Engine) {
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	r.GET("/db-check", func(c *gin.Context) {
		if checkDBConnection() {
			c.JSON(200, gin.H{"status": "connected", "time": "2025-06-19 11:06 AM IST"})
		} else {
			c.JSON(500, gin.H{"status": "disconnected", "error": "Database connection failed"})
		}
	})

	r.GET("/users", func(c *gin.Context) {
		users, err := getUsers()
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to fetch users", "details": err.Error()})
			return
		}
		c.JSON(200, users)
	})
}
