const playerRouter = require('./player/playerRouter');

module.exports = (app) => {
    app.use('/player', playerRouter);
}