function errorHandler(error, request, response, next) {
    console.log(error);

    resnponse.status(500)
    .json({
        error: error.message,
        results: null
});

};

export default errorHandler;