# Python Flask #1

1. Izveidoju parastu delete.html kur tiek uzrādīts ka post tika izdzēsts

   ![image-20231204150459555](https://s2.loli.net/2023/12/06/Mlf6TSYh3jNkKid.png)

   Tad izveidoju delete_post iekšā ControllerDatabase.py, kurs paņem post_id un pēc tā dzēš ierakstu un izvada None

   ![image-20231204150909113](https://s2.loli.net/2023/12/06/ry2YLvNzThnjumX.png)

   Pievienoju pogai delete action uz post_delete(poga atrodas view.html)

   ![image-20231204151147338](https://s2.loli.net/2023/12/06/czKdNsgW8XIpQGM.png)

   Un pievienoju post_delete ControllerPosts kur tas pārbauda ja ir Post, tad dabuj post_id un aizsuta to uz delete_post controlleri un redirecto atpakal uz post_delete, un ja nav GET tad vienkārši padod delete.html

   ![image-20231204152348033](https://s2.loli.net/2023/12/06/5jXimVM7qxnfH9v.png)

2. Pievienoju post.url_slug un tā aizpildi(piemērs: title ierakstīts "Sis ir test" tad url_slug būs "Sis_ir_test") pie post_new 

   ![image-20231206094148525](https://s2.loli.net/2023/12/06/UiW7JQ3K6Ib2xPG.png)

   post_view vienkārši nomainīju lai ņem url_slug nejau post_id

   ![image-20231206094327129](https://s2.loli.net/2023/12/06/ECB8NqevU63XarW.png)

   tad pieliku lai insertotu ari url_slug

   ![image-20231206094513245](https://s2.loli.net/2023/12/06/iH3s2lDQA6EOCbg.png)

   un nomainīju lai get_post sanem url_slug

   ![image-20231206094811874](https://s2.loli.net/2023/12/06/QBm6pi4PEfxvhbu.png)