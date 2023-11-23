const getQuantitiesDifference = function(newQuantity, oldQuantity) {

    if (newQuantity > oldQuantity) {
        let quantity = newQuantity - oldQuantity;
        return [quantity, true, false];
    } else if (newQuantity < oldQuantity) {
        let quantity = oldQuantity - newQuantity;
        return [quantity, false, true];
    }
}

module.exports = getQuantitiesDifference;





