class MarketController
{
    constructor(serviceManager)
    {
        this.eventManager = serviceManager.get('eventManager');

		this.eventManager.subscribe("adjustMarketPrices", adjustMarketPrices)
    }

    adjustMarketPrices() {
        console.log("MarketController.adjustMarketPrices(): Adjusting prices");
    }
}

export default MarketController;