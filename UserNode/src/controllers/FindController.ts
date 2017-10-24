import {Router, Request, Response} from 'express';

class FindController {
    router: Router = Router();

    constructor() {
        this.router.get("/", this.findView);
    }

    findView(request, response) {
        response.render("findView", {
            title: "Hey!",
            message: "This works :-)",
            node: global.node,
        });

    };

}

export default new FindController().router;


