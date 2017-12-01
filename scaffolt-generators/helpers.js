


module.exports = function(Handlebars) {

    Handlebars.registerHelper('properName', function(name, options) {
//        throw typeof name;
        return name.charAt(0).toUpperCase() + name.slice(1);
    });

    Handlebars.registerHelper('lowerName', function(name, options) {
//        throw typeof name;
        return name.charAt(0).toLowerCase() + name.slice(1);
    });

    Handlebars.registerHelper('upperName', function(name, options) {
//        throw typeof name;
        return name.toUpperCase();
    });

};