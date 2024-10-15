const amqp = require('amqplib');

//RabbitMQ guarentees atleast or atmost 1 delivery

async function connect() {
    try{
        // We are using amqp protocol here, and connecting to the RabbitMQ server running at 5672 port
        const connection = await amqp.connect('amqp://localhost:5672');

        //We'll have to create a channel wihtin the connection, this is a different connection than publisher one
        //Here, we have to keep the connection alive, not like the publisher where we can kill it
        const channel = await connection.createChannel();
        //console.log(channel);

        //Create a queue to publish messages
        const result = await channel.assertQueue("JobQueue");
        //console.log(result);

        //Consume the messages from channel
        channel.consume("JobQueue", (msg) => {
            console.log(`Received message: ${JSON.parse(msg.content.toString()).name}`)

            //Telling the server to remove it from queue, we can ack specific messages to!
            channel.ack(msg);
        });

        console.log("Waiting for messages");


    } catch(err) {
        console.error(err);
    }
}

connect();