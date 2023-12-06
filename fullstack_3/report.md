# MD_3_3

1. Izveidoju database pēc dotās diagrammas 

   ![image-20231206103346116](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206103346116.png)

2. nomainiju 2 nosaukumus failā DbUser lai būtu kā db

   ![image-20231206104032647](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206104032647.png)

   pievienoju created failā DbSession

   ![image-20231206104354779](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206104354779.png)

   pievienoju jaunu interface DbHabit un DbHabit_record

   ![image-20231206104816216](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206104816216.png)

   ![image-20231206105226600](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206105226600.png)

   

   main.ts nomainiju nosaukumus pie post login

   ![image-20231206112249588](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206112249588.png)

   tāpat arī login(ControllerDatabase)

   ![image-20231206112518854](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206112518854.png)

   un vel dažas izmaiņas

   ![image-20231206112758640](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206112758640.png)

3. Pievienoju addHabit(ControllerDatabase) līdzigi kā login, tikai ar pārbaudi kur pārbauda vai jau nav tāds habit ar tadu pašu label, user_id

   ![image-20231206133558053](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206133558053.png)

   un tad pievienoju jaunu app.post(/addHabit), tāpat kā /login, tikai ar habit vertibam

   ![image-20231206134107233](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206134107233.png)

4. 