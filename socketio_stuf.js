
path_of_program = 'ai/python_get_hint.py';
exports.main_function = function (socket) {

    socket.on('2048',function(data){
        data=data.toString();
        console.log('Data came from 2048: ' + data);
        var spawn = require('child_process').spawn,
            py = spawn('python', [path_of_program, '-q', data]);
        var result_of_program = '';
        py.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
            result_of_program += data;
            console.log(result_of_program.indexOf('}'));
            if (result_of_program.indexOf('}') >= 0) {
                console.log("We are sure we get the data,killing it");
                py.kill();
                console.log('This is answer from program ' + result_of_program);
                socket.emit('2048',result_of_program);
            }
        });
        py.stdin.end();
    });

};
