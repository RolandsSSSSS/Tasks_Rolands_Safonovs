# Python Flask #1

1. Izveidoju parastu delete.html kur tiek uzrādīts ka post tika izdzēsts

   ![image-20231204150459555](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231204150459555.png)

   Tad izveidoju delete_post iekšā ControllerDatabase.py, kurs paņem post_id un pēc tā dzēš ierakstu un izvada None

   ![image-20231204150909113](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231204150909113.png)

   Pievienoju pogai delete action uz post_delete(poga atrodas view.html)

   ![image-20231204151147338](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231204151147338.png)

   Un pievienoju post_delete ControllerPosts kur tas pārbauda ja ir Post, tad dabuj post_id un aizsuta to uz delete_post controlleri un redirecto atpakal uz post_delete, un ja nav GET tad vienkārši padod delete.html

   ![image-20231204152348033](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231204152348033.png)

2. 