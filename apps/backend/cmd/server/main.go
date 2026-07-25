package main

import (
	"log"
	"net/http"
)

func main() {
	log.Println("Craftgali backend starting...")

	// TODO: Initialize database connection
	// TODO: Set up routes
	// TODO: Start server

	log.Fatal(http.ListenAndServe(":8080", nil))
}
