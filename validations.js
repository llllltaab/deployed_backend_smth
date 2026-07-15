function validateStrings(columnName, maxLimit = 255) {

    return (value) => {
        if(typeof value !== "string") {
            throw new Error(`${columnName} has to be string`);
        }

        const trimmedVal = value.trim();

        if(trimmedVal === "") {
            throw new Error(`${columnName} can not be an empty string`);
        }

        if (trimmedVal.length < 2 || trimmedVal.length > maxLimit) {
            throw new Error(`${columnName} must be between 2 and ${maxLimit} characters`);
        }
    }
}

module.exports = validateStrings;