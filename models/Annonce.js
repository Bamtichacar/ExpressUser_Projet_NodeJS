class Annonce {
    constructor (titre, description, prix, image, validatiion, date_de_soumission,user_id, user_name) {
        this.titre = titre;
        this.description = description;
        this.prix = prix;
        this.image = image;
        this.validatiion = validatiion;
        this.date_de_soumission = date_de_soumission;
        this.user_id = user_id;
        this.user_name = user_name;
    }
}

module.exports = Annonce