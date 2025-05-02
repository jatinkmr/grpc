const express = require('express');
const bodyParser = require('body-parser');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'proto/serviceOne.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const app = express();

// app.use(express.json());
app.use(bodyParser.json());

const client = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());

app.get('/', (req, res) => {
    res.send('Hello from microservice 1');
});

function sendUserAsync(client, request) {
    return new Promise((resolve, reject) => {
        client.sendUser(request, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
}

app.post('/send-user', async (req, res) => {
    const request = { name: req.body.name, email: req.body.email };
    console.log('Request:', request);
    try {
        const response = await sendUserAsync(client, request);
        console.log('Response:', response.message);
        res.send(response);
    } catch (err) {
        console.error('Error sending user:', err);
        res.status(500).send(err);
    }
});

app.listen(3000, () => {
    console.log('API Server 1 is running on port 3000');
});
