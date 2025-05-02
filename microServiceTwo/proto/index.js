exports.sendUser = (call, callback) => {
    const name = call.request.name;
    const email = call.request.email;
    console.log(`Received user: ${name}, ${email}`);
    callback(null, { message: 'User received' });
}
