package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func loadConfig() string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	dsn := os.Getenv("DB_URL")
	if dsn == "" {
		log.Fatal("DB_DSN is not set in .env")
	}
	return dsn
}
