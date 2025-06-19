package main

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func initDB(dsn string) {
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	DB.AutoMigrate(&User{}, &Job{})
}

func checkDBConnection() bool {
	if DB == nil {
		log.Println("Database connection is not initialized")
		return false
	}
	var ping int
	err := DB.Raw("SELECT 1").Scan(&ping).Error
	if err != nil {
		log.Printf("Database connection test failed: %v", err)
		return false
	}
	log.Println("Database connection is active")
	return true
}

func getUsers() ([]User, error) {
	var users []User
	err := DB.Find(&users).Error
	return users, err
}

