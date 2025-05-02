const express = require('express');
const bodyParser = require('body-parser');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { sendUser } = require('./proto');

const PROTO_PATH = path.join(__dirname, './proto/serviceTwo.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const app = express();

app.use(express.json());
app.use(bodyParser.json());

const server = new grpc.Server();
server.addService(userProto.UserService.service, { sendUser });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error)
        console.error('grpc Server bind error:', error);

    console.log(`grpc Server started on port ${port}`);
});

app.use('/', (req, res) => {
    res.send('Hello from microservice 2');
});

app.listen(3001, () => {
    console.log('API Server 2 is running on port 3001');
});
