res = [
    {
        "name": "Easy",
        "size": 4,
        "levels": [
            {"goal": 16, "size": 3, "canAtack": 1, "board": [2, 0, 0, 0, 0, 0, 0, 0, 0] },
            {"goal": 32, "size": 3, "canAtack": 1, "board": [0, 0, 0, 0, 0, 0, 0, 0, 0] },
            {"goal": 64, "size": 3, "canAtack": 1, "board": [0, 32, 0, 0, 0, 0, 0, 0, 0] },
            {"goal": 64, "size": 3, "canAtack": 1, "board": [2, 0, 0, 0, 0, 0, 0, 0, 0] }
        ]
    },
    {
        "name": "Medium",
        "size": 4,
        "levels": [

            {"canAtack": 1, "size": 4, "board": [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "goal": 128},
            {"canAtack": 1, "size": 4, "board": [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "goal": 256},
            {"canAtack": 1, "size": 4, "board": [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "goal": 512},
            {"canAtack": 1, "size": 4, "board": [0, 0, 0, 0, 0, 2, 0, 0, 16384, 0, 0, 0, 0, 0, 0, 0], "goal": 512}
        ]
    },
    {
        "name": "Challenging",
        "size": 4,
        "levels": [
            {"canAtack": 1, "size": 4, "board": [0, 0, 512, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "goal": 1024},
            {"canAtack": 1, "size": 4, "board": [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "goal": 1024},
            {"canAtack": 1, "size": 4, "board": [1024, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "goal": 2048},
            {"empty":"empty"}

        ]
    },
    {
        "name": "Classic(2048-4096)",
        "size": 4,
        "levels": [
            {"canAtack": 1, "size": 4, "board": [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "goal": 2048},
            {"canAtack": 1, "size": 4, "board": [0, 0, 0, 0, 16384, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "goal": 2048},
            {"canAtack": 1, "size": 4, "board": [0, 0, 0, 2048, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "goal": 4096},
            {"canAtack": 1, "size": 4, "board": [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "goal": 4096}

        ]
    },
    {
        "name": "Hard",
        "size": 4,
        "levels": [
            {"canAtack": 1, "size": 4, "board": [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "goal": 8192}


        ]
    }


];