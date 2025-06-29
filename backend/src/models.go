package main

import "time"

type User struct {
	ID           int       `gorm:"primaryKey"`
	Email        string    `gorm:"type:varchar(255);unique;not null"`
	PasswordHash string    `gorm:"type:varchar(255);not null"`
	CreatedAt    time.Time `gorm:"autoCreateTime"`
}

type Job struct {
	ID              int       `gorm:"primaryKey"`
	UserID          int       `gorm:"not null;index"`
	CompanyName     string    `gorm:"type:varchar(255);not null"`
	JobTitle        string    `gorm:"type:varchar(255);not null"`
	Status          string    `gorm:"type:varchar(50);not null"`
	ApplicationDate time.Time `gorm:"type:date;not null"`
	Deadline        time.Time `gorm:"type:date"`
	CreatedAt       time.Time `gorm:"autoCreateTime"`
	UpdatedAt       time.Time `gorm:"autoUpdateTime"`
}
