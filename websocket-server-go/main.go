package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]bool)
var mutex = &sync.Mutex{}

// create a map for the messages
type ClientData struct {
	YtData      string `json:"ytData"`
	UserMessage string `json:"userMessage"`
}

func main() {
	http.HandleFunc("/yt-data", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Print("upgrade failed: ", err)
			return
		}
		defer conn.Close()

		mutex.Lock()
		clients[conn] = true
		mutex.Unlock()

		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				log.Println("read failed: ", err)
				break
			}

			// Create ClientData object
			cd := ClientData{
				YtData:      string(message),
				UserMessage: "hey there",
			}

			// Convert struct to JSON
			jsonData, err := json.Marshal(cd)
			if err != nil {
				log.Println("json marshal failed:", err)
				continue
			}

			mutex.Lock()
			for client := range clients {
				err := client.WriteMessage(websocket.TextMessage, jsonData) // Use TextMessage for JSON
				if err != nil {
					log.Println("write failed:", err)
					client.Close()
					delete(clients, client)
				}
			}
			mutex.Unlock()
		}

		mutex.Lock()
		delete(clients, conn)
		mutex.Unlock()
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World"))
	})

	http.ListenAndServe(":8080", nil)
}
