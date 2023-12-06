# MD_3_3

1. Izveidoju database pēc dotās diagrammas 

   ![image-20231206103346116](https://s2.loli.net/2023/12/06/J1NIwZqo2Uyb57r.png)

2. nomainiju 2 nosaukumus failā DbUser lai būtu kā db

   ![image-20231206104032647](https://s2.loli.net/2023/12/06/mbkfEI31urz8nG2.png)

   pievienoju created failā DbSession

   ![image-20231206104354779](https://s2.loli.net/2023/12/06/AMUJ4yxgiKDobCO.png)

   pievienoju jaunu interface DbHabit un DbHabit_record

   ![image-20231206104816216](https://s2.loli.net/2023/12/06/fXkQYKvZtesmuVb.png)

   ![image-20231206105226600](https://s2.loli.net/2023/12/06/BhVAyJc23OCn5Ul.png)

   

   main.ts nomainiju nosaukumus pie post login

   ![image-20231206112249588](https://s2.loli.net/2023/12/06/HkWbKf3Ac1en9i4.png)

   tāpat arī login(ControllerDatabase)

   ![image-20231206112518854](https://s2.loli.net/2023/12/06/XkdzVfr49bscgYh.png)

   un vel dažas izmaiņas

   ![image-20231206112758640](https://s2.loli.net/2023/12/06/TZ17wq2Gev9sIfb.png)

3. Pievienoju addHabit(ControllerDatabase) līdzigi kā login, tikai ar pārbaudi kur pārbauda vai jau nav tāds habit ar tadu pašu label, user_id

   ![image-20231206133558053](https://s2.loli.net/2023/12/06/AbsNJzfHxBKe7Ly.png)

   un tad pievienoju jaunu app.post(/addHabit), tāpat kā /login, tikai ar habit vertibam

   ![image-20231206134107233](https://s2.loli.net/2023/12/06/ciqmzTbYrUkW2nJ.png)

   pievienoju deleteHabit(controllerDatabase), tas strādā līdzigi kā addHabit, tikai tas nomaina is_deleted uz 1(true), ja session_token, label sakrīt jau ar pievienoto un atgriez vienkārši success(bool)

   ![image-20231206153415028](https://s2.loli.net/2023/12/06/LfImnYX3OuGx974.png)

   un tad pievienoju jaunu app.post(/deleteHabit), kurš ir kā /addHabit bet vienkārši atgriež success: true vai success: false 

   ![image-20231206153834846](https://s2.loli.net/2023/12/06/WusfPBJ14nbUpDT.png)

   pievienoju listHabits(ControllerDatabase), kurš paņem session_token, tad palaiž garo sql komandu kura paņem visus habit un salīdzina visu table user_id(session ar user, tad user ar habit) un tad pārbauda token, is_valid un is_deleted. Un pēc ta visa ir pārbaude vai rows ir vismaz 1 ieraksts, ja ir tad habits ir rows un ja nav tad vienkārši atgriež habits, kas ir null

   ![image-20231206161318081](https://s2.loli.net/2023/12/06/CbXIg3LnjeDtYko.png)

   un tad pievienoju app.post(/listHabits), kurs ir vienkarši copy paste no addHabit ar ļoti minimālām izmaiņām(habit nomainiju uz habits un izdzēsu request.label.trim())

   ![image-20231206162446123](https://s2.loli.net/2023/12/06/tuTDAS3cMYPWBQH.png)

4. Visas funkcijas, izņemot login stradā ar session_token

5. Šeit būs visi screenshot:

   login:![image-20231206162825648](https://s2.loli.net/2023/12/06/stnM9BbYFZDJ2LP.png)

addHabit:![image-20231206163209088](https://s2.loli.net/2023/12/06/8jpg2r36yTs5eVd.png)

deleteHabit:![image-20231206163437294](https://s2.loli.net/2023/12/06/5JBRpO7CmKA9bSX.png)

listHabits:![image-20231206163557375](https://s2.loli.net/2023/12/06/BuJPx7V9SIAEMHR.png)
