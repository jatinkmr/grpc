exports.sendUser = (call, callback) => {
    console.log('@@@Call', call.request);
    const name = call.request.name;
    const email = call.request.email;
    console.log(`Received user: ${name}, ${email}`);

    const response = {
        message: 'User received',
        data: '12345'
    };

    console.log('response', response)

    callback(null, response);
};
