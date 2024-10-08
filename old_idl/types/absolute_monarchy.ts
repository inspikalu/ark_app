/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/absolute_monarchy.json`.
 */
export type AbsoluteMonarchy = {
  "version": "0.1.0",
  "name": "absoluteMonarchy",
  "address": "ADp9DgS9ZpsVDCXb4ysDjJoB1d8cL3CUmm4ErwVtqWzu",
  "metadata": {
    "name": "absoluteMonarchy",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "abdicate",
      "discriminator": [
        33,
        194,
        141,
        34,
        135,
        207,
        221,
        18
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true,
          "relations": [
            "kingdom"
          ]
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        },
        {
          "name": "newMonarch",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "heirName",
          "type": "string"
        }
      ]
    },
    {
      "name": "addMember",
      "discriminator": [
        13,
        116,
        123,
        130,
        126,
        198,
        57,
        34
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "subject",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              },
              {
                "kind": "account",
                "path": "kingdom.total_subjects",
                "account": "kingdom"
              }
            ]
          }
        },
        {
          "name": "memberTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "kingdomMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "kingdomMint",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "addTokenToTreasury",
      "discriminator": [
        28,
        154,
        239,
        139,
        180,
        134,
        113,
        194
      ],
      "accounts": [
        {
          "name": "governance",
          "writable": true
        },
        {
          "name": "treasury"
        },
        {
          "name": "tokenAccount"
        },
        {
          "name": "mint"
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "treasuryProgram",
          "address": "48qaGS4sA7bqiXYE6SyzaFiAb7QNit1A7vdib7LXhW2V"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "appointOfficial",
      "discriminator": [
        9,
        188,
        184,
        230,
        76,
        24,
        187,
        40
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true
        },
        {
          "name": "subject",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              },
              {
                "kind": "account",
                "path": "kingdom.total_subjects",
                "account": "kingdom"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "role",
          "type": "string"
        },
        {
          "name": "jurisdiction",
          "type": "string"
        }
      ]
    },
    {
      "name": "createTreasury",
      "discriminator": [
        254,
        98,
        217,
        51,
        25,
        88,
        140,
        45
      ],
      "accounts": [
        {
          "name": "governance",
          "writable": true
        },
        {
          "name": "treasury"
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "treasuryProgram",
          "address": "48qaGS4sA7bqiXYE6SyzaFiAb7QNit1A7vdib7LXhW2V"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "declareWar",
      "discriminator": [
        184,
        73,
        169,
        200,
        244,
        124,
        29,
        116
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true
        },
        {
          "name": "war",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              }
            ]
          }
        },
        {
          "name": "enemyProgram"
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "reason",
          "type": "string"
        }
      ]
    },
    {
      "name": "decree",
      "discriminator": [
        141,
        90,
        168,
        95,
        207,
        111,
        221,
        144
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true
        },
        {
          "name": "decree",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  99,
                  114,
                  101,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "monarch"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "decreeText",
          "type": "string"
        },
        {
          "name": "decreeType",
          "type": {
            "defined": {
              "name": "decreeType"
            }
          }
        }
      ]
    },
    {
      "name": "expandOrganization",
      "discriminator": [
        36,
        72,
        219,
        147,
        182,
        49,
        170,
        173
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true
        },
        {
          "name": "mainTreasury",
          "writable": true
        },
        {
          "name": "division",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  105,
                  118,
                  105,
                  115,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "monarch"
              },
              {
                "kind": "arg",
                "path": "newDivisionName"
              }
            ]
          }
        },
        {
          "name": "divisionTreasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "division"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "newDivisionName",
          "type": "string"
        },
        {
          "name": "budget",
          "type": "u64"
        }
      ]
    },
    {
      "name": "grantNobility",
      "discriminator": [
        184,
        79,
        227,
        144,
        124,
        130,
        170,
        143
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true
        },
        {
          "name": "subject",
          "writable": true
        },
        {
          "name": "noble",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  111,
                  98,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        }
      ]
    },
    {
      "name": "grantPrivilegedAccess",
      "discriminator": [
        89,
        31,
        108,
        130,
        168,
        152,
        97,
        223
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true
        },
        {
          "name": "beneficiary",
          "writable": true
        },
        {
          "name": "privilegedAccess",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  105,
                  118,
                  105,
                  108,
                  101,
                  103,
                  101,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              }
            ]
          }
        },
        {
          "name": "beneficiaryTokenAccount",
          "writable": true
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "accessType",
          "type": "string"
        },
        {
          "name": "duration",
          "type": "i64"
        },
        {
          "name": "usageFeeRate",
          "type": "u8"
        },
        {
          "name": "accessLevel",
          "type": "u8"
        },
        {
          "name": "initialFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "implementPolicy",
      "discriminator": [
        18,
        235,
        114,
        114,
        235,
        178,
        21,
        20
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true
        },
        {
          "name": "policy",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  108,
                  105,
                  99,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "targetJurisdiction",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeAbsoluteMonarchy",
      "discriminator": [
        17,
        78,
        8,
        254,
        96,
        70,
        27,
        17
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  107,
                  105,
                  110,
                  103,
                  100,
                  111,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "monarch"
              }
            ]
          }
        },
        {
          "name": "monarch",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  111,
                  110,
                  97,
                  114,
                  99,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "nftMint",
          "writable": true,
          "optional": true
        },
        {
          "name": "splMint",
          "writable": true,
          "optional": true
        },
        {
          "name": "sbtMint",
          "writable": true,
          "optional": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "initializeKingdomArgs"
            }
          }
        }
      ]
    },
    {
      "name": "initializeAndRegisterGovernment",
      "discriminator": [
        95,
        138,
        185,
        166,
        143,
        12,
        8,
        30
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "arkAnalytics",
          "writable": true
        },
        {
          "name": "stateInfo",
          "writable": true
        },
        {
          "name": "governmentProgram"
        },
        {
          "name": "arkProgram",
          "address": "48qaGS4sA7bqiXYE6SyzaFiAb7QNit1A7vdib7LXhW2V"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeSplToken",
      "discriminator": [
        11,
        149,
        217,
        116,
        137,
        154,
        68,
        112
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  112,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              },
              {
                "kind": "arg",
                "path": "params.symbol"
              }
            ]
          }
        },
        {
          "name": "metadata",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "initTokenParams"
            }
          }
        }
      ]
    },
    {
      "name": "makeDecision",
      "discriminator": [
        7,
        24,
        24,
        138,
        49,
        223,
        79,
        124
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "signer": true
        },
        {
          "name": "routerProgram",
          "address": "7aQvq1fEiDXqK36H7mW8MSTGdnHn6XAHDd9pauZwZXGQ"
        },
        {
          "name": "routerState"
        },
        {
          "name": "governmentAccount"
        },
        {
          "name": "decisionAccount"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "makeDecisionArgs"
            }
          }
        }
      ]
    },
    {
      "name": "mintNewNft",
      "discriminator": [
        112,
        41,
        155,
        3,
        227,
        247,
        71,
        202
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  102,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              },
              {
                "kind": "arg",
                "path": "args.symbol"
              }
            ]
          }
        },
        {
          "name": "subjectTokenAccount",
          "writable": true
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "mintNftArgs"
            }
          }
        }
      ]
    },
    {
      "name": "mintNewSbt",
      "discriminator": [
        40,
        169,
        232,
        225,
        56,
        166,
        79,
        97
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "mint",
          "writable": true,
          "signer": true
        },
        {
          "name": "subject",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              },
              {
                "kind": "account",
                "path": "kingdom.total_subjects",
                "account": "kingdom"
              }
            ]
          }
        },
        {
          "name": "subjectTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "subject"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "initializeSbtArgs"
            }
          }
        }
      ]
    },
    {
      "name": "mintSplTokensToKingdom",
      "discriminator": [
        113,
        108,
        124,
        79,
        29,
        141,
        70,
        6
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "kingdomAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "kingdom"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mintSplTokensToSubject",
      "discriminator": [
        235,
        135,
        148,
        101,
        87,
        138,
        54,
        185
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "subject",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              },
              {
                "kind": "account",
                "path": "kingdom.total_subjects",
                "account": "kingdom"
              }
            ]
          }
        },
        {
          "name": "subjectTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "subject"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "payTax",
      "discriminator": [
        51,
        5,
        236,
        118,
        42,
        113,
        61,
        53
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "subject",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              },
              {
                "kind": "account",
                "path": "kingdom.total_subjects",
                "account": "kingdom"
              }
            ]
          }
        },
        {
          "name": "subjectTokenAccount",
          "writable": true
        },
        {
          "name": "treasuryTokenAccount",
          "writable": true
        },
        {
          "name": "economicPolicy",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  99,
                  111,
                  110,
                  111,
                  109,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "taxType",
          "type": {
            "defined": {
              "name": "taxType"
            }
          }
        },
        {
          "name": "taxableAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "repealDecree",
      "discriminator": [
        8,
        70,
        156,
        238,
        44,
        92,
        160,
        127
      ],
      "accounts": [
        {
          "name": "monarch",
          "writable": true
        },
        {
          "name": "decree",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        }
      ],
      "args": [
        {
          "name": "decreeId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "royalJudgment",
      "discriminator": [
        206,
        73,
        55,
        69,
        45,
        230,
        224,
        109
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true
        },
        {
          "name": "subject",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        }
      ],
      "args": [
        {
          "name": "verdict",
          "type": {
            "defined": {
              "name": "verdict"
            }
          }
        },
        {
          "name": "punishment",
          "type": {
            "option": {
              "defined": {
                "name": "punishment"
              }
            }
          }
        }
      ]
    },
    {
      "name": "royalPardon",
      "discriminator": [
        222,
        136,
        56,
        151,
        12,
        163,
        48,
        82
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true
        },
        {
          "name": "subject",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "setEconomicPolicy",
      "discriminator": [
        254,
        188,
        196,
        100,
        4,
        30,
        229,
        22
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true
        },
        {
          "name": "economicPolicy",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  99,
                  111,
                  110,
                  111,
                  109,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "kingdom"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "policy",
          "type": {
            "defined": {
              "name": "economicPolicyType"
            }
          }
        },
        {
          "name": "incomeTaxRate",
          "type": "u8"
        },
        {
          "name": "propertyTaxRate",
          "type": "u8"
        },
        {
          "name": "tradeTaxRate",
          "type": "u8"
        },
        {
          "name": "luxuryTaxRate",
          "type": "u8"
        }
      ]
    },
    {
      "name": "transferRevenue",
      "discriminator": [
        157,
        95,
        197,
        188,
        159,
        230,
        249,
        224
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true
        },
        {
          "name": "division",
          "writable": true
        },
        {
          "name": "divisionTreasury",
          "writable": true
        },
        {
          "name": "mainTreasury",
          "writable": true
        },
        {
          "name": "authority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  105,
                  118,
                  105,
                  115,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "monarch"
              },
              {
                "kind": "account",
                "path": "division.name",
                "account": "division"
              }
            ]
          },
          "relations": [
            "monarch"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "unappointOfficial",
      "discriminator": [
        158,
        169,
        168,
        92,
        83,
        151,
        221,
        21
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true
        },
        {
          "name": "subject",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "updatePolicy",
      "discriminator": [
        212,
        245,
        246,
        7,
        163,
        151,
        18,
        57
      ],
      "accounts": [
        {
          "name": "kingdom",
          "writable": true
        },
        {
          "name": "monarch",
          "writable": true,
          "relations": [
            "policy"
          ]
        },
        {
          "name": "policy",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "monarch"
          ]
        }
      ],
      "args": [
        {
          "name": "newDescription",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "newTargetJurisdiction",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "newIsActive",
          "type": {
            "option": "bool"
          }
        }
      ]
    },
    {
      "name": "usePrivilegedAccess",
      "discriminator": [
        92,
        136,
        233,
        103,
        214,
        229,
        80,
        158
      ],
      "accounts": [
        {
          "name": "privilegedAccess"
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "holderAccount",
          "writable": true
        },
        {
          "name": "treasuryAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "usageAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "arkAnalytics",
      "discriminator": [
        222,
        47,
        90,
        164,
        175,
        77,
        25,
        117
      ]
    },
    {
      "name": "decree",
      "discriminator": [
        101,
        171,
        2,
        214,
        37,
        129,
        192,
        0
      ]
    },
    {
      "name": "division",
      "discriminator": [
        54,
        116,
        149,
        82,
        235,
        137,
        171,
        4
      ]
    },
    {
      "name": "economicPolicy",
      "discriminator": [
        154,
        230,
        39,
        170,
        238,
        57,
        225,
        232
      ]
    },
    {
      "name": "kingdom",
      "discriminator": [
        106,
        125,
        178,
        151,
        103,
        94,
        150,
        222
      ]
    },
    {
      "name": "monarch",
      "discriminator": [
        227,
        161,
        210,
        163,
        181,
        33,
        180,
        185
      ]
    },
    {
      "name": "noble",
      "discriminator": [
        90,
        51,
        60,
        250,
        206,
        18,
        7,
        144
      ]
    },
    {
      "name": "policy",
      "discriminator": [
        222,
        135,
        7,
        163,
        235,
        177,
        33,
        68
      ]
    },
    {
      "name": "privilegedAccess",
      "discriminator": [
        17,
        119,
        223,
        76,
        122,
        79,
        255,
        199
      ]
    },
    {
      "name": "stateInfo",
      "discriminator": [
        84,
        40,
        95,
        251,
        34,
        189,
        94,
        185
      ]
    },
    {
      "name": "subject",
      "discriminator": [
        52,
        161,
        41,
        165,
        202,
        238,
        138,
        166
      ]
    },
    {
      "name": "war",
      "discriminator": [
        54,
        31,
        229,
        114,
        29,
        29,
        212,
        65
      ]
    }
  ],
  "events": [
    {
      "name": "memberAdded",
      "discriminator": [
        198,
        220,
        228,
        196,
        92,
        235,
        240,
        79
      ]
    },
    {
      "name": "mintEvent",
      "discriminator": [
        197,
        144,
        146,
        149,
        66,
        164,
        95,
        16
      ]
    },
    {
      "name": "nftMinted",
      "discriminator": [
        175,
        29,
        105,
        0,
        195,
        2,
        245,
        38
      ]
    },
    {
      "name": "sbtMinted",
      "discriminator": [
        168,
        19,
        193,
        105,
        238,
        55,
        225,
        206
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "notMonarch",
      "msg": "Only the current Monarch can perform this action"
    },
    {
      "code": 6001,
      "name": "insufficientFunds",
      "msg": "Insufficient funds in the royal treasury"
    },
    {
      "code": 6002,
      "name": "insufficientTokens",
      "msg": "Insufficient tokens to become a member"
    },
    {
      "code": 6003,
      "name": "invalidTokenAccountOwner",
      "msg": "Invalid token account owner"
    },
    {
      "code": 6004,
      "name": "invalidTreasuryAccount",
      "msg": "Invalid treasury account"
    },
    {
      "code": 6005,
      "name": "subjectNotFound",
      "msg": "Subject not found"
    },
    {
      "code": 6006,
      "name": "alreadyInitialized",
      "msg": "Monarchy already initialized"
    },
    {
      "code": 6007,
      "name": "invalidDecree",
      "msg": "Invalid decree"
    },
    {
      "code": 6008,
      "name": "warAlreadyDeclared",
      "msg": "War already declared against this enemy"
    },
    {
      "code": 6009,
      "name": "subjectNotConvicted",
      "msg": "Subject is not convicted"
    },
    {
      "code": 6010,
      "name": "invalidNobleTitle",
      "msg": "Invalid noble title"
    },
    {
      "code": 6011,
      "name": "territoryAlreadyColonized",
      "msg": "Territory already colonized"
    },
    {
      "code": 6012,
      "name": "invalidEconomicPolicy",
      "msg": "Invalid economic policy"
    },
    {
      "code": 6013,
      "name": "invalidTaxRate",
      "msg": "Invalid tax rate"
    },
    {
      "code": 6014,
      "name": "policyTitleTooLong",
      "msg": "Policy title is too long"
    },
    {
      "code": 6015,
      "name": "policyDescriptionTooLong",
      "msg": "Policy description is too long"
    },
    {
      "code": 6016,
      "name": "jurisdictionTooLong",
      "msg": "Jurisdiction name is too long"
    },
    {
      "code": 6017,
      "name": "notPolicyOwner",
      "msg": "Not the policy owner"
    },
    {
      "code": 6018,
      "name": "invalidUsageFeeRate",
      "msg": "Invalid usage fee rate"
    },
    {
      "code": 6019,
      "name": "invalidAccessLevel",
      "msg": "Invalid access level"
    },
    {
      "code": 6020,
      "name": "accessExpired",
      "msg": "Privileged access has expired"
    },
    {
      "code": 6021,
      "name": "transferTooSoon",
      "msg": "Transfer is not yet due"
    },
    {
      "code": 6022,
      "name": "invalidTreasury",
      "msg": "Wrong treasury"
    },
    {
      "code": 6023,
      "name": "missingRequiredAccount",
      "msg": "Missing required account"
    },
    {
      "code": 6024,
      "name": "invalidSplMint",
      "msg": "Invalid SPL mint"
    },
    {
      "code": 6025,
      "name": "missingNftConfig",
      "msg": "Missing NFT configuration"
    },
    {
      "code": 6026,
      "name": "missingSplConfig",
      "msg": "Missing SPL configuration"
    },
    {
      "code": 6027,
      "name": "noKingdomTokenSpecified",
      "msg": "No kingdom token specified"
    },
    {
      "code": 6028,
      "name": "invalidTreasuryOwner",
      "msg": "Invalid treasury owner"
    },
    {
      "code": 6029,
      "name": "emptyDivisionName",
      "msg": "Division name cannot be empty"
    },
    {
      "code": 6030,
      "name": "invalidMonarch",
      "msg": "Invalid monarch for this kingdom"
    },
    {
      "code": 6031,
      "name": "monarchKingdomMismatch",
      "msg": "Monarch and kingdom accounts do not match"
    },
    {
      "code": 6032,
      "name": "emptyHeirName",
      "msg": "Heir name cannot be empty"
    },
    {
      "code": 6033,
      "name": "invalidMint",
      "msg": "This mint is not valid"
    },
    {
      "code": 6034,
      "name": "exceedsSupply",
      "msg": "Supply has been exceeded"
    },
    {
      "code": 6035,
      "name": "overflow",
      "msg": "Overflow error"
    }
  ],
  "types": [
    {
      "name": "arkAnalytics",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalGovernments",
            "type": "u64"
          },
          {
            "name": "governments",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "polls",
            "type": "u64"
          },
          {
            "name": "approved",
            "type": "u64"
          },
          {
            "name": "rejected",
            "type": "u64"
          },
          {
            "name": "points",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "authBump",
            "type": "u8"
          },
          {
            "name": "stateBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "decree",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "text",
            "type": "string"
          },
          {
            "name": "decreeType",
            "type": {
              "defined": {
                "name": "decreeType"
              }
            }
          },
          {
            "name": "issuedAt",
            "type": "i64"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "decreeType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "law"
          },
          {
            "name": "economicPolicy"
          },
          {
            "name": "militaryOrder"
          },
          {
            "name": "royalProclamation"
          }
        ]
      }
    },
    {
      "name": "division",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "manager",
            "type": "pubkey"
          },
          {
            "name": "establishedAt",
            "type": "i64"
          },
          {
            "name": "lastTransferAt",
            "type": "i64"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "economicPolicy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "policyType",
            "type": {
              "defined": {
                "name": "economicPolicyType"
              }
            }
          },
          {
            "name": "implementedAt",
            "type": "i64"
          },
          {
            "name": "incomeTaxRate",
            "type": "u8"
          },
          {
            "name": "propertyTaxRate",
            "type": "u8"
          },
          {
            "name": "tradeTaxRate",
            "type": "u8"
          },
          {
            "name": "luxuryTaxRate",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "economicPolicyType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "mercantilism"
          },
          {
            "name": "freeTrade"
          },
          {
            "name": "protectionism"
          }
        ]
      }
    },
    {
      "name": "governmentType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "monarchy"
          },
          {
            "name": "democracy"
          },
          {
            "name": "autocracy"
          },
          {
            "name": "oligarchy"
          },
          {
            "name": "republic"
          },
          {
            "name": "federalism"
          },
          {
            "name": "communism"
          },
          {
            "name": "imperialism"
          },
          {
            "name": "anarchy"
          },
          {
            "name": "colonialism"
          }
        ]
      }
    },
    {
      "name": "initTokenParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "decimals",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "initializeKingdomArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "monarchName",
            "type": "string"
          },
          {
            "name": "divineMandate",
            "type": "string"
          },
          {
            "name": "collectionPrice",
            "type": "u64"
          },
          {
            "name": "nftSupply",
            "type": "u64"
          },
          {
            "name": "splSupply",
            "type": "u64"
          },
          {
            "name": "royalDecreeThreshold",
            "type": "u64"
          },
          {
            "name": "minLoyaltyAmount",
            "type": "u64"
          },
          {
            "name": "membershipTokensThreshold",
            "type": "u64"
          },
          {
            "name": "knighthoodPrice",
            "type": "u64"
          },
          {
            "name": "nftConfig",
            "type": {
              "option": {
                "defined": {
                  "name": "tokenConfig"
                }
              }
            }
          },
          {
            "name": "splConfig",
            "type": {
              "option": {
                "defined": {
                  "name": "tokenConfig"
                }
              }
            }
          },
          {
            "name": "primaryKingdomToken",
            "type": {
              "defined": {
                "name": "primaryKingdomToken"
              }
            }
          },
          {
            "name": "initializeSbt",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "initializeSbtArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "supply",
            "type": "u32"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "transferrable",
            "type": "bool"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "kingdom",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "monarch",
            "type": "pubkey"
          },
          {
            "name": "monarchName",
            "type": "string"
          },
          {
            "name": "primaryTokenMint",
            "type": "pubkey"
          },
          {
            "name": "nftMint",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "splMint",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "sbtMint",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "nftSymbol",
            "type": "string"
          },
          {
            "name": "splSymbol",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "nftMinted",
            "type": "u64"
          },
          {
            "name": "splMinted",
            "type": "u64"
          },
          {
            "name": "sbtMinted",
            "type": "u64"
          },
          {
            "name": "royalTreasury",
            "type": "u64"
          },
          {
            "name": "totalDecrees",
            "type": "u64"
          },
          {
            "name": "totalActiveDecrees",
            "type": "u64"
          },
          {
            "name": "totalSubjects",
            "type": "u64"
          },
          {
            "name": "minLoyaltyAmount",
            "type": "u64"
          },
          {
            "name": "totalSplTokenSupply",
            "type": "u64"
          },
          {
            "name": "totalNftTokenSupply",
            "type": "u64"
          },
          {
            "name": "totalSbtTokenSupply",
            "type": "u64"
          },
          {
            "name": "establishedAt",
            "type": "i64"
          },
          {
            "name": "warsDeclared",
            "type": "u64"
          },
          {
            "name": "royalJudgments",
            "type": "u64"
          },
          {
            "name": "economicPoliciesSet",
            "type": "u64"
          },
          {
            "name": "pardonsGranted",
            "type": "u64"
          },
          {
            "name": "policiesImplemented",
            "type": "u64"
          },
          {
            "name": "divisions",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "membershipTokensThreshold",
            "type": "u64"
          },
          {
            "name": "officialsAppointed",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "nobles",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "collectionPrice",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "kingdomTokenType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "new"
          },
          {
            "name": "existing"
          }
        ]
      }
    },
    {
      "name": "makeDecisionArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "instructionData",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "memberAdded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "kingdom",
            "type": "pubkey"
          },
          {
            "name": "member",
            "type": "pubkey"
          },
          {
            "name": "joinedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "mintEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "kingdom",
            "type": "pubkey"
          },
          {
            "name": "treasuryAmount",
            "type": "u64"
          },
          {
            "name": "subjectAmount",
            "type": "u64"
          },
          {
            "name": "totalMinted",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "mintNftArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "monarch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "divineMandate",
            "type": "string"
          },
          {
            "name": "coronationDate",
            "type": "i64"
          },
          {
            "name": "abdicationDate",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "decreesIssued",
            "type": "u64"
          },
          {
            "name": "warsDeclared",
            "type": "u64"
          },
          {
            "name": "royalJudgments",
            "type": "u64"
          },
          {
            "name": "economicPoliciesSet",
            "type": "u64"
          },
          {
            "name": "pardonsGranted",
            "type": "u64"
          },
          {
            "name": "policiesImplemented",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "nftMinted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "absoluteMonarchyKingdom",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "cost",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "noble",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "subject",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "grantedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "policy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "targetJurisdiction",
            "type": "string"
          },
          {
            "name": "implementedAt",
            "type": "i64"
          },
          {
            "name": "lastUpdatedAt",
            "type": "i64"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "monarch",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "primaryKingdomToken",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "nft"
          },
          {
            "name": "spl"
          }
        ]
      }
    },
    {
      "name": "privilegedAccess",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "accessType",
            "type": "string"
          },
          {
            "name": "holder",
            "type": "pubkey"
          },
          {
            "name": "grantedAt",
            "type": "i64"
          },
          {
            "name": "expiresAt",
            "type": "i64"
          },
          {
            "name": "usageFeeRate",
            "type": "u8"
          },
          {
            "name": "accessLevel",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "punishment",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "fine",
            "fields": [
              "u64"
            ]
          },
          {
            "name": "imprisonment",
            "fields": [
              "u64"
            ]
          },
          {
            "name": "exile"
          },
          {
            "name": "execution"
          }
        ]
      }
    },
    {
      "name": "sbtMinted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "kingdom",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "subject",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "stateInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "governmentType",
            "type": {
              "defined": {
                "name": "governmentType"
              }
            }
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "programId",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "subject",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "role",
            "type": "string"
          },
          {
            "name": "nobilityTitle",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "loyalty",
            "type": "u8"
          },
          {
            "name": "wealth",
            "type": "u64"
          },
          {
            "name": "isConvicted",
            "type": "bool"
          },
          {
            "name": "jurisdiction",
            "type": "string"
          },
          {
            "name": "appointedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "taxType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "income"
          },
          {
            "name": "property"
          },
          {
            "name": "trade"
          },
          {
            "name": "luxury"
          }
        ]
      }
    },
    {
      "name": "tokenConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenType",
            "type": {
              "defined": {
                "name": "kingdomTokenType"
              }
            }
          },
          {
            "name": "customMint",
            "type": {
              "option": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "verdict",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "guilty"
          },
          {
            "name": "innocent"
          }
        ]
      }
    },
    {
      "name": "war",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "enemyProgram",
            "type": "pubkey"
          },
          {
            "name": "reason",
            "type": "string"
          },
          {
            "name": "declaredAt",
            "type": "i64"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "battlesWon",
            "type": "u64"
          },
          {
            "name": "battlesLost",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
