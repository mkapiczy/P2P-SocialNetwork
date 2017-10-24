import {Router, Request, Response} from 'express';

class IndexController {
    router: Router = Router();

    constructor() {
        this.router.get("/", this.indexView);
    }

    indexView(request, response) {
        response.render("index", {
            title: "Hey!",
            message: "This works :-)",
            node: global.node,
            buckets: global.BucketManager.buckets
        });
    };

}

export default new IndexController().router;

