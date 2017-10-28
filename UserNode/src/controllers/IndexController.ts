import {Router, Request, Response} from 'express';

class IndexController {
    router: Router = Router();

    constructor() {
        this.router.get("/", this.indexView);
    }

    indexView(request, response) {
        response.sendFile('../views.index.html');
    };

}

export default new IndexController().router;

