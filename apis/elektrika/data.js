export const tarifnePostavke = {
  "naslov": "Tarifne postavke",
  "postavke": {
    "valuta": "€",
    "seznam": [
      {
        "postavka": 0,
        "barva": "#0000FF",
        "cena": 0.0
      },
      {
        "postavka": 1,
        "barva": "#00FF00",
        "cena": 0.013
      },
      {
        "postavka": 2,
        "barva": "#808080",
        "cena": 0.19
      },
      {
        "postavka": 3,
        "barva": "#FFFF00",
        "cena": 0.88
      },
      {
        "postavka": 4,
        "barva": "#FF0000",
        "cena": 3.61
      }
    ]
  }
}

export const tarifneSezone = {
  "naslov": "Nižja in višja tarifna sezona",
  "sezone": {
    "nižja": {
      "od": "1. mareca",
      "do": "31. oktobra"
    },
    "višja": {
      "od": "1. novembra",
      "do": "28./29. februarja"
    }
  }
}

export const nizjaSezona = {
  "naslov": "Nižja tarifna sezona",
  "delovniDan": {
    0: 1,
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 2,
    7: 3,
    8: 3,
    9: 3,
    10: 3,
    11: 3,
    12: 3,
    13: 3,
    14: 2,
    15: 2,
    16: 3,
    17: 3,
    18: 3,
    19: 3,
    20: 2,
    21: 2,
    22: 1,
    23: 1
  },
  "prostDan": {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 1,
    7: 2,
    8: 2,
    9: 2,
    10: 2,
    11: 2,
    12: 2,
    13: 2,
    14: 1,
    15: 1,
    16: 2,
    17: 2,
    18: 2,
    19: 2,
    20: 1,
    21: 1,
    22: 0,
    23: 0
  }
}

export const visjaSezona = {
  "naslov": "Višja tarifna sezona",
  "delovniDan": {
    0: 2,
    1: 2,
    2: 2,
    3: 2,
    4: 2,
    5: 2,
    6: 3,
    7: 4,
    8: 4,
    9: 4,
    10: 4,
    11: 4,
    12: 4,
    13: 4,
    14: 3,
    15: 3,
    16: 4,
    17: 4,
    18: 4,
    19: 4,
    20: 3,
    21: 3,
    22: 2,
    23: 2
  },
  "prostDan": {
    0: 1,
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 2,
    7: 3,
    8: 3,
    9: 3,
    10: 3,
    11: 3,
    12: 3,
    13: 3,
    14: 2,
    15: 2,
    16: 3,
    17: 3,
    18: 3,
    19: 3,
    20: 2,
    21: 2,
    22: 1,
    23: 1
  }
}

//https://podatki.gov.si/dataset/seznam-praznikov-in-dela-prostih-dni-v-republiki-sloveniji
export const praznikiCSV = `DATUM;IME_PRAZNIKA;DAN_V_TEDNU;DELA_PROST_DAN;DAN;MESEC;LETO
1.01.2024;novo leto;ponedeljek;da;1;1;2024
2.01.2024;novo leto;torek;da;2;1;2024
8.02.2024;Prešernov dan, slovenski kulturni praznik;četrtek;da;8;2;2024
31.03.2024;velika noč;nedelja;da;31;3;2024
1.04.2024;velikonočni ponedeljek;ponedeljek;da;1;4;2024
27.04.2024;dan boja proti okupatorju ;sobota;da;27;4;2024
1.05.2024;praznik dela;sreda;da;1;5;2024
2.05.2024;praznik dela;četrtek;da;2;5;2024
19.05.2024;binkoštna nedelja;nedelja;da;19;5;2024
8.06.2024;dan Primoža Trubarja;sobota;ne;8;6;2024
25.06.2024;dan državnosti;torek;da;25;6;2024
15.08.2024;Marijino vnebovzetje;četrtek;da;15;8;2024
17.08.2024;združitev prekmurskih Slovencev z matičnim narodom;sobota;ne ;17;8;2024
15.09.2024;vrnitev Primorske k matični domovini;nedelja;ne;15;9;2024
25.10.2024;dan suverenosti;petek;ne ;25;10;2024
31.10.2024;dan reformacije;četrtek;da;31;10;2024
1.11.2024;dan spomina na mrtve;petek;da;1;11;2024
23.11.2024;dan Rudolfa Maistra;sobota;ne;23;11;2024
25.12.2024;božič;sreda;da;25;12;2024
26.12.2024;dan samostojnosti in enotnosti;četrtek;da;26;12;2024
1.01.2025;novo leto;sreda;da;1;1;2025
2.01.2025;novo leto;četrtek;da;2;1;2025
8.02.2025;Prešernov dan, slovenski kulturni praznik;sobota;da;8;2;2025
20.04.2025;velika noč;nedelja;da;20;4;2025
21.04.2025;velikonočni ponedeljek;ponedeljek;da;21;4;2025
27.04.2025;dan boja proti okupatorju ;nedelja;da;27;4;2025
1.05.2025;praznik dela;četrtek;da;1;5;2025
2.05.2025;praznik dela;petek;da;2;5;2025
8.06.2025;binkoštna nedelja;nedelja;da;8;6;2025
8.06.2025;dan Primoža Trubarja;nedelja;ne;8;6;2025
25.06.2025;dan državnosti;sreda;da;25;6;2025
15.08.2025;Marijino vnebovzetje;petek;da;15;8;2025
17.08.2025;združitev prekmurskih Slovencev z matičnim narodom;nedelja;ne ;17;8;2025
15.09.2025;vrnitev Primorske k matični domovini;ponedeljek;ne;15;9;2025
25.10.2025;dan suverenosti;sobota;ne ;25;10;2025
31.10.2025;dan reformacije;petek;da;31;10;2025
1.11.2025;dan spomina na mrtve;sobota;da;1;11;2025
23.11.2025;dan Rudolfa Maistra;nedelja;ne;23;11;2025
25.12.2025;božič;četrtek;da;25;12;2025
26.12.2025;dan samostojnosti in enotnosti;petek;da;26;12;2025
1.01.2026;novo leto;četrtek;da;1;1;2026
2.01.2026;novo leto;petek;da;2;1;2026
8.02.2026;Prešernov dan, slovenski kulturni praznik;nedelja;da;8;2;2026
5.04.2026;velika noč;nedelja;da;5;4;2026
6.04.2026;velikonočni ponedeljek;ponedeljek;da;6;4;2026
27.04.2026;dan boja proti okupatorju ;ponedeljek;da;27;4;2026
1.05.2026;praznik dela;petek;da;1;5;2026
2.05.2026;praznik dela;sobota;da;2;5;2026
24.05.2026;binkoštna nedelja;nedelja;da;24;5;2026
8.06.2026;dan Primoža Trubarja;ponedeljek;ne;8;6;2026
25.06.2026;dan državnosti;četrtek;da;25;6;2026
15.08.2026;Marijino vnebovzetje;sobota;da;15;8;2026
17.08.2026;združitev prekmurskih Slovencev z matičnim narodom;ponedeljek;ne ;17;8;2026
15.09.2026;vrnitev Primorske k matični domovini;torek;ne;15;9;2026
25.10.2026;dan suverenosti;nedelja;ne ;25;10;2026
31.10.2026;dan reformacije;sobota;da;31;10;2026
1.11.2026;dan spomina na mrtve;nedelja;da;1;11;2026
23.11.2026;dan Rudolfa Maistra;ponedeljek;ne;23;11;2026
25.12.2026;božič;petek;da;25;12;2026
26.12.2026;dan samostojnosti in enotnosti;sobota;da;26;12;2026
1.01.2027;novo leto;petek;da;1;1;2027
2.01.2027;novo leto;sobota;da;2;1;2027
8.02.2027;Prešernov dan, slovenski kulturni praznik;ponedeljek;da;8;2;2027
28.03.2027;velika noč;nedelja;da;28;3;2027
29.03.2027;velikonočni ponedeljek;ponedeljek;da;29;3;2027
27.04.2027;dan boja proti okupatorju ;torek;da;27;4;2027
1.05.2027;praznik dela;sobota;da;1;5;2027
2.05.2027;praznik dela;nedelja;da;2;5;2027
16.05.2027;binkoštna nedelja;nedelja;da;16;5;2027
8.06.2027;dan Primoža Trubarja;torek;ne;8;6;2027
25.06.2027;dan državnosti;petek;da;25;6;2027
15.08.2027;Marijino vnebovzetje;nedelja;da;15;8;2027
17.08.2027;združitev prekmurskih Slovencev z matičnim narodom;torek;ne ;17;8;2027
15.09.2027;vrnitev Primorske k matični domovini;sreda;ne;15;9;2027
25.10.2027;dan suverenosti;ponedeljek;ne ;25;10;2027
31.10.2027;dan reformacije;nedelja;da;31;10;2027
1.11.2027;dan spomina na mrtve;ponedeljek;da;1;11;2027
23.11.2027;dan Rudolfa Maistra;torek;ne;23;11;2027
25.12.2027;božič;sobota;da;25;12;2027
26.12.2027;dan samostojnosti in enotnosti;nedelja;da;26;12;2027
1.01.2028;novo leto;sobota;da;1;1;2028
2.01.2028;novo leto;nedelja;da;2;1;2028
8.02.2028;Prešernov dan, slovenski kulturni praznik;torek;da;8;2;2028
16.04.2028;velika noč;nedelja;da;16;4;2028
17.04.2028;velikonočni ponedeljek;ponedeljek;da;17;4;2028
27.04.2028;dan boja proti okupatorju ;četrtek;da;27;4;2028
1.05.2028;praznik dela;ponedeljek;da;1;5;2028
2.05.2028;praznik dela;torek;da;2;5;2028
4.06.2028;binkoštna nedelja;nedelja;da;4;6;2028
8.06.2028;dan Primoža Trubarja;četrtek;ne;8;6;2028
25.06.2028;dan državnosti;nedelja;da;25;6;2028
15.08.2028;Marijino vnebovzetje;torek;da;15;8;2028
17.08.2028;združitev prekmurskih Slovencev z matičnim narodom;četrtek;ne ;17;8;2028
15.09.2028;vrnitev Primorske k matični domovini;petek;ne;15;9;2028
25.10.2028;dan suverenosti;sreda;ne ;25;10;2028
31.10.2028;dan reformacije;torek;da;31;10;2028
1.11.2028;dan spomina na mrtve;sreda;da;1;11;2028
23.11.2028;dan Rudolfa Maistra;četrtek;ne;23;11;2028
25.12.2028;božič;ponedeljek;da;25;12;2028
26.12.2028;dan samostojnosti in enotnosti;torek;da;26;12;2028
1.01.2029;novo leto;ponedeljek;da;1;1;2029
2.01.2029;novo leto;torek;da;2;1;2029
8.02.2029;Prešernov dan, slovenski kulturni praznik;četrtek;da;8;2;2029
1.04.2029;velika noč;nedelja;da;1;4;2029
2.04.2029;velikonočni ponedeljek;ponedeljek;da;2;4;2029
27.04.2029;dan boja proti okupatorju ;petek;da;27;4;2029
1.05.2029;praznik dela;torek;da;1;5;2029
2.05.2029;praznik dela;sreda;da;2;5;2029
20.05.2029;binkoštna nedelja;nedelja;da;20;5;2029
8.06.2029;dan Primoža Trubarja;petek;ne;8;6;2029
25.06.2029;dan državnosti;ponedeljek;da;25;6;2029
15.08.2029;Marijino vnebovzetje;sreda;da;15;8;2029
17.08.2029;združitev prekmurskih Slovencev z matičnim narodom;petek;ne ;17;8;2029
15.09.2029;vrnitev Primorske k matični domovini;sobota;ne;15;9;2029
25.10.2029;dan suverenosti;četrtek;ne ;25;10;2029
31.10.2029;dan reformacije;sreda;da;31;10;2029
1.11.2029;dan spomina na mrtve;četrtek;da;1;11;2029
23.11.2029;dan Rudolfa Maistra;petek;ne;23;11;2029
25.12.2029;božič;torek;da;25;12;2029
26.12.2029;dan samostojnosti in enotnosti;sreda;da;26;12;2029
1.01.2030;novo leto;torek;da;1;1;2030
2.01.2030;novo leto;sreda;da;2;1;2030
8.02.2030;Prešernov dan, slovenski kulturni praznik;petek;da;8;2;2030
21.04.2030;velika noč;nedelja;da;21;4;2030
22.04.2030;velikonočni ponedeljek;ponedeljek;da;22;4;2030
27.04.2030;dan boja proti okupatorju ;sobota;da;27;4;2030
1.05.2030;praznik dela;sreda;da;1;5;2030
2.05.2030;praznik dela;četrtek;da;2;5;2030
9.06.2030;binkoštna nedelja;nedelja;da;9;6;2030
8.06.2030;dan Primoža Trubarja;sobota;ne;8;6;2030
25.06.2030;dan državnosti;torek;da;25;6;2030
15.08.2030;Marijino vnebovzetje;četrtek;da;15;8;2030
17.08.2030;združitev prekmurskih Slovencev z matičnim narodom;sobota;ne ;17;8;2030
15.09.2030;vrnitev Primorske k matični domovini;nedelja;ne;15;9;2030
25.10.2030;dan suverenosti;petek;ne ;25;10;2030
31.10.2030;dan reformacije;četrtek;da;31;10;2030
1.11.2030;dan spomina na mrtve;petek;da;1;11;2030
23.11.2030;dan Rudolfa Maistra;sobota;ne;23;11;2030
25.12.2030;božič;sreda;da;25;12;2030
26.12.2030;dan samostojnosti in enotnosti;četrtek;da;26;12;2030`