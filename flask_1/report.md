# Python Flask #1

1. Izveidoju parastu delete.html kur tiek uzrādīts ka post tika izdzēsts

   ![image-20231204150459555](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231204150459555.png)

   Tad izveidoju delete_post iekšā ControllerDatabase.py, kurs paņem post_id un pēc tā dzēš ierakstu un izvada None

   ![image-20231204150909113](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231204150909113.png)

   Pievienoju pogai delete action uz post_delete(poga atrodas view.html)

   ![image-20231204151147338](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231204151147338.png)

   Un pievienoju post_delete ControllerPosts kur tas pārbauda ja ir Post, tad dabuj post_id un aizsuta to uz delete_post controlleri un redirecto atpakal uz post_delete, un ja nav GET tad vienkārši padod delete.html

   ![image-20231204152348033](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231204152348033.png)

2. Pievienoju post.url_slug un tā aizpildi(piemērs: title ierakstīts "Sis ir test" tad url_slug būs "Sis_ir_test") pie post_new 

   ![image-20231206094148525](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206094148525.png)

   post_view vienkārši nomainīju lai ņem url_slug nejau post_id

   ![image-20231206094327129](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206094327129.png)

   tad pieliku lai insertotu ari url_slug

   ![image-20231206094513245](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206094513245.png)

   un nomainīju lai get_post sanem url_slug

   ![image-20231206094811874](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206094811874.png)