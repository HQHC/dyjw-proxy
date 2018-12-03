class Format {
    success(code,data){
        return {
            code,
            data
        }
    }

    fail(code,message) {
        return {
            code,
            message
        }
    }
}

module.exports = new Format();