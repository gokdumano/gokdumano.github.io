# act4

```
SceneSetup.act4();
publish("SAVE_GAME", ["act4"]);
Game.FORCE_CANT_SKIP = true;
```

(...5001)

```
publish("set_how_many_prompts", [1]);
Game.FORCE_CANT_SKIP = false;
Game.CLICK_TO_ADVANCE = true;
```

n3: (game auto-saved)

```
Game.clearText();
Game.FORCE_CANT_SKIP = true;
```

(...1001)

```
var hong_frame = _.INJURED ? 9 : 0;
publish("act4", ["hong_walks_in",hong_frame]);
sfx("grass_step1", {volume:0.1});
```

(...666)

```
publish("act4", ["hong_walks_in", "next"]);
sfx("grass_step2", {volume:0.2});
```

(...666)

```
publish("act4", ["hong_walks_in", "next"]);
sfx("grass_step1", {volume:0.25});
```

(...666)

```
publish("act4", ["hong_walks_in", "next"]);
sfx("grass_step2", {volume:0.3});
```

(...666)

```
publish("act4", ["hong_walks_in", "next"]);
sfx("grass_step1", {volume:0.35});
```

(...1667)

```
publish("act4", ["hong_walks_in", "next"]);
sfx("grass_step2", {volume:0.35});
```

(...666)

```
publish("act4", ["hong_walks_in", "next"]);
sfx("grass_step1", {volume:0.35});
```

(...666)

```
publish("act4", ["hong_walks_in", "next"]);
sfx("grass_step2", {volume:0.35});
```

(...1333)

```
publish("act4", ["hong_walks_in", "next"]);
sfx("grass_step1", {volume:0.20});
```

(...167)

```
publish("act4_hong_sits");
```

(...66)

```
publish("act4", ["hong_transition", "next"]);
sfx("squeak");
```

(...133)

`publish("act4", ["hong_transition", "next"]);`

(...1333)

```
publish("act4", ["hong_transition", "next"]);
sfx("rustle");
```

(...333)

`publish("act4", ["hong_transition", "next"]);`

(...1001)

```
publish("act4", ["hong_transition", "next"]);
```

(...333)

```
publish("act4", ["hong_transition", 9]);
sfx("sandwich");
```

(...333)

`publish("act4", ["hong_transition", 10]);`

(...333)

`publish("act4", ["hong_transition", 9]);`

(...333)

`publish("act4", ["hong_transition", 10]);`

(...333)

`publish("act4", ["hong_transition", 9]);`

(...333)

`publish("act4", ["hong_transition", 10]);`

(...333)

`publish("act4", ["hong_transition", "next"]);`

(...1466)

`publish("act4-out-1");`

(...201)

`publish("act4", ["hong_transition", "next"]);`

(...99)

`publish("act4", ["hong_transition", "next"]);`

(...99)

`publish("act4", ["hong_transition", "next"]);`

(...99)

`publish("act4", ["hong_transition", "next"]);`

(...99)

`publish("act4", ["hong_transition", "next"]);`

(...99)

`publish("act4", ["hong_transition", "next"]);`

(...99)

`publish("act4", ["hong_transition", "next"]);`

(...99)

`publish("act4", ["hong_transition", "next"]);`

(...99)

`publish("act4", ["hong_transition", "next"]);`

(...99)

```
publish("act4-show-chars");
Game.FORCE_CANT_SKIP = false;
```

(...901)

`hong({body:"sigh_1"})`

(...601)

```
hong({body:"sigh_2"});
bb({eyes:"look_down"});
```

h: *ahh*

```
hong({body:"hold", eyes:"normal", mouth:"normal"});
bb({eyes:"normal"});
```

h: Yani bu hikayeden ????kar??lacak sonu?? neydi?

`hong({body:"one_up", eyes:"annoyed"})`

h: Ne *????rendik*? Ben *aptald??m*, "arkada??lar??m" beni *kullan??yordu*, ve neredeyse *??l??yorduk*.

`hong({body:"normal", eyes:"normal"})`

{{if _.INJURED}}
[Hastane faturalar??ndan bahsetmiyorum bile.](#act4a_bill)
{{/if}}

{{if !_.INJURED}}
[Karaci??er hasar??ndan bahsetmiyorum bile.](#act4a_liver)
{{/if}}

[Evet, bu k??t?? durum senaryosuydu.](#act4a_worst)

[Evet, ben hakl??yd??m.](#act4a_right)

# act4a_bill

`hong({eyes:"annoyed_l", mouth:"narrow"});`

h: Do??ru. Sigortam??n "aptal olmam??" kar????layaca????n?? sanm??yorum.

`hong({eyes:"annoyed", mouth:"normal"});`

b: Ama yine de... kurtulduk!

`hong({eyes:"normal"});`

h: ?

(#act4b)

# act4a_liver

`bb({eyes:"normal_d"});`

b: Kesinlikle hayat??m??zdan birka?? y??l eksilttik...

`bb({eyes:"surprise"});`

b: Ama en az??ndan hala bir hayat??m??z?? *var*! Hayatta kald??k!

```
hong({eyes:"surprise"});
bb({eyes:"normal"});
```

h: ?

(#act4b)

# act4a_worst

`bb({eyes:"normal_d"});`

b: Ama yine de...

h: Hm?

`bb({eyes:"surprise"});`

b: Hayatta kald??k!

(#act4b)

# act4a_right

`bb({eyes:"normal_d"});`

b: Ama... Sen de hakl??yd??n.

`hong({eyes:"surprise"});`

h: Hm?

`bb({eyes:"normal"});`

b: Ben yalanc?? ??obanl??k yapan bir *kurttum*. Ve *ger??ek* tehlike geldi??inde do??al olarak bana inanmad??n.

`bb({eyes:"surprise_r"});`

b: Ama yine de, hayatta kald??k!

(#act4b)

# act4b

```
bb({eyes:"normal", mouth:"normal"});
hong({eyes:"normal", mouth:"normal"});
```

b: Her ??eye ra??men, hala buraday??z.

`hong({eyes:"suspect"});`

{{if _.INJURED}}
h: ??l??m??n e??i??inden d??nd??????m??z?? d??????n??rsek olduk??a sakin g??r??n??yorsun.
{{/if}}

{{if !_.INJURED}}
h: ??l??m??n e??i??inin *e??i??inden* d??nd??????m??z?? d??????n??rsek olduk??a sakin g??r??n??yorsun.
{{/if}}

```
hong({eyes:"normal"});
bb({eyes:"annoyed_d", mouth:"narrow"});
```

b: Eh, di??er her ??ey nispeten daha az geliyor art??k. Ayr??ca beni d??????nmeye de itti.

`bb({eyes:"normal", mouth:"normal"});`

b: Seni korumam?? engelledi??i i??in seninle d??v????mem k??t?? ise...

h: Ama seninle d??v????mem sadece seni daha da ??ok ba????rtt?????? i??in k??t??yse...

`bb({eyes:"normal_r"})`

b: o zaman, belki...

`bb({eyes:"normal"})`

h: Belki d??v????mek zorunda de??ilizdir.

```
Game.FORCE_CANT_SKIP = true;
Game.clearText();
```

(...301)

`publish("smash",[0]);`

(...2001)

```
publish("smash",[1]);
sfx("smash_glass");
```

(...2601)

```
publish("smash",[2]);
bb({eyes:"normal", mouth:"normal"});
hong({eyes:"normal", mouth:"normal"});
```

(...2001)

`Game.FORCE_CANT_SKIP = false;`

(#act4b_2)

# act4b_2

```
music('dontfight',{fade:5, volume:0.6});
bb({eyes:"annoyed_d"});
```

b: Ben b??y??k k??t?? bir kurt de??ilim. Ama ben bir muhaf??z-kurt da de??ilim.

`bb({eyes:"sad_d"})`

b: Ben h??rpalanm???? bir bar??nak k??pe??iyim.

`bb({eyes:"sad"})`

b: Zor ??eyler atlatt??k. Ad??na travma ya da yaln??zl??k de. Bu y??zden bazen a????r?? tepki veriyorum ve:

```
sfx("yaps", {volume:0.6});
bb({body:"yap_1"});
Game.FORCE_CANT_SKIP = true;
Game.WORDS_HEIGHT_BOTTOM = 215;
Game.FORCE_TEXT_DURATION = 90;
Game.FORCE_NO_VOICE = true;
```

b: HAV HAV HAV HAV HAV

(...1884)

```
Game.WORDS_HEIGHT_BOTTOM = -1;
Game.FORCE_CANT_SKIP = false;
bb({body:"normal", mouth:"scream", eyes:"scream_sad"});
```

b: *Korkak* bir k??pek olmak istemiyorum! Seni korumak istiyorum! ??yi bir k??pek olmak istiyorum!

`bb({eyes:"sad", mouth:"normal"});`

b: ??nsan... bu kurdu evcille??tirmeye yard??m edecek misin?

`hong({eyes:"sad"})`

h: Ben... deneyece??im.

`hong({eyes:"normal_l", body:"chin", mouth:"narrow"})`

h: Tamam. Duygularla sa??l??kl?? ili??kiler. ??li??kilerin ileti??ime ihtiyac?? var. Hadi, ileti??im kural??m.

`hong({eyes:"normal", body:"hands_1", mouth:"normal"})`

h: Bu be?? dakika kula??a olduk??a zorlama gelecek ama yolun sonunu g??rene kadar gidelim.

```
hong({body:"hands_2", mouth:"normal"});
```

h: Sevgili i??imdeki kurt... nas??l *hissediyorsun*?

n2: TOPLAM KULLANILAN KORKULAR:

n2: *??NC??NMEK* {{_.attack_harm_total}}, *SEV??LMEMEK* {{_.attack_alone_total}}, *K??T??LENMEK* {{_.attack_bad_total}}

n2: ??LK KONU??MAK ??STED??????N KORKU HANG??S??? (D????ERLER??N?? SONRA YAPAB??L??RS??N)

```
_.a4_fears_discussed = 0;
_.num_thanks = 0;
hong({body:"normal"});
bb({eyes:"normal"});
```

[Bizim incinece??imizden korkuyorum.](#act4_harm)

[Yaln??z kalaca????m??zdan korkuyorum.](#act4_alone)

[K??t?? biri oldu??umuzdan korkuyorum.](#act4_bad)

# act4_harm

```
_.a4_talked_about_harm = true;
_.a4_fears_discussed += 1;
```

`bb({eyes:"normal_d"})`

b: Fiziksel g??venli??ini korumak istiyorum,

`bb({eyes:"sad_d"})`

b: Ama *b??t??n d??nya* tehlikeli g??r??n??yor. ??ok fazla felaket ve k??t??l??kle dolu.

`bb({eyes:"sad"})`

{{if _.a4_fears_discussed==1}}
b: *Ben* yeterince konu??tum, *sen* ne d??????n??yorsun, insan?
{{/if}}

{{if _.a4_fears_discussed==2}}
b: Peki ya sen insan, sen ne d??????n??yorsun?
{{/if}}

{{if _.a4_fears_discussed==3}}
b: Ekleyece??in bi'??ey var m??, insan?
{{/if}}

`Game.OVERRIDE_CHOICE_SPEAKER = "h"`

[Hakl??s??n. O zaman birbirimizi koruyal??m.](#act4_harm_skills)

[Kendimizi tehlikeye daha da maruz b??rakal??m.](#act4_harm_exposure)

[Te??ekk??r ederim.](#act4_thanks) `_.thanks_for = "fiziksel g??venli??im";`

# act4_harm_skills

`bb({eyes:"look_down", body:"paw"})`

b: Ama... nas??l? Di??lerim ve pen??elerim var, ama sadece bir metaforum.

```
bb({ body:"normal", eyes:"normal" });
hong({ body:"one_up", eyes:"surprise" });
```

h: Kendimizi korumay?? ????renebiliriz, birbirini koruyan bir toplulu??a m?? kat??labiliriz, sa??l??????m??z?? ve ki??isel s??n??rlar??m??z?? iyile??tirebiliriz.

```
bb({ eyes:"annoyed_r" });
hong({ body:"normal", eyes:"normal" });
```

b: Belki, ama...

[Nereden ba??layaca????z?](#act4_harm_skills_start)

[Ya yine de ba??aramazsak?](#act4_harm_skills_work)

[Ya "g??venlik" konusunda a????r??ya ka??arsak?](#act4_harm_skills_overboard)

# act4_harm_skills_start

`bb({ eyes:"sad_d" })`

b: Yap??lacak ??ok ??ey var, kendimiz hakk??nda d??zeltmemiz gereken ??ok ??ey var. Nereden *ba??l??yoruz*?

`hong({ body:"shrug", eyes:"surprise" })`

h: Tam da ??imdi ba??l??yoruz.

`bb({ eyes:"normal", mouth:"narrow" })`

b: Ne?

```
bb({ body:"normal", mouth:"normal" });
hong({ body:"normal", mouth:"normal", eyes:"normal"});
```

h: ??u an do??ru ileti??im prati??i yap??yoruz. Daha kolay tehlikeleri farkedece??iz, yanl???? alarmlar azalacak, 

`hong({ eyes:"surprise" });`

h: Ve *bu* bizi incinmekten koruyacak!

`hong({ eyes:"normal", mouth:"normal" });`

h: Bu nedenle: bu *bir* savunma e??itimi.

`bb({ eyes:"normal_r" })`

b: Huh. Ben daha ??ok ??undan bekliyordum:

```
Game.FORCE_CANT_SKIP = true;
Game.clearText();
hong({ eyes:"sad", mouth:"smile" });
bb({ body:"karate_1" });
sfx("hiya");
```

(...1001)

`Game.FORCE_CANT_SKIP = false;`

(#act4_something_else)

# act4_harm_skills_work

`bb({ eyes:"normal" });`

h: Do??ru, kendimizi %100 koruman??n bir yolu yok...

`hong({ body:"one_up" });`

h: Ama %1'lik bir iyile??me bile bir ilerlemedir, de??il mi?

```
bb({ eyes:"annoyed" });
hong({ normal:"one_up" });
```

b: Sen barda???? %99 bo?? de??il, %1 dolu olarak g??r??yorsun.

`bb({ eyes:"normal" });`

h: ????lde mahsur biri i??in o suyun h??l?? de??eri vard??r.

`bb({ eyes:"closed" });`

b: Pekala. Dibini g??relim o zaman.

(#act4_something_else)

# act4_harm_skills_overboard

`bb({ body:"chest", eyes:"annoyed" })`

b: Yani, bunca zaman beni g??rmezden gelme sebebin *benim* g??venlik konusunda a????r??ya ka??mamd??! 

`bb({ body:"normal", eyes:"normal" })`

h: Hakl??s??n. G??venli??in bile ??l????l??s??n?? isteriz. Her ??eyi ??l????l?? ??ekilde yapmal??y??z.

`bb({ eyes:"suspect" })`

b: Pardon, *HER ??EY??* M???

`hong({ eyes:"annoyed" })`

h: *M??kul say??daki ??eyleri* ??l????l?? yapmal??y??z.

```
bb({ eyes:"closed" });
hong({ eyes:"normal" });
```

b: S??zlerini, birbirini destekler ??ekilde yapt??????n i??in te??ekk??rler.

(#act4_something_else)


# act4_harm_exposure

`bb({ mouth:"scream_talk", eyes:"scream", MOUTH_LOCK:true });`

b: *NE*

```
bb({ mouth:"narrow", eyes:"suspect" });
hong({ body:"one_up" });
```

h: Demek istedi??im, diyelim ki k??pek g??k g??r??lt??s??nden korkuyor.

`hong({ body:"hands_1" });`

h: E??itmenlerin kulland?????? bir numara, g??k g??r??lt??s?? k??s??k bir sesle kaydedilir ve k??pe??e sakinle??mesi i??in ??d??l olarak verilir.

`hong({ body:"hands_2" });`

h: Birka?? g??n boyunca e??itmen, k??pek g??k g??r??lt??s?? korkusunu yenene kadar sesi azar azar y??kseltir.

```
hong({ body:"normal", eyes:"surprise" });
bb({ mouth:"normal", eyes:"normal" });
```

h: Buna mazur kalma terapisi denir!

`hong({ body:"point", eyes:"normal" });`

h: Sen de bir k??peksin, sende de i??e yaramal??, de??il mi? T??m memeliler ayn?? davran??r, ka?? veya sava??.

`hong({ body:"normal" });`

[Ya *fazla* duyars??zla????rsak?](#act4_harm_exposure_overboard)

[Ya *ger??ek* bir tehlikeye maruz kal??rsak?](#act4_harm_exposure_hurt)

[Ben bir kurtum, k??pek de??il.](#act4_harm_exposure_dog) `bb({ eyes:"suspect" })`

# act4_harm_exposure_dog

h: Ben de sana evcille??tirilip sevimli bir yavru k??pek olana kadar nezaket ve sab??r g??sterece??im.

`bb({ MOUTH_LOCK:true })`

b: ...

`bb({ eyes:"sad", mouth:"smile" })`

b: Aaay.

(#act4_something_else)

# act4_harm_exposure_overboard

`bb({ eyes:"annoyed" })`

b: Korkunu *tamamen* kapat??rsan neler oldu??unu g??rd??k - kendini *ger??ekten* tehlikeli durumlara soktun.

`bb({ eyes:"angry_r", body:"one_up" })`

b: Ayr??ca, *fazla* duyars??zla??t??rma bizi psikopata d??n????t??rmez mi?

`bb({ mouth:"scream", eyes:"scream", body:"two_up" })`

b: Sonra da kendimizi enfiye cinayeti pornosu izleyerek ??d??llendirece??iz!

`hong({ eyes:"annoyed" })`

h: Bence... bununla g??k g??r??lt??s?? aras??nda bir ??izgi var.

`bb({ body:"normal", mouth:"normal", eyes:"suspect" })`

b: Ama tam olarak *nerede*, insan? *Nerede?!*

`hong({ eyes:"surprise", body:"one_up" })`

h: Bilmiyorum. Ama *sen* bana yard??m edebilirsin!

`hong({ eyes:"normal", body:"normal" })`

h: Seninle ??al????arak ve tart????arak o ??izgiyi ??izece??iz.

`bb({ body:"paw", mouth:"narrow", eyes:"closed" })`

b: Ama benim ba??parmaklar??m yok, bu y??zden ??izimi sen yapmal??s??n.

(#act4_something_else)

# act4_harm_exposure_hurt

`bb({ body:"two_up", eyes:"angry_r" })`

{{if _.INJURED}}
b: ??rne??in: o lanet olas??ca *??at??dan* atlad??k!
{{/if}}

{{if !_.INJURED}}
b: ??rne??in: o lanet olas??ca *??at??dan* neredeyse atlayacakt??k!
{{/if}}

```
hong({ eyes:"annoyed" });
bb({ body:"normal", eyes:"annoyed" });
```

h: Hakl??s??n. Bazen fazla ileri *gidilebilir*.

`hong({ eyes:"normal" });`

h: ????te bu y??zden, maruz b??rakma terapisi ile k??????k ba??lay??p yukar?? do??ru k??????k ad??mlar ataca????z.

h: *Ger??ek* tehlikeye ??arpmadan hemen ??nce duraca????z.

`bb({ eyes:"annoyed_r", mouth:"narrow" });`

b: Evet, g??k g??r??lt??s?? duymakla, uzun sivri bir ??apkayla f??rt??nada durmak aras??nda bir ??izgi ??iziyorum.

(#act4_something_else)

# act4_thanks

`_.num_thanks += 1`

{{if _.num_thanks==1}}
(#act4_thanks_1)
{{/if}}

{{if _.num_thanks==2}}
(#act4_thanks_2)
{{/if}}

{{if _.num_thanks==3}}
(#act4_thanks_3)
{{/if}}

# act4_thanks_1

`bb({ MOUTH_LOCK:true })`

b: ...

`bb({ eyes:"annoyed" })`

b: Bekle, destekleme veya kar???? ????kma yok mu? Sadece... "te??ekk??r ederim" mi?

`hong({ eyes:"surprise", body:"shrug" })`

h: Evet! {{_.thanks_for}} hakk??nda endi??elendi??in i??in te??ekk??r ederim.

```
bb({ eyes:"closed_annoyed", MOUTH_LOCK:true });
hong({ eyes:"normal", body:"normal" });
```

b: ...

h: Sen iyi misin?

`bb({ eyes:"super_sad", mouth:"narrow" });`

b: Bana daha ??nce hi?? *te??ekk??r ederim* dememi??tin.

`hong({ mouth:"smile" });`

h: Aw seni b??y??k, t??yl??, panik kurt.

(#act4_something_else)

# act4_thanks_2

h: A????r?? tepki versen bile, {{_.thanks_for}} hakk??nda ilgilendi??in i??in minnetar??m.

`bb({ eyes:"annoyed" })`

b: Bekle... Korkular hakk??nda konu??maktan ka??mak i??in "te??ekk??r ederim" demiyorsun, de??il mi?

```
bb({ eyes:"normal" });
hong({ eyes:"annoyed", body:"chin" });
```

h: ??ey, i??ler karma????k ve her zaman haz??r cevaplar??m olmuyor.

`hong({ eyes:"annoyed_l", body:"one_up" })`

h: Hayat sana 3 se??enekten ibaret diyaloglar vermiyor sonu??ta.

`hong({ eyes:"normal", mouth:"smile", body:"normal" })`

h: Ama ??imdilik, en az??ndan te??ekk??r edebilirim.

b: Pekala, beni sab??rla dinledi??in i??in de te??ekk??r ederim.

`bb({ eyes:"closed" });`

b: Seni k??????k t??ys??z memeli.

(#act4_something_else)

# act4_thanks_3

h: Havlaman beni korkutsa bile, {{_.thanks_for}} hakk??nda korumaya ??al??????yorsun.

`bb({ eyes:"smile_r" });`

b: Pekala, beni b??yle pohpohlamaya devam edersen internet bizim hakk??m??zda tuhaf fikirler edinecek.

```
bb({ eyes:"smile" });
hong({ eyes:"annoyed" });
```

h:Hadi ama, ben lise ??a????nda savunmas??z bir ??ocu??um ve sen b??y??k, korkun?? bir kurtsun. En k??t??s?? ne-

`hong({ eyes:"normal", body:"point" });`

h: Asl??nda, buna cevap verme.

(#act4_something_else)




# act4_alone

```
_.a4_talked_about_alone = true;
_.a4_fears_discussed += 1;
```

`bb({ eyes:"sad_d" });`

b: Aidiyetlik hissinin kar????lad??????ndan emin olmak istiyorum..

`bb({ eyes:"sad_u" });`

b: Ama korkum o ki, e??er birisi bizi - *ger??ek* bizi - tan??rsa korkup ka??ar.

`bb({ eyes:"sad" });`

{{if _.a4_fears_discussed==1}}
b: *Ben* yeterince konu??tum, *sen* ne d??????n??yorsun, insan?
{{/if}}

{{if _.a4_fears_discussed==2}}
b: Peki ya sen insan, sen ne d??????n??yorsun?
{{/if}}

{{if _.a4_fears_discussed==3}}
b: Ekleyece??in bi'??ey var m??, insan?
{{/if}}

`Game.OVERRIDE_CHOICE_SPEAKER = "h"`

[Kat??l??yorum: sosyal hayat??m??z ??zerinde ??al????al??m.](#act4_alone_skills)

[Bence insanlar bizi seviyor. Hadi deneyelim?](#act4_alone_experiment)

[Te??ekk??r ederim.](#act4_thanks) `_.thanks_for = "sosyal aidiyetim";`

# act4_alone_skills

```
bb({ eyes:"normal" });
hong({ body:"chin" });
```

h: Soru sorma, dinleme ve empati kurma, a????k ve savunmas??z olma gibi becerileri pratik yapabilir miyiz?

`hong({ eyes:"normal_l" });`

h: Veya arkada??larla plan yapmak, d??zenli bulu??malara gitmek gibi daha iyi sosyal al????kanl??klar?

`hong({ body:"one_up" });`

h: Ayr??ca reddedilmekten daha az etkilenmeyi,

`hong({ eyes:"normal" });`

h: Ya da insanlar??n bizi reddetmedi??ini, sadece yorgun oldu??unu anlamay?? ????reniriz

```
hong({ body:"normal" });
bb({ eyes:"annoyed_r" });
```

b: ??ok fazla se??enek var. Ama, "sosyal beceriler ????renmek" hakk??nda...

[Bu *manip??latif* de??il mi?](#act4_alone_skills_manipulative)

[Bu bizi *manip??latif* birisi yapmaz m???](#act4_alone_skills_manipulated)

[Ya h??l?? ba??ar??s??z olursak?](#act4_alone_skills_fail)

# act4_alone_skills_manipulative

`bb({ eyes:"suspect" });`

b: Kurbanlar??n??n duygular??n?? okuyabilen seri katiller "empati" uzman?? de??iller mi?

`bb({ eyes:"annoyed" });`

b: Charles Manson arkada??lar edinip insanlar?? etkilemedi mi?

`hong({ eyes:"annoyed", body:"chin" });`

h: Evet, hakl??s??n.

h: ??nsanlar?? *??nemsemiyorsak* "sosyal becerilerin" anlam?? olmaz.

`hong({ body:"normal" });`

h: K??sacas?? ^oruspu ??ocu??u^ olma.

`bb({ eyes:"annoyed", mouth:"smile" });`

b: ????te tam motive edici bir poster ba??l??????

`hong({ body:"shrug", mouth:"narrow" });`

h: "^Oruspu ??ocu??u^??? Olma."

(#act4_something_else)

# act4_alone_skills_manipulated

`bb({ eyes:"angry" })`

b: ??nsanlar??n ayaklar??n?? sildi??i, "L??tfen" ve "Te??ekk??rler" diyen bir kap?? paspas?? olaca????z!

`bb({ mouth:"scream", eyes:"scream" })`

b: O kadar ^k????^ ??pece??iz ki, kahverengi ruj s??rm??????z gibi g??r??necek!

```
bb({ mouth:"normal", eyes:"normal" });
hong( body:"chin" });
```

h: Evet. "Sosyal beceriler" sadece ba??kalar??n?? memnun etmek de??ildir, *s??n??rlar* belirlemekle de ilgilidir.

`hong( body:"one_up" });`

h: Evimizin kiri??leri olmadan ba??kalar??n?? evimize davet edemeyiz.

```
hong( eyes:"angry", mouth:"narrow" });
bb( eyes:"annoyed", mouth:"smile" });
```

h: Ayr??ca... o ruju akl??mda canland??rd??m da... *tats??z??*

(#act4_something_else)

# act4_alone_skills_fail

`bb({ eyes:"annoyed" });`

h: Ba??ar??s??z olabiliriz. Asl??nda, ba??ar??s??z *olaca????z*.

```
bb({ eyes:"normal" });
hong({ eyes:"surprise", body:"shrug" });
```

h: S??k??nt?? de??il! Yeni bi'??ey ????renmenin ilk ad??m?? ba??ar??s??zl??kt??r!

`hong({ body:"normal", eyes:"normal" });`

h: O zaman birlikte ba??ar??s??z olal??m, tamam m???

`bb({ eyes:"normal_r" });`

b: Tabii, san??r??m... en k??t?? ??ehirden ka????p yeni bir kimlik alabiliriz.

`bb({ eyes:"normal" });`

h: Evet, san??r??m bu g??nlerde sadece iki bitcoine m??l oluyor.

(#act4_something_else)

# act4_alone_experiment

```
hong({ body:"one_up" });
bb({ eyes:"normal" });
```

h: Denemeler yapabiliriz!

`hong({ body:"chin" });`

h: Tak??lmak i??in g??z??m??ze bir arkada?? takar??z, eskilerden birileri ile konu??abiliriz, ya da baristayla.

`hong({ body:"normal" });`

h: San??r??m sand??????m??zdan daha sevimli oldu??umuzu farkedebiliriz.

`bb({ eyes:"annoyed" });`

[Ya bunlar k??????k, ucuz "zaferlerse"?](#act4_alone_experiment_cheap)

[Ya bu ba??kalar??na y??k olursa?](#act4_alone_experiment_burden)

[Ama ufak muhabbetler *ger??ek* biz de??iliz!](#act4_alone_experiment_real_us)

# act4_alone_experiment_real_us

`bb({ eyes:"sad" });`

b: Bo?? bir g??l??mseme tak??n??rsak, asla kimseyle ger??ekten ba??lant?? kuramay??z,

`bb({ eyes:"super_sad" });`

b: *Ama* e??er i??imizi a??arsak, di??er insanlar i??imizdeki t??m pisli??i g??recek!

`hong({body:"chin", mouth:"narrow", MOUTH_LOCK:true})`

h: ...

```
hong({body:"normal", mouth:"normal"});
bb({eyes:"normal"});
```

h: Yuvarlan.

b: Ne.

`hong({body:"hands_1"})`

h: K??pekler sevgi ve g??ven g??stergesi olarak kar??nlar??n?? savunmas??z b??rak??rlar.

`hong({body:"one_up"})`

h: Belki *hen??z* g??be??imizi a??acak kadar g??vende hissetmiyoruz ama yeterli e??itimle,

`hong({body:"normal", eyes:"surprise"})`

h: Bir g??n insanlara ger??ek bizi g??sterebiliriz - berbat, insan.

```
hong({eyes:"normal"});
bb({ eyes:"super_sad", mouth:"smile", body:"chest" });
```

b: Bana bir ??d??l verirsen yuvarlan??r??m.

`bb({ eyes:"normal", mouth:"normal" });`

h: Hay??r.

(#act4_something_else)


# act4_alone_experiment_cheap

b: Baristaya "merhaba" demek alt??n madalyal??k bir olimpiyat performans?? de??il.

```
hong({ body:"point", eyes:"surprise" });
bb({ eyes:"normal" });
```

h: *Bizim* i??in ??yle!

`hong({ body:"one_up", eyes:"annoyed" });`

h:Sosyal arenada t??y siklet bile de??iliz, daha ??ok... kuark siklet.

`hong({ body:"normal", eyes:"normal" });`

h: K??????k zaferlerle ba??lamam??z gerekiyorsa, ??yle olsun. 1000. ad??mdan ??nce elbet 1. ad??m?? atmam??z gerek.

b: Evet! Belki "Merhaba" dedikten sonra, ????yle devam edebiliriz...

`bb({ body:"two_up", mouth:"smile", eyes:"smile_u" });`

b: *"Nas??ls??n??z?"*

`hong({ body:"shrug", mouth:"smile", eyes:"surprise_l" });`

h: *"Fena de??il!"*

(#act4_something_else)

# act4_alone_experiment_burden

`bb({ eyes:"suspect_r" })`

b: Belki barista sosyal beceri *dene??imiz* olmak istemiyordur, sadece kahve yapmak istiyordur.

`bb({ eyes:"annoyed" })`

h: Eh, e??er bir *y??k* oldu??umuzu farkedersek...

```
hong({ eyes:"surprise" });
bb({ eyes:"normal" });
```

h: Bunu bilmek de g??zel!

`hong({ eyes:"normal" });`

h: ??nsanlar??n nas??l rahat oldu??unu ????renmeyi ve ba??kalar??n??n s??n??rlar??na sayg?? duymay?? ????renebiliriz.

```
hong({ eyes:"annoyed_l", mouth:"narrow" });
bb({ eyes:"annoyed", mouth:"smile" });
```

h: Bilirsin, dan????man bro????rlerinde g??rd??????n o "ki??iler aras?? beceriler" sa??mal??????.

(#act4_something_else)



# act4_bad

```
_.a4_talked_about_bad = true;
_.a4_fears_discussed += 1;
```

`bb({ eyes:"annoyed_r" })`

b: Daha iyi bir insan olman?? sa??layacak ahlaki ihtiya??lar??n?? korumak istiyorum,

`bb({ eyes:"sad_d" })`

b: Ama derinlerde bir yerde, temelde ??ok... bozu??uz.

`bb({ body:"two_up", eyes:"angry" })`

{{if _.INJURED}}
b: Ve bana bozuk *olmad??????m??z??* s??yleme. Bir *??at??dan* atlad??k.
{{/if}}

{{if !_.INJURED}}
b: Ve bana bozuk *olmad??????m??z??* s??yleme. Neredeyse bir *??at??dan* atl??yorduk.
{{/if}}

`bb({ body:"normal", eyes:"sad" })`

{{if _.a4_fears_discussed==1}}
b: *Ben* yeterince konu??tum, *sen* ne d??????n??yorsun, insan?
{{/if}}

{{if _.a4_fears_discussed==2}}
b: Yine sana d??nelim, insan. Sen ne d??????n??yorsun?
{{/if}}

{{if _.a4_fears_discussed==3}}
b: Ekleyece??in bi'??ey var m??, insan?
{{/if}}

`Game.OVERRIDE_CHOICE_SPEAKER = "h"`

[Madem bozu??uz, hadi kendimizi d??zeltelim.](#act4_bad_fix)

[Madem bozu??uz, hadi bunu kabul edelim.](#act4_bad_accept)

[Te??ekk??r ederim.](#act4_thanks) `_.thanks_for = "Ahlaki sa??l??????m";`

# act4_bad_fix

```
bb({eyes:"normal"});
hong({body:"chin"});
```

h: Yava?? yava?? daha iyi al????kanl??klar edinebilir, hayat??m??z?? hizaya sokabiliriz.

`hong({body:"one_up"});`

h: Ve gerekirse, bir terapist veya dan????man gibi bir uzmandan yard??m alabiliriz.

`hong({body:"normal"});`

h: Bizi d??zeltmenin yollar?? var.

[Ya hepsini d??zeltemezsek?](#act4_bad_fix_cant)

[Ya *??ok* fazla d??zeltirsek?](#act4_bad_fix_too_much)

[Profesyonel yard??m almaya g??c??m??z yetmez.](#act4_bad_fix_afford)

# act4_bad_fix_cant

`hong({eyes:"annoyed"});`

h: Evet, san??r??m hakl??s??n.

h: Hepsini d??zeltemeyiz.

`bb({mouth:"scream", eyes:"scream_sad"});`

b: Ahhh biliyordum her zaman bozuk kalaca????z!

`hong({eyes:"surprise"});`

h: Ama en az??ndan *daha az* bozuk olabiliriz.

```
bb({mouth:"normal", eyes:"annoyed"});
hong({eyes:"sad", mouth:"smile"});
```

h: Yaralar zamanla iyile??ir ama asla ge??mezler. Sorun de??il.

`bb({eyes:"annoyed_r"});`

b: San??r??m. Bunun d??????nda,

```
Game.FORCE_TEXT_Y = 460;
Game.clearText();
publish("act4-sexy", [true]);
```

b: Yaralar *seksidir.*

```
Game.FORCE_TEXT_Y = -1;
Game.clearText();
publish("act4-sexy", [false]);
bb({body:"chest", mouth:"smile_talk", MOUTH_LOCK:true, eyes:"sexy"}, 0);
hong({eyes:"normal", mouth:"normal"}, 0);
```

h: L??tfen, bunu yapma.

(#act4_something_else)

# act4_bad_fix_too_much

`bb({ eyes:"angry_d" })`

b: Bunu kabul etmek i??ren?? ama... bir par??am bu rahats??zl????a sahip olmak *istiyor*.

`bb({ eyes:"angry" })`

b: Yani, onsuz, *s??k??c??* olmayacak m??y??z?

`bb({ eyes:"sad_r", body:"one_up" })`

b: Bu bozukluk olmadan mizac??m??z bayat ve yavan olmaz m???

`bb({ eyes:"sad_u", body:"two_up" })`

b: Bozukluk olmadan, bozuklu??u olan arkada??lar??m??zla ba??lant?? kuramaz hale gelmeyecek miyiz?

`bb({ eyes:"sad", body:"chest" })`

b: Hayat??m??zdan memnun olursak, kendimizi daha iyi ??eyler yapmaktan al??koymaz m??y??z?

`hong({ MOUTH_LOCK:true })`

h: ...

h: "Korkacak bi'??ey kalmamas??ndan" bile korkuyorsak...

h: Korkacak ??eylerimiz kolay kolay bitmeyecektir.

`bb({ eyes:"smile_u", body:"normal", mouth:"smile" })`

b: Ah, Evet! Vay! Ne b??y??k bir rahatlama!

(#act4_something_else)

# act4_bad_fix_afford

`bb({ body:"one_up", eyes:"sexy", mouth:"normal" })`

b: Sadece "*bu seni nas??l hissettirdi*" sorusuna 870???/saat ??demek beni kayg??land??r??yor.

`bb({ body:"paw", eyes:"closed", mouth:"narrow" })`

b: "Hm-mmm. Peki bu seni nas??l hissettiriyor?"

```
bb({ body:"normal", eyes:"normal", mouth:"normal" });
hong({ eyes:"sad" });
```

h: Evet, bu tamamen makul bir endi??e.

`hong({ eyes:"annoyed", mouth:"sad" });`

h: Ve ak??l sa??l??????n??n ??o??u ki??i i??in kar????lanabilir olmamas?? ger??ekten berbat.

`hong({ eyes:"normal", mouth:"normal" });`

h: Yine de baz?? ucuz veya ??cretsiz se??enekler var:

`hong({ body:"chin" })`

h: Destek gruplar??, ??evrimi??i terapi, kar amac?? g??tmeyen sa??l??k merkezleri...

`hong({ body:"hands_1" })`

h: Meditasyon, iyi uyku, arkada??larla d??zenli sohbet gibi al????kanl??klar edinmek...

`hong({ body:"hands_2" })`

h: K??t??phaneden, kan??ta dayal?? psikoterapiler i??in ??al????ma kitaplar?? ??d??n?? almak...

`hong({ body:"one_up" })`

h: Bu oyunun sonunda kaynaklar??n tam listesi var!

```
hong({ body:"normal" });
bb({ eyes:"annoyed", mouth:"narrow" });
```

b: *D??rd??nc??* duvar pek dayanmad?? demek.

`hong({ body:"point" });`

h: Baz?? ??eyler edebi anlat??dan daha ??nemlidir. Ak??l sa??l?????? gibi.

(#act4_something_else)


# act4_bad_accept

```
bb({ eyes:"normal" });
hong({ eyes:"normal_l", body:"one_up", mouth:"narrow" });
```

h: Terapistler de b??yle demiyor mu? T??m duygular??n??, olumsuz olanlar?? bile kabul et?

```
bb({ eyes:"annoyed" });
hong({ eyes:"normal", body:"normal", mouth:"normal" });
```

b: Bekle.

["Kabul etmek" yani *pes etmek* mi?](#act4_bad_accept_give_up)

["Kabul etmek" yani *onaylamak* m???](#act4_bad_accept_approve)

["Kabul etmek" yani *harfiyen* mi?](#act4_bad_accept_literally)

# act4_bad_accept_give_up

`bb({ eyes:"angry", body:"one_up" });`

b: Sence Martin Luther King, "Otob??s??n ??n??nde oturamam??z k??t??, hadi *kabul edelim*" der miydi?

`bb({ eyes:"angry_r", body:"two_up" });`

b: Ki??isel geli??im duayenleri beyaz bayrak sallamay?? neden *derin bir bilgelik* olarak g??r??yor?

`bb({ eyes:"annoyed", body:"normal" });`

h: Bence "kabul et" ile kastettikleri ??ey: varl??klar??n?? ve de??i??tirmesi zor olduklar??n?? kabul et,

h: Ama de??i??ime dair eylemlerde daha ba??larken pes etme

`bb({ eyes:"suspect" });`

b: O zaman terapistler *tan??* demeli *kabul et* de??il.

`hong({ body:"chin", eyes:"annoyed" });`

h: Evet, d??????n??nce "kabul et" biraz kafa kar????t??r??c??.

`bb({ eyes:"closed", mouth:"narrow" });`

b: Peki, bunu *tan??yorum.*

(#act4_something_else)

# act4_bad_accept_approve

`bb({ eyes:"angry" });`

b: Bozuk olmam??z *iyi* bi'??eymi?? gibi mi? Hay??r!

`bb({ eyes:"angry_r", body:"one_up" });`

b: Ak??l hastal??klar??n?? romantikle??tiren t??m Hollywood senaristleri be?? para etmez!

`bb({ eyes:"angry", body:"two_up" });`

b: Ak??l hastas?? olmak *berbat!* ??nsanlar??n *hayatlar??n??* ??al??yor! Bunu neden "kabul edelim"?!

`bb({ body:"normal" });`

h: Bence "kabul et" ile kastettikleri ??ey: onlara kar???? sab??rl?? ol.

```
hong({ body:"one_up" });
bb({ eyes:"normal" });
```

h: T??pk?? batakl??kta debelenmenin daha h??zl?? bat??rd?????? ve ????z??m??n sab??rla d??md??z uzanmak oldu??u gibi,

`hong({ eyes:"surprise" });`

{{if _.INJURED}}
h: Seninle sava??mak, korkum, ??at??dan atlamama neden oldu.
{{/if}}

{{if !_.INJURED}}
h: Seninle sava??mak, korkum, neredeyse ??at??dan atlamama sebep olacakt??.
{{/if}}

`hong({ body:"normal", eyes:"normal" });`

h: Bunun yerine, ????z??m ??u anda yapt??????m??z ??eyi yapmakt??r ??? sava??mak de??il, sab??rla birlikte olmakt??r.

`bb({ eyes:"annoyed" });`

b: O zaman "kabul et" gibi sorunlu bir kelime yerine *bunu* demeliler.

`hong({ body:"chin", eyes:"annoyed" });`

h: Evet, biraz d??????n??nce, "kabul etmek" berbat bir ??ey.

`bb({ eyes:"closed_annoyed", mouth:"narrow" });`

b: "Kabul etmeyi" kabul etmiyorum.

(#act4_something_else)

# act4_bad_accept_literally

`bb({ eyes:"sad", body:"one_up" });`

b: Ama zaten beni harfiyen dinlememen gerekti??i *biliyoruz*.

`bb({ eyes:"sad_u", body:"two_up" });`

b: B??t??n *sorun* sana yard??m etmek istemem ama bunu yapmak i??in do??ru s??zc??kleri bulamamam!

`bb({ eyes:"sad", body:"normal" });`

h: Bence "kabul et" ile kastettikleri ??ey: "ne sava????n ne de g??zard?? edin."

`hong({ eyes:"surprise", body:"one_up" });`

h: Duygular??n?? dinle, onlarla birlik ol ama dediklerini %100 harfiyen anlama.

```
hong({ eyes:"normal", body:"normal" });
bb({ eyes:"annoyed", mouth:"normal" });`
```

b: O zaman terapistler "kabul et" gibi belirsiz bir s??zc??k yerine *bunu* s??ylemeliler.

`hong({ body:"chin", eyes:"annoyed" });`

h: San??r??m onlar da do??ru s??zc??kleri bulam??yorlar.

(#act4_something_else)




# act4_something_else

```
bb({ body:"normal", mouth:"normal", eyes:"normal" });
hong({ body:"normal", mouth:"normal", eyes:"normal" });
```

{{if _.a4_fears_discussed==1}}
h: Neyse, konu??mak istedi??in ba??ka bir ??ey var m???
{{/if}}

{{if _.a4_fears_discussed==2}}
h: Peki, dertli kalbinde ba??ka bir ??ey var m???
{{/if}}

{{if _.a4_fears_discussed==3}}
(#act4_something_else_2)
{{/if}}

{{if _.a4_talked_about_harm!=true}}
[??ncinece??imizden korkuyorum.](#act4_harm)
{{/if}}

{{if _.a4_talked_about_alone!=true}}
[Yaln??z kalaca????m??zdan korkuyorum.](#act4_alone)
{{/if}}

{{if _.a4_talked_about_bad!=true}}
[K??t?? biri oldu??umuzdan korkuyorum.](#act4_bad)
{{/if}}

[Hay??r, ??imdilik iyiyim.](#act4c_prelude)

# act4_something_else_2

h: Tamam, san??r??m art??k t??m korkular??m??z hakk??nda konu??tuk.

b: Evet, sadece ???? korku vard??.

h: Evet, kesinlikle ????.

b: Pratik.

(#act4c)

# act4c_prelude

h: ??yi sohbetti, tak??m.

(#act4c)

# act4c

```
Game.clearText();
music(null,{fade:3});
bb({body:"normal", eyes:"normal", mouth:"normal", MOUTH_LOCK:true},0);
hong({body:"normal", eyes:"normal", mouth:"normal"},0);
```

b: ...

`hong({MOUTH_LOCK:true},0)`

h: ...

`bb({eyes:"annoyed_d"})`

b: Bu bir *oyun* de??il, biliyorsun.

`bb({eyes:"angry_d", body:"one_up"})`

b: Duygular??nla sa??l??kl?? bir ili??ki kurmak, ekrandaki d????melere t??klamak kadar kolay de??ildir.

`bb({eyes:"sad", body:"normal"})`

b: Ger??ekten *anla??abilir* miyiz?

b: Ekip olarak birlikte *??al????abilir* miyiz?

`hong({eyes:"sad", body:"one_up"})`

h: ??ey,

```
hong({eyes:"surprise_l"});
bb({eyes:"normal"});
```

a: A-affedersiniz...

```
Game.clearText();
publish("act4-in-2");
music('campus', {volume:0.5, fade:1});
```

(...2101)

(#act4d)

# act4d

`Game.WORDS_HEIGHT_BOTTOM = 221;`

`publish("act4", ["alshire", 0]);`

a: ??-????-????le yeme??inde seninle oturmam??n bir sak??ncas?? var m???

`publish("act4", ["alshire", 1]);`

{{if _.TOP_FEAR=="harm"}}
s: *Bu* ho??land??????n ki??i mi? Neden psikopat bir seri katil gibi yaln??z oturuyorlar?
{{/if}}

{{if _.TOP_FEAR=="alone"}}
s: Ho??land??????na oturabilir miyim diye sormak m??, kula??a ne kadar *muhta??* geliyor?!
{{/if}}

{{if _.TOP_FEAR=="bad"}}
s: *Bu* ho??land??????n ki??i mi? Huzurlar?? bozduk! ??yle bir y??k??z ki!
{{/if}}

`publish("act4", ["alshire", 2]);`

a: Ben-yani-, bu sorun de??ilse, ben sadece...

`publish("act4", ["alshire", 3]);`

`Game.OVERRIDE_CHOICE_SPEAKER = "h2"`

[Bekle, seni partide g??rmedim mi?](#act4d_recognition) `publish("act4", ["hong_to_alshire",1])`

[Evet tabii ki! Buraya gel.](#act4d_yes) `publish("act4", ["hong_to_alshire",2])`

[??zg??n??m, yaln??z kalmaya ihtiyac??m var.](#act4d_no) `publish("act4", ["hong_to_alshire",8])`

# act4d_recognition

`publish("act4", ["hong_to_alshire",2]);`

h2: Evet, kanepedeydin! ??lk partiye gitti??imde oradayd??n...

`publish("act4", ["hong_to_alshire",10]);`

{{if _.a2_ending=="fight"}}
h2: Panik atak ge??irip ev sahibine yumruk att??????mda.
{{/if}}

{{if _.a2_ending=="flight"}}
h2: Panik atak ge??irip a??layarak d????ar?? ????kt??????mda.
{{/if}}

```
publish("act4", ["hong_to_alshire", 0]);
publish("act4", ["bb_to_alshire", _.INJURED ? 3 : 1]);
```

b: Biraz bekle insan, onlar?? rahats??z ediyor olabiliriz.

```
publish("act4", ["hong_to_alshire", 3]);
publish("act4", ["bb_to_alshire", _.INJURED ? 2 : 0]);
```

h2: Ah, seni olay??n ortas??na koymak istemiyorum!

`publish("act4", ["hong_to_alshire",4]);`

h2: Sadece tan??d??k bir y??z?? hat??rlad??m, hepsi bu.

```
publish("act4", ["hong_to_alshire",5]);
publish("act4", ["alshire", 4]);
```

{{if _.TOP_FEAR=="harm"}}
s: AHHHHH B??L??YORDUM! TEHL??KEL?? PAN??K-ATAK PS??KOPATLAR!
{{/if}}

{{if _.TOP_FEAR=="alone"}}
s: AAHHH ??LK ??ZLEN??M OLARAK "TRAVMAMA TANIK OLDUN" DED??! BU, B??ZDEN NEFRET ETT??LER DEMEKT??R!
{{/if}}

{{if _.TOP_FEAR=="bad"}}
s: AAAHHH TRAVMAT??K B??R OLAYI HATIRLATTIK. VARLI??IMIZ BA??KALARINA ZARAR VER??YOR.
{{/if}}

(#act4e)

# act4d_yes

```
publish("act4", ["hong_to_alshire", 5]);
publish("act4", ["bb_to_alshire", _.INJURED ? 3 : 1]);
```

b: Biraz bekle insan, rahat de??iller gibi.

```
publish("act4", ["hong_to_alshire", 6]);
publish("act4", ["bb_to_alshire", _.INJURED ? 2 : 0]);
```

h2: Ah, elbette bask?? yok!

`publish("act4", ["hong_to_alshire", 4]);`

h2: Sadece s??yl??yorum, istersen burada oturabilirsin.

```
publish("act4", ["hong_to_alshire", 5]);
publish("act4", ["alshire", 4]);
```

{{if _.TOP_FEAR=="harm"}}
s: *??OK* DOSTANE DAVRANIYORLAR! TIPKI SER?? KAT??L TED BUNDY G??B??!
{{/if}}

{{if _.TOP_FEAR=="alone"}}
s: DOSTANE ROL?? YAPIYORLAR! K??MSE *GER??EKTEN* B??ZE YAKIN OLMAK ??STEM??YOR!
{{/if}}

{{if _.TOP_FEAR=="bad"}}
s: AHHH HER ZAMAN BA??KALARINI HUZURSUZ ED??YORUZ! D??NYA ??ZER??NDEK?? B??R LEKEY??Z!
{{/if}}

(#act4e)

# act4d_no

```
publish("act4", ["hong_to_alshire", 9]);
publish("act4", ["bb_to_alshire", _.INJURED ? 3 : 1]);
```

b: Biraz bekle insan, onlar?? rahats??z ediyor olabiliriz.

```
publish("act4", ["hong_to_alshire", 3]);
publish("act4", ["bb_to_alshire", _.INJURED ? 2 : 0]);
```

h2: Ah, kaba olmak istememi??tim!

`publish("act4", ["hong_to_alshire", 6]);`

h2: Sadece duygular??m?? anlamak i??in biraz zamana ihtiyac??m var. L??tfen bunu ki??isel alg??lamay??n.

```
publish("act4", ["hong_to_alshire", 7]);
publish("act4", ["alshire", 4]);
```

{{if _.TOP_FEAR=="harm"}}
s: SAPKIN D??????NCELER D??????N??YOR?! BU PS??KOPATIN KALB??N?? HANG?? KARANLIK ??STEKLER DOLUYOR?!
{{/if}}

{{if _.TOP_FEAR=="alone"}}
s: K??????SEL OLARAK REDDED??LD??K! ASLA SEV??LMEYECE????Z!
{{/if}}

{{if _.TOP_FEAR=="bad"}}
s: DUYGULARINI ANLAMASINI B??LD??K! ????MD?? SONSUZA KADAR TRAVMAT??K OLACAKLAR VE HEPS?? B??Z??M SU??UMUZ!
{{/if}}

(#act4e)

# act4e

```
Game.WORDS_HEIGHT_BOTTOM = 195;
publish("act4", ["alshire", 6]);
```

s: KA?? KA?? KA?? KA?? KA?? KA?? KA??K KA?? KA?? KA?? KA?? KA?? KA?? KA?? KA??

```
Game.clearText();
publish("act4", ["hong_to_alshire", 0]);
publish("act4", ["alshire", 10]);
sfx("pop");
```

(...1001)

```
publish("act4", ["alshire", 11]);
sfx("alshire_run");
```

(...2601)

```
publish("act4-out-3");
Game.WORDS_HEIGHT_BOTTOM = -1; /* reset */
```

(...1201)

`publish("act4-jumpcut-hong");`

h: Huh. Bu tuhaft??.. Kafalar??ndan neler ge??ti??ini merak ediyorum.

`publish("act4", ["hong_closer", 2]);`

h: Her neyse, ne diyordun?

```
publish("act4", ["hong_closer", 1]);
publish("act4", ["bb_closer", 6]);
```

b: Uh, unuttum? Tak??m olmak ve ??al????makla ilgili bi ??eylerdi?

```
publish("act4", ["bb_closer", 0]);
publish("act4", ["hong_closer", 3]);
```

h: ??\_(???)_/??

```
publish("act4", ["hong_closer", 1]);
publish("act4", ["bb_closer", 4]);
```

b: Duygular??n??zla "bar??????n" diyorlar, sanki duygular??m??z *sava?? su??lusuymu??* gibi.

`publish("act4", ["bb_closer", 7]);`

b: *Bar????tan* daha fazlas??n?? istiyorum! *M??ttefik* olmam??z?? istiyorum!

`publish("act4", ["bb_closer", 3]);`

b: A??l??k ve susuzlu??un fiziksel alarmlar olmas?? gibi iyi bir muhaf??z-k??pek olmak istiyorum

`publish("act4", ["bb_closer", 8]);`

b: *Psikolojik* ihtiya?? alarm??n olmak istiyorum ??? g??vende, iyi olmak, ait hissetmek gibi.

`publish("act4", ["bb_closer", 1]);`

b: Ama... ????imde berbat??m, bu y??zden beni e??itmene ihtiyac??m var.

`publish("act4", ["bb_closer", 4]);`

b: Her zaman "mant??kl??" veya "mant??ks??z" de??ilim. Sadece... elimden geleni yap??yorum. Yani,

`publish("act4", ["bb_closer", 30]);`

b: L??tfen sana yard??m etmeme yard??m et!

`publish("act4", ["bb_closer", 6]);`

b: Ya??l?? bir k??pe??e yeni numaralar ????retmek biraz *zaman* alacakt??r. Belki *y??llar.*

`publish("act4", ["bb_closer", 3]);`

b: Ve bazen eski al????kanl??klar??m?? b??rakamayaca????m.

`publish("act4", ["bb_closer", 2]);`

b: G??lgelere havlayaca????m. Seni s??zlerimle korkutaca????m. Hatta baz?? rahats??z edici g??r??nt??ler... g??sterebilirim.

`publish("act4", ["bb_closer", 9]);`

b: ??zg??n??m! Ben h??rpalanm???? bir bar??nak k??pe??iyim! Bazen yata????na kaka yapabilirim!

`publish("act4", ["bb_closer", 4]);`

b: Ama e??er bana kar???? sab??rl?? olursan... yan??mda kal??p ve benimle oturursan...

`publish("act4", ["bb_closer", 8]);`

b: Belki de bu kurdu evcille??tirebilirsin.

`publish("act4", ["bb_closer", 0]);`

`Game.clearText();`

(...1000)

`Game.OVERRIDE_CHOICE_SPEAKER = "h"`

[??yi k??pek.](#act4f-pat-bb) `Game.OVERRIDE_CHOICE_SPEAKER = "h"; publish("act4", ["hong_closer", 2]);`

`Game.OVERRIDE_CHOICE_SPEAKER = "b"`

[??yi insan.](#act4f-pat-hong) `Game.OVERRIDE_CHOICE_SPEAKER = "b"; publish("act4", ["bb_closer", 8]);`

# act4f-pat-hong

```
Game.clearText();
publish("hide_tabs");
Game.FORCE_CANT_SKIP = true;
music(null,{fade:0.5});
sfx("youbothwin");
```

```
publish("act4", ["hong_closer", 4]);
publish("act4", ["bb_closer", 13]);
```

(...501)

`publish("act4", ["bb_closer", 14]);`

(...501)

`publish("act4", ["bb_closer", 13]);`

(...501)

`publish("act4", ["bb_closer", 14]);`

(...501)

`publish("act4", ["bb_closer", 13]);`

(...501)

`publish("act4", ["bb_closer", 14]);`

(...6501)

`publish("act4", ["bb_closer", 15]);`

(...1001)

(#act4f)

# act4f-pat-bb

```
Game.clearText();
publish("hide_tabs");
Game.FORCE_CANT_SKIP = true;
music(null,{fade:0.5});
sfx("youbothwin");
```

```
publish("act4", ["hong_closer", 4]);
publish("act4", ["bb_closer", 10]);
```

(...501)

`publish("act4", ["bb_closer", 11]);`

(...501)

`publish("act4", ["bb_closer", 10]);`

(...501)

`publish("act4", ["bb_closer", 11]);`

(...501)

`publish("act4", ["bb_closer", 10]);`

(...501)

`publish("act4", ["bb_closer", 11]);`

(...6501)

`publish("act4", ["bb_closer", 12]);`

(...1001)

(#act4f)

# act4f

```
Game.FORCE_CANT_SKIP = false;
publish("act4", ["bb_closer", 16]);
publish("act4", ["hong_closer", 5]);
```

{{if _.fifteencigs}}
b: AAAAA SEN H??L?? YALNIZ Y??YORSUN, ONBE?? S??GARA AAAAA
{{/if}}

{{if _.parasite}}
b: AAAAA YEMEK YERKEN HALA VER??ML?? DE????LS??N B??Z TOPLUM PARAZ??TLER??Y??Z AAAAA
{{/if}}

{{if _.whitebread}}
b: AAAAA SEN DAHA FAZLA BEYAZ EKMEK Y??YORSUN AAAAA
{{/if}}

```
publish("act4", ["bb_closer", 18]);
publish("act4", ["hong_closer", 6]);
sfx("yaps", {volume:0.6});
Game.FORCE_CANT_SKIP = true;
Game.WORDS_HEIGHT_BOTTOM = 205;
Game.FORCE_TEXT_DURATION = 90;
Game.FORCE_NO_VOICE = true;
```

b: HAV HAV HAV HAV HAV

(#credits)
