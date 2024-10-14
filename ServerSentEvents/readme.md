# Server-Sent Events (SSE) Server in Go

This Go package provides an implementation of a Server-Sent Events (SSE) server using the `http` package. SSE is a server push technology allowing the server to push real-time updates to the browser over HTTP.

## Features

- Implements a basic SSE server that sends periodic time updates to connected clients.
- Supports multiple clients simultaneously, broadcasting the same events to all active connections.
- Clients can disconnect gracefully, and the server will automatically stop sending events to them.
- Utilizes Go's concurrency model to handle multiple clients efficiently.

## Requirements

- Go 1.15+ installed.

## Installation

1. **Clone the repository or copy the code**:

   ```bash
   git clone https://github.com/arpit-ayeeee/SystemPrototypes.git
   cd serversentevents
   ```

2. **Run the server**:

   Use the following command to run the server:

   ```bash
   go run main.go
   ```

3. **Visit the server in your browser or use an SSE client**:

   The server runs on `http://localhost:3000`. Open your browser or use a tool like `curl` to connect and start receiving real-time time updates.

   Example with `curl`:

   ```bash
   curl http://localhost:3000
   ```

## Usage

Once the server is running, clients can connect to `http://localhost:3000` to receive real-time updates every 2 seconds. The server will send a message like:

```
data: the time is 2024-10-13 14:35:22.123456789 +0000 UTC
```

### Event Handling

- **New Client**: When a new client connects, their connection is registered with the server, and they will start receiving event updates.
- **Client Disconnect**: If a client disconnects, the server will detect it and stop sending events to that client.

## Code Explanation

### Broker

The `Broker` struct manages the connections and event broadcasting. It contains the following components:

- `Notifier`: A channel where events are pushed, and then broadcasted to all clients.
- `newClients`: A channel for registering new clients.
- `closingClients`: A channel for removing clients when they disconnect.
- `clients`: A map of active client connections.

### Functions

- **`NewServer()`**: Initializes and returns a new `Broker` instance. It starts the `listen()` method that handles the registration and deregistration of clients as well as event broadcasting.

- **`ServeHTTP(rw http.ResponseWriter, req *http.Request)`**: Handles incoming HTTP requests and streams data to clients using the SSE protocol. It ensures proper flushing of data to the client, registering the client to receive events, and cleaning up on client disconnection.

- **`listen()`**: The main loop that processes new connections, client disconnections, and broadcasts events to all connected clients.

- **`main()`**: The entry point of the program. It creates a `Broker` and starts a periodic time event that is sent to all connected clients every 2 seconds. It also starts an HTTP server on `localhost:3000`.

### Key Concepts

- **Concurrency**: Go's `goroutines` are used to handle multiple clients and send events concurrently.
- **Channels**: Go channels are used for communication between the event notifier, new clients, and closing clients.
- **SSE (Server-Sent Events)**: A standard protocol for server-side event streaming over HTTP. This is implemented using HTTP's `text/event-stream` content type.

### Example Client Output

When a client connects to `http://localhost:3000`, they will receive the following output:

```
data: the time is 2024-10-13 14:35:22.123456789 +0000 UTC

data: the time is 2024-10-13 14:35:24.123456789 +0000 UTC

data: the time is 2024-10-13 14:35:26.123456789 +0000 UTC
```

Each `data` line is a message containing the current time, sent every 2 seconds.

### Error Handling

If a client disconnects, the server handles it gracefully by unregistering the client and no longer attempting to send them events.

## Conclusion

This Go-based SSE server demonstrates how to efficiently broadcast real-time updates to multiple clients. It can be extended for various real-time use cases, such as live data feeds, notifications, or monitoring dashboards.

