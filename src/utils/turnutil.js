const {Base64Encode} = require('base64-stream')

function turnToEn(value){
    const data = {
        0 : "FirstClass",
        1 : "SecondClass",
        2 : "ThirdClass",
        3 : "TourthClass",
        4 : "FifthClass",
        5 : "SixthClass"
    }
    return data[value]
}

function chToEn(value) {
    const data = {
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thur',
        5: 'Feb',
        6: 'Sat',
        7: 'Sun'
    }
    return data[value]
}

function streamToBase64(stream){
    return new Promise(resolve => {
        let data = 'data:image/jpeg;base64,'
        let base64code = stream.pipe(new Base64Encode())
        base64code.setEncoding('UTF8')
        base64code.on('data',function(chunk){
            data += chunk
        })

        base64code.on('end', function(){
            resolve(data)     
        })
    })
}


module.exports = {turnToEn,chToEn,streamToBase64}



