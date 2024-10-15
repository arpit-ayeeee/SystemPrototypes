const amqp = require('amqplib');

const message = {name: process.argv[2]};

async function connect() {
    try{
        // We are using amqp protocol here, and connecting to the RabbitMQ server running at 5672 port
        const connection = await amqp.connect('amqp://localhost:5672');

        //We'll have to create a channel wihtin the conneciton
        const channel = await connection.createChannel();
        //console.log(channel);

        //Create a queue to publish messages
        const result = await channel.assertQueue("JobQueue");
        //console.log(result);

        //Send message to job queue
        channel.sendToQueue("JobQueue", Buffer.from(JSON.stringify(message)));

        console.log("Job sent", message.name);

    } catch(err) {
        console.error(err);
    }
}

connect();