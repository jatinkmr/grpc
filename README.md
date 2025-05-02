# gRPC Microservices Implementation

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.x-blue.svg)](https://expressjs.com/)
[![gRPC](https://img.shields.io/badge/gRPC-latest-orange.svg)](https://grpc.io/)

This repository demonstrates inter-service communication using gRPC between two Express.js-based microservices:

- **microServiceOne**: Acts as a client that receives HTTP requests and forwards them as gRPC calls
- **microServiceTwo**: A gRPC server that processes requests and returns formatted responses

## Architecture

```
┌─────────────────┐     HTTP POST     ┌─────────────────┐      gRPC      ┌─────────────────┐
│    HTTP Client  │ ─────────────────>│ microServiceOne │ ─────────────> │ microServiceTwo │
│  (curl/Postman) │                   │  (Express/gRPC) │                │   (gRPC Server) │
└─────────────────┘                   └─────────────────┘                └─────────────────┘
                                                 ↑                               │
                                      HTTP Response                      gRPC Response
                                                 └───────────────────────────────┘
```

## Features

- **Type-Safe Communication**: Using Protocol Buffers (.proto files)
- **Efficient Data Transfer**: Leveraging gRPC's binary protocol for performance
- **Service Definition**: Clear interface contracts between services
- **Simple HTTP API**: Easy testing via standard HTTP endpoints

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jatinkmr/grpc.git
cd grpc
```

2. Install dependencies for both services:
```bash
# For microServiceOne
cd microServiceOne
npm install

# For microServiceTwo
cd ../microServiceTwo
npm install
```

## Running the Services

1. Start microServiceTwo (gRPC server) first:
```bash
cd microServiceTwo
npm run dev
```

2. In a separate terminal, start microServiceOne:
```bash
cd microServiceOne
npm run dev
```

## Testing

### Using curl

Send a POST request to microServiceOne:

```bash
curl -X POST http://localhost:3000/send-user \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

### Using Postman

1. Create a new POST request
2. URL: `http://localhost:3000/send-user`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "name": "John",
  "email": "john@example.com"
}
```

### Expected Output

#### microServiceTwo Logs:
```
@@@Call { name: 'John', email: 'john@example.com' }
Received user: John, john@example.com
@@@Sending response: { message: 'User received', data: '12345' }
```

#### microServiceOne Logs:
```
Request: { name: 'John', email: 'john@example.com' }
@@@Raw response: { message: 'User received', data: '12345' }
Response: { message: 'User received', data: '12345' }
```

#### HTTP Response:
```json
{
  "message": "User received",
  "data": "12345"
}
```

## Project Structure

```
├── microServiceOne/
│   ├── package.json
│   ├── server.js
│   ├── proto/
│   │   └── user.proto
│   └── ...
│
├── microServiceTwo/
│   ├── package.json
│   ├── server.js
│   ├── proto/
│   │   └── user.proto
│   └── ...
│
└── README.md
```

## Protocol Buffer Definition

The services communicate using the following protocol buffer definition:

```proto
syntax = "proto3";

service UserService {
  rpc SendUser(UserRequest) returns (UserResponse) {}
}

message UserRequest {
  string name = 1;
  string email = 2;
}

message UserResponse {
  string message = 1;
  string data = 2;
}
```

## Error Handling

Both services implement error handling for:
- Invalid input validation
- gRPC connection issues
- Service availability problems

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
