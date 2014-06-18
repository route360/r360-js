var museums = [
  {
    "id":9760312,
    "name":"New York State Museum and Archives",
    "lon":-73.7617882539537,
    "lat":42.6482778961764
  },
  {
    "id":35002555,
    "name":"Herkimer Diamond Mine & Museum",
    "lon":-74.9766492512373,
    "lat":43.1287069881386
  },
  {
    "id":35017727,
    "name":"Garibaldi-Meucci Museum",
    "lon":-74.0738193700763,
    "lat":40.6151835941388
  },
  {
    "id":35068417,
    "name":"Johnson Museum of Art",
    "lon":-76.4862881371072,
    "lat":42.4507127884427
  },
  {
    "id":35798325,
    "name":"Galerie Saint George",
    "lon":-74.0849070639011,
    "lat":40.6462349027813
  },
  {
    "id":54672817,
    "name":"Potsdam Museum",
    "lon":-74.9826834991126,
    "lat":44.6695613825237
  },
  {
    "id":55576393,
    "name":"Chinese Scholar's Garden",
    "lon":-74.1044271135668,
    "lat":40.6420215389008
  },
  {
    "id":55580349,
    "name":"Randall Manor",
    "lon":-74.1045764129965,
    "lat":40.6441992724425
  },
  {
    "id":60009953,
    "name":"Watervliet Arsenal Museum",
    "lon":-73.7040190330899,
    "lat":42.7183232623104
  },
  {
    "id":60010043,
    "name":"Chimney Point Museum",
    "lon":-73.4210217269656,
    "lat":44.0349073583156
  },
  {
    "id":82568150,
    "name":"Klyne Esopus Museum",
    "lon":-73.9697788283909,
    "lat":41.8536851810796
  },
  {
    "id":85535184,
    "name":"Buffalo Museum of Science",
    "lon":-78.8433707139719,
    "lat":42.9062122390084
  },
  {
    "id":85930901,
    "name":"Shaker Meeting House",
    "lon":-73.8112153400971,
    "lat":42.7412174754465
  },
  {
    "id":89868754,
    "name":"Albany Institute of History and Art",
    "lon":-73.7602905426479,
    "lat":42.6558033135447
  },
  {
    "id":90940954,
    "name":"Historic Cherry Hill",
    "lon":-73.7634822703831,
    "lat":42.6348555864642
  },
  {
    "id":103599097,
    "name":"Fine Arts & Art Museum",
    "lon":-73.8229412408528,
    "lat":42.686352103898
  },
  {
    "id":109269297,
    "name":"Museum of Arts and Design",
    "lon":-73.9820011508003,
    "lat":40.7674021704425
  },
  {
    "id":109556267,
    "name":"JELL-O Gallery",
    "lon":-77.9857069607271,
    "lat":42.978861420789
  },
  {
    "id":117572969,
    "name":"Saratoga Automobile Museum",
    "lon":-73.8047498751405,
    "lat":43.0569683831252
  },
  {
    "id":117606663,
    "name":"Saratoga Historical Society Museum",
    "lon":-73.7840929710086,
    "lat":43.0784094005569
  },
  {
    "id":119504316,
    "name":"Burchfield Penney Art Museum",
    "lon":-78.8779995488249,
    "lat":42.9314032008648
  },
  {
    "id":120746387,
    "name":"Niagara County Historical Society Museum",
    "lon":-78.6997419339964,
    "lat":43.1703938754489
  },
  {
    "id":120840615,
    "name":"Phelps Mansion",
    "lon":-75.9055970545783,
    "lat":42.1007244200764
  },
  {
    "id":120840622,
    "name":"Roberson Museum & Science Center",
    "lon":-75.9186217691123,
    "lat":42.0936779175624
  },
  {
    "id":120843447,
    "name":"Kopernik Space Education Center",
    "lon":-76.0333080604685,
    "lat":42.0020680812799
  },
  {
    "id":122207062,
    "name":"Napanoch Station",
    "lon":-74.3651885608202,
    "lat":41.7397486886459
  },
  {
    "id":125420177,
    "name":"New York State Military Museum",
    "lon":-73.7813935917893,
    "lat":43.083113594747
  },
  {
    "id":138284359,
    "name":"Restored Mill/Water Wheels",
    "lon":-77.6157886055467,
    "lat":43.1609659470753
  },
  {
    "id":138358983,
    "name":"Greece Historical Society",
    "lon":-77.6972053545156,
    "lat":43.2597410302446
  },
  {
    "id":139809769,
    "name":"Museum of Innovation and Science",
    "lon":-73.9336484744877,
    "lat":42.8119427195551
  },
  {
    "id":140793321,
    "name":"Boscobel House",
    "lon":-73.9392147845899,
    "lat":41.4116554929744
  },
  {
    "id":142997638,
    "name":"Tang Teaching Museum and Art Gallery",
    "lon":-73.7859000773129,
    "lat":43.0953397642677
  },
  {
    "id":143325011,
    "name":"Professional Wrestling Hall of Fame",
    "lon":-74.1925764,
    "lat":42.937041
  },
  {
    "id":143897110,
    "name":"Children's Museum of Saratoga",
    "lon":-73.7817530765506,
    "lat":43.0817165819343
  },
  {
    "id":151743736,
    "name":"Willett Center",
    "lon":-75.4574122675049,
    "lat":43.209997686081
  },
  {
    "id":156115549,
    "name":"Niagara Gorge Discovery Center",
    "lon":-79.0621816509112,
    "lat":43.0934956076892
  },
  {
    "id":158460345,
    "name":"Sir Adam Beck Power Stations",
    "lon":-79.045587686048,
    "lat":43.1473367677047
  },
  {
    "id":158934869,
    "name":"Erie Canal Museum",
    "lon":-76.1487179684119,
    "lat":43.0506494937217
  },
  {
    "id":162755458,
    "name":"Paley Center for Media",
    "lon":-73.977590887277,
    "lat":40.7605823855502
  },
  {
    "id":162776007,
    "name":"American Folk Art Museum",
    "lon":-73.9813014655921,
    "lat":40.7732619357325
  },
  {
    "id":162932432,
    "name":"Empire State Aerosciences Museum",
    "lon":-73.93202255,
    "lat":42.8605503
  },
  {
    "id":164465270,
    "name":"International Boxing Hall of Fame",
    "lon":-75.7500933547244,
    "lat":43.089589420942
  },
  {
    "id":164609583,
    "name":"Skä•noñh Center",
    "lon":-76.1969782844664,
    "lat":43.0935108543057
  },
  {
    "id":164609585,
    "name":"Salt Museum",
    "lon":-76.2068447128563,
    "lat":43.0997529683528
  },
  {
    "id":165245347,
    "name":"Wagoner Carriage Museum",
    "lon":-76.2198868538421,
    "lat":43.0740894163145
  },
  {
    "id":165245348,
    "name":"Witter Agricultural Museum",
    "lon":-76.2193016633732,
    "lat":43.0737771359215
  },
  {
    "id":170149134,
    "name":"Guggenheim Museum",
    "lon":-73.9589261369567,
    "lat":40.7830141185896
  },
  {
    "id":173057487,
    "name":"Chittenango Landing Canal Boat Museum",
    "lon":-75.8721545952596,
    "lat":43.0600259112028
  },
  {
    "id":175946418,
    "name":"Museum of Science and Technology",
    "lon":-76.1553287509749,
    "lat":43.0470584175043
  },
  {
    "id":178513233,
    "name":"American Airpower Museum",
    "lon":-73.41336795,
    "lat":40.7374521
  },
  {
    "id":184689487,
    "name":"Shrine Museum and Library",
    "lon":-74.3030728257183,
    "lat":42.9257764166473
  },
  {
    "id":184689571,
    "name":"Saints of Auriesville Museum",
    "lon":-74.3039205363157,
    "lat":42.9244167557891
  },
  {
    "id":185021601,
    "name":"The Depot",
    "lon":-73.58462865983,
    "lat":44.967860465256
  },
  {
    "id":185195881,
    "name":"Wardenclyffe",
    "lon":-72.8989985093312,
    "lat":40.9481364816036
  },
  {
    "id":187462805,
    "name":"Slate Museum",
    "lon":-73.2618135336133,
    "lat":43.4060006309349
  },
  {
    "id":193989799,
    "name":"Tonawanda-Kenmore Historical Society",
    "lon":-78.8779390828907,
    "lat":42.9938965324948
  },
  {
    "id":200365937,
    "name":"Herschell Carrousel Factory Museum",
    "lon":-78.8730486712173,
    "lat":43.0299534046815
  },
  {
    "id":203004917,
    "name":"Oyster Bay Railroad Museum",
    "lon":-73.5293187593873,
    "lat":40.8750519186961
  },
  {
    "id":203029953,
    "name":"Raynham Hall Museum",
    "lon":-73.5316815157573,
    "lat":40.8724726210933
  },
  {
    "id":213580884,
    "name":"disAbility museum",
    "lon":-78.8079703182296,
    "lat":42.9621543179223
  },
  {
    "id":225144163,
    "name":"Roscoe O&W Museum",
    "lon":-74.91319685,
    "lat":41.9317174
  },
  {
    "id":230119051,
    "name":"Vestal Museum",
    "lon":-76.045344,
    "lat":42.08784205
  },
  {
    "id":231043590,
    "name":"Medina Railroad Museum",
    "lon":-78.390257219177,
    "lat":43.2182605483582
  },
  {
    "id":231869036,
    "name":"Stint Lawrence Power and Equipment Museum",
    "lon":-75.1227749334454,
    "lat":44.7403066713066
  },
  {
    "id":232334694,
    "name":"Samuel Dorsky Museum of Art",
    "lon":-74.0834342681078,
    "lat":41.7411312767267
  },
  {
    "id":232815824,
    "name":"Kiersted House",
    "lon":-73.9494227,
    "lat":42.0793018
  },
  {
    "id":238271102,
    "name":"Edinburg Rural Museum",
    "lon":-74.1041605268883,
    "lat":43.2182912146568
  },
  {
    "id":238271169,
    "name":"Nellie Tyrell Museum",
    "lon":-74.1034879,
    "lat":43.2201335
  },
  {
    "id":241833272,
    "name":"The Ukrainian Museum",
    "lon":-73.9897639118576,
    "lat":40.7276648778618
  },
  {
    "id":241846075,
    "name":"BRIC Rotunda Gallery",
    "lon":-73.9914660983424,
    "lat":40.6951513176192
  },
  {
    "id":241850436,
    "name":"Fort Wadsworth Visitor's Center and Museum",
    "lon":-74.0581420857082,
    "lat":40.6040835362433
  },
  {
    "id":241850443,
    "name":"Mont Sec House",
    "lon":-74.0590200178212,
    "lat":40.6061607426642
  },
  {
    "id":241853811,
    "name":"Staten Island Museum and Institue of Arts and Sciences",
    "lon":-74.0776988579737,
    "lat":40.6444017745672
  },
  {
    "id":241853878,
    "name":"Galerie St. George",
    "lon":-74.0847457877445,
    "lat":40.6461494066227
  },
  {
    "id":241996494,
    "name":"Little Falls Historical Society & Museum",
    "lon":-74.8592026485477,
    "lat":43.0427596872625
  },
  {
    "id":242294866,
    "name":"Farmers' Museum",
    "lon":-74.9298320485614,
    "lat":42.7121995445331
  },
  {
    "id":244060305,
    "name":"Alice Austen House",
    "lon":-74.0630311838784,
    "lat":40.6151137028463
  },
  {
    "id":244178352,
    "name":"Staten Island Children's Museum",
    "lon":-74.1019636005497,
    "lat":40.6423962935264
  },
  {
    "id":244178353,
    "name":"Staten Island Children's Museum",
    "lon":-74.1019514,
    "lat":40.64256495
  },
  {
    "id":244178354,
    "name":"Staten Island Children's Museum",
    "lon":-74.1018895925946,
    "lat":40.6427148692632
  },
  {
    "id":244178355,
    "name":"Staten Island Children's Museum",
    "lon":-74.1019703772899,
    "lat":40.6422016889345
  },
  {
    "id":246244299,
    "name":"Jacques Marchais Museum of Tibetan Art",
    "lon":-74.138139465109,
    "lat":40.5763113535782
  },
  {
    "id":246731269,
    "name":"Seguine Mansion",
    "lon":-74.1975841291546,
    "lat":40.5152131895275
  },
  {
    "id":247838607,
    "name":"Merchant's House Museum",
    "lon":-73.9923438453787,
    "lat":40.7276575634842
  },
  {
    "id":247920493,
    "name":"New Museum",
    "lon":-73.9928335473647,
    "lat":40.7223461390718
  },
  {
    "id":249053508,
    "name":"Harbor Defense Museum of Fort Hamilton",
    "lon":-74.0320526995635,
    "lat":40.6089312277683
  },
  {
    "id":249664614,
    "name":"New York City Fire Museum",
    "lon":-74.0069393094894,
    "lat":40.7255738686459
  },
  {
    "id":250220500,
    "name":"Jewish Childrens Museum",
    "lon":-73.9419590459064,
    "lat":40.6688970975048
  },
  {
    "id":250229991,
    "name":"Brooklyn Museum of Art",
    "lon":-73.963645910806,
    "lat":40.6709778930017
  },
  {
    "id":250324041,
    "name":"Brooklyn Children's Museum",
    "lon":-73.9439545454537,
    "lat":40.6744573309134
  },
  {
    "id":261474959,
    "name":"Brick House Museum",
    "lon":-74.1761429293564,
    "lat":41.5248417089148
  },
  {
    "id":262190469,
    "name":"Safe Haven Museum",
    "lon":-76.50440375,
    "lat":43.4636048
  },
  {
    "id":262356518,
    "name":"H. Lee White Marine Museum",
    "lon":-76.5156350919679,
    "lat":43.4643666808038
  },
  {
    "id":262812532,
    "name":"Richardson-Bates House Museum",
    "lon":-76.5037683190228,
    "lat":43.4554963766478
  },
  {
    "id":265357846,
    "name":"Intrepid Museum",
    "lon":-73.9995269839788,
    "lat":40.7645127365527
  },
  {
    "id":266894769,
    "name":"Whitney Museum of American Art",
    "lon":-73.963828304683,
    "lat":40.7733974413705
  },
  {
    "id":266926168,
    "name":"Cooper–Hewitt, National Design Museum",
    "lon":-73.9577180999197,
    "lat":40.7842847118462
  },
  {
    "id":266934250,
    "name":"Institute for the Study of the Ancient World",
    "lon":-73.9602185539347,
    "lat":40.7799815553321
  },
  {
    "id":266934254,
    "name":"Neue Galerie New York",
    "lon":-73.9602371062615,
    "lat":40.7812224042268
  },
  {
    "id":266940107,
    "name":"Jewish Museum",
    "lon":-73.9571859906121,
    "lat":40.7854051575353
  },
  {
    "id":269305282,
    "name":"Hayden Planetarium",
    "lon":-73.9732382526605,
    "lat":40.7815326498499
  },
  {
    "id":270901657,
    "name":"Children's Museum of Manhattan",
    "lon":-73.977336414301,
    "lat":40.7858570825664
  },
  {
    "id":271205062,
    "name":"Nicholas Roerich Museum",
    "lon":-73.9688153614184,
    "lat":40.8028537570472
  },
  {
    "id":271220752,
    "name":"Museum of the City of New York",
    "lon":-73.9519118160367,
    "lat":40.7925038078732
  },
  {
    "id":271274003,
    "name":"El Museo Del Barrio",
    "lon":-73.9513547129453,
    "lat":40.7930897491884
  },
  {
    "id":271592477,
    "name":"National Museum of Catholic Art and History",
    "lon":-73.9343693841294,
    "lat":40.7949256483583
  },
  {
    "id":275704895,
    "name":"Buffalo History Museum - Resource Center",
    "lon":-78.8819322111464,
    "lat":42.9273256558842
  },
  {
    "id":277070523,
    "name":"Glyndor Gallery",
    "lon":-73.9123957599315,
    "lat":40.8977497054807
  },
  {
    "id":277924005,
    "name":"Museum of the Jewish Heritage",
    "lon":-74.0186037057181,
    "lat":40.7059661791164
  },
  {
    "id":277924006,
    "name":"Museum of the Jewish Heritage",
    "lon":-74.0187860985451,
    "lat":40.7062451594026
  },
  {
    "id":278033604,
    "name":"Memorial Museum",
    "lon":-74.0126992781145,
    "lat":40.711480557609
  },
  {
    "id":278076368,
    "name":"NYPD Museum",
    "lon":-74.00813135,
    "lat":40.7034864
  },
  {
    "id":278084740,
    "name":"Bodies",
    "lon":-74.0029374580089,
    "lat":40.7067500667366
  },
  {
    "id":278346560,
    "name":"American Folk Art Museum",
    "lon":-73.9781036001579,
    "lat":40.7616239105758
  },
  {
    "id":278346578,
    "name":"Museum of Modern Art",
    "lon":-73.9775799186235,
    "lat":40.7616029212542
  },
  {
    "id":281344884,
    "name":"Isamu Noguch Museum",
    "lon":-73.9376491501079,
    "lat":40.7669605544863
  },
  {
    "id":283167850,
    "name":"King Manor Museum",
    "lon":-73.8037709308984,
    "lat":40.7030922941957
  },
  {
    "id":284856409,
    "name":"Queens Museum",
    "lon":-73.8467390669472,
    "lat":40.7458671236178
  },
  {
    "id":284860788,
    "name":"New York Hall of Science",
    "lon":-73.8517284085633,
    "lat":40.7473684433223
  },
  {
    "id":285107125,
    "name":"Historic Aircraft Restoration Project - Hangar B",
    "lon":-73.8829629046434,
    "lat":40.5948684836922
  },
  {
    "id":368061332,
    "name":"Frank L Baum-Oz Museum",
    "lon":-75.8807474,
    "lat":43.045067
  },
  {
    "id":368061337,
    "name":"National Museum of the American Indian",
    "lon":-74.0137472,
    "lat":40.7040265
  },
  {
    "id":368061451,
    "name":"Science Museum of Long Island",
    "lon":-73.7019444,
    "lat":40.8172222
  },
  {
    "id":368061456,
    "name":"Van Nostrand - Starkins House And Museum",
    "lon":-73.6463889,
    "lat":40.7944444
  },
  {
    "id":368061460,
    "name":"Wantagh Museum",
    "lon":-73.5102778,
    "lat":40.6805556
  },
  {
    "id":368061463,
    "name":"Cold Spring Harbor Whaling Museum",
    "lon":-73.4552778,
    "lat":40.8722222
  },
  {
    "id":368061467,
    "name":"Goudreau Museum of Mathematics",
    "lon":-73.6613889,
    "lat":40.7597222
  },
  {
    "id":368061469,
    "name":"Grist Mill Museum",
    "lon":-73.6633333,
    "lat":40.6463889
  },
  {
    "id":368061476,
    "name":"Rock Hall Museum",
    "lon":-73.7341667,
    "lat":40.6088889
  },
  {
    "id":368061480,
    "name":"Garibaldi - Meucci Memorial Museum",
    "lon":-74.0736112,
    "lat":40.6152779
  },
  {
    "id":368061490,
    "name":"Heckscher Museum",
    "lon":-73.4219444,
    "lat":40.8747222
  },
  {
    "id":368061494,
    "name":"Suffolk County Marine Museum West",
    "lon":-73.0952778,
    "lat":40.7283333
  },
  {
    "id":368061498,
    "name":"Sag Harbor Whaling Museum",
    "lon":-72.2972248,
    "lat":40.997656
  },
  {
    "id":368061502,
    "name":"Long Island Museum of American Art, History and Carriages",
    "lon":-73.1416667,
    "lat":40.9116667
  },
  {
    "id":368061507,
    "name":"Thomas Paine National Historic Museum",
    "lon":-73.7916667,
    "lat":40.9352778
  },
  {
    "id":368061510,
    "name":"Memorial Museum",
    "lon":-73.9209715,
    "lat":41.2892606
  },
  {
    "id":368061514,
    "name":"Museum of Bronx History",
    "lon":-73.8797222,
    "lat":40.8769444
  },
  {
    "id":368061518,
    "name":"Bronx Museum of the Arts",
    "lon":-73.9199471,
    "lat":40.8310911
  },
  {
    "id":368061534,
    "name":"Hammond Museum",
    "lon":-73.5817932,
    "lat":41.3312057
  },
  {
    "id":368061543,
    "name":"Old Orchard Museum",
    "lon":-73.4958333,
    "lat":40.8858333
  },
  {
    "id":368061547,
    "name":"Garvies Point Museum",
    "lon":-73.6513782,
    "lat":40.8596801
  },
  {
    "id":368061551,
    "name":"Earle - Wightman House Museum",
    "lon":-73.5303235,
    "lat":40.8707183
  },
  {
    "id":368061554,
    "name":"Schoolhouse Museum",
    "lon":-73.8402778,
    "lat":41.3536111
  },
  {
    "id":368061558,
    "name":"Van Cortlandt Mansion Museum",
    "lon":-73.895,
    "lat":40.8908333
  },
  {
    "id":368061562,
    "name":"Tackapausha Museum Library",
    "lon":-73.4833333,
    "lat":40.6677778
  },
  {
    "id":368061566,
    "name":"Tackapausha Museum",
    "lon":-73.4833333,
    "lat":40.6677778
  },
  {
    "id":368061590,
    "name":"Abigail Adams Smith Museum",
    "lon":-73.96,
    "lat":40.7605556
  },
  {
    "id":368061605,
    "name":"Yeshiva University Museum",
    "lon":-73.9938889,
    "lat":40.7377778
  },
  {
    "id":368061607,
    "name":"Dahesh Museum of Art",
    "lon":-73.9730556,
    "lat":40.7619444
  },
  {
    "id":368061610,
    "name":"Museum of Biblical Art",
    "lon":-73.9825,
    "lat":40.77
  },
  {
    "id":368061617,
    "name":"Coyuga Museum of History and Art",
    "lon":-76.5752778,
    "lat":42.9277778
  },
  {
    "id":368061619,
    "name":"National Soccer Hall of Fame and Museum",
    "lon":-75.1113,
    "lat":42.448
  },
  {
    "id":368061623,
    "name":"Fire Department Museum",
    "lon":-74.4152778,
    "lat":41.445
  },
  {
    "id":368061639,
    "name":"Louis Armstrong House Museum",
    "lon":-73.8616667,
    "lat":40.7544444
  },
  {
    "id":368061644,
    "name":"Museum of the Moving Image",
    "lon":-73.9238889,
    "lat":40.7563889
  },
  {
    "id":368061648,
    "name":"New York City Transit Museum",
    "lon":-73.989968,
    "lat":40.6905048
  },
  {
    "id":368061657,
    "name":"Museum of African Art",
    "lon":-73.9977778,
    "lat":40.725
  },
  {
    "id":368061660,
    "name":"Lower East Side Tenement Museum",
    "lon":-73.9900266,
    "lat":40.7187837
  },
  {
    "id":368061667,
    "name":"Erasmus Hall Museum",
    "lon":-73.9575,
    "lat":40.6494444
  },
  {
    "id":368061692,
    "name":"National Bottle Museum",
    "lon":-73.8486111,
    "lat":43.0030556
  },
  {
    "id":368061696,
    "name":"National Baseball Hall of Fame and Museum",
    "lon":-74.923,
    "lat":42.6998
  },
  {
    "id":368061700,
    "name":"Center For Curatorial Studies And Hessel Museum of Art",
    "lon":-73.9141667,
    "lat":42.0202778
  },
  {
    "id":368061704,
    "name":"Yager Hall - Library and Museum",
    "lon":-75.0708123,
    "lat":42.457901
  },
  {
    "id":368061707,
    "name":"Schuyler Mansion Museum",
    "lon":-73.7592183,
    "lat":42.6414208
  },
  {
    "id":368061723,
    "name":"Samuel Dorsky Museum of Art",
    "lon":-74.0833333,
    "lat":41.7411111
  },
  {
    "id":368061727,
    "name":"McClurg Museum",
    "lon":-79.5769444,
    "lat":42.3213889
  },
  {
    "id":368061730,
    "name":"Hudson Highlands Nature Museum - Outdoor Discovery Center",
    "lon":-74.0347222,
    "lat":41.4219444
  },
  {
    "id":368061734,
    "name":"The Pines Museum",
    "lon":-74.4588889,
    "lat":41.3925
  },
  {
    "id":368061738,
    "name":"Minisink Heritage Museum",
    "lon":-74.5666667,
    "lat":41.3216667
  },
  {
    "id":368061742,
    "name":"Erie Depot Museum",
    "lon":-74.6916667,
    "lat":41.3722222
  },
  {
    "id":368061749,
    "name":"Charlton Historical Society Museum",
    "lon":-73.96,
    "lat":42.935
  },
  {
    "id":368061753,
    "name":"Hicksville Gregory Museum",
    "lon":-73.5208333,
    "lat":40.7688889
  },
  {
    "id":368061761,
    "name":"Childrens Museum",
    "lon":-75.2241667,
    "lat":43.1044444
  },
  {
    "id":368061765,
    "name":"Chemung County Museum",
    "lon":-76.8005556,
    "lat":42.0886111
  },
  {
    "id":368061769,
    "name":"Kingston Fire Department Museum",
    "lon":-74.0185992,
    "lat":41.9332846
  },
  {
    "id":368061777,
    "name":"Neversink Valley Area Museum",
    "lon":-74.6030556,
    "lat":41.4586111
  },
  {
    "id":368061781,
    "name":"Old Fort Museum",
    "lon":-73.5808333,
    "lat":43.2616667
  },
  {
    "id":368061788,
    "name":"Port Jervis Fireman Museum",
    "lon":-74.6877778,
    "lat":41.3797222
  },
  {
    "id":368061792,
    "name":"Sullivan County Historical Society Museum",
    "lon":-74.6852778,
    "lat":41.6555556
  },
  {
    "id":368061804,
    "name":"National Museum of Racing",
    "lon":-73.7736111,
    "lat":43.0761111
  },
  {
    "id":368061812,
    "name":"Holland Land Office Museum",
    "lon":-78.1908333,
    "lat":42.9991667
  },
  {
    "id":368061816,
    "name":"Old Stone Fort Museum",
    "lon":-74.3018001,
    "lat":42.6772976
  },
  {
    "id":368061820,
    "name":"Iroquois Museum",
    "lon":-74.3090232,
    "lat":42.6617422
  },
  {
    "id":368061831,
    "name":"Vanderbilt Museum",
    "lon":-73.3684513,
    "lat":40.9064869
  },
  {
    "id":368061835,
    "name":"Shaker Museum",
    "lon":-73.5823377,
    "lat":42.4375831
  },
  {
    "id":368061847,
    "name":"Hudson River Museum and Planetarium",
    "lon":-73.895969,
    "lat":40.9542651
  },
  {
    "id":368061866,
    "name":"Bartow-Pell Mansion Museum",
    "lon":-73.8056401,
    "lat":40.8717809
  },
  {
    "id":368061870,
    "name":"Cradle of Aviation Museum",
    "lon":-73.5975,
    "lat":40.7286111
  },
  {
    "id":368061874,
    "name":"Lauder Museum",
    "lon":-73.4175,
    "lat":40.6769444
  },
  {
    "id":368061878,
    "name":"Castellani Art Museum",
    "lon":-79.0366667,
    "lat":43.1372222
  },
  {
    "id":368061882,
    "name":"Newark Valley Depot Museum",
    "lon":-76.1855556,
    "lat":42.2255556
  },
  {
    "id":368061889,
    "name":"National Museum of Dance",
    "lon":-73.7902778,
    "lat":43.0661111
  },
  {
    "id":368061892,
    "name":"Livingston County Historical Society Museum",
    "lon":-77.8132,
    "lat":42.7955
  },
  {
    "id":368061900,
    "name":"Nassau County Museum of Art",
    "lon":-73.6435754,
    "lat":40.8077183
  },
  {
    "id":368061904,
    "name":"Big Springs Historical Museum",
    "lon":-77.8548,
    "lat":42.9739
  },
  {
    "id":386329700,
    "name":"National Museum of Play at The Strong",
    "lon":-77.6013949,
    "lat":43.1526554
  },
  {
    "id":418524116,
    "name":"Show Gallery Studio",
    "lon":-74.0766559,
    "lat":40.6424957
  },
  {
    "id":424048139,
    "name":"Noble Maritime Museum",
    "lon":-74.1018006,
    "lat":40.6442901
  },
  {
    "id":424048146,
    "name":"Newhouse Center for Contemporary Art",
    "lon":-74.1023242,
    "lat":40.64388
  },
  {
    "id":424048153,
    "name":"Staten Island Museum",
    "lon":-74.1024872,
    "lat":40.644466
  },
  {
    "id":424061246,
    "name":"ArtLab",
    "lon":-74.1027159,
    "lat":40.6439445
  },
  {
    "id":457540484,
    "name":"Kazoo Factory",
    "lon":-78.8983928,
    "lat":42.6491077
  },
  {
    "id":494723201,
    "name":"The Hyde Collection",
    "lon":-73.634441,
    "lat":43.3102646
  },
  {
    "id":522280132,
    "name":"International Museum of Photography and Film",
    "lon":-77.5798264,
    "lat":43.1531296
  },
  {
    "id":540491582,
    "name":"Rockwell Museum of Western Art",
    "lon":-77.0528421,
    "lat":42.1425989
  },
  {
    "id":541646558,
    "name":"Destroyer Escort Historical Museum",
    "lon":-73.7499427,
    "lat":42.6425409
  },
  {
    "id":565990219,
    "name":"Guild Hall",
    "lon":-72.1904334,
    "lat":40.9579128
  },
  {
    "id":566445454,
    "name":"International Center of Photography",
    "lon":-73.9837251,
    "lat":40.7557394
  },
  {
    "id":567712004,
    "name":"Hallwalls Contemporary Art Center",
    "lon":-78.8754164,
    "lat":42.8936798
  },
  {
    "id":567712064,
    "name":"Starlight Studio and Art Gallery",
    "lon":-78.8761717,
    "lat":42.8936169
  },
  {
    "id":568952280,
    "name":"Adirondack Museum",
    "lon":-74.4331435,
    "lat":43.8695388
  },
  {
    "id":600623268,
    "name":"Great Buddha Hall",
    "lon":-73.7940146,
    "lat":41.485217
  },
  {
    "id":635375931,
    "name":"10th Mountain Division Historical Collection",
    "lon":-75.7548232,
    "lat":44.0357961
  },
  {
    "id":675960140,
    "name":"Albright-Knox Art Gallery",
    "lon":-78.8756443,
    "lat":42.9320314
  },
  {
    "id":677192447,
    "name":"Berne Museum",
    "lon":-74.1350402,
    "lat":42.6249136
  },
  {
    "id":684842652,
    "name":"North Creek Depot Museum",
    "lon":-73.9892038,
    "lat":43.702959
  },
  {
    "id":761470487,
    "name":"Pratt Museum",
    "lon":-74.4322544,
    "lat":42.3147125
  },
  {
    "id":805687848,
    "name":"Northeast Classic Car Museum",
    "lon":-75.521685,
    "lat":42.536572
  },
  {
    "id":853328911,
    "name":"Foster Cottage Museum",
    "lon":-77.1376762,
    "lat":42.9612382
  },
  {
    "id":864137285,
    "name":"The Wild Center",
    "lon":-74.4386401,
    "lat":44.219825
  },
  {
    "id":963610038,
    "name":"Children's Museum of Science and Technology",
    "lon":-73.6977639,
    "lat":42.6767251
  },
  {
    "id":1043256373,
    "name":"Philadelphia Historical Society",
    "lon":-75.7060517,
    "lat":44.1577552
  },
  {
    "id":1089084022,
    "name":"Long Beach Historical & Preservation Society Museum",
    "lon":-73.6708405,
    "lat":40.5852129
  },
  {
    "id":1120346131,
    "name":"Fort William Henry",
    "lon":-73.7111859,
    "lat":43.4203076
  },
  {
    "id":1215192034,
    "name":"Ten Broeck Mansion",
    "lon":-73.7511913,
    "lat":42.6587107
  },
  {
    "id":1228597697,
    "name":"Defreest House",
    "lon":-73.6950706,
    "lat":42.676252
  },
  {
    "id":1242650600,
    "name":"Strasenburgh Planetarium",
    "lon":-77.5868098,
    "lat":43.1521643
  },
  {
    "id":1242662202,
    "name":"Susan B. Anthony House",
    "lon":-77.6280045,
    "lat":43.1532425
  },
  {
    "id":1273585734,
    "name":"Orchard Park Historical Society",
    "lon":-78.7433029,
    "lat":42.7669762
  },
  {
    "id":1289044027,
    "name":"Sperone Westwater",
    "lon":-73.9926929,
    "lat":40.7231996
  },
  {
    "id":1301351049,
    "name":"Sciencenter",
    "lon":-76.504024,
    "lat":42.4497613
  },
  {
    "id":1342600765,
    "name":"Darwin D. Martin House",
    "lon":-78.8480595,
    "lat":42.936123
  },
  {
    "id":1347472169,
    "name":"Fairport Historical Museum",
    "lon":-77.4441558,
    "lat":43.1004032
  },
  {
    "id":1353113387,
    "name":"New York State Erie Canal Museum at Locks 34 & 35",
    "lon":-78.6934753,
    "lat":43.1705883
  },
  {
    "id":1353960759,
    "name":"The Bundy Museum of History and Art",
    "lon":-75.9278829,
    "lat":42.1016775
  },
  {
    "id":1401129365,
    "name":"Burden Iron Works Museum",
    "lon":-73.698966,
    "lat":42.7100013
  },
  {
    "id":1401149566,
    "name":"Waterford Historial Museum",
    "lon":-73.6951762,
    "lat":42.7809377
  },
  {
    "id":1404797574,
    "name":"Chapman Historical Museum",
    "lon":-73.6489955,
    "lat":43.3116293
  },
  {
    "id":1404824651,
    "name":"Henry Hudson Panetarium",
    "lon":-73.7479623,
    "lat":42.6543929
  },
  {
    "id":1450220006,
    "name":"S.R.A.C. Susquehanna River Archaeological Center",
    "lon":-76.5395118,
    "lat":42.0012192
  },
  {
    "id":1498880937,
    "name":"Heritage Discovery Center",
    "lon":-78.8397469,
    "lat":42.8662829
  },
  {
    "id":1506527734,
    "name":"Johnson Hall",
    "lon":-74.3832697,
    "lat":43.0162475
  },
  {
    "id":1508323628,
    "name":"Black River Canal Museum",
    "lon":-75.3272026,
    "lat":43.4808387
  },
  {
    "id":1549441335,
    "name":"Dyckman Farmhouse Museum",
    "lon":-73.9228859,
    "lat":40.8673822
  },
  {
    "id":1557217631,
    "name":"Seneca Iroquois National Museum",
    "lon":-78.74625,
    "lat":42.159392
  },
  {
    "id":1558819017,
    "name":"Grant Cottage State Historic Site",
    "lon":-73.7453512,
    "lat":43.2012502
  },
  {
    "id":1562109693,
    "name":"Kent Rockwell Gallery",
    "lon":-73.4676531,
    "lat":44.6939383
  },
  {
    "id":1562109696,
    "name":"Nina Winkel Sculpture Gallery",
    "lon":-73.4655288,
    "lat":44.6933396
  },
  {
    "id":1574231146,
    "name":"Fireman's Association of the State of New York Museum of Firefighting",
    "lon":-73.7793156,
    "lat":42.2564868
  },
  {
    "id":1598430306,
    "name":"American Baseball Wax Museum",
    "lon":-74.9250877,
    "lat":42.7003902
  },
  {
    "id":1608122242,
    "name":"Fenimore Art Museum",
    "lon":-74.9269664,
    "lat":42.7157064
  },
  {
    "id":1676946837,
    "name":"Johnson Museum of Art",
    "lon":-76.4863094,
    "lat":42.4506769
  },
  {
    "id":1689971620,
    "name":"Everson Museum of Art",
    "lon":-76.1468413,
    "lat":43.0446854
  },
  {
    "id":1693299134,
    "name":"Museum of American Finance",
    "lon":-74.0091958,
    "lat":40.7063713
  },
  {
    "id":1741679484,
    "name":"Champlain Valley Transportation Museum",
    "lon":-73.445042,
    "lat":44.6831791
  },
  {
    "id":1749951339,
    "name":"Forwarders Museum",
    "lon":-75.5144245,
    "lat":44.7091721
  },
  {
    "id":1750010266,
    "name":"Historic Society",
    "lon":-75.5245576,
    "lat":44.7111523
  },
  {
    "id":1750426122,
    "name":"Genesee Country Village & Museum",
    "lon":-77.8842367,
    "lat":42.9950757
  },
  {
    "id":1810241472,
    "name":"Rubin Museum of Art",
    "lon":-73.9977377,
    "lat":40.7400959
  },
  {
    "id":1885413710,
    "name":"Wax Museum",
    "lon":-79.064542,
    "lat":43.086275
  },
  {
    "id":1885421037,
    "name":"Orin Lehman Visitor Center",
    "lon":-79.066526,
    "lat":43.0866434
  },
  {
    "id":1917240901,
    "name":"Onondaga Historical Association Museum & Research Center",
    "lon":-76.1491511,
    "lat":43.0478818
  },
  {
    "id":1920104061,
    "name":"Historical Museum",
    "lon":-77.5900034,
    "lat":42.9530664
  },
  {
    "id":2021125432,
    "name":"New York State Museum of Transportation",
    "lon":-77.7100709,
    "lat":43.016381
  },
  {
    "id":2185003533,
    "name":"Ryan Visitor Center",
    "lon":-73.8965225,
    "lat":40.5881506
  },
  {
    "id":2265796247,
    "name":"Columbia County Historical Society",
    "lon":-73.6988164,
    "lat":42.3958047
  },
  {
    "id":2305180821,
    "name":"Trailside nature museum",
    "lon":-73.588969,
    "lat":41.25741
  },
  {
    "id":2347820873,
    "name":"Red Hill Observer's Cabin & Museum",
    "lon":-74.5174445,
    "lat":41.9239131
  },
  {
    "id":2354317841,
    "name":"Tonawanda Historical Society",
    "lon":-78.8785612,
    "lat":43.017045
  },
  {
    "id":2406688997,
    "name":"First Universalist Church",
    "lon":-78.1911052,
    "lat":43.2870916
  },
  {
    "id":2408092784,
    "name":"Storm King Arts Center",
    "lon":-74.059269,
    "lat":41.4250316
  },
  {
    "id":2420873472,
    "name":"Shushan Covered Bridge Museum",
    "lon":-73.3452586,
    "lat":43.0912938
  },
  {
    "id":2505218265,
    "name":"Granger Homestead and Carriage Museum",
    "lon":-77.2868279,
    "lat":42.897646
  },
  {
    "id":2512503652,
    "name":"Lighthouse Museum",
    "lon":-76.9860474,
    "lat":43.2738221
  },
  {
    "id":2605527970,
    "name":"The Waterfront Museum",
    "lon":-74.018337,
    "lat":40.6752289
  },
  {
    "id":2610495442,
    "name":"Rochester Medical Museum and Archives",
    "lon":-77.5611604,
    "lat":43.1516831
  },
  {
    "id":2610499670,
    "name":"Stone Tolan House",
    "lon":-77.5421512,
    "lat":43.1398716
  },
  {
    "id":2611640871,
    "name":"The Yankees Museum",
    "lon":-73.9258934,
    "lat":40.8285709
  },
  {
    "id":2656330262,
    "name":"Hudson Highlands Nature Museum - Wildlife Education Center",
    "lon":-74.0162922,
    "lat":41.4370415
  },
  {
    "id":2676905371,
    "name":"Madame Tussaud's",
    "lon":-73.9882558,
    "lat":40.7563708
  },
  {
    "id":2717293825,
    "name":"Discovery Times Square",
    "lon":-73.9872654,
    "lat":40.7577432
  },
  {
    "id":2745527607,
    "name":"American Museum of Natural History",
    "lon":-73.9741191,
    "lat":40.7812956
  },
  {
    "id":2772116293,
    "name":"Glenn H Curtiss Museum",
    "lon":-77.2328886,
    "lat":42.3987574
  },
  {
    "id":2808241058,
    "name":"Skyscraper Museum",
    "lon":-74.0177051,
    "lat":40.7057229
  },
  {
    "id":2875398530,
    "name":"Harness Racing Museum",
    "lon":-74.3191238,
    "lat":41.4038869
  },
  {
    "id":2875415404,
    "name":"Motorcyclopedia Motorcycle Museum",
    "lon":-74.0322361,
    "lat":41.4938421
  },
  {
    "id":2875416233,
    "name":"Dia:Beacon",
    "lon":-73.9827547,
    "lat":41.5008452
  },
  {
    "id":2898706753,
    "name":"South Street Seaport Museum",
    "lon":-74.0036758,
    "lat":40.706628
  },
  {
    "id":154628819,
    "name":"Toy Town Museum",
    "lon":-78.6127146,
    "lat":42.7726166
  },
  {
    "id":256127866,
    "name":"Buffalo and Erie County Historical Museum",
    "lon":-78.8761912,
    "lat":42.9353485
  },
  {
    "id":256133001,
    "name":"Albright-Knox Art Museum",
    "lon":-78.8756419,
    "lat":42.9324013
  },
  {
    "id":270109894,
    "name":"Rochester Museum and Science Center",
    "lon":-77.5873915,
    "lat":43.1526447
  },
  {
    "id":277496679,
    "name":"Corning Museum of Glass",
    "lon":-77.0541158,
    "lat":42.1498229
  },
  {
    "id":300501078,
    "name":"Amherst Museum",
    "lon":-78.7283964,
    "lat":43.0839719
  },
  {
    "id":357557770,
    "name":"Memorial Art Gallery of the University of Rochester",
    "lon":-77.5879927,
    "lat":43.1577218
  },
  {
    "id":357601647,
    "name":"School Number 5 (historical)",
    "lon":-77.0661151,
    "lat":43.0210366
  },
  {
    "id":368045507,
    "name":"Frick Collection",
    "lon":-73.9673607,
    "lat":40.7712125
  },
  {
    "id":368057056,
    "name":"Jefferson County Historical Society",
    "lon":-75.9113889,
    "lat":43.9733333
  }
];