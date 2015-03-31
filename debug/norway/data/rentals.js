// Copy (
//     SELECT osm_id, tags->'network', tags->'capacity', tags->'description', ST_X(ST_Transform(way, 4326)) as lat, ST_Y(ST_Transform(way, 4326)) as lng FROM osm_norway_point WHERE amenity = 'bicycle_rental'
//     ) To '/Users/gerb/Development/workspaces/mi/motion_intelligence.r360_js.git/debug/norway/data/rental.csv' With CSV;

var rentals = [
  {
    "id":1,
    "network":"",
    "capacity":"12",
    "description":"Fylkeshuset",
    "lng":10.1887,
    "lat":59.7482
  },
  {
    "id":2,
    "network":"",
    "capacity":"15",
    "description":"Sykehuset",
    "lng":10.1995,
    "lat":59.7483
  },
  {
    "id":3,
    "network":"",
    "capacity":"24",
    "description":"Bragernes Torg Øvre",
    "lng":10.2046,
    "lat":59.7446
  },
  {
    "id":4,
    "network":"",
    "capacity":"18",
    "description":"Bragernes Torg Midtre",
    "lng":10.2054,
    "lat":59.7439
  },
  {
    "id":5,
    "network":"",
    "capacity":"9",
    "description":"Bragernes Torg Nedre",
    "lng":10.2046,
    "lat":59.7433
  },
  {
    "id":6,
    "network":"",
    "capacity":"18",
    "description":"Losjeplassen",
    "lng":10.2139,
    "lat":59.7425
  },
  {
    "id":7,
    "network":"",
    "capacity":"12",
    "description":"Fayeparken",
    "lng":10.2277,
    "lat":59.7437
  },
  {
    "id":8,
    "network":"",
    "capacity":"18",
    "description":"Sundland NSB kompetanssesenter",
    "lng":10.1814,
    "lat":59.741
  },
  {
    "id":9,
    "network":"",
    "capacity":"24",
    "description":"Grønland - Papirbredden",
    "lng":10.1932,
    "lat":59.7443
  },
  {
    "id":10,
    "network":"",
    "capacity":"21",
    "description":"Strømsø Torg ved Bussstasjonen",
    "lng":10.1999,
    "lat":59.7405
  },
  {
    "id":11,
    "network":"",
    "capacity":"24",
    "description":"Strømsø Torg ved Jernbanestasjonen",
    "lng":10.2042,
    "lat":59.7398
  },
  {
    "id":12,
    "network":"",
    "capacity":"21",
    "description":"Marienlyst ved Drammensbadet",
    "lng":10.2005,
    "lat":59.7369
  },
  {
    "id":13,
    "network":"",
    "capacity":"18",
    "description":"Gyldenløves plass",
    "lng":10.2112,
    "lat":59.7369
  },
  {
    "id":14,
    "network":"",
    "capacity":"24",
    "description":"Bangeløkka ekspressbussholdeplass",
    "lng":10.2141,
    "lat":59.7312
  },
  {
    "id":15,
    "network":"",
    "capacity":"18",
    "description":"Rundtom",
    "lng":10.2248,
    "lat":59.73
  },
  {
    "id":16,
    "network":"",
    "capacity":"9",
    "description":"Bragernes Torg Nedre 2",
    "lng":10.2046,
    "lat":59.7433
  },
  {
    "id":17,
    "network":"",
    "capacity":"15",
    "description":"Prinsen Kinosenter, Prinsensgt.",
    "lng":10.393,
    "lat":63.4266
  },
  {
    "id":18,
    "network":"",
    "capacity":"15",
    "description":"Samfundet",
    "lng":10.3941,
    "lat":63.4218
  },
  {
    "id":19,
    "network":"",
    "capacity":"15",
    "description":"Leuthenhaven, Repslagerveita",
    "lng":10.3916,
    "lat":63.4299
  },
  {
    "id":20,
    "network":"",
    "capacity":"12",
    "description":"Kongensgate, Nordre Gate",
    "lng":10.398,
    "lat":63.4305
  },
  {
    "id":21,
    "network":"",
    "capacity":"15",
    "description":"Solsiden, vis-a-vis Beddingen 14",
    "lng":10.4095,
    "lat":63.4351
  },
  {
    "id":22,
    "network":"",
    "capacity":"15",
    "description":"Bakke bro, v/Bakke P-Hus",
    "lng":10.4073,
    "lat":63.4322
  },
  {
    "id":23,
    "network":"",
    "capacity":"15",
    "description":"Øvre Bakklandet (Gamle bybro)",
    "lng":10.4029,
    "lat":63.4279
  },
  {
    "id":24,
    "network":"",
    "capacity":"15",
    "description":"Fjordgata / krysset Jomfrugatealmenningen",
    "lng":10.3955,
    "lat":63.4344
  },
  {
    "id":25,
    "network":"",
    "capacity":"12",
    "description":"Ilaparken",
    "lng":10.369,
    "lat":63.4293
  },
  {
    "id":26,
    "network":"",
    "capacity":"18",
    "description":"Trondheim Sentralstasjon",
    "lng":10.3996,
    "lat":63.436
  },
  {
    "id":27,
    "network":"",
    "capacity":"12",
    "description":"St. Olavs Hospital",
    "lng":10.3921,
    "lat":63.4201
  },
  {
    "id":28,
    "network":"",
    "capacity":"18",
    "description":"Høyskoleringen, Gløshaugen",
    "lng":10.4075,
    "lat":63.4166
  },
  {
    "id":29,
    "network":"",
    "capacity":"15",
    "description":"Tollboden ",
    "lng":10.405,
    "lat":63.4395
  },
  {
    "id":30,
    "network":"",
    "capacity":"15",
    "description":"Kirkegata",
    "lng":10.4124,
    "lat":63.4328
  },
  {
    "id":31,
    "network":"",
    "capacity":"15",
    "description":"Cicignonsplass",
    "lng":10.4004,
    "lat":63.4318
  },
  {
    "id":32,
    "network":"",
    "capacity":"12",
    "description":"Lille Skansen",
    "lng":10.3748,
    "lat":63.4304
  },
  {
    "id":33,
    "network":"",
    "capacity":"12",
    "description":"Vollabakken",
    "lng":10.3993,
    "lat":63.4219
  },
  {
    "id":34,
    "network":"",
    "capacity":"15",
    "description":"Teknoparken",
    "lng":10.3961,
    "lat":63.4162
  },
  {
    "id":35,
    "network":"",
    "capacity":"12",
    "description":"Lademoparken",
    "lng":10.4263,
    "lat":63.4368
  },
  {
    "id":36,
    "network":"",
    "capacity":"12",
    "description":"Rica Nidelv",
    "lng":10.4059,
    "lat":63.4353
  },
  {
    "id":576566238,
    "network":"Bysykkel",
    "capacity":"",
    "description":"",
    "lng":10.3929523985533,
    "lat":63.4266564948505
  },
  {
    "id":247022808,
    "network":"Bysykkel",
    "capacity":"",
    "description":"",
    "lng":10.3941790985531,
    "lat":63.4225161948503
  },
  {
    "id":420189879,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"66-Karenslyst alle (v/Bang&Olufsen)",
    "lng":10.6842474985128,
    "lat":59.9202280947467
  },
  {
    "id":408455943,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"33-Bygdøy v/Folkemuseet",
    "lng":10.6868352985124,
    "lat":59.9076591947465
  },
  {
    "id":1319550193,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"73-Bygdøy alle (vis-a-vis Ingegjerdsvei)",
    "lng":10.6928944985115,
    "lat":59.9191722947467
  },
  {
    "id":1319550194,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"72-Bygdøy alle (v/Kristinelundsvei)",
    "lng":10.6975899985109,
    "lat":59.9194199947466
  },
  {
    "id":1319550191,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"55-Bygdøy alle 45, vis a vis Gimle Kino",
    "lng":10.7082151985094,
    "lat":59.9172685947466
  },
  {
    "id":1319550167,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"41-Frognerstranda v/Kongen",
    "lng":10.7084726985094,
    "lat":59.9102659947465
  },
  {
    "id":477367982,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"02-Middelthunsgate 28 (utenfor Frognerbadet)",
    "lng":10.7086494985093,
    "lat":59.9281276947468
  },
  {
    "id":1319550195,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"49-Frognerveien 35 A /Amtmann Furus plass",
    "lng":10.7088374985093,
    "lat":59.9195271947467
  },
  {
    "id":1319550207,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"01-Middelthunsgate (vis-a-vis nr. 21, retning Kirkeveien)",
    "lng":10.7090091985093,
    "lat":59.9278612947468
  },
  {
    "id":477368007,
    "network":"Bysykkel",
    "capacity":"16",
    "description":"48-Frogner stadion v/tenninsbanene",
    "lng":10.7098595985091,
    "lat":59.9261866947468
  },
  {
    "id":1319550174,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"39-Munkedamsvn.100, Skillebekk (Niels Juelsgt/Drm.veien)",
    "lng":10.7100999985092,
    "lat":59.9127099947466
  },
  {
    "id":417840795,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"70-Colosseum / Fridtjof Nansensvei",
    "lng":10.711489998509,
    "lat":59.9298088947469
  },
  {
    "id":946194894,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"12-Amaldus Nielsenspl.(Vestkanttorget-Neuberggt.)",
    "lng":10.7131902985087,
    "lat":59.9244742947468
  },
  {
    "id":938210077,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"71-Slemdalsveien 1-3",
    "lng":10.7144715985085,
    "lat":59.9307413947469
  },
  {
    "id":1319550183,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"61-Bygdøy alle 2",
    "lng":10.7152699985084,
    "lat":59.9151399947466
  },
  {
    "id":425190359,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"94-Drammensveien 33",
    "lng":10.7154371985084,
    "lat":59.9141138947466
  },
  {
    "id":1319550206,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"90-Mariesgt. v/Majorstuveien",
    "lng":10.7162713985082,
    "lat":59.9266410947468
  },
  {
    "id":938210078,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"13-Majorstua",
    "lng":10.7169110985082,
    "lat":59.9290919947468
  },
  {
    "id":741137543,
    "network":"Bysykkel",
    "capacity":"unknown",
    "description":"54-Uranienborg skole (Briskeby)",
    "lng":10.7177931985081,
    "lat":59.9202652947467
  },
  {
    "id":729643187,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"47-Valkyrieplass (mellom Narvesen-gatekjøkken)",
    "lng":10.718333198508,
    "lat":59.9281179947468
  },
  {
    "id":729643181,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"67-Holtegt. 20 (krysset Uranienborgvn)",
    "lng":10.7209518985076,
    "lat":59.9224828947467
  },
  {
    "id":1319550214,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"91-Suhmsgt. v/Shell - Marienlyst",
    "lng":10.7217107985075,
    "lat":59.9324078947469
  },
  {
    "id":1319550182,
    "network":"Bysykkel",
    "capacity":"11",
    "description":"32-Parkveien/Drammensveien (v.Am.ambassade)",
    "lng":10.7222350985075,
    "lat":59.9150669947466
  },
  {
    "id":1319550173,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"11-Ruseløkkvn.(krysset C.Adelersgt.-Vikatorget)",
    "lng":10.725059998507,
    "lat":59.9126599947465
  },
  {
    "id":1319550171,
    "network":"Bysykkel",
    "capacity":"14",
    "description":"98-Ruseløkkveien (Cort Adelersgt.)",
    "lng":10.725316998507,
    "lat":59.9124174947465
  },
  {
    "id":1319550177,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"59-Dr. Maudsgt. 11-15",
    "lng":10.7269262985068,
    "lat":59.9134070947465
  },
  {
    "id":1319550218,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"92-Blindernveien 5",
    "lng":10.7269299985068,
    "lat":59.9352799947469
  },
  {
    "id":499967107,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"97-Dokkveien (v/Taxi Aker Brygge)",
    "lng":10.7280372985067,
    "lat":59.9109848947465
  },
  {
    "id":433579242,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"08-Vestbanen Sør (v/Aker Brygge)",
    "lng":10.7299859985063,
    "lat":59.9111665947465
  },
  {
    "id":433579243,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"07-Vestbanen Nord (nærmest Rådhuset)",
    "lng":10.7300631985063,
    "lat":59.9111859947465
  },
  {
    "id":499966171,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"83-Parkveien 13",
    "lng":10.7302051985063,
    "lat":59.9216342947467
  },
  {
    "id":1319550219,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"93-Sognsveien v/Ullevålsalléen",
    "lng":10.7305955985063,
    "lat":59.937870094747
  },
  {
    "id":573250018,
    "network":"Bysykkel",
    "capacity":"24",
    "description":"21-Bislet Stadion (mot Rundkjøring i Pilestredet)",
    "lng":10.7312935985062,
    "lat":59.9255165947467
  },
  {
    "id":433579881,
    "network":"Bysykkel",
    "capacity":"6",
    "description":"14-Olav V's gt (ved rundkjøringen)",
    "lng":10.7323494985061,
    "lat":59.9126857947465
  },
  {
    "id":433579882,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"89-Olav V's gt. vis-a-vis Saga Kino",
    "lng":10.732882998506,
    "lat":59.9139660947465
  },
  {
    "id":1319550212,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"29-Theresesgt.15-17/Stensgt.",
    "lng":10.732912998506,
    "lat":59.9303448947468
  },
  {
    "id":1319550197,
    "network":"Bysykkel",
    "capacity":"6",
    "description":"77-Pilestredet 46",
    "lng":10.7333910985059,
    "lat":59.9208428947467
  },
  {
    "id":1319550216,
    "network":"Bysykkel",
    "capacity":"6",
    "description":"28-Adamstuen (Krysset Theresesgt/Ullevålsvn.)",
    "lng":10.7344150985058,
    "lat":59.9326133947469
  },
  {
    "id":1319550196,
    "network":"Bysykkel",
    "capacity":"14",
    "description":"53-Pilestredet 36-38 (v/Høyskolen/Frydenlund)",
    "lng":10.7350587985056,
    "lat":59.9203768947467
  },
  {
    "id":1319550213,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"58-Brageveien 1 ( Ligger langs Ullevålsveien)",
    "lng":10.7358526985056,
    "lat":59.9307426947469
  },
  {
    "id":496106541,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"99-Rådhusgt.27/Kontraskjæret",
    "lng":10.7359094985056,
    "lat":59.9110131947465
  },
  {
    "id":433580378,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"06-Stortingsgt.(Spikersuppa-Studenterlunden)",
    "lng":10.7360157985056,
    "lat":59.9137872947466
  },
  {
    "id":433580379,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"100-Stortingsgt. (vis-a-vis Filmteatret)",
    "lng":10.7360361985055,
    "lat":59.9137856947466
  },
  {
    "id":1319550192,
    "network":"Bysykkel",
    "capacity":"23",
    "description":"17-Pilestredet 33 (litt nord for Blitz)",
    "lng":10.7361203985055,
    "lat":59.9190946947467
  },
  {
    "id":496106542,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"",
    "lng":10.7362599985055,
    "lat":59.9109319947465
  },
  {
    "id":977584929,
    "network":"Bysykkel",
    "capacity":"11",
    "description":"65-Ullevålsveien/Collettsgate (St.Hanshaugen vest)",
    "lng":10.7386509985051,
    "lat":59.9272142947468
  },
  {
    "id":1319550199,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"04-Hallingsgate 2 (v. St.Haugen Fargehandel)",
    "lng":10.7386599985052,
    "lat":59.9226799947467
  },
  {
    "id":496105874,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"18-Christiania Torv",
    "lng":10.7387499985051,
    "lat":59.9102199947465
  },
  {
    "id":803670482,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"16-Knud Knudsens plass (sør for St.Hanshaugen)",
    "lng":10.739912098505,
    "lat":59.9247520947467
  },
  {
    "id":1319550202,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"81-Wdm. Thranesgt. 16 A",
    "lng":10.7404477985049,
    "lat":59.9236589947467
  },
  {
    "id":433579075,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"57-Vippetangen/Akershusstranda",
    "lng":10.7405120985049,
    "lat":59.9039310947463
  },
  {
    "id":433579076,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"95-Akershusstranda/Vippetangen nr. 2",
    "lng":10.7407101985048,
    "lat":59.9039470947464
  },
  {
    "id":1319550181,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"74-Prof.Aschehougs plass",
    "lng":10.7408699985049,
    "lat":59.9147799947466
  },
  {
    "id":803676550,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"26-C.J.Hambros plass (Tinghuset)",
    "lng":10.7409071985049,
    "lat":59.9156088947466
  },
  {
    "id":433579077,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"96-Akershusstranda/Vippetangen nr. 1",
    "lng":10.7409506985049,
    "lat":59.9039781947463
  },
  {
    "id":1319550215,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"69-Geitmyrsveien (krysset Gen.Birchsgt.)",
    "lng":10.7415174985048,
    "lat":59.9324090947469
  },
  {
    "id":829617324,
    "network":"Bysykkel",
    "capacity":"21",
    "description":"15-Bankplassen/Kirkegt,",
    "lng":10.7416754985047,
    "lat":59.9083557947464
  },
  {
    "id":3187193091,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"05-Egertorget (Ø.Slottsgt.)",
    "lng":10.7420011985047,
    "lat":59.9126167947465
  },
  {
    "id":1319550211,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"45-Geitmyrsveien (krysset Collettsgt.) - Lovisenberg",
    "lng":10.7434999985045,
    "lat":59.9297999947468
  },
  {
    "id":803675073,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"38-Ullevålsveien 9 v/Vår Frues hospital,ovenf Barnevognhuset",
    "lng":10.7437972985044,
    "lat":59.9194601947466
  },
  {
    "id":1319550168,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"03-Prinsensgt. (Kirkegt.)",
    "lng":10.7441353985044,
    "lat":59.9112448947465
  },
  {
    "id":1319550166,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"76-Skippergaten vis-a-vis nr. 3 (Cafe Grei, Dagens Næringsl)",
    "lng":10.7457758985042,
    "lat":59.9084692947465
  },
  {
    "id":450873162,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"09-Kirkeristen Vest (mot Glassmagasinet)",
    "lng":10.746715498504,
    "lat":59.9130350947465
  },
  {
    "id":496107674,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"10-Kirkeristen Øst (mot Storgt.)",
    "lng":10.7467830985041,
    "lat":59.9130359947465
  },
  {
    "id":1319550217,
    "network":"Bysykkel",
    "capacity":"14",
    "description":"75-Uelandsgt. v/Arkitekt Rivertz' plass",
    "lng":10.7490899985037,
    "lat":59.934909994747
  },
  {
    "id":1319550190,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"80-Møllergt. 39",
    "lng":10.7491399985037,
    "lat":59.9165699947466
  },
  {
    "id":1319550170,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"22-Europarådets plass",
    "lng":10.7497099985037,
    "lat":59.9120599947465
  },
  {
    "id":1319550176,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"64-Skippergt./Storgt.",
    "lng":10.7499099985036,
    "lat":59.9132699947465
  },
  {
    "id":1319550198,
    "network":"Bysykkel",
    "capacity":"14",
    "description":"88-Fredensborgveien v/62-64",
    "lng":10.7500576985036,
    "lat":59.9209360947467
  },
  {
    "id":1319550204,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"63-Maridalsveien 31",
    "lng":10.7503580985035,
    "lat":59.9256139947468
  },
  {
    "id":1319550175,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"34-Oslo City (Stenersgt. 2)",
    "lng":10.7511305985034,
    "lat":59.9129445947465
  },
  {
    "id":1319550208,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"62-Alexander Kiellands plass",
    "lng":10.7513079985034,
    "lat":59.9280639947468
  },
  {
    "id":1319550184,
    "network":"Bysykkel",
    "capacity":"11",
    "description":"24-Arb.samfunnets plass (v/Sentrum Scene)",
    "lng":10.7513299985034,
    "lat":59.9154199947465
  },
  {
    "id":1319550188,
    "network":"Bysykkel",
    "capacity":"16",
    "description":"102-Arb.samfunnets plass (mot Torggt)",
    "lng":10.7516455985034,
    "lat":59.9159778947466
  },
  {
    "id":408457760,
    "network":"Bysykkel",
    "capacity":"30",
    "description":"50-Havnegata N (Østbanehallen)",
    "lng":10.7517601985034,
    "lat":59.9101619947465
  },
  {
    "id":1319550180,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"25-Storgt. 27 (enden av Youngsgt./skrått ovenf. Gunerius)",
    "lng":10.7517699985034,
    "lat":59.9142099947465
  },
  {
    "id":408457759,
    "network":"Bysykkel",
    "capacity":"30",
    "description":"51-Havnegata S (Østbanehallen) v/Hotell Opera",
    "lng":10.7521007985033,
    "lat":59.9100889947465
  },
  {
    "id":1319550172,
    "network":"Bysykkel",
    "capacity":"1",
    "description":"19-Oslo Plaza",
    "lng":10.754259998503,
    "lat":59.9124199947465
  },
  {
    "id":615209013,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"31-Torggt./Jacobs kirke (Ankertorget)",
    "lng":10.754618598503,
    "lat":59.9178335947466
  },
  {
    "id":1319550178,
    "network":"Bysykkel",
    "capacity":"21",
    "description":"23-Brugata Sør (Vaterland nærmest Oslo Plaza)",
    "lng":10.7571815985026,
    "lat":59.9134823947466
  },
  {
    "id":1319550179,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"20-Brugata Nord (ved Cafeen)",
    "lng":10.7574711985025,
    "lat":59.9136221947466
  },
  {
    "id":451009895,
    "network":"Bysykkel",
    "capacity":"11",
    "description":"68-Storgt. 40 (utenfor Legevakten)",
    "lng":10.7582608985025,
    "lat":59.9169063947466
  },
  {
    "id":1319550205,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"60-Birkelunden",
    "lng":10.7607006985021,
    "lat":59.9256676947468
  },
  {
    "id":729649795,
    "network":"Bysykkel",
    "capacity":"6",
    "description":"35-Schous plass - 1",
    "lng":10.7608123985021,
    "lat":59.9203175947466
  },
  {
    "id":615208998,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"36-Schous plass - 2",
    "lng":10.7608760985021,
    "lat":59.9203456947467
  },
  {
    "id":729650507,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"44-Sofienberggt.(krysset Toftesgt.) - Sofienbergparken",
    "lng":10.761573098502,
    "lat":59.9223392947467
  },
  {
    "id":450536322,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"37-Johan Sverdrups plass - Vogts gate (øvreTorshov)",
    "lng":10.7621259985019,
    "lat":59.9314773947468
  },
  {
    "id":1319550185,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"108-Nylandsveien v/krysset Urtegt./Vahlsgt- stativ 2",
    "lng":10.7625030985019,
    "lat":59.9156444947466
  },
  {
    "id":1319550187,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"107-Nylandsveien v/krysset Urtegt./Vahlsgt-stativ 1",
    "lng":10.7627820985018,
    "lat":59.9157197947466
  },
  {
    "id":451010273,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"52-Helga Helgesens plass 2.(Gr.Landsleir./Åkebergv/Politi)",
    "lng":10.7661987985013,
    "lat":59.9121085947465
  },
  {
    "id":1319550210,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"78-Dælenenggt. 41",
    "lng":10.7668799985012,
    "lat":59.9289499947469
  },
  {
    "id":1319550200,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"87-Helgesensgt. vis-a-vis nr. 58",
    "lng":10.7671199985012,
    "lat":59.9230399947467
  },
  {
    "id":1319550164,
    "network":"Bysykkel",
    "capacity":"14",
    "description":"82-Oslogate 37",
    "lng":10.7671499985012,
    "lat":59.9034599947463
  },
  {
    "id":1319550165,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"30-Oslogt. (Gamlebyen under Jernbanebro)",
    "lng":10.7675671985011,
    "lat":59.9078883947464
  },
  {
    "id":1319550209,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"79-Fagerheimgt. 11",
    "lng":10.7677399985011,
    "lat":59.9288699947468
  },
  {
    "id":1319550189,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"43-Jens Bjelkesgt.(motsatt side nr.39)",
    "lng":10.769049998501,
    "lat":59.9159899947466
  },
  {
    "id":1319550201,
    "network":"Bysykkel",
    "capacity":"10",
    "description":"46-Trondheimsveien 64 (v.Sofienberg holdeplass og Kiwi)",
    "lng":10.7716099985006,
    "lat":59.9231899947467
  },
  {
    "id":448599738,
    "network":"Bysykkel",
    "capacity":"11",
    "description":"42-Tøyen T-bane -inng.Hagegt.",
    "lng":10.7743732985002,
    "lat":59.9146079947466
  },
  {
    "id":1319550203,
    "network":"Bysykkel",
    "capacity":"8",
    "description":"40-Carl Berners (krysset Finnmarksgt./Frydensgt)",
    "lng":10.7759355985,
    "lat":59.9250467947468
  },
  {
    "id":1319550169,
    "network":"Bysykkel",
    "capacity":"21",
    "description":"84-Jens Bjelkesgt./Sverresgt. (Tøyen)",
    "lng":10.7760373985,
    "lat":59.9115321947465
  },
  {
    "id":1319550186,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"85-Økernveien v/Caltexløkka",
    "lng":10.7772230984998,
    "lat":59.9156874947466
  },
  {
    "id":1319550163,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"86-Dyvekesvei/Konowsgt.",
    "lng":10.7780499984997,
    "lat":59.9034317947464
  }
];