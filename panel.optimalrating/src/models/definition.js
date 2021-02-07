/**
 * User
 */
export class User {
    constructor() {
        this.name = {
            firstName: null,
            lastName: null
        };
        this.email = null;
        this.username = null;
        this.password = null;
        this.status = 'i';
    }
}

/**
 * Category
 */
export class Category {
    constructor() {
        this.parent = 0;
        this.name = null;
        this.description = null;
        this.code = null;
        this.status = 'active';
        this.sort_order = 0;
    }
}

/**
 * Country
 */
export class Country {
    constructor() {
        this.name = null
        this.name_en = null
        this.flag = null;
        this.code = null;
        this.sort_order = 1;
        this.status = 'active';
        this.email = null;
        this.password = null;
        this.password_confirmation = null;
    }
}

/**
 * City
 */
export class City {
    constructor() {
        this.name = null;
        this.order = 1;
    }
}

/**
 * Keyword
 */
export class Keyword {
    constructor() {
        this.key = null;
        this.default = null;
        this.translation = new Translation();
    }
}

/**
 * Comment
 */
export class Comment {
    constructor() {
        this.key = null;
        this.default = null;
        this.translation = new Translation();
    }
}

/**
 * Translation
 */
export class Translation {
    constructor() {
        this.id = null;
        this.translation = null;
    }
}

/**
 * User Password
 */
export class UserPassword {
    constructor() {
        this.password = null
    }
}


/**
 * Subject
 */
export class Subject {
    constructor() {
        this.title = null
    }
}

/**
 * Special
 */
export class Special {
    constructor() {
        this.title = null
        this.choices = []
        this.subjects = []
        this.status = 1
        this.type ='special'
        this.show_on_home = true
    }
}

/**
 * Choice
 */
export class Choice {
    constructor() {
        this.id = null
        this.choice_title = null
        this.choice_description = ""
        this.choice_image = ""
    }
}

/**
 * Survey
 */
export class Survey {
    constructor() {
        this.title = null,
        this.description = null,
        this.slug = null,
        this.image = null,
        this.choices = []
        this.category_id = []
        this.status = 1,
        this.type ='normal',
        this.user = new User()
    }
}

/**
 * Page
 */
export class Page {
    constructor() {
        this.title = null,
        this.body  = null,
        this.order = 0
    }
}

/**
 * Page
 */
export class PageTranslation {
    constructor() {
        this.title = null,
        this.body  = null
    }
}
