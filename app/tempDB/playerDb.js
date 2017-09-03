const playerDb = {
  "3adasd2ds-63af-408b-9ce2-931631c0bbed" : {
    "id" : 1,
    "firstName" : "Jacob",
    "currentNodeName" : "Earth",
    "isLanded" : true,
    "homePlanetName" : "Earth",
    "credits" : 1000,
    "activeShipIndex" : 0,
    "token" : "3adasd2ds-63af-408b-9ce2-931631c0bbed",
    "ships" : [
      {
        "id" : 1,
        "currentStats" : {
          "hull": 50,
          "shield": 0,
          "energy": 0,
          "cargo": 50
        },
        "shipClass": "Jumper",
        "shipType": "Ancients",
        "shipCargo" : {},
        "shipParts" : [
          {
            "name": "BasicEngine",
            "partStats" : {
              "hull": 50,
              "jumpRange" : 20
            }
          },
          {
            "name": "BasicCargo",
            "partStats" : {
              "cargoCapacity": 50
            }
          },
          {
            "name": "BasicGenerator",
            "partStats" : {
              "energyRegen": 2,
              "energyCapacity": 10
            }
          }
        ]
      }
    ]
  }
};
export default playerDb;
