function validateStartRating(request, response, next) {
    const { start_rating } = request.query

    if (start_rating === undefined) {
        return next();
    }

    const rating = Number(start_rating);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return response.status(400).json({
            error: "start_rating deve essere un numero intero compreso tra 1 e 5",
            results: null
        });

    }

    request.rating = rating;

    next()
}

function isValidRating(rating) {
    return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

function validateReviewBody(request, response, next) {
    const {
        title,
        body,
        start_rating,
        author_name,
        product_id
    } = request.body ?? {};

    if (
        !title ||
        !body ||
        start_rating === undefined ||
        !author_name
    ) {
        return response.status(400).json({
            error: "Dati mancanti: title, body, start_rating e author_name sono obbligatori",
            results: null
        });
    }

    const rating = Number(start_rating);

    if (!isValidRating(rating)) {
        return response.status(400).json({
            error: "start_rating deve essere un numero intero compreso tra 1 e 5",
            results: null
        });
    }

    const realProductId =
        product_id === undefined || product_id === null
            ? null
            : Number(product_id);

    if (
        realProductId !== null &&
        (!Number.isInteger(realProductId) || realProductId <= 0)
    ) {
        return response.status(400).json({
            error: "product_id deve essere un numero intero positivo",
            results: null
        });
    }

    request.realTitle = title.trim();
    request.realBody = body.trim();
    request.rating = rating;
    request.realAuthorName = author_name.trim();
    request.realProductId = realProductId;

    next();

}

export { validateStartRating, validateReviewBody };