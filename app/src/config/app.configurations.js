import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import routeManager from '~/routes/routeManager';

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

    initRouting() {
        routeManager(this.app);

        this.app.get('/', function(req, res) {
            res.sendFile(path.join(__dirname + '/index.html'));
        });
    }

    initServer(server) {
        server.listen(this.app.get('port'), () => {
            console.log('Server listening on port ' + this.app.get('port'));
        });
    }
}
