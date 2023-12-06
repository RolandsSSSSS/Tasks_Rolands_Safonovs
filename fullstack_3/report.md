# MD_3_3

1. Izveidoju database pēc dotās diagrammas 

   ![image-20231206103346116](C:\Users\xnzza\Desktop\prak_uzd_2\Tasks_Rolands_Safonovs\fullstack_3\report_img\image-20231206103346116.png)

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

   pievienoju deleteHabit(controllerDatabase), tas strādā līdzigi kā addHabit, tikai tas nomaina is_deleted uz 1(true), ja session_token, label sakrīt jau ar pievienoto un atgriez vienkārši success(bool)

   ![image-20231206153415028](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206153415028.png)

   un tad pievienoju jaunu app.post(/deleteHabit), kurš ir kā /addHabit bet vienkārši atgriež success: true vai success: false 

   ![image-20231206153834846](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206153834846.png)

   pievienoju listHabits(ControllerDatabase), kurš paņem session_token, tad palaiž garo sql komandu kura paņem visus habit un salīdzina visu table user_id(session ar user, tad user ar habit) un tad pārbauda token, is_valid un is_deleted. Un pēc ta visa ir pārbaude vai rows ir vismaz 1 ieraksts, ja ir tad habits ir rows un ja nav tad vienkārši atgriež habits, kas ir null

   ![image-20231206161318081](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206161318081.png)

   un tad pievienoju app.post(/listHabits), kurs ir vienkarši copy paste no addHabit ar ļoti minimālām izmaiņām(habit nomainiju uz habits un izdzēsu request.label.trim())

   ![image-20231206162446123](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206162446123.png)

4. Visas funkcijas, izņemot login stradā ar session_token

5. Šeit būs visi screenshot:

   login:![image-20231206162825648](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206162825648.png)

addHabit:![image-20231206163209088](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206163209088.png)

deleteHabit:![image-20231206163437294](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206163437294.png)

listHabits:![image-20231206163557375](C:\Users\xnzza\AppData\Roaming\Typora\typora-user-images\image-20231206163557375.png)