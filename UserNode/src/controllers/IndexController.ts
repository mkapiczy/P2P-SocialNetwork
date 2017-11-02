import {Router, Request, Response} from 'express';

class IndexController {
    router: Router = Router();

    constructor() {
        this.router.get("/", this.indexView);
        this.router.get("/pug", this.indexPug);
    }

    indexView(request, response) {
        response.sendFile('../views.index.html');
    };

    indexPug(request, response){
        response.render("index", {
            title: "Hey!",
            message: "This works :-)",
            node: global.node,
            buckets: global.BucketManager.buckets
        });
    };

}

export default new IndexController().router;

