import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";

export default new class ServerConfiguration {
    constructor() {
        this.app = express();
        this.initServerSettings();
        this.initMiddleware();

    }

    initServerSettings() {
        this.app.set('port', process.env.PORT || 3000);
    }

    initMiddleware() {
        this.app.use(morgan('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static('./'));
    }

    initServer(server) {
        server.listen(this.app.get('port'), () => {
            console.log('Server listening on port ' + this.app.get('port'));
        });
    }
}
