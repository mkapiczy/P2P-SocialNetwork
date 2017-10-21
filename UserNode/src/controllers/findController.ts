import {Router, Request, Response} from 'express';

const router: Router = Router();

router.get("/find", (request, response) => {
    response.render("findView", {
        title: "Hey!",
        message: "This works :-)",
        //node: global.node,
    });
});

export const FindController: Router = router;


