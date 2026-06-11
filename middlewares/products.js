function validateProducts(request, response, next) {

    const { id } = request.params;

    const realId = Number(id.trim());

    if (isNan(realId)) {
        response.status(400)
        .json({
            error: 'Id non corretto: inserire un id valido!'
        });
        return;
    }
    request.realId = realId;
    next();

}

export default validateProducts;