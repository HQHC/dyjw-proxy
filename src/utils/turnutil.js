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

function getRadioValue(value){
    const data = {
        'star5':{
            'radio1': '4.75,E21DC03AC75C49F8AFEB05D2B18708F8',
            'radio2': '4.75,DFF37AF2B7984CBABFE4031DAB7B561B',
            'radio3': '9.5,DACE4EFAC1DF4474B2BA71ED5768D87D',
            'radio4': '14.25,3DF824E7C7A94B67BEFB4036363D1D19',
            'radio5': '14.25,88943ABD8C35422E91A478515E54CAB2',
            'radio6': '9.5,04A1B0430A3A4683BCB6B386412A5E82',
            'radio7': '14.25,16CC2804E4E74C1DB347DDAC7023D74B',
            'radio8': '4.75,278F763676974CC89860B8202BC49301',
            'radio9': '4.75,FD9542268088485F874EC61981921A46',
            'radio10': '4.75,41B8538D7F974EAD80BC1FE5FBF3BFAB',
            'radio11': '4.75,BD80DD02A8CE409AAD66FDDC114CB204',
            'radio12': '4.25,12BB6E66206246E489C8E92FC0FE979C'
        },
        'star4':{
            'radio1': '4.25,AE571B8A8024400099D414770C9FB5D4',
            'radio2': '4.25,3433E25E3CAF46A19A344B9A182C66A4',
            'radio3': '8.5,64D82C49ACD54571B146241E22444B86',
            'radio4': '12.75,20C5F62FFAF641D9AF7D6BD990CE55D8',
            'radio5': '12.75,56FA830F5CDD428D9A8C9A20AC42F361',
            'radio6': '8.5,3F584BF1DE0746129C25FC224C40B373',
            'radio7': '12.75,26DBE9D2524D4AA0B65D810A5721C6EA',
            'radio8': '4.25,9A48E042851546DFBCD74F855BB8E9BD',
            'radio9': '4.25,0F8EF718FA1A48E2AC0E54D89CE82148',
            'radio10': '4.25,ED514E33BC3347FDBA943740B3319F35',
            'radio11': '4.25,1067BBE5DC4B4BB79BFA81CB05D8B304',
            'radio12': '4.75,FB1FDA99948D4576A67BF72297342596'
        },
        'star3':{
            'radio1': '3.75,59F1370A2510474AAFDFDAD39CF32891',
            'radio2': '3.75,89A51117C41C4ED084061CDB1E84729F',
            'radio3': '7.5,547195FDBAAA497685259C7EA53D782E',
            'radio4': '11.25,B069D82159E34368A79A11C4B9DBF637',
            'radio5': '11.25,930A73501B1E4CF1A4B94A7FEB1528A5',
            'radio6': '7.5,D8C6DF1958854D63B617A332C1E2D536',
            'radio7': '11.25,A7056A18947D4DA8B3ED76E83F729973',
            'radio8': '3.75,4002F647A82C4270B78C71AC6BB070D1',
            'radio9': '3.75,32498D2888D3415781315B173207F349',
            'radio10': '3.75,FE84654D23F14010906A90B710ED7D8F',
            'radio11': '3.75,AAE72BABB1F4483CA025F62BAAB470EF',
            'radio12': '4.75,FB1FDA99948D4576A67BF72297342596'
        },
        'star2':{
            'radio1': '3.25,D3E164C70594449C96A804267BBE465A',
            'radio2': '3.25,1F09372D970F41AB90EEF4FCDE96E30B',
            'radio3': '6.5,4A5C4DD259404666BE9B861955C4C834',
            'radio4': '9.75,79B3F11EB65142EFB980470DB0BD5E51',
            'radio5': '9.75,32AE686A89984AF590E2C6A7E4CAC7B1',
            'radio6': '6.5,D429AB4F9A414D928E49B71D88FA0802',
            'radio7': '9.75,0FC336AE15B04F7CAE90E0ECFC944812',
            'radio8': '3.25,367B65E5E846464AA705E6353F2BBDEB',
            'radio9': '3.25,078AAC51F62147FABA12A294C45D267E',
            'radio10': '3.25,633940AA33C34F4BB63953CABF6EAE95',
            'radio11': '3.25,1F2B1F29F6884E2DAC639193D759E7FE',
            'radio12': '4.75,FB1FDA99948D4576A67BF72297342596'
        },
        'star1':{
            'radio1': '1.0,DD06492D39B142609303611DC74F3E73',
            'radio2': '1.0,2E13F2E727D64AF58F83E845798B81A5',
            'radio3': '2.0,0C6087898FA64DA292A771C812964831',
            'radio4': '3.0,CD480820CB1F40059F386D56F3CB5D94',
            'radio5': '3.0,EF2E5D5671FF43AEB273B1B907B73E80',
            'radio6': '2.0,C421D713CA0341E9BAD9C1D60752D6B8',
            'radio7': '3.0,B9E18488B3FE47BF95C28F2551361CE5',
            'radio8': '1.0,F7A4214E72984AB9B3CBDEC8BD9292FA',
            'radio9': '1.0,F98E1FF149A6413DBEB79721BF335AE3',
            'radio10': '1.0,F8B9164162EB4F69A3A90C4054EF73BF',
            'radio11': '1.0,77BEC81075194DFD978A8CD53A4D8966',
            'radio12': '4.75,FB1FDA99948D4576A67BF72297342596'
        }
    }
    return data[value] 
}


module.exports = {turnToEn,chToEn,streamToBase64,getRadioValue}



