# RabbitMQ Messaging with Node.js

This project demonstrates a simple implementation of message publishing and consuming using RabbitMQ and Node.js. It includes two key components:

1. **Publisher**: Sends messages to a RabbitMQ queue.
2. **Consumer**: Listens to the queue and processes incoming messages.

## Project Structure

- `publisher.js`: Sends messages to the RabbitMQ queue.
- `consumer.js`: Consumes messages from the RabbitMQ queue and acknowledges their processing.

## Requirements

- **Node.js**: Ensure you have Node.js (v12+) installed.
- **RabbitMQ**: RabbitMQ server running in docker (default port `5672`). (docker run --name rabbitmq -p 5672:5672 rabbitmq)
- **amqplib**: This is Advanced Messaging Queue Protocol used to communicate with RabbitMQ server

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arpit-ayeeee/SystemPrototypes/RabbitMQProto.git
   cd SystemPrototypes/RabbitMQProto
   ```

2. **Install dependencies**:
   Install the required `amqplib` package for interacting with RabbitMQ:
   ```bash
   npm install amqplib
   ```

3. **Start RabbitMQ Server**:
   Make sure RabbitMQ is running. You can download and start RabbitMQ from the official [RabbitMQ website](https://www.rabbitmq.com/download.html).

## How to Use

### Running the Consumer
The consumer will listen for messages in the `JobQueue` and process them.

1. Open a terminal window and run the consumer:
   ```bash
   node consumer.js
   ```

   This will keep the consumer running, waiting for incoming messages. You'll see the following message indicating it is ready:

   ```
   Waiting for messages
   ```

### Running the Publisher
The publisher will send messages to the `JobQueue`.

1. Open a second terminal window and run the publisher with a message:
   ```bash
   node publisher.js <YourMessage>
   ```

   Replace `<YourMessage>` with the name or message you want to send. For example:
   ```bash
   node publisher.js "Task1"
   ```

   You should see the following output in the publisher terminal:
   ```
   Job sent Task1
   ```

2. The consumer will automatically receive the message and print it to the console:
   ```
   Received message: Task1
   ```

### Example Flow

1. **Publisher** sends a message to the queue `JobQueue`:
   ```bash
   node publisher.js "Job1"
   ```

2. **Consumer** receives the message and processes it:
   ```bash
   Received message: Job1
   ```

### How It Works

- **Publisher (`publisher.js`)**:
   - Connects to RabbitMQ server (`amqp://localhost:5672`).
   - Creates a channel and ensures a queue named `JobQueue` exists.
   - Sends a message to the queue, which is serialized as a JSON object.

   ```javascript
   const message = {name: process.argv[2]};
   ```

- **Consumer (`consumer.js`)**:
   - Connects to RabbitMQ server (`amqp://localhost:5672`).
   - Creates a channel and ensures the same `JobQueue` exists.
   - Listens for messages in the queue, deserializes them, and logs the message content.
   - Acknowledges the message to remove it from the queue.

   ```javascript
   channel.ack(msg);
   ```

### RabbitMQ Concepts Used

- **Queue**: A named entity in RabbitMQ to which messages are sent and from which messages are consumed.
- **Producer**: The publisher that sends messages to the queue.
- **Consumer**: The subscriber that reads messages from the queue.
- **Acknowledgment (ack)**: Confirms that a message has been processed by the consumer and can be removed from the queue.

## Notes

- RabbitMQ ensures **at least one** delivery of messages to consumers (messages are acknowledged only after being processed).
- You can scale this by adding more consumers, and RabbitMQ will distribute messages among them.

## Troubleshooting

- **RabbitMQ not running**: Ensure RabbitMQ is running locally on port 5672. You can check the status by running:
  ```bash
  sudo systemctl status rabbitmq-server
  ```

- **Connection refused**: If RabbitMQ is not running or is on a different host, ensure the connection URL is updated in both `consumer.js` and `publisher.js` to the correct address (e.g., `amqp://your-host:5672`).

## Conclusion

This project provides a basic example of using RabbitMQ with Node.js to implement a message queue system. It demonstrates how to send and receive messages using a simple publisher-consumer model, which can be extended to more complex workflows.

Feel free to experiment with the code by adding more queues, creating more complex message payloads, or running multiple consumers for parallel message processing.