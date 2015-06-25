// Copy (
//     SELECT osm_id, tags->'network', tags->'capacity', tags->'description', ST_X(ST_Transform(way, 4326)) as lat, ST_Y(ST_Transform(way, 4326)) as lng FROM osm_norway_point WHERE amenity = 'bicycle_rental'
//     ) To '/Users/gerb/Development/workspaces/mi/motion_intelligence.r360_js.git/debug/norway/data/rental.csv' With CSV;

var rentals = [
  {
    "id":420189879,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"66-Karenslyst alle (v/Bang&Olufsen)",
    "lng":10.6842474891366,
    "lat":59.9202281012909
  },
  {
    "id":408455943,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"33-Bygdøy v/Folkemuseet",
    "lng":10.6868352659756,
    "lat":59.907659198442
  },
  {
    "id":1319550193,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"73-Bygdøy alle (vis-a-vis Ingegjerdsvei)",
    "lng":10.6928944923985,
    "lat":59.9191722708708
  },
  {
    "id":1319550194,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"72-Bygdøy alle (v/Kristinelundsvei)",
    "lng":10.6975899863886,
    "lat":59.9194200000691
  },
  {
    "id":1319550191,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"55-Bygdøy alle 45, vis a vis Gimle Kino",
    "lng":10.7082151697376,
    "lat":59.9172685845289
  },
  {
    "id":1319550167,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"41-Frognerstranda v/Kongen",
    "lng":10.7084727167296,
    "lat":59.9102659841067
  },
  {
    "id":477367982,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"02-Middelthunsgate 28 (utenfor Frognerbadet)",
    "lng":10.7086495051775,
    "lat":59.928127708456
  },
  {
    "id":1319550195,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"49-Frognerveien 35 A /Amtmann Furus plass",
    "lng":10.7088375225665,
    "lat":59.9195272047341
  },
  {
    "id":1319550207,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"01-Middelthunsgate (vis-a-vis nr. 21, retning Kirkeveien)",
    "lng":10.7090091906173,
    "lat":59.9278612735613
  },
  {
    "id":477368007,
    "network":"Bysykkel",
    "capacity":"16",
    "description":"48-Frogner stadion v/tenninsbanene",
    "lng":10.7098596256967,
    "lat":59.9261866774357
  },
  {
    "id":1319550174,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"39-Munkedamsvn.100, Skillebekk (Niels Juelsgt/Drm.veien)",
    "lng":10.7101000148668,
    "lat":59.9127099919166
  },
  {
    "id":417840795,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"70-Colosseum / Fridtjof Nansensvei",
    "lng":10.7114899781059,
    "lat":59.9298088682447
  },
  {
    "id":946194894,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"12-Amaldus Nielsenspl.(Vestkanttorget-Neuberggt.)",
    "lng":10.7131903092757,
    "lat":59.924474271492
  },
  {
    "id":938210077,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"71-Slemdalsveien 1-3",
    "lng":10.7144715763654,
    "lat":59.9307413937857
  },
  {
    "id":1319550183,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"61-Bygdøy alle 2",
    "lng":10.7152699989899,
    "lat":59.9151399953093
  },
  {
    "id":425190359,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"94-Drammensveien 33",
    "lng":10.7154371754643,
    "lat":59.914113904495
  },
  {
    "id":1319550206,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"90-Mariesgt. v/Majorstuveien",
    "lng":10.7162713510371,
    "lat":59.9266411103475
  },
  {
    "id":938210078,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"13-Majorstua",
    "lng":10.7169111311825,
    "lat":59.9290919697248
  },
  {
    "id":741137543,
    "network":"Bysykkel",
    "capacity":"unknown",
    "description":"54-Uranienborg skole (Briskeby)",
    "lng":10.71779318696,
    "lat":59.9202652911231
  },
  {
    "id":729643187,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"47-Valkyrieplass (mellom Narvesen-gatekjøkken)",
    "lng":10.7183331642772,
    "lat":59.9281179855781
  },
  {
    "id":729643181,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"67-Holtegt. 20 (krysset Uranienborgvn)",
    "lng":10.7209519329935,
    "lat":59.9224828733939
  },
  {
    "id":1319550214,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"91-Suhmsgt. v/Shell - Marienlyst",
    "lng":10.7217108297455,
    "lat":59.9324078837018
  },
  {
    "id":1319550182,
    "network":"Bysykkel",
    "capacity":"11",
    "description":"32-Parkveien/Drammensveien (v.Am.ambassade)",
    "lng":10.7222350865453,
    "lat":59.9150670000785
  },
  {
    "id":1319550173,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"11-Ruseløkkvn.(krysset C.Adelersgt.-Vikatorget)",
    "lng":10.7250600186193,
    "lat":59.9126600038785
  },
  {
    "id":1319550171,
    "network":"Bysykkel",
    "capacity":"14",
    "description":"98-Ruseløkkveien (Cort Adelersgt.)",
    "lng":10.7253170266221,
    "lat":59.9124174932738
  },
  {
    "id":1319550177,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"59-Dr. Maudsgt. 11-15",
    "lng":10.7269262686221,
    "lat":59.9134070695162
  },
  {
    "id":1319550218,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"92-Blindernveien 5",
    "lng":10.7269299517147,
    "lat":59.9352800035951
  },
  {
    "id":499967107,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"97-Dokkveien (v/Taxi Aker Brygge)",
    "lng":10.7280373049655,
    "lat":59.9109849107362
  },
  {
    "id":433579242,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"08-Vestbanen Sør (v/Aker Brygge)",
    "lng":10.7299860203113,
    "lat":59.9111665877823
  },
  {
    "id":433579243,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"07-Vestbanen Nord (nærmest Rådhuset)",
    "lng":10.7300631855942,
    "lat":59.9111859984342
  },
  {
    "id":499966171,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"83-Parkveien 13",
    "lng":10.7302052092406,
    "lat":59.9216343071876
  },
  {
    "id":1319550219,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"93-Sognsveien v/Ullevålsalléen",
    "lng":10.7305956170631,
    "lat":59.9378700853736
  },
  {
    "id":573250018,
    "network":"Bysykkel",
    "capacity":"24",
    "description":"21-Bislet Stadion (mot Rundkjøring i Pilestredet)",
    "lng":10.7312936080389,
    "lat":59.9255166082408
  },
  {
    "id":433579881,
    "network":"Bysykkel",
    "capacity":"6",
    "description":"14-Olav V's gt (ved rundkjøringen)",
    "lng":10.7323494878238,
    "lat":59.9126858085238
  },
  {
    "id":433579882,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"89-Olav V's gt. vis-a-vis Saga Kino",
    "lng":10.7328829972711,
    "lat":59.9139661080586
  },
  {
    "id":1319550212,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"29-Theresesgt.15-17/Stensgt.",
    "lng":10.7329130010016,
    "lat":59.9303449003442
  },
  {
    "id":1319550197,
    "network":"Bysykkel",
    "capacity":"6",
    "description":"77-Pilestredet 46",
    "lng":10.7333910843958,
    "lat":59.9208428987962
  },
  {
    "id":1319550216,
    "network":"Bysykkel",
    "capacity":"6",
    "description":"28-Adamstuen (Krysset Theresesgt/Ullevålsvn.)",
    "lng":10.7344150739881,
    "lat":59.9326133873546
  },
  {
    "id":1319550196,
    "network":"Bysykkel",
    "capacity":"14",
    "description":"53-Pilestredet 36-38 (v/Høyskolen/Frydenlund)",
    "lng":10.7350588067207,
    "lat":59.9203769053935
  },
  {
    "id":1319550213,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"58-Brageveien 1 ( Ligger langs Ullevålsveien)",
    "lng":10.7358526479373,
    "lat":59.9307426990691
  },
  {
    "id":496106541,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"99-Rådhusgt.27/Kontraskjæret",
    "lng":10.7359095112948,
    "lat":59.9110131936933
  },
  {
    "id":433580378,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"06-Stortingsgt.(Spikersuppa-Studenterlunden)",
    "lng":10.7360157819929,
    "lat":59.9137872833979
  },
  {
    "id":433580379,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"100-Stortingsgt. (vis-a-vis Filmteatret)",
    "lng":10.7360361737499,
    "lat":59.9137857072508
  },
  {
    "id":1319550192,
    "network":"Bysykkel",
    "capacity":"23",
    "description":"17-Pilestredet 33 (litt nord for Blitz)",
    "lng":10.736120345892,
    "lat":59.9190946918995
  },
  {
    "id":496106542,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"",
    "lng":10.7362600339187,
    "lat":59.9109319927186
  },
  {
    "id":977584929,
    "network":"Bysykkel",
    "capacity":"11",
    "description":"65-Ullevålsveien/Collettsgate (St.Hanshaugen vest)",
    "lng":10.7386509898789,
    "lat":59.9272142856478
  },
  {
    "id":1319550199,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"04-Hallingsgate 2 (v. St.Haugen Fargehandel)",
    "lng":10.7386599730317,
    "lat":59.9226799746418
  },
  {
    "id":496105874,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"18-Christiania Torv",
    "lng":10.7387499842232,
    "lat":59.9102200007362
  },
  {
    "id":803670482,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"16-Knud Knudsens plass (sør for St.Hanshaugen)",
    "lng":10.7399120448747,
    "lat":59.9247520780992
  },
  {
    "id":1319550202,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"81-Wdm. Thranesgt. 16 A",
    "lng":10.7404478001102,
    "lat":59.9236589805296
  },
  {
    "id":433579075,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"57-Vippetangen/Akershusstranda",
    "lng":10.7405121194845,
    "lat":59.9039310735563
  },
  {
    "id":433579076,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"95-Akershusstranda/Vippetangen nr. 2",
    "lng":10.7407101980047,
    "lat":59.9039471099796
  },
  {
    "id":1319550181,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"74-Prof.Aschehougs plass",
    "lng":10.7408700082937,
    "lat":59.914779971007
  },
  {
    "id":803676550,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"26-C.J.Hambros plass (Tinghuset)",
    "lng":10.7409071985465,
    "lat":59.9156088991555
  },
  {
    "id":433579077,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"96-Akershusstranda/Vippetangen nr. 1",
    "lng":10.7409506770062,
    "lat":59.9039781917892
  },
  {
    "id":1319550215,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"69-Geitmyrsveien (krysset Gen.Birchsgt.)",
    "lng":10.7415175139505,
    "lat":59.9324090989046
  },
  {
    "id":829617324,
    "network":"Bysykkel",
    "capacity":"21",
    "description":"15-Bankplassen/Kirkegt,",
    "lng":10.741675527609,
    "lat":59.9083557965775
  },
  {
    "id":3187193091,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"05-Egertorget (Ø.Slottsgt.)",
    "lng":10.7420011668995,
    "lat":59.91261677092
  },
  {
    "id":1319550211,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"45-Geitmyrsveien (krysset Collettsgt.) - Lovisenberg",
    "lng":10.743500005951,
    "lat":59.9298000010694
  },
  {
    "id":803675073,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"38-Ullevålsveien 9 v/Vår Frues hospital,ovenf Barnevognhuset",
    "lng":10.7437972584785,
    "lat":59.9194602074871
  },
  {
    "id":1319550168,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"03-Prinsensgt. (Kirkegt.)",
    "lng":10.7441353843515,
    "lat":59.9112449058651
  },
  {
    "id":1319550166,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"76-Skippergaten vis-a-vis nr. 3 (Cafe Grei, Dagens Næringsl)",
    "lng":10.7457758877233,
    "lat":59.90846929754
  },
  {
    "id":450873162,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"09-Kirkeristen Vest (mot Glassmagasinet)",
    "lng":10.7467155255105,
    "lat":59.9130350924648
  },
  {
    "id":496107674,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"10-Kirkeristen Øst (mot Storgt.)",
    "lng":10.7467830788199,
    "lat":59.9130359931407
  },
  {
    "id":1319550217,
    "network":"Bysykkel",
    "capacity":"14",
    "description":"75-Uelandsgt. v/Arkitekt Rivertz' plass",
    "lng":10.7490899524695,
    "lat":59.9349099818287
  },
  {
    "id":1319550190,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"80-Møllergt. 39",
    "lng":10.7491399886308,
    "lat":59.9165700120048
  },
  {
    "id":1319550170,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"22-Europarådets plass",
    "lng":10.7497099696786,
    "lat":59.9120600064443
  },
  {
    "id":1319550176,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"64-Skippergt./Storgt.",
    "lng":10.7499100244924,
    "lat":59.9132699879014
  },
  {
    "id":1319550198,
    "network":"Bysykkel",
    "capacity":"14",
    "description":"88-Fredensborgveien v/62-64",
    "lng":10.7500577075251,
    "lat":59.9209360966916
  },
  {
    "id":1319550204,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"63-Maridalsveien 31",
    "lng":10.7503581041561,
    "lat":59.9256139795661
  },
  {
    "id":1319550175,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"34-Oslo City (Stenersgt. 2)",
    "lng":10.7511305654689,
    "lat":59.9129445744162
  },
  {
    "id":1319550208,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"62-Alexander Kiellands plass",
    "lng":10.7513079827375,
    "lat":59.9280639695376
  },
  {
    "id":1319550184,
    "network":"Bysykkel",
    "capacity":"11",
    "description":"24-Arb.samfunnets plass (v/Sentrum Scene)",
    "lng":10.751329991462,
    "lat":59.9154199965013
  },
  {
    "id":1319550188,
    "network":"Bysykkel",
    "capacity":"16",
    "description":"102-Arb.samfunnets plass (mot Torggt)",
    "lng":10.7516455696213,
    "lat":59.9159778753987
  },
  {
    "id":408457760,
    "network":"Bysykkel",
    "capacity":"30",
    "description":"50-Havnegata N (Østbanehallen)",
    "lng":10.7517601946516,
    "lat":59.9101619922405
  },
  {
    "id":1319550180,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"25-Storgt. 27 (enden av Youngsgt./skrått ovenf. Gunerius)",
    "lng":10.7517699862882,
    "lat":59.9142100033484
  },
  {
    "id":408457759,
    "network":"Bysykkel",
    "capacity":"30",
    "description":"51-Havnegata S (Østbanehallen) v/Hotell Opera",
    "lng":10.7521007459758,
    "lat":59.9100889860627
  },
  {
    "id":1319550172,
    "network":"Bysykkel",
    "capacity":"1",
    "description":"19-Oslo Plaza",
    "lng":10.7542600264242,
    "lat":59.9124199701784
  },
  {
    "id":615209013,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"31-Torggt./Jacobs kirke (Ankertorget)",
    "lng":10.7546186338856,
    "lat":59.917833591695
  },
  {
    "id":1319550178,
    "network":"Bysykkel",
    "capacity":"21",
    "description":"23-Brugata Sør (Vaterland nærmest Oslo Plaza)",
    "lng":10.7571816172228,
    "lat":59.9134824101232
  },
  {
    "id":1319550179,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"20-Brugata Nord (ved Cafeen)",
    "lng":10.7574712340704,
    "lat":59.9136221928408
  },
  {
    "id":451009895,
    "network":"Bysykkel",
    "capacity":"11",
    "description":"68-Storgt. 40 (utenfor Legevakten)",
    "lng":10.7582608532051,
    "lat":59.9169063769158
  },
  {
    "id":1319550205,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"60-Birkelunden",
    "lng":10.7607006775168,
    "lat":59.925667684479
  },
  {
    "id":729649795,
    "network":"Bysykkel",
    "capacity":"6",
    "description":"35-Schous plass - 1",
    "lng":10.7608124279381,
    "lat":59.9203176089521
  },
  {
    "id":615208998,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"36-Schous plass - 2",
    "lng":10.7608761184918,
    "lat":59.9203457038624
  },
  {
    "id":729650507,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"44-Sofienberggt.(krysset Toftesgt.) - Sofienbergparken",
    "lng":10.7615731213207,
    "lat":59.9223393011907
  },
  {
    "id":450536322,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"37-Johan Sverdrups plass - Vogts gate (øvreTorshov)",
    "lng":10.7621260343781,
    "lat":59.9314773853949
  },
  {
    "id":1319550185,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"108-Nylandsveien v/krysset Urtegt./Vahlsgt- stativ 2",
    "lng":10.7625030573028,
    "lat":59.9156444730749
  },
  {
    "id":1319550187,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"107-Nylandsveien v/krysset Urtegt./Vahlsgt-stativ 1",
    "lng":10.7627820740301,
    "lat":59.9157198086038
  },
  {
    "id":451010273,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"52-Helga Helgesens plass 2.(Gr.Landsleir./Åkebergv/Politi)",
    "lng":10.7661988162132,
    "lat":59.9121085992994
  },
  {
    "id":1319550210,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"78-Dælenenggt. 41",
    "lng":10.7668800086932,
    "lat":59.9289500015448
  },
  {
    "id":1319550200,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"87-Helgesensgt. vis-a-vis nr. 58",
    "lng":10.7671199487056,
    "lat":59.9230400032956
  },
  {
    "id":1319550164,
    "network":"Bysykkel",
    "capacity":"14",
    "description":"82-Oslogate 37",
    "lng":10.767149952436,
    "lat":59.9034599776441
  },
  {
    "id":1319550165,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"30-Oslogt. (Gamlebyen under Jernbanebro)",
    "lng":10.7675672198855,
    "lat":59.9078884117397
  },
  {
    "id":1319550209,
    "network":"Bysykkel",
    "capacity":"9",
    "description":"79-Fagerheimgt. 11",
    "lng":10.7677399659147,
    "lat":59.928869969754
  },
  {
    "id":1319550189,
    "network":"Bysykkel",
    "capacity":"18",
    "description":"43-Jens Bjelkesgt.(motsatt side nr.39)",
    "lng":10.7690499790935,
    "lat":59.9159899884131
  },
  {
    "id":1319550201,
    "network":"Bysykkel",
    "capacity":"10",
    "description":"46-Trondheimsveien 64 (v.Sofienberg holdeplass og Kiwi)",
    "lng":10.7716099979902,
    "lat":59.9231900103302
  },
  {
    "id":448599738,
    "network":"Bysykkel",
    "capacity":"11",
    "description":"42-Tøyen T-bane -inng.Hagegt.",
    "lng":10.7743733056356,
    "lat":59.9146079955437
  },
  {
    "id":1319550203,
    "network":"Bysykkel",
    "capacity":"8",
    "description":"40-Carl Berners (krysset Finnmarksgt./Frydensgt)",
    "lng":10.7759355657463,
    "lat":59.9250468089638
  },
  {
    "id":1319550169,
    "network":"Bysykkel",
    "capacity":"21",
    "description":"84-Jens Bjelkesgt./Sverresgt. (Tøyen)",
    "lng":10.7760373448679,
    "lat":59.9115321906836
  },
  {
    "id":1319550186,
    "network":"Bysykkel",
    "capacity":"15",
    "description":"85-Økernveien v/Caltexløkka",
    "lng":10.777223121043,
    "lat":59.9156874769393
  },
  {
    "id":1319550163,
    "network":"Bysykkel",
    "capacity":"12",
    "description":"86-Dyvekesvei/Konowsgt.",
    "lng":10.778050020262,
    "lat":59.9034317783461
  }
];