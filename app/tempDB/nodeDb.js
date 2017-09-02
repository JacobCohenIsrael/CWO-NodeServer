const nodeDb = {
  "Nova": {
    "name": "Nova",
    "coordX": -5.0,
    "coordY": 0.0,
    "ships": {},
    "sprite": "star-nova",
    "star": {},
    "market": {
      "resourceList": {
        "Holmium": {
          "name": "Holmium",
          "boughtAmount": 0,
          "soldAmount": 0,
          "buyPrice": 15,
          "sellPrice": 10
        },
        "Cerium": {
          "name": "Cerium",
          "boughtAmount": 0,
          "soldAmount": 0,
          "buyPrice": 15,
          "sellPrice": 8
        }
      }
    },
    "isSafeZone": true,
    "connectedNodes": {
      "NX040PY010": {
        "jumpRange": 10
      },
      "NX030": {
        "jumpRange": 10
      },
      "NX040PY035": {
        "jumpRange": 20
      },
      "NY020": {
        "jumpRange": 20
      }
    }
  },
  "Earth": {
    "name": "Earth",
    "coordX": 0.0,
    "coordY": 5.0,
    "ships": {},
    "sprite": "star-earth",
    "star": {},
    "market": {
      "resourceList": {
        "Holmium": {
          "name": "Holmium",
          "boughtAmount": 0,
          "soldAmount": 0,
          "buyPrice": 5,
          "sellPrice": 4
        },
        "Cerium": {
          "name": "Cerium",
          "boughtAmount": 0,
          "soldAmount": 0,
          "buyPrice": 45,
          "sellPrice": 35
        }
      }
    },
    "isSafeZone": true,
    "connectedNodes": {
      "NX010PY040": {
        "jumpRange": 10
      },
      "PX010PY040": {
        "jumpRange": 10
      },
      "NX040PY035": {
        "jumpRange": 20
      },
      "PX040PY035": {
        "jumpRange": 20
      }
    }
  },
  "Siera": {
    "name": "Siera",
    "coordX": 5.0,
    "coordY": 0.0,
    "ships": {},
    "sprite": "star-siera",
    "star": {},
    "market": {
      "resourceList": {
        "Holmium": {
          "name": "Holmium",
          "boughtAmount": 0,
          "soldAmount": 0,
          "buyPrice": 15,
          "sellPrice": 10
        },
        "Cerium": {
          "name": "Cerium",
          "boughtAmount": 0,
          "soldAmount": 0,
          "buyPrice": 25,
          "sellPrice": 15
        }
      }
    },
    "isSafeZone": true,
    "connectedNodes": {
      "PX040PY010": {
        "jumpRange": 10
      },
      "PX030": {
        "jumpRange": 10
      },
      "NY020": {
        "jumpRange": 20
      },
      "PX040PY035": {
        "jumpRange": 20
      }
    }
  },
  "NX010": {
    "name": "NX010",
    "sprite": "empty",
    "coordX": -1.0,
    "coordY": 0.0,
    "ships": {},
    "connectedNodes": {
      "NX030": {
        "jumpRange": 10
      },
      "PX010": {
        "jumpRange": 10
      }
    }
  },
  "NX030": {
    "name": "NX030",
    "sprite": "empty",
    "coordX": -3.0,
    "coordY": 0.0,
    "ships": {},
    "connectedNodes": {
      "Nova": {
        "jumpRange": 10
      },
      "NX010": {
        "jumpRange": 10
      }
    }
  },
  "PX010": {
    "name": "PX010",
    "sprite": "empty",
    "coordX": 1.0,
    "coordY": 0.0,
    "ships": {},
    "connectedNodes": {
      "PX030": {
        "jumpRange": 10
      },
      "NX010": {
        "jumpRange": 10
      }
    }
  },
  "PX030": {
    "name": "PX030",
    "sprite": "empty",
    "coordX": 3.0,
    "coordY": 0.0,
    "ships": {},
    "connectedNodes": {
      "Siera": {
        "jumpRange": 10
      },
      "PX010": {
        "jumpRange": 10
      }
    }
  },
  "NX040PY010": {
    "name": "NX040PY010",
    "sprite": "empty",
    "coordX": -4.0,
    "coordY": 1.0,
    "ships": {},
    "connectedNodes": {
      "Nova": {
        "jumpRange": 10
      },
      "NX030PY020": {
        "jumpRange": 10
      }
    }
  },
  "NX030PY020": {
    "name": "NX030PY020",
    "sprite": "empty",
    "coordX": -3.0,
    "coordY": 2.0,
    "ships": {},
    "connectedNodes": {
      "NX020PY030": {
        "jumpRange": 10
      },
      "NX040PY010": {
        "jumpRange": 10
      }
    }
  },
  "NX020PY030": {
    "name": "NX020PY030",
    "sprite": "empty",
    "coordX": -2.0,
    "coordY": 3.0,
    "ships": {},
    "connectedNodes": {
      "NX010PY040": {
        "jumpRange": 10
      },
      "NX030PY020": {
        "jumpRange": 10
      }
    }
  },
  "NX010PY040": {
    "name": "NX010PY040",
    "sprite": "empty",
    "coordX": -1.0,
    "coordY": 4.0,
    "ships": {},
    "connectedNodes": {
      "Earth": {
        "jumpRange": 10
      },
      "NX020PY030": {
        "jumpRange": 10
      }
    }
  },
  "PX040PY010": {
    "name": "PX040PY010",
    "sprite": "empty",
    "coordX": 4.0,
    "coordY": 1.0,
    "ships": {},
    "connectedNodes": {
      "PX030PY020": {
        "jumpRange": 10
      },
      "Siera": {
        "jumpRange": 10
      }
    }
  },
  "PX030PY020": {
    "name": "PX030PY020",
    "sprite": "empty",
    "coordX": 3.0,
    "coordY": 2.0,
    "ships": {},
    "connectedNodes": {
      "PX020PY030": {
        "jumpRange": 10
      },
      "PX040PY010": {
        "jumpRange": 10
      }
    }
  },
  "PX020PY030": {
    "name": "PX020PY030",
    "sprite": "empty",
    "coordX": 2.0,
    "coordY": 3.0,
    "ships": {},
    "connectedNodes": {
      "PX010PY040": {
        "jumpRange": 10
      },
      "PX030PY020": {
        "jumpRange": 10
      }
    }
  },
  "PX010PY040": {
    "name": "PX010PY040",
    "sprite": "empty",
    "coordX": 1.0,
    "coordY": 4.0,
    "ships": {},
    "connectedNodes": {
      "Earth": {
        "jumpRange": 10
      },
      "PX020PY030": {
        "jumpRange": 10
      }
    }
  },
  "NY020": {
    "name": "NY020",
    "sprite": "empty",
    "coordX": 0.0,
    "coordY": -2.0,
    "ships": {},
    "connectedNodes": {
      "Siera": {
        "jumpRange": 20
      },
      "Nova": {
        "jumpRange": 20
      }
    }
  },
  "PX040PY035": {
    "name": "PX040PY035",
    "sprite": "empty",
    "coordX": 4.0,
    "coordY": 3.5,
    "ships": {},
    "connectedNodes": {
      "Earth": {
        "jumpRange": 20
      },
      "Siera": {
        "jumpRange": 20
      }
    }
  },
  "NX040PY035": {
    "name": "NX040PY035",
    "sprite": "empty",
    "coordX": -4.0,
    "coordY": 3.5,
    "ships": {},
    "connectedNodes": {
      "Earth": {
        "jumpRange": 20
      },
      "Nova": {
        "jumpRange": 20
      }
    }
  }
};
export default nodeDb;