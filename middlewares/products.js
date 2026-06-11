

function validateProductBody(request, response, next) {
    const { name, short_description: shortDescription, marketing_description: mktgDescription, price, ingredients, allergens } = request.body;
    const realName = name.trim();
    const realShortDescription = shortDescription.trim();
    const realMktgDescription = mktgDescription.trim();
    const realPrice = Number(price.trim());
    const realIngredients = ingredients.trim();
    const realAllergens = allergens.trim();

    if (realName === '') {
        response.status(400)
            .json({
                error: 'il campo nome è obbligatorio'
            });
        return;
    } else if (realName.length < 3 || realName.length > 150) {
        response.status(400)
            .json({
                error: 'il nome del prodotto deve avere una lunghezza compresa tra i 3 e i 150 caratteri (spazi inclusi)'
            })
        return;
    }

    if (realShortDescription === '') {
        response.status(400)
            .json({
                error: 'il campo short_description è obbligatorio'
            });
        return;
    } else if (realShortDescription.length < 30 || realShortDescription.length > 255) {
        response.status(400)
            .json({
                error: 'il campo short_description deve avere una lunghezza compresa tra i 30 e i 255 caratteri (spazi inclusi)'
            });
        return;
    }

    if (realMktgDescription === '') {
        response.status(400)
            .json({
                error: 'il campo marketing_description è obbligatorio'
            });
        return;
    } else if (realMktgDescription.length < 255 || realMktgDescription.length > 900) {
        response.status(400)
            .json({
                error: 'il campo marketing_description deve avere una lunghezza compresa tra i 255 e i 900 caratteri (spazi inclusi)'
            });
        return;
    }

    // price (decimal, parsefloat to 2, compreso tra 3 e 15)
    if (isNaN(realPrice)) {
        response.status(400)
            .json({
                error: 'Il campo price deve essere un numero!'
            });
        return;
    } else if (realPrice <= 0) {
        response.status(400)
            .json({
                error: 'ti piacerebbe pagare i clienti per mangiare gelati? A me no... inserisci un numero positivo'
            });
        return;
    } else if (realPrice < 3 || realPrice > 15) {
        response.status(400)
            .json({
                error: 'Il prezzo inserito è contro ogni logica: inserire un valora tra 3 e 15'
            });
        return;
    }

    if (realIngredients === '') {
        response.status(400)
            .json({
                error: 'il campo ingredients è obbligatorio'
            });
        return;
    } else if (realIngredients.length < 20 || realIngredients.length > 800) {
        response.status(400)
            .json({
                error: 'il campo ingredients deve avere una lunghezza compresa tra i 20 e i 800 caratteri (spazi inclusi)'
            });
        return;
    }

    if (realAllergens === '') {
        response.status(400)
            .json({
                error: 'il campo allergens è obbligatorio'
            });
        return;
    } else if (realAllergens.length < 3 || realAllergens.length > 300) {
        response.status(400)
            .json({
                error: 'il campo ingredients deve avere una lunghezza compresa tra i 3 e i 300 caratteri (spazi inclusi), se non presenti, inserire N/A'
            });
        return;
    }
    // image url ASPETTA ALDO CON IMG = SYNCH DB

    request.realName = realName;
    request.realShortDescription = realShortDescription;
    request.realMktgDescription = realMktgDescription;
    request.realPrice = realPrice;
    request.realIngredients = realIngredients;
    request.realAllergens = realAllergens;

    next()
}

export {
    validateProductBody
};