package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func setupHandlers(r *gin.Engine) {
	db := DB
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

	r.GET("/login", func(c *gin.Context) {
		var req LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": "Invalid request"})
			return
		}

		var user User
		if err := db.Where("username = ?", req.Username).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"Error": "Invalid Username or Password"})
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"Error": "Invalid Username or Password"})
		}

		c.JSON(http.StatusOK, gin.H{"message": "Login sucessful"})
	})
}
