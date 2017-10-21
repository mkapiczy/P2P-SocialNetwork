import {Router, Request, Response} from 'express';

const router: Router = Router();

router.get("/", (request, response) => {
    response.render("index", {
        title: "Hey!",
        message: "This works :-)",
        node: {},//global.node,
        buckets: []//global.BucketManager.buckets
    });
});

export const IndexController: Router = router;